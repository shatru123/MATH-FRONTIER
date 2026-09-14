import React from 'react';
import { MobiusStripScene } from './MobiusStripScene';
import { KleinBottleScene } from './KleinBottleScene';
import { TorusScene } from './TorusScene';
import { HyperbolicGeometryScene } from './HyperbolicGeometryScene';
import { HilbertsHotelLab } from './HilbertsHotelLab';
import { BanachTarskiLab } from './BanachTarskiLab';
import { FractalLab } from './FractalLab';
import { CollatzLab } from './CollatzLab';
import { GoldbachLab } from './GoldbachLab';
import { TwinPrimeLab } from './TwinPrimeLab';
import { RiemannHypothesisLab } from './RiemannHypothesisLab';

export interface VisualizationRegistryEntry {
  title: string;
  description: string;
  component: React.ComponentType<any>;
  category: string;
  isThreeD: boolean;
}

export const VISUALIZATION_REGISTRY: Record<string, VisualizationRegistryEntry> = {
  'mobius-strip': {
    title: 'Möbius Strip Laboratory',
    description: 'Flagship 3D experience with step-by-step construction, surface tracing, and normal vector flip.',
    component: MobiusStripScene,
    category: 'Topology',
    isThreeD: true
  },
  'klein-bottle': {
    title: 'Klein Bottle 4D Immersion',
    description: 'Interactive 3D parametric figure-8 Klein bottle with cross-sectional slicing.',
    component: KleinBottleScene,
    category: 'Topology',
    isThreeD: true
  },
  'torus': {
    title: 'Parametric Torus & Loops',
    description: 'Interactive torus with adjustable major/minor radii and fundamental group cycles.',
    component: TorusScene,
    category: 'Topology',
    isThreeD: true
  },
  'hyperbolic-geometry': {
    title: 'Poincaré Disk Hyperbolic Plane',
    description: 'Comparative explorer for non-Euclidean parallel postulate behavior.',
    component: HyperbolicGeometryScene,
    category: 'Geometry',
    isThreeD: false
  },
  'hilberts-hotel': {
    title: 'Hilbert\'s Infinite Hotel',
    description: 'Countable infinity simulator with dynamic room shifting animations.',
    component: HilbertsHotelLab,
    category: 'Paradoxes',
    isThreeD: false
  },
  'banach-tarski': {
    title: 'Banach–Tarski Paradox Lab',
    description: 'Decomposition of a 3D sphere into 5 non-measurable pieces using SO(3) rotations.',
    component: BanachTarskiLab,
    category: 'Paradoxes',
    isThreeD: true
  },
  'mandelbrot-set': {
    title: 'Fractal Explorer (Mandelbrot & Julia)',
    description: 'High-performance canvas fractal lab with zoom, pan, and dynamic parameters.',
    component: FractalLab,
    category: 'Fractals',
    isThreeD: false
  },
  'fractal-lab': {
    title: 'Fractal Explorer',
    description: 'Interactive fractal generator for Mandelbrot, Julia, Sierpiński, Koch, and Cantor sets.',
    component: FractalLab,
    category: 'Fractals',
    isThreeD: false
  },
  'collatz-conjecture': {
    title: 'Collatz 3n + 1 Trajectory Explorer',
    description: 'Interactive sequence calculation, stopping time, and peak height comparison.',
    component: CollatzLab,
    category: 'Number Theory',
    isThreeD: false
  },
  'collatz-lab': {
    title: 'Collatz Trajectory Lab',
    description: 'Interactive 3n+1 sequence plotter and multi-integer comparisons.',
    component: CollatzLab,
    category: 'Number Theory',
    isThreeD: false
  },
  'goldbach-conjecture': {
    title: 'Goldbach Decomposition Lab',
    description: 'Find all prime pairs summing to any even integer with Goldbach comet explanation.',
    component: GoldbachLab,
    category: 'Number Theory',
    isThreeD: false
  },
  'goldbach-lab': {
    title: 'Goldbach Decomposition Lab',
    description: 'Search prime decompositions for any even integer.',
    component: GoldbachLab,
    category: 'Number Theory',
    isThreeD: false
  },
  'twin-prime-conjecture': {
    title: 'Twin Prime Sieve & Gaps',
    description: 'Interactive prime number line and verified bounded gap milestones (< 246).',
    component: TwinPrimeLab,
    category: 'Number Theory',
    isThreeD: false
  },
  'twin-prime-lab': {
    title: 'Twin Prime Sieve',
    description: 'Interactive prime number line highlighting (p, p+2) pairs.',
    component: TwinPrimeLab,
    category: 'Number Theory',
    isThreeD: false
  },
  'riemann-hypothesis': {
    title: 'Riemann Zeta Zero Spectrum',
    description: 'Complex plane visualizer with critical strip, critical line, and known zeros.',
    component: RiemannHypothesisLab,
    category: 'Analytic Number Theory',
    isThreeD: false
  }
};

export function getVisualizationComponent(slug?: string): React.ComponentType<any> | null {
  if (!slug) return null;
  const entry = VISUALIZATION_REGISTRY[slug.toLowerCase()];
  return entry ? entry.component : null;
}
