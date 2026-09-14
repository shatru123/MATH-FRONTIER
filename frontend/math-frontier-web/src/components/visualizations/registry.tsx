import React from 'react';
import { MobiusStripScene } from './MobiusStripScene';
import { KleinBottleScene } from './KleinBottleScene';
import { TorusScene } from './TorusScene';
import { ProjectivePlaneScene } from './ProjectivePlaneScene';
import { HyperbolicGeometryScene } from './HyperbolicGeometryScene';
import { HilbertsHotelLab } from './HilbertsHotelLab';
import { ZenosParadoxesLab } from './ZenosParadoxesLab';
import { CantorDiagonalLab } from './CantorDiagonalLab';
import { BanachTarskiLab } from './BanachTarskiLab';
import { BirthdayParadoxLab } from './BirthdayParadoxLab';
import { MontyHallLab } from './MontyHallLab';
import { GabrielsHornScene } from './GabrielsHornScene';
import { FractalLab } from './FractalLab';
import { CollatzLab } from './CollatzLab';
import { GoldbachLab } from './GoldbachLab';
import { TwinPrimeLab } from './TwinPrimeLab';
import { RiemannHypothesisLab } from './RiemannHypothesisLab';
import { PvsNPLab } from './PvsNPLab';
import { PoincareConjectureScene } from './PoincareConjectureScene';

// Fractal wrapper components
const JuliaSetLab: React.FC = () => <FractalLab initialType="julia" />;
const SierpinskiLab: React.FC = () => <FractalLab initialType="sierpinski" />;
const KochSnowflakeLab: React.FC = () => <FractalLab initialType="koch" />;
const CantorSetLab: React.FC = () => <FractalLab initialType="cantor" />;
const DragonCurveLab: React.FC = () => <FractalLab initialType="dragon" />;

export interface VisualizationRegistryEntry {
  title: string;
  description: string;
  component: React.ComponentType<any>;
  category: string;
  isThreeD: boolean;
  entityType: 'wonder' | 'problem' | 'lab';
  entitySlug: string;
}

