import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, StepForward, Compass, Split, ArrowRight, ShieldAlert, Sparkles, Timer } from 'lucide-react';
import { KaTeXMath } from '../common/KaTeXMath';
import { IntuitionVsMath } from '../common/IntuitionVsMath';

export const ZenosParadoxesLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'achilles' | 'dichotomy' | 'arrow'>('achilles');

  // Achilles & Tortoise state
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [initialGap, setInitialGap] = useState(100); // meters
  const [speedRatio, setSpeedRatio] = useState(10); // Achilles is 10x faster than Tortoise
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(8);

  // Achilles speed = 10 m/s, Tortoise = 10 / speedRatio
  const achillesSpeed = 10;
  const tortoiseSpeed = achillesSpeed / speedRatio;

  // Compute geometric intervals for Achilles & Tortoise
  const stepsData = useMemo(() => {
    const data: Array<{
      step: number;
      achillesStart: number;
      achillesEnd: number;
      tortoiseStart: number;
      tortoiseEnd: number;
      intervalDistance: number;
      intervalTime: number;
      cumulativeDistance: number;
      cumulativeTime: number;
      remainingGap: number;
    }> = [];

    let cumDist = 0;
    let cumTime = 0;
    let aPos = 0;
    let tPos = initialGap;

    for (let k = 1; k <= 15; k++) {
      const stepDistance = tPos - aPos;
      const stepTime = stepDistance / achillesSpeed;
      const tMoved = tortoiseSpeed * stepTime;

      cumDist += stepDistance;
      cumTime += stepTime;

      data.push({
        step: k,
        achillesStart: aPos,
        achillesEnd: tPos,
        tortoiseStart: tPos,
        tortoiseEnd: tPos + tMoved,
        intervalDistance: stepDistance,
        intervalTime: stepTime,
        cumulativeDistance: cumDist,
        cumulativeTime: cumTime,
        remainingGap: tMoved
      });

      aPos = tPos;
      tPos = tPos + tMoved;
    }

    return data;
  }, [initialGap, speedRatio]);

  // Theoretical exact meeting point: x* = initialGap / (1 - v_T/v_A)
  const theoreticalDistance = useMemo(() => {
    return initialGap / (1 - 1 / speedRatio);
  }, [initialGap, speedRatio]);

  const theoreticalTime = useMemo(() => {
    return theoreticalDistance / achillesSpeed;
  }, [theoreticalDistance]);

  // Animation ticker for Achilles
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= maxSteps) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, maxSteps, speed]);

  const currentStepData = stepsData[Math.min(currentStep, stepsData.length - 1)];
  const achillesDisplayPos = currentStep === 0 ? 0 : currentStepData ? currentStepData.achillesEnd : 0;
  const tortoiseDisplayPos = currentStep === 0 ? initialGap : currentStepData ? currentStepData.tortoiseEnd : initialGap;

  const trackMax = theoreticalDistance * 1.25;

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      {/* Paradox Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            Zeno's Paradoxes Laboratory
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Greek philosopher Zeno of Elea (c. 490–430 BCE) challenged the reality of motion and continuous space.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('achilles')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'achilles'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Achilles & Tortoise
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dichotomy')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'dichotomy'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dichotomy Paradox
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('arrow')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'arrow'
                ? 'bg-purple-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            The Flying Arrow
          </button>
        </div>
      </div>

      {/* Tab 1: Achilles & The Tortoise */}
      {activeTab === 'achilles' && (
        <div className="space-y-6">
          {/* Visual Track */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-6">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">
                Iteration Checkpoint: {currentStep} / {maxSteps}
              </span>
              <span className="text-slate-400">
                Overtake Point: <strong className="text-emerald-400">{theoreticalDistance.toFixed(2)}m</strong> in <strong className="text-emerald-400">{theoreticalTime.toFixed(2)}s</strong>
              </span>
            </div>

            {/* Track Graphic */}
            <div className="relative h-28 w-full bg-slate-900/80 rounded-xl border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
              {/* Distance scale marks */}
              <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20 border-b border-dashed border-slate-600" />

              {/* Achilles Runner Lane */}
              <div className="relative h-8 flex items-center">
                <span className="text-[10px] font-mono text-cyan-400 w-16 shrink-0 font-bold">Achilles:</span>
                <div className="relative flex-grow h-2 bg-slate-950 rounded-full overflow-visible">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${Math.min((achillesDisplayPos / trackMax) * 100, 96)}%` }}
                  >
                    <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50 flex items-center justify-center text-[9px] font-bold text-slate-950">
                      A
                    </div>
                    <span className="text-[9px] font-mono text-cyan-300 mt-1 whitespace-nowrap">
                      {achillesDisplayPos.toFixed(1)}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Tortoise Runner Lane */}
              <div className="relative h-8 flex items-center">
                <span className="text-[10px] font-mono text-amber-400 w-16 shrink-0 font-bold">Tortoise:</span>
                <div className="relative flex-grow h-2 bg-slate-950 rounded-full overflow-visible">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${Math.min((tortoiseDisplayPos / trackMax) * 100, 96)}%` }}
                  >
                    <div className="w-4 h-4 rounded-full bg-amber-400 shadow-md shadow-amber-400/50 flex items-center justify-center text-[9px] font-bold text-slate-950">
                      T
                    </div>
                    <span className="text-[9px] font-mono text-amber-300 mt-1 whitespace-nowrap">
                      {tortoiseDisplayPos.toFixed(1)}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Overtake Line */}
              <div
                className="absolute top-0 bottom-0 border-r-2 border-dashed border-emerald-500 pointer-events-none"
                style={{ left: `${(theoreticalDistance / trackMax) * 100}%` }}
              >
                <span className="absolute -top-1 -right-16 text-[9px] font-mono text-emerald-400 bg-slate-950 px-1 py-0.5 rounded border border-emerald-500/40">
                  Limit x*
                </span>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Achilles Position</span>
                <span className="text-cyan-400 font-bold text-sm">{achillesDisplayPos.toFixed(2)}m</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Tortoise Position</span>
                <span className="text-amber-400 font-bold text-sm">{tortoiseDisplayPos.toFixed(2)}m</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Remaining Gap</span>
                <span className="text-purple-400 font-bold text-sm">
                  {Math.max(0, tortoiseDisplayPos - achillesDisplayPos).toFixed(3)}m
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Elapsed Time</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {(currentStepData ? currentStepData.cumulativeTime : 0).toFixed(3)}s
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play Sequence'}
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, maxSteps))}
                disabled={currentStep >= maxSteps}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 disabled:opacity-40 text-xs font-mono flex items-center gap-1"
                title="Step to next catch-up point"
              >
                <StepForward className="w-4 h-4" />
                Step
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(0);
                }}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <label className="flex items-center gap-1.5">
                Head Start:
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="10"
                  value={initialGap}
                  onChange={(e) => {
                    setInitialGap(Number(e.target.value));
                    setCurrentStep(0);
                  }}
                  className="w-16 accent-cyan-500 cursor-pointer"
                />
                <span className="font-mono text-slate-200">{initialGap}m</span>
              </label>

              <label className="flex items-center gap-1.5">
                Speed Ratio (A/T):
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={speedRatio}
                  onChange={(e) => {
                    setSpeedRatio(Number(e.target.value));
                    setCurrentStep(0);
                  }}
                  className="w-16 accent-amber-500 cursor-pointer"
                />
                <span className="font-mono text-slate-200">{speedRatio}x</span>
              </label>

              <label className="flex items-center gap-1.5">
                Max Steps:
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="1"
                  value={maxSteps}
                  onChange={(e) => setMaxSteps(Number(e.target.value))}
                  className="w-14 accent-purple-500 cursor-pointer"
                />
                <span className="font-mono text-slate-200">{maxSteps}</span>
              </label>
            </div>
          </div>

          {/* Convergence Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-[11px] font-mono text-left">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Step $k$</th>
                  <th className="p-2.5">Step Distance $\Delta d$</th>
                  <th className="p-2.5">Cumulative Distance</th>
                  <th className="p-2.5">Step Time $\Delta t$</th>
                  <th className="p-2.5">Cumulative Time</th>
                  <th className="p-2.5">Remaining Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {stepsData.slice(0, maxSteps).map((d) => (
                  <tr
                    key={d.step}
                    className={currentStep === d.step ? 'bg-cyan-500/10 font-bold text-cyan-300' : 'text-slate-300'}
                  >
                    <td className="p-2.5 font-bold text-cyan-400">{d.step}</td>
                    <td className="p-2.5">{d.intervalDistance.toFixed(3)}m</td>
                    <td className="p-2.5">{d.cumulativeDistance.toFixed(3)}m</td>
                    <td className="p-2.5">{d.intervalTime.toFixed(3)}s</td>
                    <td className="p-2.5">{d.cumulativeTime.toFixed(3)}s</td>
                    <td className="p-2.5 text-purple-400">{d.remainingGap.toFixed(4)}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Dichotomy Paradox */}
      {activeTab === 'dichotomy' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="font-cinzel text-lg font-bold text-amber-300">
              The Dichotomy Paradox: The Infinite Halfway Checkpoints
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Before reaching a destination of distance 1, a runner must first cover halfway (<KaTeXMath math="1/2" />). Before covering the remaining half, they must cover half of that (<KaTeXMath math="1/4" />), then <KaTeXMath math="1/8" />, ad infinitum. Because there are infinitely many tasks to complete, Zeno concluded that movement could never even finish—or even begin!
            </p>

            {/* Geometric Bar Visualizer */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono text-slate-400 block">
                Visualizing Unit Interval Subdivision <KaTeXMath math="\sum_{n=1}^\infty 2^{-n} = 1" />:
              </span>
              <div className="h-10 w-full rounded-xl bg-slate-900 border border-slate-800 flex overflow-hidden p-1 gap-0.5">
                <div className="h-full bg-cyan-500 rounded flex items-center justify-center text-[10px] font-mono font-bold text-slate-950" style={{ width: '50%' }}>
                  1/2
                </div>
                <div className="h-full bg-amber-500 rounded flex items-center justify-center text-[10px] font-mono font-bold text-slate-950" style={{ width: '25%' }}>
                  1/4
                </div>
                <div className="h-full bg-purple-500 rounded flex items-center justify-center text-[10px] font-mono font-bold text-slate-950" style={{ width: '12.5%' }}>
                  1/8
                </div>
                <div className="h-full bg-emerald-500 rounded flex items-center justify-center text-[9px] font-mono font-bold text-slate-950" style={{ width: '6.25%' }}>
                  1/16
                </div>
                <div className="h-full bg-rose-500 rounded flex items-center justify-center text-[8px] font-mono font-bold text-slate-950" style={{ width: '3.125%' }}>
                  1/32
                </div>
                <div className="h-full bg-blue-500 rounded flex items-center justify-center text-[7px] font-mono text-slate-950" style={{ width: '1.5625%' }}>
                  ...
                </div>
                <div className="h-full flex-grow bg-slate-800 rounded" />
              </div>
            </div>

            {/* Mathematical Resolution */}
            <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 font-mono text-xs space-y-2">
              <span className="font-bold text-amber-400 block uppercase">Rigorous Mathematical Limit Resolution</span>
              <p className="text-slate-300">
                Let <KaTeXMath math="S_N = \sum_{k=1}^N \frac{1}{2^k} = 1 - \frac{1}{2^N}" />.
              </p>
              <KaTeXMath math="\lim_{N \to \infty} S_N = \lim_{N \to \infty} \left(1 - \frac{1}{2^N}\right) = 1" block />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Calculus formalizes the sum of infinitely many terms: an infinite sequence of positive intervals completes in a finite total time because both the distances <KaTeXMath math="\Delta d_n" /> and times <KaTeXMath math="\Delta t_n" /> shrink geometrically with a convergent finite sum!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Arrow Paradox */}
      {activeTab === 'arrow' && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <h4 className="font-cinzel text-lg font-bold text-purple-300">
            The Arrow Paradox: The Illusion of Instantaneous Motion
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Consider an arrow in flight. At any instantaneous moment in time, the duration of that moment is 0. In an instant of duration 0, the arrow cannot move anywhere; it occupies a space equal to its own dimensions and is completely motionless. If the arrow is motionless at every instant, and time is composed entirely of instants, how can the arrow ever move?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 block font-mono uppercase">Zeno's Classical Formulation</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                1. At any instant <KaTeXMath math="t" />, the time interval <KaTeXMath math="\Delta t = 0" />.<br />
                2. Therefore, displacement <KaTeXMath math="\Delta x = 0" />.<br />
                3. The arrow is at rest at time <KaTeXMath math="t" />.<br />
                4. Since time is composed of instants, the arrow is motionless at all times.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2">
              <span className="text-xs font-bold text-cyan-400 block font-mono uppercase">Modern Calculus Resolution</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Newton and Leibniz resolved this by discovering that instantaneous velocity is not the ratio <KaTeXMath math="0/0" />, but the limit of average velocity as <KaTeXMath math="\Delta t \to 0" />:
              </p>
              <KaTeXMath math="v(t) = \frac{dx}{dt} = \lim_{\Delta t \to 0} \frac{x(t + \Delta t) - x(t)}{\Delta t}" block />
              <p className="text-[11px] text-slate-400">
                A duration-zero time slice is not a static state of rest; velocity is a genuine mathematical state of the system at every instant.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Intuition vs Mathematics Section */}
      <IntuitionVsMath
        intuition="Because Achilles must first reach where the tortoise was, there are infinitely many checkpoints to reach. An infinite number of tasks can never be completed in finite time, so Achilles can never overtake the tortoise."
        mathematics="An infinite series of diminishing positive intervals can have a strictly finite sum. In modern analysis, the infinite sum converges: \sum_{k=0}^\infty d_0 (v_T / v_A)^k = \frac{d_0}{1 - v_T / v_A}. In finite time t^* = \frac{d_0}{v_A - v_T}, Achilles overtakes the tortoise."
        mathLaTeX="\sum_{k=1}^\infty \frac{1}{2^k} = 1, \qquad x^* = \frac{d_0}{1 - v_T / v_A}"
      />
    </div>
  );
};
