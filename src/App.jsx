import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DudnikKiraGame from './pages/DudnikKira';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/dudnik-kira" element={<DudnikKiraGame />} />
            </Routes>
        </div>
    );
}

export default App;