export const VISUALIZATION_REGISTRY: Record<string, VisualizationRegistryEntry> = {
  'mobius-strip': {
    title: 'Möbius Strip Laboratory',
    description: 'Flagship 3D experience with step-by-step construction, surface tracing, and normal vector flip.',
    component: MobiusStripScene,
    category: 'Topology',
    isThreeD: true,
    entityType: 'wonder',
    entitySlug: 'mobius-strip'
  },
  'klein-bottle': {
    title: 'Klein Bottle 4D Immersion',
    description: 'Interactive 3D parametric figure-8 Klein bottle with cross-sectional slicing and surface tracing.',
    component: KleinBottleScene,
    category: 'Topology',
    isThreeD: true,
    entityType: 'wonder',
    entitySlug: 'klein-bottle'
  },
  'torus': {
    title: 'Parametric Torus & Loops',
    description: 'Interactive torus with adjustable major/minor radii and fundamental group cycles.',
    component: TorusScene,
    category: 'Topology',
    isThreeD: true,
    entityType: 'wonder',
    entitySlug: 'torus'
  },
  'projective-plane': {
    title: 'Real Projective Plane (Cross-Cap)',
    description: '3D cross-cap immersion of the non-orientable surface RP² with self-intersection line.',
    component: ProjectivePlaneScene,
    category: 'Topology',
    isThreeD: true,
    entityType: 'wonder',
    entitySlug: 'projective-plane'
  },
  'hyperbolic-geometry': {
    title: 'Poincaré Disk Hyperbolic Plane',
    description: 'Comparative explorer for non-Euclidean parallel postulate behavior and negative curvature.',
    component: HyperbolicGeometryScene,
    category: 'Geometry',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'hyperbolic-geometry'
  },
  'hilberts-hotel': {
    title: "Hilbert's Infinite Hotel",
    description: 'Countable infinity simulator with dynamic guest shifting animations.',
    component: HilbertsHotelLab,
    category: 'Infinity',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'hilberts-hotel'
  },
  'zenos-paradoxes': {
    title: "Zeno's Paradoxes Laboratory",
    description: 'Interactive Achilles and the Tortoise race, Dichotomy series, and Arrow paradox limits.',
    component: ZenosParadoxesLab,
    category: 'Infinity',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'zenos-paradoxes'
  },
  'cantors-diagonal-argument': {
    title: "Cantor's Diagonalization Laboratory",
    description: 'Interactive binary sequence grid proving the uncountability of the real continuum.',
    component: CantorDiagonalLab,
    category: 'Infinity',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'cantors-diagonal-argument'
  },
  'banach-tarski': {
    title: 'Banach–Tarski Paradox Lab',
    description: 'Decomposition of a 3D sphere into 5 non-measurable pieces using SO(3) rotations.',
    component: BanachTarskiLab,
    category: 'Paradoxes',
    isThreeD: true,
    entityType: 'wonder',
    entitySlug: 'banach-tarski-paradox'
  },
  'banach-tarski-paradox': {
    title: 'Banach–Tarski Paradox Lab',
    description: 'Decomposition of a 3D sphere into 5 non-measurable pieces using SO(3) rotations.',
    component: BanachTarskiLab,
    category: 'Paradoxes',
    isThreeD: true,
    entityType: 'wonder',
    entitySlug: 'banach-tarski-paradox'
  },
  'birthday-paradox': {
    title: 'The Birthday Paradox Explorer',
    description: 'Calculate and visualize the combinatorial collision threshold reaching 50% at n = 23.',
    component: BirthdayParadoxLab,
    category: 'Paradoxes',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'birthday-paradox'
  },
  'monty-hall-problem': {
    title: 'Monty Hall Problem Simulator',
    description: 'Interactive 3-door game and batch Monte Carlo simulation showing the 2/3 switching advantage.',
    component: MontyHallLab,
    category: 'Paradoxes',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'monty-hall-problem'
  },
  'gabriels-horn': {
    title: "Gabriel's Horn 3D (Torricelli's Trumpet)",
    description: 'Finite volume pi but infinite surface area: the famous painter paradox surface of revolution.',
    component: GabrielsHornScene,
    category: 'Paradoxes',
    isThreeD: true,
    entityType: 'wonder',
    entitySlug: 'gabriels-horn'
  },
  'mandelbrot-set': {
    title: 'The Mandelbrot Set',
    description: 'High-performance canvas fractal lab with zoom, pan, and escape-time color maps.',
    component: FractalLab,
    category: 'Fractals',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'mandelbrot-set'
  },
  'julia-set': {
    title: 'The Julia Set Explorer',
    description: 'Dynamical boundary generator across the complex parameter space c = cr + ci*i.',
    component: JuliaSetLab,
    category: 'Fractals',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'julia-set'
  },
  'sierpinski-triangle': {
    title: 'Sierpiński Triangle Generator',
    description: 'Recursive trifurcation generating a fractal of dimension log 3 / log 2 approx 1.585.',
    component: SierpinskiLab,
    category: 'Fractals',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'sierpinski-triangle'
  },
  'koch-snowflake': {
    title: 'Koch Snowflake Lab',
    description: 'Infinite perimeter enclosing finite area with fractal dimension log 4 / log 3 approx 1.262.',
    component: KochSnowflakeLab,
    category: 'Fractals',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'koch-snowflake'
  },
  'cantor-set': {
    title: 'Cantor Ternary Set Explorer',
    description: 'Repeated middle-third deletion forming an uncountable set of Lebesgue measure zero.',
    component: CantorSetLab,
    category: 'Fractals',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'cantor-set'
  },
  'dragon-curve': {
    title: 'Heighway Dragon Curve',
    description: 'Self-similar space-filling boundary with 90-degree paper-fold iteration.',
    component: DragonCurveLab,
    category: 'Fractals',
    isThreeD: false,
    entityType: 'wonder',
    entitySlug: 'dragon-curve'
  },
  'fractal-lab': {
    title: 'Unified Fractal Laboratory',
    description: 'Interactive fractal generator for Mandelbrot, Julia, Sierpiński, Koch, and Cantor sets.',
    component: FractalLab,
    category: 'Fractals',
    isThreeD: false,
    entityType: 'lab',
    entitySlug: 'fractals'
  },
  'collatz-conjecture': {
    title: 'Collatz 3n + 1 Trajectory Explorer',
    description: 'Interactive sequence calculation, stopping time, and peak height comparison.',
    component: CollatzLab,
    category: 'Number Theory',
    isThreeD: false,
    entityType: 'problem',
    entitySlug: 'collatz-conjecture'
  },
  'collatz-lab': {
    title: 'Collatz Trajectory Lab',
    description: 'Interactive 3n+1 sequence plotter and multi-integer comparisons.',
    component: CollatzLab,
    category: 'Number Theory',
    isThreeD: false,
    entityType: 'problem',
    entitySlug: 'collatz-conjecture'
  },
  'goldbach-conjecture': {
    title: 'Goldbach Decomposition Lab',
    description: 'Find all prime pairs summing to any even integer with Goldbach comet explanation.',
    component: GoldbachLab,
    category: 'Number Theory',
    isThreeD: false,
    entityType: 'problem',
    entitySlug: 'goldbach-conjecture'
  },
  'goldbach-lab': {
    title: 'Goldbach Comet Lab',
    description: 'Search prime decompositions for any even integer.',
    component: GoldbachLab,
    category: 'Number Theory',
    isThreeD: false,
    entityType: 'problem',
    entitySlug: 'goldbach-conjecture'
  },
  'twin-prime-conjecture': {
    title: 'Twin Prime Sieve & Gaps',
    description: 'Interactive prime number line and verified bounded gap milestones (< 246).',
    component: TwinPrimeLab,
    category: 'Number Theory',
    isThreeD: false,
    entityType: 'problem',
    entitySlug: 'twin-prime-conjecture'
  },
  'twin-prime-lab': {
    title: 'Twin Prime Sieve',
    description: 'Interactive prime number line highlighting (p, p+2) pairs.',
    component: TwinPrimeLab,
    category: 'Number Theory',
    isThreeD: false,
    entityType: 'problem',
    entitySlug: 'twin-prime-conjecture'
  },
  'riemann-hypothesis': {
    title: 'Riemann Zeta Zero Spectrum',
    description: 'Complex plane visualizer with critical strip, critical line, and known zeros.',
    component: RiemannHypothesisLab,
    category: 'Analytic Number Theory',
    isThreeD: false,
    entityType: 'problem',
    entitySlug: 'riemann-hypothesis'
  },
  'p-vs-np': {
    title: 'P vs NP Complexity Landscape',
    description: 'Interactive Euler diagram of P, NP, and NP-Complete classes and Karp reductions.',
    component: PvsNPLab,
    category: 'Theoretical Computer Science',
    isThreeD: false,
    entityType: 'problem',
    entitySlug: 'p-vs-np'
  },
  'poincare-conjecture': {
    title: 'Poincaré Conjecture 3-Sphere Surgery',
    description: 'Ricci flow smoothing deformation on simply connected 3-manifolds.',
    component: PoincareConjectureScene,
    category: 'Topology',
    isThreeD: true,
    entityType: 'problem',
    entitySlug: 'poincare-conjecture'
  }
};

export function getVisualizationComponent(slug?: string): React.ComponentType<any> | null {
  if (!slug) return null;
  const entry = VISUALIZATION_REGISTRY[slug.toLowerCase()];
  return entry ? entry.component : null;
}

export function getVisualEntityRoute(slug: string): string {
  const entry = VISUALIZATION_REGISTRY[slug.toLowerCase()];
  if (!entry) return `/wonders/${slug}`;
  if (entry.entityType === 'problem') return `/problems/${entry.entitySlug}`;
  if (entry.entityType === 'lab') return `/lab?tool=${entry.entitySlug}`;
  return `/wonders/${entry.entitySlug}`;
}
