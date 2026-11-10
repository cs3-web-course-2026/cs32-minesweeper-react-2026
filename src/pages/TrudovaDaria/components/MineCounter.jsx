import StatDisplay from "./StatDisplay";

function MineCounter({ minesRemaining }) {
  return <StatDisplay label="Міни" value={minesRemaining} />;
}

export default MineCounter;
