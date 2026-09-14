import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Footer } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ProblemsPage } from './pages/ProblemsPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';
import { WondersPage } from './pages/WondersPage';
import { WonderDetailPage } from './pages/WonderDetailPage';
import { Gallery3DPage } from './pages/Gallery3DPage';
import { LabPage } from './pages/LabPage';
import { SolvedProblemsPage } from './pages/SolvedProblemsPage';
import { TimelinePage } from './pages/TimelinePage';
import { AboutPage } from './pages/AboutPage';

const NotFoundPage: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 gap-4">
    <div className="font-cinzel text-6xl font-black text-cyan-400">404</div>
    <h2 className="font-cinzel text-2xl font-bold text-slate-100">Mathematical Coordinate Undefined</h2>
    <p className="text-xs text-slate-400 max-w-md">
      The requested equation, problem, or exhibit does not exist in the Math Frontier coordinate system.
    </p>
    <Link
      to="/"
      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors"
    >
      Return to Museum Grand Hall
    </Link>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problems/:slug" element={<ProblemDetailPage />} />
            <Route path="/wonders" element={<WondersPage />} />
            <Route path="/wonders/:slug" element={<WonderDetailPage />} />
            <Route path="/gallery" element={<Gallery3DPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/solved" element={<SolvedProblemsPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
