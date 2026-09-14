import {
  Category,
  Problem,
  MathematicalWonder,
  Visualization,
  TimelineEvent,
  SearchResult,
  ProblemFilterParams
} from '../types/math';
import {
  FALLBACK_CATEGORIES,
  FALLBACK_PROBLEMS,
  FALLBACK_WONDERS,
  FALLBACK_TIMELINE,
  FALLBACK_VISUALIZATIONS
} from './fallbackData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

class MathFrontierApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async fetchJson<T>(endpoint: string, fallback: T): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        console.warn(`API request failed [${response.status}] for ${endpoint}, using fallback.`);
        return fallback;
      }
      return await response.json();
    } catch (err) {
      console.warn(`API unreachable at ${this.baseUrl}${endpoint} (${err}), using fallback data.`);
      return fallback;
    }
  }

  async getCategories(): Promise<Category[]> {
    return this.fetchJson<Category[]>('/api/categories', FALLBACK_CATEGORIES);
  }

  async getProblems(filters?: ProblemFilterParams): Promise<Problem[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.field) params.append('field', filters.field);
    if (filters?.hasVisualization !== undefined) params.append('hasVisualization', String(filters.hasVisualization));
    if (filters?.hasExperiment !== undefined) params.append('hasExperiment', String(filters.hasExperiment));

    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    // Apply in-memory filtering to fallback if API fails
    let fallback = [...FALLBACK_PROBLEMS];
    if (filters?.status) fallback = fallback.filter(p => p.status === filters.status);
    if (filters?.category) fallback = fallback.filter(p => p.category?.slug === filters.category || p.categoryId === Number(filters.category));
    if (filters?.difficulty) fallback = fallback.filter(p => p.difficulty === filters.difficulty);
    if (filters?.field) fallback = fallback.filter(p => p.field.toLowerCase().includes(filters.field!.toLowerCase()));
    if (filters?.hasVisualization !== undefined) fallback = fallback.filter(p => filters.hasVisualization ? !!p.visualizationSlug : !p.visualizationSlug);
    if (filters?.hasExperiment !== undefined) fallback = fallback.filter(p => p.hasExperiment === filters.hasExperiment);

    return this.fetchJson<Problem[]>(`/api/problems${queryString}`, fallback);
  }

  async getProblemBySlug(slug: string): Promise<Problem | null> {
    const fallback = FALLBACK_PROBLEMS.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
    return this.fetchJson<Problem | null>(`/api/problems/${slug}`, fallback);
  }

  async getRelatedProblems(slug: string): Promise<Problem[]> {
    const problem = FALLBACK_PROBLEMS.find(p => p.slug.toLowerCase() === slug.toLowerCase());
    const fallback = problem
      ? FALLBACK_PROBLEMS.filter(p => problem.relatedProblems.includes(p.slug))
      : [];
    return this.fetchJson<Problem[]>(`/api/problems/${slug}/related`, fallback);
  }

  async getWonders(): Promise<MathematicalWonder[]> {
    return this.fetchJson<MathematicalWonder[]>('/api/wonders', FALLBACK_WONDERS);
  }

  async getWonderBySlug(slug: string): Promise<MathematicalWonder | null> {
    const fallback = FALLBACK_WONDERS.find(w => w.slug.toLowerCase() === slug.toLowerCase()) || null;
    return this.fetchJson<MathematicalWonder | null>(`/api/wonders/${slug}`, fallback);
  }

  async getVisualizations(): Promise<Visualization[]> {
    return this.fetchJson<Visualization[]>('/api/visualizations', FALLBACK_VISUALIZATIONS);
  }

  async getVisualizationBySlug(slug: string): Promise<Visualization | null> {
    const fallback = FALLBACK_VISUALIZATIONS.find(v => v.slug.toLowerCase() === slug.toLowerCase()) || null;
    return this.fetchJson<Visualization | null>(`/api/visualizations/${slug}`, fallback);
  }

  async getTimeline(): Promise<TimelineEvent[]> {
    return this.fetchJson<TimelineEvent[]>('/api/timeline', FALLBACK_TIMELINE);
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    
    // In-memory fallback search
    const q = query.toLowerCase();
    const fallback: SearchResult[] = [];
    
    FALLBACK_PROBLEMS.forEach(p => {
      if (p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))) {
        fallback.push({
          type: 'Problem',
          title: p.title,
          slug: p.slug,
          description: p.shortDescription,
          category: p.field,
          status: p.status,
          tags: p.tags
        });
      }
    });

    FALLBACK_WONDERS.forEach(w => {
      if (w.title.toLowerCase().includes(q) || w.shortDescription.toLowerCase().includes(q) || w.tags.some(t => t.toLowerCase().includes(q))) {
        fallback.push({
          type: 'Wonder',
          title: w.title,
          slug: w.slug,
          description: w.shortDescription,
          category: 'Topology & Phenomena',
          status: w.status,
          tags: w.tags
        });
      }
    });

    return this.fetchJson<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`, fallback);
  }

  async checkHealth(): Promise<{ status: string; databaseConnected: boolean }> {
    return this.fetchJson('/health', { status: 'Client Fallback Mode', databaseConnected: false });
  }
}

export const api = new MathFrontierApiClient(API_BASE_URL);
export default api;
