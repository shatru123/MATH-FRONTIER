export type ProblemStatus =
  | 'OPEN'
  | 'PARTIALLY_SOLVED'
  | 'SOLVED'
  | 'DISPROVED'
  | 'UNDECIDABLE'
  | 'INDEPENDENT'
  | 'DISPUTED'
  | 'CLAIMED_SOLUTION'
  | 'PHENOMENON'
  | 'THEOREM'
  | 'PARADOX';

export type DifficultyLevel = 'Introductory' | 'Intermediate' | 'Advanced' | 'Extreme';

export type VisualizationType = 'ThreeD' | 'Canvas2D' | 'InteractiveSvg' | 'InteractiveSim';

export type VisualizationMode = 'Explore' | 'Guided' | 'Mathematical';

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  displayOrder: number;
}

export interface Problem {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  field: string;
  categoryId: number;
  category?: Category;
  status: ProblemStatus;
  difficulty: DifficultyLevel;
  yearIntroduced?: number;
  lastVerified: string;
  statusSource: string;
  sourceType: string;
  statusNotes: string;
  mathematicalStatement: string;
  intuition: string;
  whyItMatters: string;
  whatWeKnow: string[];
  whatWeDontKnow: string[];
  partialResults: string[];
  commonMisconceptions: string[];
  history: string;
  visualizationSlug?: string;
  hasExperiment: boolean;
  experimentSlug?: string;
  relatedProblems: string[];
  sourceIds: number[];
  tags: string[];
  claimedSolutions: string[];
  historicalStatuses: string[];
}

export interface MathematicalWonder {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: number;
  category?: Category;
  status: ProblemStatus;
  intuition: string;
  mathematics: string;
  properties: string[];
  constructionSteps: string[];
  parametricEquations: string;
  visualizationSlug?: string;
  hasExperiment: boolean;
  experimentSlug?: string;
  tags: string[];
  sources: string[];
}

export interface Visualization {
  id: number;
  slug: string;
  title: string;
  description: string;
  type: VisualizationType;
  supportedModes: VisualizationMode[];
  defaultParametersJson?: string;
  cameraSettingsJson?: string;
}

export interface TimelineEvent {
  id: number;
  year: number;
  dateDisplay: string;
  title: string;
  description: string;
  significance: string;
  category: string;
  relatedProblemSlug?: string;
  relatedWonderSlug?: string;
}

export interface Source {
  id: number;
  title: string;
  authors: string;
  year?: number;
  publication: string;
  url: string;
  sourceType: string;
  isPeerReviewed: boolean;
  citationKey: string;
}

export interface SearchResult {
  type: 'Problem' | 'Wonder' | 'Mathematician' | 'Timeline';
  title: string;
  slug: string;
  description: string;
  category?: string;
  status?: string;
  tags: string[];
}

export interface ProblemFilterParams {
  status?: ProblemStatus;
  category?: string;
  difficulty?: DifficultyLevel;
  field?: string;
  hasVisualization?: boolean;
  hasExperiment?: boolean;
}
