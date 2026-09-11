import React from 'react';

export default function ThemeToggle({ toggleTheme }) {
  return (
    <div className="top-controls">
      <button onClick={toggleTheme} className="btn-utility">
        🌓 Tema
      </button>
    </div>
  );
}