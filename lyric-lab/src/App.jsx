import React, { useState, useEffect } from 'react';
import './App.css';
import ThemeToggle from './components/ThemeToggle';
import Home from './components/Home';
import Player from './components/Player';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark-theme');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [currentLyrics, setCurrentLyrics] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('lyric_lab_history')) || [];
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark-theme' ? 'light-theme' : 'dark-theme');
  };

  const handleStart = async (urlToUse) => {
    const finalUrl = typeof urlToUse === 'string' ? urlToUse : youtubeUrl;

    if (!finalUrl) {
      alert('Por favor, cole um link válido antes de começar!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: finalUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentTitle(data.title);
        setCurrentLyrics(data.lyrics);

        const newHistoryItem = {
          title: data.title,
          url: finalUrl,
          date: new Date().toLocaleDateString('pt-BR')
        };

        const updatedHistory = [newHistoryItem, ...history.filter(item => item.url !== finalUrl)].slice(0, 3);
        setHistory(updatedHistory);
        localStorage.setItem('lyric_lab_history', JSON.stringify(updatedHistory));

        setCurrentScreen('player');
      } else {
        alert('Erro ao processar o vídeo: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Não foi possível conectar ao servidor. O servidor Node.js está rodando?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = (urlToDelete, e) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item.url !== urlToDelete);
    setHistory(updatedHistory);
    localStorage.setItem('lyric_lab_history', JSON.stringify(updatedHistory));
  };

  const goBackToHome = () => {
    setYoutubeUrl('');
    setCurrentLyrics([]);
    setCurrentTitle('');
    setCurrentScreen('home');
  };

  return (
    <div className={`app-container ${theme} ${currentScreen === 'player' ? 'player-active' : ''}`}>
      <ThemeToggle toggleTheme={toggleTheme} />

      {isLoading ? (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px' }}>Carregando sua aula...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Isso pode levar alguns segundos.</p>
        </div>
      ) : currentScreen === 'home' ? (
        <Home
          youtubeUrl={youtubeUrl}
          setYoutubeUrl={setYoutubeUrl}
          onStart={handleStart}
          history={history}
          onDeleteHistory={handleDeleteHistory}
        />
      ) : (
        <Player
          goBack={goBackToHome}
          youtubeUrl={youtubeUrl}
          lyrics={currentLyrics}
          title={currentTitle}
        />
      )}
    </div>
  );
}