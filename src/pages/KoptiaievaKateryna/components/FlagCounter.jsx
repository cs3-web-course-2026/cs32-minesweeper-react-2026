import Counter from './Counter';


function FlagCounter({ flagsLeft }) {
  return (
    <Counter icon="💗" label="Flags">
      {flagsLeft}
    </Counter>
  );
}


export default FlagCounter;
