import React, { useState } from 'react';
import { Sparkles, RotateCcw, Play, Trophy, ShieldAlert } from 'lucide-react';
import { KaTeXMath } from '../common/KaTeXMath';
import { IntuitionVsMath } from '../common/IntuitionVsMath';

export const MontyHallLab: React.FC = () => {
  const [trials, setTrials] = useState<{ switchWins: number; stayWins: number; total: number }>({
    switchWins: 0,
    stayWins: 0,
    total: 0
  });

  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [carDoor, setCarDoor] = useState<number>(1);
  const [revealedGoatDoor, setRevealedGoatDoor] = useState<number | null>(null);
  const [gameResolved, setGameResolved] = useState<boolean>(false);
  const [wonGame, setWonGame] = useState<boolean>(false);

  // Start new single-player round
  const startRound = (door: number) => {
    const car = Math.floor(Math.random() * 3) + 1;
    setCarDoor(car);
    setSelectedDoor(door);

    // Host reveals a goat door that is neither player's door nor the car
    const candidates = [1, 2, 3].filter((d) => d !== door && d !== car);
    const goat = candidates[Math.floor(Math.random() * candidates.length)];
    setRevealedGoatDoor(goat);
    setGameResolved(false);
  };

  const resolveGame = (didSwitch: boolean) => {
    if (selectedDoor === null || revealedGoatDoor === null) return;
    const finalDoor = didSwitch
      ? [1, 2, 3].find((d) => d !== selectedDoor && d !== revealedGoatDoor)!
      : selectedDoor;

    const won = finalDoor === carDoor;
    setWonGame(won);
    setGameResolved(true);

    setTrials((prev) => ({
      total: prev.total + 1,
      switchWins: prev.switchWins + (didSwitch && won ? 1 : 0),
      stayWins: prev.stayWins + (!didSwitch && won ? 1 : 0)
    }));
  };

  // Run bulk simulation (e.g. 500 trials)
  const runBatchSimulation = (count: number) => {
    let sWins = 0;
    let stWins = 0;
    for (let i = 0; i < count; i++) {
      const car = Math.floor(Math.random() * 3) + 1;
      const initialChoice = Math.floor(Math.random() * 3) + 1;
      // Host reveals goat
      const hostCandidates = [1, 2, 3].filter((d) => d !== initialChoice && d !== car);
      const revealed = hostCandidates[Math.floor(Math.random() * hostCandidates.length)];

      const switchedChoice = [1, 2, 3].find((d) => d !== initialChoice && d !== revealed)!;

      if (switchedChoice === car) sWins++;
      if (initialChoice === car) stWins++;
    }

    setTrials((prev) => ({
      total: prev.total + count,
      switchWins: prev.switchWins + sWins,
      stayWins: prev.stayWins + stWins
    }));
  };

  const switchWinRate = trials.total > 0 ? (trials.switchWins / trials.total) * 100 : 66.7;
  const stayWinRate = trials.total > 0 ? (trials.stayWins / trials.total) * 100 : 33.3;

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Monty Hall Problem Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Should you switch doors? Marilyn vos Savant famously proved that switching doubles your winning probability from 1/3 to 2/3.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTrials({ switchWins: 0, stayWins: 0, total: 0 })}
          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Stats
        </button>
      </div>

      {/* 3 Doors Visual */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <span className="text-xs font-mono text-slate-400 block uppercase">
          {selectedDoor === null
            ? 'Step 1: Choose a Door'
            : !gameResolved
            ? `Door ${revealedGoatDoor} has a GOAT! Will you stay or switch?`
            : wonGame
            ? '🎉 YOU WON THE CAR!'
            : '🐐 You got a goat!'}
        </span>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((door) => {
            const isSelected = selectedDoor === door;
            const isRevealedGoat = revealedGoatDoor === door;
            const isCar = carDoor === door;

            return (
              <button
                key={door}
                type="button"
                onClick={() => selectedDoor === null && startRound(door)}
                disabled={selectedDoor !== null}
                className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${
                  isRevealedGoat
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-400'
                    : isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/40'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-200'
                }`}
              >
                <span className="font-cinzel text-3xl font-black">
                  {gameResolved && isCar ? '🚗' : isRevealedGoat ? '🐐' : `Door ${door}`}
                </span>
                <span className="text-[10px] font-mono uppercase">
                  {isSelected ? 'Your Choice' : isRevealedGoat ? 'Host Opened: Goat' : 'Closed'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Choice Buttons after Host Reveals Goat */}
        {selectedDoor !== null && !gameResolved && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => resolveGame(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition-colors"
            >
              Stay with Door {selectedDoor} (1/3 odds)
            </button>
            <button
              type="button"
              onClick={() => resolveGame(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-lg shadow-cyan-500/20"
            >
              Switch Door (2/3 odds)
            </button>
          </div>
        )}

        {gameResolved && (
          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedDoor(null);
                setRevealedGoatDoor(null);
                setGameResolved(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs font-bold transition-colors"
            >
              Play Another Round
            </button>
          </div>
        )}
      </div>

      {/* Batch Monte Carlo Simulation Bar */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Monte Carlo Simulation:</span>
          <button
            type="button"
            onClick={() => runBatchSimulation(100)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-cyan-400 text-xs"
          >
            +100 Trials
          </button>
          <button
            type="button"
            onClick={() => runBatchSimulation(1000)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold"
          >
            +1,000 Trials
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-500 block text-[10px]">Switch Win Rate</span>
            <span className="text-emerald-400 font-bold text-sm">
              {switchWinRate.toFixed(1)}% ({trials.switchWins} / {trials.total})
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Stay Win Rate</span>
            <span className="text-amber-400 font-bold text-sm">
              {stayWinRate.toFixed(1)}% ({trials.stayWins} / {trials.total})
            </span>
          </div>
        </div>
      </div>

      <IntuitionVsMath
        intuition="Two unopened doors remain, so the odds of the car behind either door must be a 50/50 coin flip."
        mathematics="Your initial choice had a 1/3 probability of the car and a 2/3 probability of a goat. The host cannot open your door or the car door. The host's deliberate revelation channels the entire 2/3 probability mass onto the remaining unopened door!"
        mathLaTeX="P(\text{Win} \mid \text{Switch}) = \frac{2}{3}, \qquad P(\text{Win} \mid \text{Stay}) = \frac{1}{3}"
      />
    </div>
  );
};
