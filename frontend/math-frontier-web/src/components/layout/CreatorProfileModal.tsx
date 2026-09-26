import React, { useEffect } from 'react';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Expose global modal functions for compatibility with external triggers
    (window as any).openProfileModal = () => {
      window.dispatchEvent(new CustomEvent('mathfrontier:open-profile'));
    };
    (window as any).openModal = (id: string) => {
      if (id === 'modal-profile') {
        window.dispatchEvent(new CustomEvent('mathfrontier:open-profile'));
      }
    };
    (window as any).closeModal = (id: string) => {
      if (id === 'modal-profile') {
        window.dispatchEvent(new CustomEvent('mathfrontier:close-profile'));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-profile"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-content p-6 max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition text-base leading-none z-10"
          title="Close"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center pt-2">
          <div className="relative group mb-4">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-70 blur-md group-hover:opacity-100 transition duration-300"></div>
            <a
              href="/images/shatrughna.jpg"
              target="_blank"
              rel="noopener noreferrer"
              title="Click to view full original photo in new tab"
            >
              <img
                src="/images/shatrughna.jpg"
                alt="Shatrughna Ambhore"
                className="relative w-48 h-48 rounded-full object-cover ring-4 ring-slate-900 shadow-2xl cursor-zoom-in transition transform group-hover:scale-105"
              />
            </a>
            <a
              href="/images/shatrughna.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 bg-slate-900/95 text-blue-300 border border-blue-500/40 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
            >
              <span>🔍</span> Full View
            </a>
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight">Shatrughna Ambhore</h3>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 mt-1">
            Lead Creator &amp; Software Engineer
          </span>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed max-w-sm">
            Architected LearningOS to deliver a resilient, career-grade 100-day engineering and AI learning system.
          </p>

          <div className="w-full space-y-2 mt-5 text-xs">
            <a
              href="mailto:ambhoreshatrughna@gmail.com"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-blue-600/20 text-blue-300 border border-slate-700/80 hover:border-blue-500/50 transition font-medium"
            >
              <span>✉️</span> ambhoreshatrughna@gmail.com
            </a>
            <a
              href="tel:+919604466334"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-600/20 text-emerald-300 border border-slate-700/80 hover:border-emerald-500/50 transition font-medium"
            >
              <span>📞</span> +91 9604466334
            </a>
            <a
              href="https://github.com/shatru123/Learning"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-purple-600/20 text-purple-300 border border-slate-700/80 hover:border-purple-500/50 transition font-medium"
            >
              <span>🐙</span> GitHub Repository
            </a>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between w-full text-xs">
            <a
              href="/images/shatrughna.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <span>🖼️</span> Open full photo ↗
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
