import React from 'react';
import styles from '../Game.module.css';

export default function Timer({ gameTime }) {
  return <span id="timer">{String(gameTime).padStart(3, '0')}</span>;
}