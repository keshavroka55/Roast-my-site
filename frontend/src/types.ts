export type Severity = 'toasted' | 'charred' | 'cremated';
export type Confidence = 'measured' | 'inferred';
export type Category = 'Visual design' | 'Usability' | 'Content clarity' | 'Navigation' | 'Mobile experience';

export interface Finding {
  id: string;
  category: Category;
  severity: Severity;
  confidence: Confidence;
  evidence: string;
  observation: string;
  roast: string;
  fix: string;
}

export interface RoastReport {
  url: string;
  finalUrl: string;
  hostname: string;
  fetchedAt: string;
  status: number;
  score: number;
  verdict: string;
  summary: string;
  findings: Finding[];
  stats: {
    htmlBytes: number;
    fetchMs: number;
    wordCount: number;
    imageCount: number;
    linkCount: number;
    scriptCount: number;
    stylesheetCount: number;
  };
  notMeasured: string[];
}

export interface WaitlistResponse {
  ok: boolean;
  alreadyRegistered: boolean;
  message: string;
}