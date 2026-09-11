import React from 'react';

export default function Home({ youtubeUrl, setYoutubeUrl, onStart, history, onDeleteHistory }) {
  return (
    <div className="hero-section">
      <h1 className="logo-title">Lyric Lab</h1>
      <p className="subtitle">
        Insira o link de uma música ou vídeo do YouTube para criar uma aula de inglês interativa instantaneamente.
      </p>

      <div className="input-group">
        <input
          type="text"
          placeholder="Cole o link do YouTube aqui... (ex: https://youtube.com/...)"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
        <button className="btn-start" onClick={onStart}>Começar ➔</button>
      </div>

      {/* Histórico */}
      {history.length > 0 && (
        <div className="history-section">
          <h2>⏱️ Suas Últimas Aulas</h2>
          <div className="history-list">
            {history.map((item, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => {
                  setYoutubeUrl(item.url);
                  setTimeout(() => onStart(item.url), 50);
                }}
              >
                <div className="history-item-content">
                  <div className="history-info">
                    <span className="history-title">{item.title}</span>
                    <span className="history-url">{item.url}</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '10px' }}>
                    {item.date}
                  </span>
                </div>

                <button
                  className="btn-delete-history"
                  onClick={(e) => onDeleteHistory(item.url, e)}
                  title="Excluir do histórico"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🔗</div>
          <h3>1. Cole o link</h3>
          <p>Insira qualquer vídeo musical ou conversação em inglês.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>2. Sincronize</h3>
          <p>O áudio e o texto são gerados e sincronizados linha por linha.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔁</div>
          <h3>3. Treine e repita</h3>
          <p>Clique nas frases para ouvir novamente e dominar a pronúncia.</p>
        </div>
      </div>
    </div>
  );
}