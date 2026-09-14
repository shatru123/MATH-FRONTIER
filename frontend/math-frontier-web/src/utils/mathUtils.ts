/**
 * Pure mathematical functions for Math Frontier.
 * Independent of UI frameworks, fully unit-testable.
 */

// 1. Collatz Conjecture (3n + 1)
export interface CollatzResult {
  sequence: number[];
  maxExcursion: number;
  totalStoppingTime: number;
}

export function generateCollatzSequence(start: number, maxSteps = 5000): CollatzResult {
  if (start <= 0 || !Number.isInteger(start)) {
    throw new Error('Collatz input must be a positive integer.');
  }

  const sequence: number[] = [start];
  let current = start;
  let maxExcursion = start;

  while (current !== 1 && sequence.length < maxSteps) {
    if (current % 2 === 0) {
      current = current / 2;
    } else {
      current = 3 * current + 1;
    }
    sequence.push(current);
    if (current > maxExcursion) {
      maxExcursion = current;
    }
  }

  return {
    sequence,
    maxExcursion,
    totalStoppingTime: sequence.length - 1
  };
}

// 2. Primality test
export function isPrime(n: number): boolean {
  if (n <= 1 || !Number.isInteger(n)) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

// 3. Goldbach Conjecture decompositions (even n > 2 into p + q)
export function goldbachPairs(n: number): [number, number][] {
  if (n <= 2 || n % 2 !== 0) {
    return [];
  }

  const pairs: [number, number][] = [];
  const limit = Math.floor(n / 2);

  for (let p = 2; p <= limit; p++) {
    const q = n - p;
    if (isPrime(p) && isPrime(q)) {
      pairs.push([p, q]);
    }
  }

  return pairs;
}

// 4. Twin primes in range [min, max]
export function twinPrimesInRange(min: number, max: number): [number, number][] {
  const pairs: [number, number][] = [];
  const start = Math.max(3, min);

  for (let p = start; p <= max - 2; p += 2) {
    if (isPrime(p) && isPrime(p + 2)) {
      pairs.push([p, p + 2]);
    }
  }

  return pairs;
}

// 5. Parametric Möbius Strip coordinate calculation
// u in [0, 2pi], v in [-width, width]
export function mobiusPoint(
  u: number,
  v: number,
  radius = 2,
  twist = 1 // 1 for standard 180-deg half-twist
): [number, number, number] {
  const halfTwist = (twist * u) / 2;
  const x = (radius + v * Math.cos(halfTwist)) * Math.cos(u);
  const y = (radius + v * Math.cos(halfTwist)) * Math.sin(u);
  const z = v * Math.sin(halfTwist);
  return [x, y, z];
}

// 6. Parametric Klein Bottle Figure-8 Immersion
// u in [0, 2pi], v in [0, 2pi]
export function kleinBottlePoint(
  u: number,
  v: number,
  r = 2
): [number, number, number] {
  const cu2 = Math.cos(u / 2);
  const su2 = Math.sin(u / 2);
  const sv = Math.sin(v);
  const s2v = Math.sin(2 * v);

  const factor = r + cu2 * sv - su2 * s2v;
  const x = factor * Math.cos(u);
  const y = factor * Math.sin(u);
  const z = su2 * sv + cu2 * s2v;

  return [x, y, z];
}

// 7. Parametric Torus coordinate calculation
// u in [0, 2pi], v in [0, 2pi]
export function torusPoint(
  u: number,
  v: number,
  R = 2,
  r = 0.8
): [number, number, number] {
  const x = (R + r * Math.cos(v)) * Math.cos(u);
  const y = (R + r * Math.cos(v)) * Math.sin(u);
  const z = r * Math.sin(v);
  return [x, y, z];
}

// 8. Mandelbrot Set Iteration: z_{n+1} = z_n^2 + c with z_0 = 0
export function mandelbrotIteration(cr: number, ci: number, maxIter = 100): number {
  let zr = 0;
  let zi = 0;
  let iter = 0;

  while (zr * zr + zi * zi <= 4 && iter < maxIter) {
    const nextZr = zr * zr - zi * zi + cr;
    const nextZi = 2 * zr * zi + ci;
    zr = nextZr;
    zi = nextZi;
    iter++;
  }

  return iter;
}

// 9. Julia Set Iteration: z_{n+1} = z_n^2 + c with starting point z
export function juliaIteration(
  zr: number,
  zi: number,
  cr: number,
  ci: number,
  maxIter = 100
): number {
  let r = zr;
  let i = zi;
  let iter = 0;

  while (r * r + i * i <= 4 && iter < maxIter) {
    const nextR = r * r - i * i + cr;
    const nextI = 2 * r * i + ci;
    r = nextR;
    i = nextI;
    iter++;
  }

  return iter;
}

// 10. Koch Curve Segment Iteration
export function kochIteration(
  p1: [number, number],
  p2: [number, number]
): [number, number][] {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];

  // 1/3 point
  const a: [number, number] = [p1[0] + dx / 3, p1[1] + dy / 3];
  // 2/3 point
  const b: [number, number] = [p1[0] + (2 * dx) / 3, p1[1] + (2 * dy) / 3];

  // Equilateral triangle peak rotated by 60 deg (-pi/3)
  const angle = -Math.PI / 3;
  const vdx = b[0] - a[0];
  const vdy = b[1] - a[1];
  const peak: [number, number] = [
    a[0] + vdx * Math.cos(angle) - vdy * Math.sin(angle),
    a[1] + vdx * Math.sin(angle) + vdy * Math.cos(angle)
  ];

  return [p1, a, peak, b, p2];
}
