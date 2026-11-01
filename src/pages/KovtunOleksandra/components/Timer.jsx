import React from 'react';

export default function Timer({ gameTime }) {
  return <span id="timer">{String(gameTime).padStart(3, '0')}</span>;
}