import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Game from './pages/Game';
import MockGame from './pages/MockGame';
import ChernousValerii from './pages/ChernousValerii';
import KarpovaBohdana from './pages/KarpovaBohdana';
import LinkovOleksandr from './pages/LinkovOleksandr';
import OstapenkoRodion from './pages/OstapenkoRodion';
import KovtunOleksandra from './pages/KovtunOleksandra';
import RevaDenys from './pages/RevaDenys';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="chernous-valerii" element={<ChernousValerii />} />
        <Route path="karpova-bohdana" element={<KarpovaBohdana />} />
        <Route path="linkov-oleksandr" element={<LinkovOleksandr />} />
        <Route path="ostapenko-rodion" element={<OstapenkoRodion />} />
        <Route path="kovtun-oleksandra" element={<KovtunOleksandra />} />
        <Route path="reva-denys" element={<RevaDenys />} />
      </Route>
    </Routes>
  );
}

export default App;