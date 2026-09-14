import { describe, it, expect } from 'vitest';
import {
  generateCollatzSequence,
  isPrime,
  goldbachPairs,
  twinPrimesInRange,
  mobiusPoint,
  mandelbrotIteration,
  juliaIteration,
  kochIteration
} from './mathUtils';

describe('Pure Math Utilities', () => {
  describe('Collatz Sequence', () => {
    it('generates expected trajectory for n = 6', () => {
      const result = generateCollatzSequence(6);
      expect(result.sequence).toEqual([6, 3, 10, 5, 16, 8, 4, 2, 1]);
      expect(result.maxExcursion).toBe(16);
      expect(result.totalStoppingTime).toBe(8);
    });

    it('terminates immediately for n = 1', () => {
      const result = generateCollatzSequence(1);
      expect(result.sequence).toEqual([1]);
      expect(result.totalStoppingTime).toBe(0);
    });
  });

  describe('Primality Testing', () => {
    it('correctly identifies primes', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(3)).toBe(true);
      expect(isPrime(5)).toBe(true);
      expect(isPrime(13)).toBe(true);
      expect(isPrime(97)).toBe(true);
    });

    it('correctly identifies non-primes', () => {
      expect(isPrime(0)).toBe(false);
      expect(isPrime(1)).toBe(false);
      expect(isPrime(4)).toBe(false);
      expect(isPrime(100)).toBe(false);
      expect(isPrime(91)).toBe(false); // 7 * 13
    });
  });

  describe('Goldbach Decompositions', () => {
    it('finds prime pairs for 10', () => {
      const pairs = goldbachPairs(10);
      expect(pairs).toEqual([
        [3, 7],
        [5, 5]
      ]);
    });

    it('finds multiple prime pairs for 100', () => {
      const pairs = goldbachPairs(100);
      expect(pairs.length).toBeGreaterThan(3);
      expect(pairs).toContainEqual([3, 97]);
      expect(pairs).toContainEqual([11, 89]);
      expect(pairs).toContainEqual([17, 83]);
    });

    it('returns empty list for odd numbers or <= 2', () => {
      expect(goldbachPairs(7)).toEqual([]);
      expect(goldbachPairs(2)).toEqual([]);
    });
  });

  describe('Twin Primes', () => {
    it('scans twin prime pairs up to 32', () => {
      const pairs = twinPrimesInRange(3, 32);
      expect(pairs).toEqual([
        [3, 5],
        [5, 7],
        [11, 13],
        [17, 19],
        [29, 31]
      ]);
    });
  });

  describe('Möbius Strip Parametric Coordinates', () => {
    it('computes consistent closed 3D boundary coordinates', () => {
      const [x0, y0, z0] = mobiusPoint(0, 0, 2);
      expect(x0).toBeCloseTo(2, 5);
      expect(y0).toBeCloseTo(0, 5);
      expect(z0).toBeCloseTo(0, 5);

      const [xEnd, yEnd, zEnd] = mobiusPoint(2 * Math.PI, 0, 2);
      expect(xEnd).toBeCloseTo(2, 5);
      expect(yEnd).toBeCloseTo(0, 5);
      expect(zEnd).toBeCloseTo(0, 5);
    });
  });

  describe('Fractal Iterations', () => {
    it('identifies bounded point in Mandelbrot set for c = 0', () => {
      const iter = mandelbrotIteration(0, 0, 50);
      expect(iter).toBe(50);
    });

    it('identifies escape point in Mandelbrot set for c = 2.5', () => {
      const iter = mandelbrotIteration(2.5, 0, 50);
      expect(iter).toBeLessThan(5);
    });

    it('identifies bounded Julia point for z = 0, c = 0', () => {
      const iter = juliaIteration(0, 0, 0, 0, 50);
      expect(iter).toBe(50);
    });
  });

  describe('Koch Curve Geometry', () => {
    it('generates 5 points per segment', () => {
      const points = kochIteration([0, 0], [3, 0]);
      expect(points).toHaveLength(5);
      expect(points[0]).toEqual([0, 0]);
      expect(points[1]).toEqual([1, 0]);
      expect(points[3]).toEqual([2, 0]);
      expect(points[4]).toEqual([3, 0]);
    });
  });
});
