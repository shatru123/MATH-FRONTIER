import React, { useState } from 'react';
import { UserPlus, Users, Infinity as InfinityIcon, RotateCcw, Sparkles } from 'lucide-react';
import { KaTeXMath } from '../common/KaTeXMath';

interface Room {
  number: number;
  guestName: string;
  isNewArrival: boolean;
  isMoving: boolean;
  fromRoom?: number;
}

export const HilbertsHotelLab: React.FC = () => {
  const [totalArrivals, setTotalArrivals] = useState(0);
  const [lastAction, setLastAction] = useState<string>('Hotel is fully occupied with infinite guests.');
  const [activeShift, setActiveShift] = useState<string>('n \\mapsto n');

  // We display the first 16 rooms of the infinite hotel
  const [rooms, setRooms] = useState<Room[]>(() =>
    Array.from({ length: 16 }, (_, i) => ({
      number: i + 1,
      guestName: `Guest #${i + 1}`,
      isNewArrival: false,
      isMoving: false
    }))
  );

  const handleAddOne = () => {
    setTotalArrivals((a) => a + 1);
    setLastAction('Add 1 guest: Tell Guest n to move to Room n+1. Room 1 is now empty for the newcomer!');
    setActiveShift('n \\mapsto n + 1');

    setRooms((prev) => {
      const next = [...prev];
      // Shift existing guests
      for (let i = next.length - 1; i >= 1; i--) {
        next[i] = {
          number: i + 1,
          guestName: prev[i - 1].guestName,
          isNewArrival: false,
          isMoving: true,
          fromRoom: prev[i - 1].number
        };
      }
      // Insert new guest into Room 1
      next[0] = {
        number: 1,
        guestName: `New Arrival`,
        isNewArrival: true,
        isMoving: false
      };
      return next;
    });
  };

  const handleAddTen = () => {
    const k = 10;
    setTotalArrivals((a) => a + k);
    setLastAction(`Add ${k} guests: Tell Guest n to move to Room n + ${k}. Rooms 1 through ${k} open up!`);
    setActiveShift(`n \\mapsto n + ${k}`);

    setRooms((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i >= k; i--) {
        next[i] = {
          number: i + 1,
          guestName: prev[i - k].guestName,
          isNewArrival: false,
          isMoving: true,
          fromRoom: prev[i - k].number
        };
      }
      for (let i = 0; i < Math.min(k, next.length); i++) {
        next[i] = {
          number: i + 1,
          guestName: `Guest (+${i + 1})`,
          isNewArrival: true,
          isMoving: false
        };
      }
      return next;
    });
  };

  const handleAddInfinite = () => {
    setTotalArrivals((a) => a + 1000);
    setLastAction(
      'Infinitely Many Guests arrive! Tell Guest n to move to Room 2n (all even rooms). All infinitely many odd rooms (1, 3, 5, 7...) become vacant!'
    );
    setActiveShift('n \\mapsto 2n');

    setRooms((prev) => {
      const next = [...prev];
      for (let i = 0; i < next.length; i++) {
        const roomNum = i + 1;
        if (roomNum % 2 === 0) {
          // Even room receives old guest from roomNum/2
          next[i] = {
            number: roomNum,
            guestName: `Old #${roomNum / 2}`,
            isNewArrival: false,
            isMoving: true,
            fromRoom: roomNum / 2
          };
        } else {
          // Odd room receives new infinite guest
          next[i] = {
            number: roomNum,
            guestName: `Inf Arrival #${(roomNum + 1) / 2}`,
            isNewArrival: true,
            isMoving: false
          };
        }
      }
      return next;
    });
  };

  const handleReset = () => {
    setTotalArrivals(0);
    setLastAction('Hotel reset to initial state: fully occupied.');
    setActiveShift('n \\mapsto n');
    setRooms(
      Array.from({ length: 16 }, (_, i) => ({
        number: i + 1,
        guestName: `Guest #${i + 1}`,
        isNewArrival: false,
        isMoving: false
      }))
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      {/* Header & Concept */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100 flex items-center gap-2">
            <InfinityIcon className="w-5 h-5 text-cyan-400" />
            Hilbert's Grand Hotel Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Demonstrating bijection with proper subsets in countably infinite sets (<KaTeXMath math="\aleph_0" />).
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
          Mapping rule: <KaTeXMath math={activeShift} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={handleAddOne}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/10"
        >
          <UserPlus className="w-4 h-4" />
          Add 1 Guest (n → n+1)
        </button>

        <button
          type="button"
          onClick={handleAddTen}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/10"
        >
          <Users className="w-4 h-4" />
          Add 10 Guests (n → n+10)
        </button>

        <button
          type="button"
          onClick={handleAddInfinite}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/10"
        >
          <InfinityIcon className="w-4 h-4" />
          Add Infinitely Many Guests (n → 2n)
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs ml-auto transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Hotel
        </button>
      </div>

      {/* Current Action Banner */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-amber-300 flex items-center gap-2">
        <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
        <span>{lastAction}</span>
      </div>

      {/* Hotel Rooms Visual Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {rooms.map((room) => (
          <div
            key={room.number}
            className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
              room.isNewArrival
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10'
                : room.isMoving
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono text-slate-400">ROOM</span>
            <span className="text-base font-bold font-mono text-slate-100 my-0.5">{room.number}</span>
            <div className="w-full h-px bg-slate-800/80 my-1.5" />
            <span className="text-xs truncate w-full font-medium" title={room.guestName}>
              {room.guestName}
            </span>
            {room.fromRoom && (
              <span className="text-[9px] font-mono text-slate-400 mt-1">from #{room.fromRoom}</span>
            )}
          </div>
        ))}
      </div>

      {/* Educational Note */}
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
        <strong className="text-slate-200">Countable Infinity (<KaTeXMath math="\aleph_0" />):</strong> In a finite hotel, full implies no vacancies. But a countably infinite set can be placed into a one-to-one correspondence (bijection) with a proper subset of itself. The mapping <KaTeXMath math="f(n) = 2n" /> demonstrates that the set of all integers <KaTeXMath math="\mathbb{N}" /> has the exact same cardinality as the set of only even integers!
      </div>
    </div>
  );
};
