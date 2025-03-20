import { useState, useEffect } from "react";
import "./App.css";
import { Metronome } from "./Metronome";
import BaseButton from "./components/button";
import TempoItem from "./components/TempoItem";
let met = null as null | Metronome;

function App() {
  const [repetitions, setRepetitions] = useState(1);
  const [startTempo, setStartTempo] = useState(96);
  const [tempoSteps, setTempoSteps] = useState(5);
  const [targetTempo, setTargetTempo] = useState(2 * startTempo);

  const [procedure, setProcedure] = useState([] as TempoStep[]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    startMetronomeOnCurrentTempo();
  }, [index]);

  document.addEventListener("keydown", (e) => {
    if (e.key == " ") setIndex(index + 5);
  });

  return (
    <div className="container mx-auto min-h-screen">
      <h1 className="text-6xl font-bold">Get Faster!!!</h1>
      {/* Settings */}
      <div className="text-2xl font-semibold mt-4">Settings</div>
      <div>
        <div className="flex gap-4 items-center">
          <div className="w-48">Starting tempo:</div>
          <input
            type="number"
            value={startTempo}
            onChange={(e) => setStartTempo(parseInt(e.target.value))}
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-48">Target tempo:</div>
          <input
            type="number"
            value={targetTempo}
            onChange={(e) => setTargetTempo(parseInt(e.target.value))}
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-48">Repetitions per step:</div>
          <input
            type="number"
            value={repetitions}
            onChange={(e) => setRepetitions(parseInt(e.target.value))}
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-48">Tempo steps:</div>
          <input
            type="number"
            value={tempoSteps}
            onChange={(e) => setTempoSteps(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="mt-2 mb-4">
        {BaseButton({
          content: <div>Generate</div>,
          variant: "primary",
          onClick: () => {
            setIndex(0);
            setProcedure(
              generateProcedure(
                repetitions,
                startTempo,
                tempoSteps,
                targetTempo
              )
            );
          },
        })}
      </div>

      {procedure.length > 0 ? (
        <>
          {/* Tempo Grid */}
          <div className="text-2xl font-semibold mt-4 mb-2">Steps</div>
          <div className="flex flex-wrap md:gap-4 gap-2 select-none cursor-pointer">
            {procedure.map((p, i) => (
              <div key={i} onClick={() => setIndex(i)}>
                <TempoItem tempo={p.tempo} type={p.type} active={i == index} />
              </div>
            ))}
          </div>
          <div className="text-2xl font-bold">
            Total: {procedure.length} steps
          </div>
          <div className="flex gap-2">
            <BaseButton
              onClick={() => startMetronomeOnCurrentTempo()}
              content={<div>Start metronome</div>}
              variant="secondary"
            />
            <BaseButton
              onClick={() => met?.stop()}
              content={<div>Stop metronome</div>}
              variant="secondary"
            />
            <BaseButton
              onClick={() => setIndex(index + 1)}
              content={<div>Next step</div>}
            />
          </div>
        </>
      ) : (
        ""
      )}
      {/* How to guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
        <div>
          <h2 className="text-2xl font-semibold mt-4">What is this?</h2>
          <div className="">
            This is small tool that generates a sequences of tempos to help one
            get faster at a (short) section of music. This works by slowly
            increasing the tempo after every playing, with some jumps ever{" "}
            <i>n</i> steps. I came across this practice method in the book "The
            Working Clarinetist" by Peter Hadcock. I started this project for
            myself as both a useful tool while practicing and also an
            opportunity to take a look at the react framework. The code for this
            site can be found{" "}
            <a
              className="text-blue-500 underline"
              href="https://github.com/niklas-gund/training-metronome"
              target="_blank"
            >
              here
            </a>
            .
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mt-4">How do I use it?</h2>
          <div className="">
            For starting tempo you should enter a tempo in which you can
            comfortable play the section you want to practice. The target tempo
            is the tempo you will end up with.
          </div>
        </div>
      </div>
    </div>
  );

  function startMetronomeOnCurrentTempo() {
    met?.stop();
    met = new Metronome(procedure[index]?.tempo ?? 1);
    met.start();
  }
}

export type TempoStep = {
  type: "start" | "end" | "step" | "jump";
  tempo: number;
};

function generateProcedure(
  reps: number,
  start: number,
  step: number,
  goal: number
) {
  start -= step;
  const tempos = [] as TempoStep[];
  do {
    start += step;
    tempos.push(...Array(reps).fill({ type: "step", tempo: start }));
    tempos.push({ type: "jump", tempo: start + 3 * step });
  } while (start < goal);
  return tempos;
}

export default App;
