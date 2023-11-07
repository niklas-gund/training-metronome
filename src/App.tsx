import { useState, useEffect } from "react";
import "./App.css";
import { Metronome } from "./Metronome";
let met = null as null | Metronome;

function App() {
  const [repetitions, setRepetitions] = useState(4);
  const [startTempo, setStartTempo] = useState(96);
  const [tempoSteps, setTempoSteps] = useState(5);
  const [targetTempo, setTargetTempo] = useState(2 * startTempo);

  const [procedure, setProcedure] = useState([] as number[]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    met?.stop();
    console.log(JSON.stringify(met));
    met = new Metronome(procedure[index]);
    met.start();
  }, [index]);

  document.addEventListener("keydown", (e) => {
    if (e.key == " ") setIndex(index + 5);
  });

  return (
    <div className="container mx-auto">
      <div className="text-6xl font-bold">Get Faster!!!</div>
      <div>
        <label className="mr-2">Repetitions per tempo:</label>
        <input
          type="number"
          value={repetitions}
          onChange={(e) => setRepetitions(parseInt(e.target.value))}
        />
      </div>
      <div className="mt-2">
        <label className="mr-2">Starting Tempo:</label>
        <input
          type="number"
          value={startTempo}
          onChange={(e) => setStartTempo(parseInt(e.target.value))}
        />
      </div>
      <div className="mt-2">
        <label className="mr-2">Tempo steps:</label>
        <input
          type="number"
          value={tempoSteps}
          onChange={(e) => setTempoSteps(parseInt(e.target.value))}
        />
      </div>
      <div className="mt-2">
        <label className="mr-2">Tempo steps:</label>
        <input
          type="number"
          value={targetTempo}
          onChange={(e) => setTargetTempo(parseInt(e.target.value))}
        />
      </div>
      <button
        className="bg-blue-500 py-3 px-6 rounded mt-2"
        onClick={() => {
          setIndex(0);
          setProcedure(
            generateProcedure(repetitions, startTempo, tempoSteps, targetTempo)
          );
        }}
      >
        Generate Sequence
      </button>
      <div className="flex flex-wrap gap-2">
        {procedure.map((p, i) => (
          <div
            onClick={() => {
              setIndex(i);
            }}
            key={i}
            className={
              (i == index ? "bg-green-500" : "bg-orange-500") + " p-2 rounded"
            }
          >
            {p}
          </div>
        ))}
      </div>
      <div className="text-2xl font-bold">Total: {procedure.length}</div>
      <button
        className="bg-purple-500 py-3 px-6 rounded mt-2"
        onClick={() => setIndex(index + 1)}
      >
        Next Index
      </button>
      <button
        className="bg-red-500 py-3 px-6 rounded mt-2"
        onClick={() => met?.stop()}
      >
        Stop All
      </button>
    </div>
  );
}

function generateProcedure(
  reps: number,
  start: number,
  step: number,
  goal: number
) {
  const tempos = [] as number[];
  do {
    tempos.push(...Array(reps).fill(start));
    tempos.push(start + 3 * step);
    start += step;
  } while (start < goal);
  return tempos;
}

export default App;
