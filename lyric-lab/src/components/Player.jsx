import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

export default function Player({ goBack, youtubeUrl, lyrics = [], title }) {
  const [activeTab, setActiveTab] = useState('audio-tab');
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false); // Estado para controlar a tradução

  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const getVideoId = (url) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    } catch (e) {
      return null;
    }
  };

  const videoId = getVideoId(youtubeUrl);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        if (playerRef.current) {
          setCurrentTime(playerRef.current.getCurrentTime());
        }
      }, 200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const seekVideo = (seconds) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="player-container">
      <div className="btn-back-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-back" onClick={goBack}>
          ← Estudar Outro Vídeo
        </button>

        {/* BOTÃO NOVO: Traduzir (Igual ao estilo dos outros botões de utilidade) */}
        <button
          className={`btn-utility ${showTranslation ? 'active-translation' : ''}`}
          onClick={() => setShowTranslation(!showTranslation)}
          style={{
            fontSize: '13px',
            padding: '6px 14px',
            borderRadius: '15px',
            backgroundColor: showTranslation ? 'var(--primary)' : 'var(--bg-card)',
            color: showTranslation ? '#fff' : 'var(--text-main)',
            border: showTranslation ? '1px solid var(--primary)' : '1px solid var(--border)'
          }}
        >
          {showTranslation ? '🇧🇷 Tradução: On' : '🇺🇸 Original'}
        </button>
      </div>

      {title && <div className="video-title-display" title={title}>{title}</div>}

      {/* Abas */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'audio-tab' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio-tab')}
        >
          🎧 Modo Áudio
        </button>
        <button
          className={`tab-btn ${activeTab === 'video-tab' ? 'active' : ''}`}
          onClick={() => setActiveTab('video-tab')}
        >
          📺 Modo Vídeo
        </button>
      </div>

      {/* Unificação dos Players */}
      <div className="video-and-audio-wrapper">
        <div className="video-container" style={{ display: activeTab === 'video-tab' ? 'block' : 'none' }}>
          {videoId ? (
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={onPlayerReady}
              onStateChange={onPlayerStateChange}
              className="youtube-iframe-container"
              containerClassName="youtube-iframe-container"
            />
          ) : (
            <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Link do vídeo inválido.</p>
          )}
        </div>

        {activeTab === 'audio-tab' && (
          <div className="audio-active-box">
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>🎧 Modo de Áudio Ativo</p>
            <p style={{ margin: 0, fontSize: '13px' }}>Clique nas frases abaixo para controlar e ouvir o áudio do vídeo.</p>
          </div>
        )}
      </div>

      {/* Letras */}
      <div className="lyrics-container">
        {lyrics.length > 0 ? (
          lyrics.map((line, index) => {
            const nextLineTime = lyrics[index + 1] ? lyrics[index + 1].time : Infinity;
            const isActive = currentTime >= line.time && currentTime < nextLineTime;

            return (
              <div
                key={index}
                className={`lyric-line ${isActive ? 'active' : ''}`}
                onClick={() => seekVideo(line.time)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span className="time-tag">
                    [{String(Math.floor(line.time / 60)).padStart(2, '0')}:{String(line.time % 60).padStart(2, '0')}]
                  </span>

                  {/* Container de textos para empilhar original e tradução */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="original-text">{line.text}</span>

                    {/* Se o botão de tradução estiver ativo, exibe a tradução logo abaixo */}
                    {showTranslation && line.translation && (
                      <span className="translated-text" style={{
                        fontSize: '14px',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                        fontWeight: 'normal'
                      }}>
                        {line.translation}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Nenhuma legenda disponível.</p>
        )}
      </div>
    </div>
  );
}