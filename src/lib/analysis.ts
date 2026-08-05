import { api } from "@/lib/api";

export type Recommendation = "strong_apply" | "apply" | "maybe" | "skip";

export type Evidence = {
  requirement: string;
  evidence: string;
};

export type PartialMatch = {
  requirement: string;
  evidence: string;
  gap: string;
};

export type JobAnalysis = {
  match_score: number;
  recommendation: Recommendation;
  summary: string;
  strong_matches: Evidence[];
  partial_matches: PartialMatch[];
  missing_requirements: string[];
  cv_suggestions: string[];
};

export function analyzeApplication(id: number) {
  return api.post<JobAnalysis>(`/applications/${id}/analyze`);
}
