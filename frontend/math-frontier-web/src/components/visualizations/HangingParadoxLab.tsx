import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, StepForward, AlertTriangle, ShieldCheck, DoorOpen, Skull, CheckCircle2, XCircle, Brain, BookOpen, Sparkles, Scale, Info } from 'lucide-react';
import { KaTeXMath } from '../common/KaTeXMath';
import { IntuitionVsMath } from '../common/IntuitionVsMath';

interface DayState {
  index: number;
  name: string;
  shortName: string;
  eliminatedAtStep: number | null; // which step eliminated this day (1 = Friday, 2 = Thursday...)
  reason: string;
}

export const HangingParadoxLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'induction' | 'simulation' | 'logic' | 'quiz'>('induction');

  // Days configuration
  const [numDays, setNumDays] = useState<number>(5);
  const weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Backward Induction State
  const [inductionStep, setInductionStep] = useState<number>(0);
  const maxInductionSteps = numDays;

  // Executioner Knock Simulation State
  const [executionDay, setExecutionDay] = useState<number>(2); // 0 = Mon, 1 = Tue, 2 = Wed (default)
  const [simCurrentDay, setSimCurrentDay] = useState<number>(-1); // -1 = Sunday decree
  const [isSimPlaying, setIsSimPlaying] = useState<boolean>(false);
  const [simSpeed] = useState<number>(1000); // ms per day
  const [knockOccurred, setKnockOccurred] = useState<boolean>(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Reset steps if numDays changes
  useEffect(() => {
    setInductionStep(0);
    if (executionDay >= numDays) {
      setExecutionDay(Math.floor(numDays / 2));
    }
    setSimCurrentDay(-1);
    setKnockOccurred(false);
    setIsSimPlaying(false);
  }, [numDays]);

  // Days array for current configuration
  const days: DayState[] = Array.from({ length: numDays }, (_, i) => {
    const reverseIndexFromEnd = numDays - 1 - i; // 0 for Friday, 1 for Thursday...
    const isEliminated = inductionStep > reverseIndexFromEnd;
    const eliminatedAt = isEliminated ? reverseIndexFromEnd + 1 : null;

    let reason = 'Possible execution day.';
    if (eliminatedAt === 1) {
      reason = `If alive on the morning of ${weekDayNames[i]}, with all prior days passed, the hanging is mathematically certain—hence CANNOT be a surprise.`;
    } else if (eliminatedAt !== null) {
      reason = `With later days already proven impossible, ${weekDayNames[i]} becomes the last possible date. If prior days pass, it is certain—hence CANNOT be a surprise.`;
    }

    return {
      index: i,
      name: weekDayNames[i],
      shortName: weekDayNames[i].slice(0, 3),
      eliminatedAtStep: eliminatedAt,
      reason
    };
  });

  // Prisoner's Subjective Confidence
  const eliminatedCount = Math.min(inductionStep, numDays);
  const prisonerConfidencePercent = Math.round((eliminatedCount / numDays) * 100);

  // Simulation timer
  useEffect(() => {
    let timer: any;
    if (isSimPlaying && !knockOccurred) {
      timer = setTimeout(() => {
        setSimCurrentDay((prev) => {
          const nextDay = prev + 1;
          if (nextDay === executionDay) {
            setKnockOccurred(true);
            setIsSimPlaying(false);
            return nextDay;
          }
          if (nextDay >= numDays - 1) {
            setIsSimPlaying(false);
            return nextDay;
          }
          return nextDay;
        });
      }, simSpeed);
    }
    return () => clearTimeout(timer);
  }, [isSimPlaying, simCurrentDay, executionDay, numDays, simSpeed, knockOccurred]);

  const handleStartSim = () => {
    setSimCurrentDay(-1);
    setKnockOccurred(false);
    setIsSimPlaying(true);
  };

  const handleResetSim = () => {
    setIsSimPlaying(false);
    setSimCurrentDay(-1);
    setKnockOccurred(false);
  };

  const handleRandomDay = () => {
    const rnd = Math.floor(Math.random() * numDays);
    setExecutionDay(rnd);
    handleResetSim();
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-slate-100 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Top Banner: Courtroom Scene */}
      <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/40 border border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-wider uppercase">
              <Scale className="w-3.5 h-3.5" /> Epistemic Logic & Game Theory
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-slate-100">
              The Unexpected Hanging Paradox
            </h3>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              On Sunday, the judge sentences a prisoner to be hanged at noon on a weekday next week. The execution will be a <strong className="text-amber-300">complete surprise</strong>: the prisoner will not know the day until the executioner knocks at noon.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono">Week Length:</span>
            {[3, 5, 7].map((n) => (
              <button
                key={n}
                onClick={() => setNumDays(n)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  numDays === n
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {n} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveTab('induction')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all ${
            activeTab === 'induction'
              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Brain className="w-4 h-4" /> 1. Backward Induction Trap
        </button>
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all ${
            activeTab === 'simulation'
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <DoorOpen className="w-4 h-4" /> 2. The Executioner's Knock
        </button>
        <button
          onClick={() => setActiveTab('logic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all ${
            activeTab === 'logic'
              ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <BookOpen className="w-4 h-4" /> 3. Formal Epistemic Logic
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all ${
            activeTab === 'quiz'
              ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 font-semibold shadow-lg'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" /> 4. Paradox Diagnosis Quiz
        </button>
      </div>

      {/* TAB 1: BACKWARD INDUCTION TRAP */}
      {activeTab === 'induction' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setInductionStep((s) => Math.min(s + 1, maxInductionSteps))}
                disabled={inductionStep >= maxInductionSteps}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-mono text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                <StepForward className="w-4 h-4" /> Eliminate Next Day (Step {inductionStep + 1})
              </button>
              <button
                onClick={() => setInductionStep(0)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-mono text-xs transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Induction
              </button>
            </div>

            {/* Subjective Confidence Meter */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">Prisoner's Confidence:</span>
              <div className="w-44 h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    prisonerConfidencePercent === 100
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      : 'bg-gradient-to-r from-amber-500 to-rose-500'
                  }`}
                  style={{ width: `${prisonerConfidencePercent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-amber-300 min-w-[3.5rem]">
                {prisonerConfidencePercent}% Safe
              </span>
            </div>
          </div>

          {/* Calendar Grid of Days */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {days.map((day) => {
              const isEliminated = day.eliminatedAtStep !== null;
              const isCurrentElimination = day.eliminatedAtStep === inductionStep;

              return (
                <div
                  key={day.index}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[180px] ${
                    isCurrentElimination
                      ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-950/50 scale-[1.02]'
                      : isEliminated
                      ? 'bg-slate-950/50 border-slate-800/80 opacity-60'
                      : 'bg-slate-900/90 border-slate-700/80 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400">Day {day.index + 1}</span>
                    {isEliminated ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        <XCircle className="w-3 h-3" /> Step {day.eliminatedAtStep}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3" /> Candidate
                      </span>
                    )}
                  </div>

                  <div className="my-2">
                    <h4 className="font-cinzel text-lg font-bold text-slate-100">{day.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">12:00 PM Noon</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[11px] leading-relaxed">
                    {isEliminated ? (
                      <span className="text-rose-300/90 italic">"{day.reason}"</span>
                    ) : (
                      <span className="text-slate-400">Not yet eliminated by backward induction.</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Induction Log Narrative */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Induction Deduction State: Step {inductionStep} of {maxInductionSteps}
            </h4>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
              {inductionStep === 0 && (
                <p>
                  The prisoner sits in his cell on Sunday listening to the decree. All <strong className="text-amber-300">{numDays} days</strong> appear equally open candidates for execution. The prisoner begins his backward induction chain from the final day.
                </p>
              )}
              {inductionStep === 1 && (
                <p>
                  <strong>Phase 1 ({days[numDays - 1].name}):</strong> "Suppose I survive until the morning of {days[numDays - 1].name}. Since the hanging must occur on a weekday, and all earlier days have elapsed, the executioner <em>must</em> arrive today. But then I would know it in advance! It would not be a surprise. Therefore, the judge cannot execute me on {days[numDays - 1].name}."
                </p>
              )}
              {inductionStep === 2 && (
                <p>
                  <strong>Phase 2 ({days[numDays - 2].name}):</strong> "Since {days[numDays - 1].name} is ruled out, {days[numDays - 2].name} is now the effectively final day. If I survive to {days[numDays - 2].name} morning, I know the execution must happen today. Hence it cannot be a surprise! Therefore, {days[numDays - 2].name} is also ruled out."
                </p>
              )}
              {inductionStep > 2 && inductionStep < maxInductionSteps && (
                <p>
                  <strong>Phase {inductionStep} ({days[numDays - inductionStep].name}):</strong> By continuous backward induction, with all subsequent days previously ruled out, {days[numDays - inductionStep].name} becomes the latest remaining date. The exact same logic applies: certainty preempts surprise.
                </p>
              )}
              {inductionStep >= maxInductionSteps && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Prisoner's Final Deduction: Complete Immunity!
                  </div>
                  <p className="text-xs text-slate-300">
                    "Every single day has been eliminated. The judge cannot fulfill both conditions (hanging AND surprise). Therefore, the decree is an empty threat. I cannot be hanged at all!"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THE EXECUTIONER'S KNOCK SIMULATION */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400">Choose Execution Day Planned by Judge:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {days.map((d) => (
                  <button
                    key={d.index}
                    onClick={() => {
                      setExecutionDay(d.index);
                      handleResetSim();
                    }}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                      executionDay === d.index
                        ? 'bg-rose-500 text-slate-950 font-bold shadow-md shadow-rose-950/50'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
                <button
                  onClick={handleRandomDay}
                  className="px-3 py-1.5 rounded-xl font-mono text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-slate-950 transition-all"
                >
                  Pick Random Surprise
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleStartSim}
                disabled={isSimPlaying || knockOccurred}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 rounded-xl font-mono text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
              >
                <Play className="w-4 h-4" /> Start Week Timeline
              </button>
              <button
                onClick={handleResetSim}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-mono text-xs transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          {/* Timeline Animation Visualizer */}
          <div className="relative p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-stretch gap-3 overflow-x-auto">
            {days.map((day) => {
              const isPast = simCurrentDay > day.index;
              const isToday = simCurrentDay === day.index;
              const isExecutionMoment = isToday && knockOccurred;

              return (
                <div
                  key={day.index}
                  className={`flex-1 p-4 rounded-xl border flex flex-col justify-between transition-all duration-500 min-w-[140px] ${
                    isExecutionMoment
                      ? 'bg-rose-950/90 border-rose-500 ring-2 ring-rose-500 scale-105 shadow-2xl shadow-rose-950'
                      : isToday
                      ? 'bg-amber-950/40 border-amber-500/70 shadow-lg'
                      : isPast
                      ? 'bg-slate-950/50 border-slate-900 opacity-40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-slate-400">{day.shortName}</span>
                      {isExecutionMoment ? (
                        <Skull className="w-5 h-5 text-rose-400 animate-bounce" />
                      ) : isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-slate-600" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                      )}
                    </div>
                    <div className="font-cinzel text-base font-bold text-slate-100">{day.name}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
                    {isExecutionMoment ? (
                      <span className="text-rose-300 font-bold uppercase tracking-wider animate-pulse">
                        💥 KNOCK! 12:00 PM
                      </span>
                    ) : isToday ? (
                      <span className="text-amber-300">Passing noon...</span>
                    ) : isPast ? (
                      <span className="text-slate-500">Survived</span>
                    ) : (
                      <span className="text-slate-600">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outcome Verdict Card */}
          {knockOccurred && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/60 border border-rose-500/50 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
                <h4 className="font-cinzel text-lg font-bold text-slate-100">
                  Knock on the Door: {days[executionDay].name} at Noon!
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="text-rose-400 font-mono font-bold uppercase tracking-wider text-[11px]">
                    The Reality of the Hanging
                  </div>
                  <p>
                    The prisoner was sitting calmly in his cell, having convinced himself with mathematical certainty that execution was impossible. When the executioner knocked on <strong className="text-slate-100">{days[executionDay].name} at noon</strong>, the prisoner was <strong className="text-rose-300">utterly astonished</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="text-emerald-400 font-mono font-bold uppercase tracking-wider text-[11px]">
                    The Judge's Triumph
                  </div>
                  <p>
                    The judge's decree was fulfilled to the exact letter:
                    1. The prisoner was executed on a weekday.
                    2. The prisoner did <em>not</em> know in advance.
                    His very "proof" of safety was what made the knock a total surprise!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FORMAL EPISTEMIC LOGIC */}
      {activeTab === 'logic' && (
        <div className="space-y-6">
          <IntuitionVsMath
            intuition="If Friday can't be a surprise because it's the last day, and Thursday can't be a surprise because Friday is gone, then by mathematical induction no day can be a surprise. Logic guarantees the prisoner is safe!"
            mathematics="The prisoner's induction is fallacious because it relies on hypothetical knowledge states at future moments that are self-defeating. Formally in epistemic logic (modal system S5), the decree contains a Fitch knowability blindspot: asserting K(p and not K p) creates a contradiction inside the agent's belief system."
            mathLaTeX="\mathcal{M}, t \models K_t \left( \bigvee_{i=1}^n H_i \land \bigwedge_{i=1}^n (H_i \to \neg K_{i-1} H_i) \right) \implies \bot"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> 1. Quine's Epistemic View
              </div>
              <h5 className="font-cinzel text-sm font-bold text-slate-200">The Self-Refuting Decree</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Willard Van Orman Quine (1953) argued the decree is pragmatic nonsense from the start. A surprise hanging cannot be consistently announced. Since the prisoner deduces a contradiction, his premise that the judge's decree is a reliable truth is invalidated.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" /> 2. Game Theory Defeat
              </div>
              <h5 className="font-cinzel text-sm font-bold text-slate-200">Counterfactual Collapse</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Christina Bicchieri & Timothy Williamson noted that backward induction requires counterfactual nodes ("What if Thursday arrives?"). But reaching Thursday itself would contradict the judge's infallibility, so the prisoner cannot keep relying on the premise that the decree holds!
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-purple-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" /> 3. Fitch's Blindspot
              </div>
              <h5 className="font-cinzel text-sm font-bold text-slate-200">Moorean Epistemic Blindspots</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Statements of the form $p \land \neg K p$ ("It is raining, but you do not know it") are easily true, yet impossible to know. By attempting to know a Moorean proposition, the prisoner's belief state collapses into an inescapable epistemic paradox.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PARADOX DIAGNOSIS QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            Test your understanding of the subtle logical mechanisms that make the Unexpected Hanging Paradox so notorious in the philosophy of mathematics and formal logic.
          </div>

          {[
            {
              id: 1,
              question: "Where exactly did the prisoner's backward induction logic go wrong?",
              options: [
                "He assumed Thursday was before Friday.",
                "He assumed on Sunday that if Thursday arrives without a hanging, the judge's decree would still be a credible premise from which to deduce conclusions.",
                "The judge lied about having an executioner.",
                "Math cannot model days of the week."
              ],
              correct: 1,
              explanation: "If Thursday night arrives and the prisoner has not been hanged, the judge's decree has already proven untrustworthy in the prisoner's mind. The prisoner cannot use the decree to deduce Friday is impossible."
            },
            {
              id: 2,
              question: "Can an unexpected hanging occur in a 1-day week (e.g. Friday only)?",
              options: [
                "Yes, because surprise is impossible in advance.",
                "No, on a 1-day week, the prisoner knows it must be Friday noon, so it can never be a surprise unless the prisoner completely forgets the decree.",
                "Yes, if the prisoner is sleeping.",
                "It is mathematically undecidable."
              ],
              correct: 1,
              explanation: "For n = 1, the decree is an outright logical contradiction: 'You will be hanged Friday, and you will not know it is Friday.'"
            },
            {
              id: 3,
              question: "Why was the prisoner surprised on Wednesday noon?",
              options: [
                "Because he forgot what day it was.",
                "Because his deductive proof convinced him he could not be hanged at all, making the arrival of the executioner completely unanticipated.",
                "The executioner used a disguise.",
                "Because Wednesday is an odd day."
              ],
              correct: 1,
              explanation: "The core irony: It was the prisoner's very deduction of impossibility that generated the surprise required by the judge's decree."
            }
          ].map((q) => {
            const selected = selectedAnswers[q.id];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === q.correct;

            return (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h5 className="font-cinzel text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-xs">Q{q.id}.</span> {q.question}
                </h5>

                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';
                    if (isAnswered) {
                      if (oIdx === q.correct) {
                        btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold';
                      } else if (selected === oIdx) {
                        btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && oIdx === q.correct && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && selected === oIdx && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="pt-2 text-xs text-slate-400 italic">
                    <strong className="text-amber-300 not-italic">Analysis: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
