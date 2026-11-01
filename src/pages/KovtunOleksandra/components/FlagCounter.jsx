import React from 'react';

export default function FlagCounter({ flagsCount }) {
  return <span id="flag-count">{String(flagsCount).padStart(3, '0')}</span>;
}