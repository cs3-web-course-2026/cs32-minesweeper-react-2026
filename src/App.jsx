import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Game from './pages/Game';
import MockGame from './pages/MockGame';
import PrychynaDariaGame from './pages/PrychynaDaria'; 
import ChernousValerii from './pages/ChernousValerii';
import KarpovaBohdana from './pages/KarpovaBohdana';
import UskovaOlexandra from './pages/UskovaOlexandra';
import KhomiakovOleksii from './pages/KhomiakovOleksii';
import LinkovOleksandr from './pages/LinkovOleksandr';
import OstapenkoRodion from './pages/OstapenkoRodion';
import KovtunOleksandra from './pages/KovtunOleksandra';
import PogoreletsElizaveta from './pages/PogoreletsElizaveta'
import SurmachVolodymyr from './pages/SurmachVolodymyr';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="prychyna-daria" element={<PrychynaDariaGame />} />
        <Route path="chernous-valerii" element={<ChernousValerii />} />
        <Route path="karpova-bohdana" element={<KarpovaBohdana />} />
        <Route path="uskova-olexandra" element={<UskovaOlexandra />} />
        <Route path="khomiakov-oleksii" element={<KhomiakovOleksii />} />
        <Route path="linkov-oleksandr" element={<LinkovOleksandr />} />
        <Route path="ostapenko-rodion" element={<OstapenkoRodion />} />
        <Route path="kovtun-oleksandra" element={<KovtunOleksandra />} />
        <Route path="pogorelets-elizaveta" element={<PogoreletsElizaveta />} />
        <Route path="surmach-volodymyr" element={<SurmachVolodymyr />} />
      </Route>
    </Routes>
  );
}

export default App;