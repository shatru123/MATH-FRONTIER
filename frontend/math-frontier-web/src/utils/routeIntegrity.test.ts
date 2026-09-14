import { describe, it, expect } from 'vitest';
import { VISUALIZATION_REGISTRY, getVisualizationComponent, getVisualEntityRoute } from '../components/visualizations/registry';
import { FALLBACK_PROBLEMS, FALLBACK_WONDERS, FALLBACK_VISUALIZATIONS } from '../services/fallbackData';

describe('Route & Visualization Integrity', () => {
  it('should have all 18 fallback wonders with complete metadata and working visualizers', () => {
    expect(FALLBACK_WONDERS.length).toBeGreaterThanOrEqual(18);

    for (const wonder of FALLBACK_WONDERS) {
      expect(wonder.slug).toBeTruthy();
      expect(wonder.title).toBeTruthy();
      expect(wonder.shortDescription).toBeTruthy();
      expect(wonder.fullDescription).toBeTruthy();
      expect(wonder.intuition).toBeTruthy();
      expect(wonder.mathematics).toBeTruthy();
      expect(wonder.properties.length).toBeGreaterThan(0);
      expect(wonder.constructionSteps.length).toBeGreaterThan(0);
      expect(['PHENOMENON', 'PARADOX', 'THEOREM']).toContain(wonder.status);

      if (wonder.visualizationSlug) {
        const comp = getVisualizationComponent(wonder.visualizationSlug);
        expect(comp).toBeDefined();
        expect(comp).not.toBeNull();

        const route = getVisualEntityRoute(wonder.visualizationSlug);
        expect(route).toBe(`/wonders/${wonder.slug}`);
      }
    }
  });

  it('should have all 13 fallback problems with epistemological integrity', () => {
    expect(FALLBACK_PROBLEMS.length).toBeGreaterThanOrEqual(13);

    for (const problem of FALLBACK_PROBLEMS) {
      expect(problem.slug).toBeTruthy();
      expect(problem.title).toBeTruthy();
      expect(problem.shortDescription).toBeTruthy();
      expect(problem.fullDescription).toBeTruthy();
      expect(problem.mathematicalStatement).toBeTruthy();
      expect(problem.intuition).toBeTruthy();
      expect(problem.whyItMatters).toBeTruthy();
      expect(problem.lastVerified).toBeTruthy();
      expect(problem.statusSource).toBeTruthy();
      expect(problem.sourceType).toBeTruthy();
      expect(problem.statusNotes).toBeTruthy();
      expect(['OPEN', 'SOLVED', 'UNDECIDABLE', 'INDEPENDENT', 'PARTIALLY_SOLVED']).toContain(problem.status);

      if (problem.visualizationSlug && VISUALIZATION_REGISTRY[problem.visualizationSlug]) {
        const comp = getVisualizationComponent(problem.visualizationSlug);
        expect(comp).toBeDefined();
        expect(comp).not.toBeNull();

        const route = getVisualEntityRoute(problem.visualizationSlug);
        expect(route).toBe(`/problems/${problem.slug}`);
      }
    }
  });

  it('should register Zenos Paradoxes with interactive laboratory', () => {
    const zenoWonder = FALLBACK_WONDERS.find(w => w.slug === 'zenos-paradoxes');
    expect(zenoWonder).toBeDefined();
    expect(zenoWonder?.status).toBe('PARADOX');
    expect(zenoWonder?.visualizationSlug).toBe('zenos-paradoxes');

    const reg = VISUALIZATION_REGISTRY['zenos-paradoxes'];
    expect(reg).toBeDefined();
    expect(reg.title).toContain('Zeno');
    expect(reg.entityType).toBe('wonder');
    expect(getVisualEntityRoute('zenos-paradoxes')).toBe('/wonders/zenos-paradoxes');
  });

  it('should register Klein Bottle and Mobius Strip with 3D capability', () => {
    const klein = VISUALIZATION_REGISTRY['klein-bottle'];
    expect(klein).toBeDefined();
    expect(klein.isThreeD).toBe(true);
    expect(klein.entityType).toBe('wonder');
    expect(getVisualEntityRoute('klein-bottle')).toBe('/wonders/klein-bottle');

    const mobius = VISUALIZATION_REGISTRY['mobius-strip'];
    expect(mobius).toBeDefined();
    expect(mobius.isThreeD).toBe(true);
    expect(mobius.entityType).toBe('wonder');
    expect(getVisualEntityRoute('mobius-strip')).toBe('/wonders/mobius-strip');
  });

  it('should route problems in 3D Gallery correctly without dead links', () => {
    // Problems registered in 3D gallery
    expect(getVisualEntityRoute('poincare-conjecture')).toBe('/problems/poincare-conjecture');
    expect(getVisualEntityRoute('p-vs-np')).toBe('/problems/p-vs-np');
    expect(getVisualEntityRoute('collatz-conjecture')).toBe('/problems/collatz-conjecture');
    expect(getVisualEntityRoute('riemann-hypothesis')).toBe('/problems/riemann-hypothesis');

    // Wonders registered in 3D gallery
    expect(getVisualEntityRoute('torus')).toBe('/wonders/torus');
    expect(getVisualEntityRoute('projective-plane')).toBe('/wonders/projective-plane');
    expect(getVisualEntityRoute('gabriels-horn')).toBe('/wonders/gabriels-horn');
  });

  it('should have all 24 fallback visualizations defined', () => {
    expect(FALLBACK_VISUALIZATIONS.length).toBeGreaterThanOrEqual(24);
    for (const vis of FALLBACK_VISUALIZATIONS) {
      expect(vis.slug).toBeTruthy();
      expect(vis.title).toBeTruthy();
      expect(vis.description).toBeTruthy();
      expect(vis.supportedModes.length).toBeGreaterThan(0);
    }
  });
});
