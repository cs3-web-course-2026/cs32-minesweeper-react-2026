import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DudnikKiraGame from './pages/DudnikKira';
import GameList from './pages/Game';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/games" element={<GameList />} />
        <Route path="/dudnik-kira" element={<DudnikKiraGame />} />
      </Routes>
    </Router>
  );
}