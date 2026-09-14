import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, Sliders } from 'lucide-react';
import { mandelbrotIteration, juliaIteration, kochIteration } from '../../utils/mathUtils';
import { KaTeXMath } from '../common/KaTeXMath';

export type FractalType = 'mandelbrot' | 'julia' | 'sierpinski' | 'koch' | 'cantor' | 'dragon';

interface FractalLabProps {
  initialType?: FractalType;
}

export const FractalLab: React.FC<FractalLabProps> = ({ initialType = 'mandelbrot' }) => {
  const [fractalType, setFractalType] = useState<FractalType>(initialType);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // View parameters for Mandelbrot & Julia
  const [centerX, setCenterX] = useState(-0.5);
  const [centerY, setCenterY] = useState(0.0);
  const [zoom, setZoom] = useState(1.0);
  const [maxIter, setMaxIter] = useState(60);

  // Julia parameter c = cr + ci*i
  const [juliaCr, setJuliaCr] = useState(-0.7);
  const [juliaCi, setJuliaCi] = useState(0.27015);

  // Recursion depth for discrete fractals
  const [depth, setDepth] = useState(4);

  // Render function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (fractalType === 'mandelbrot') {
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      const scale = 3.0 / (zoom * Math.min(width, height));

      for (let py = 0; py < height; py++) {
        const ci = centerY + (py - height / 2) * scale;
        for (let px = 0; px < width; px++) {
          const cr = centerX + (px - width / 2) * scale;
          const iter = mandelbrotIteration(cr, ci, maxIter);

          const idx = (py * width + px) * 4;
          if (iter === maxIter) {
            data[idx] = 2; // Dark interior
            data[idx + 1] = 6;
            data[idx + 2] = 23;
            data[idx + 3] = 255;
          } else {
            // Neon cyan to purple palette
            const t = iter / maxIter;
            data[idx] = Math.floor(Math.sin(t * 10) * 127 + 128); // R
            data[idx + 1] = Math.floor(Math.cos(t * 8) * 127 + 128); // G
            data[idx + 2] = Math.floor(t * 255); // B
            data[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (fractalType === 'julia') {
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;
      const scale = 3.0 / (zoom * Math.min(width, height));

      for (let py = 0; py < height; py++) {
        const zi = centerY + (py - height / 2) * scale;
        for (let px = 0; px < width; px++) {
          const zr = centerX + (px - width / 2) * scale;
          const iter = juliaIteration(zr, zi, juliaCr, juliaCi, maxIter);

          const idx = (py * width + px) * 4;
          if (iter === maxIter) {
            data[idx] = 2;
            data[idx + 1] = 6;
            data[idx + 2] = 23;
            data[idx + 3] = 255;
          } else {
            const t = iter / maxIter;
            data[idx] = Math.floor(t * 220 + 35);
            data[idx + 1] = Math.floor(Math.sin(t * 12) * 100 + 100);
            data[idx + 2] = 240;
            data[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (fractalType === 'sierpinski') {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#06b6d4';

      const drawTriangle = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, d: number) => {
        if (d === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.closePath();
          ctx.fill();
          return;
        }
        const m12x = (x1 + x2) / 2, m12y = (y1 + y2) / 2;
        const m23x = (x2 + x3) / 2, m23y = (y2 + y3) / 2;
        const m31x = (x3 + x1) / 2, m31y = (y3 + y1) / 2;

        drawTriangle(x1, y1, m12x, m12y, m31x, m31y, d - 1);
        drawTriangle(m12x, m12y, x2, y2, m23x, m23y, d - 1);
        drawTriangle(m31x, m31y, m23x, m23y, x3, y3, d - 1);
      };

      const pad = 40;
      drawTriangle(width / 2, pad, pad, height - pad, width - pad, height - pad, depth);
    } else if (fractalType === 'koch') {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;

      const drawKoch = (p1: [number, number], p2: [number, number], d: number) => {
        if (d === 0) {
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.stroke();
          return;
        }
        const pts = kochIteration(p1, p2);
        for (let i = 0; i < 4; i++) {
          drawKoch(pts[i], pts[i + 1], d - 1);
        }
      };

      // 3 sides of equilateral triangle for snowflake
      const size = 260;
      const h = (Math.sqrt(3) / 2) * size;
      const p1: [number, number] = [width / 2, height / 2 - (2 / 3) * h + 20];
      const p2: [number, number] = [width / 2 + size / 2, height / 2 + (1 / 3) * h + 20];
      const p3: [number, number] = [width / 2 - size / 2, height / 2 + (1 / 3) * h + 20];

      drawKoch(p1, p2, depth);
      drawKoch(p2, p3, depth);
      drawKoch(p3, p1, depth);
    } else if (fractalType === 'cantor') {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#a855f7';

      const drawCantor = (x: number, y: number, len: number, d: number) => {
        if (len < 1 || d > depth + 3) return;
        ctx.fillRect(x, y, len, 8);
        drawCantor(x, y + 24, len / 3, d + 1);
        drawCantor(x + (2 * len) / 3, y + 24, len / 3, d + 1);
      };

      drawCantor(30, 40, width - 60, 0);
    } else if (fractalType === 'dragon') {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.5;

      const drawDragon = (x1: number, y1: number, x2: number, y2: number, d: number, sign: number) => {
        if (d === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          return;
        }
        const midX = (x1 + x2) / 2 + (sign * (y2 - y1)) / 2;
        const midY = (y1 + y2) / 2 - (sign * (x2 - x1)) / 2;
        drawDragon(x1, y1, midX, midY, d - 1, 1);
        drawDragon(midX, midY, x2, y2, d - 1, -1);
      };

      drawDragon(width / 3, height / 2, (2 * width) / 3, height / 2, depth + 6, 1);
    }
  }, [fractalType, centerX, centerY, zoom, maxIter, juliaCr, juliaCi, depth]);

  const handleZoom = (factor: number) => {
    setZoom((z) => Math.max(0.2, z * factor));
  };

  const handleReset = () => {
    setCenterX(-0.5);
    setCenterY(0.0);
    setZoom(1.0);
    setMaxIter(60);
    setDepth(4);
  };

  return (
    <div className="flex flex-col gap-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
      {/* Fractal Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {(['mandelbrot', 'julia', 'sierpinski', 'koch', 'cantor', 'dragon'] as FractalType[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFractalType(f);
                if (f === 'julia') setCenterX(0);
              }}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                fractalType === f
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'mandelbrot' ? 'Mandelbrot Set' : f === 'julia' ? 'Julia Set' : f}
            </button>
          ))}
        </div>

        {/* Zoom & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleZoom(1.5)}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1 / 1.5)}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Canvas */}
      <div className="relative w-full h-[400px] rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
        <canvas ref={canvasRef} width={600} height={400} className="w-full h-full object-contain" />

        {/* Readout */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-800 text-[11px] font-mono text-cyan-400">
          Zoom: {zoom.toFixed(2)}x | Iterations: {maxIter}
        </div>
      </div>

      {/* Sliders & Parameters */}
      <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
        {(fractalType === 'mandelbrot' || fractalType === 'julia') && (
          <label className="flex items-center gap-2 text-slate-300">
            <span>Max Iterations: {maxIter}</span>
            <input
              type="range"
              min="20"
              max="200"
              step="5"
              value={maxIter}
              onChange={(e) => setMaxIter(parseInt(e.target.value))}
              className="w-24 accent-cyan-500"
            />
          </label>
        )}

        {fractalType === 'julia' && (
          <>
            <label className="flex items-center gap-2 text-slate-300">
              <span>c (Real): {juliaCr.toFixed(3)}</span>
              <input
                type="range"
                min="-1.5"
                max="1.5"
                step="0.01"
                value={juliaCr}
                onChange={(e) => setJuliaCr(parseFloat(e.target.value))}
                className="w-20 accent-purple-500"
              />
            </label>
            <label className="flex items-center gap-2 text-slate-300">
              <span>c (Imag): {juliaCi.toFixed(3)}</span>
              <input
                type="range"
                min="-1.5"
                max="1.5"
                step="0.01"
                value={juliaCi}
                onChange={(e) => setJuliaCi(parseFloat(e.target.value))}
                className="w-20 accent-purple-500"
              />
            </label>
          </>
        )}

        {['sierpinski', 'koch', 'cantor', 'dragon'].includes(fractalType) && (
          <label className="flex items-center gap-2 text-slate-300">
            <span>Recursion Depth: {depth}</span>
            <input
              type="range"
              min="1"
              max="7"
              step="1"
              value={depth}
              onChange={(e) => setDepth(parseInt(e.target.value))}
              className="w-24 accent-cyan-500"
            />
          </label>
        )}
      </div>
    </div>
  );
};
