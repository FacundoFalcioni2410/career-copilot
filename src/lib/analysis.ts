import { api } from "@/lib/api";

export type RequirementEvidence = {
  id: number;
  source_type: string;
  source: string;
  detail: string;
};

export type RequirementAnalysis = {
  id: number;
  requirement: string;
  importance: string;
  status: string;
  explanation: string;
  evidence: RequirementEvidence[];
};

export type JobAnalysis = {
  id: number;
  job_application_id: number;
  match_score: number;
  recommendation: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  cv_suggestions_supported: string[];
  cv_suggestions_to_verify: string[];
  created_at: string;
  requirements: RequirementAnalysis[];
};

export function analyzeApplication(applicationId: number) {
  return api.post<JobAnalysis>(`/applications/${applicationId}/analyze`);
}

export function listAnalyses(applicationId: number) {
  return api.get<JobAnalysis[]>(`/applications/${applicationId}/analyses`);
}

export function getAnalysis(applicationId: number, analysisId: number) {
  return api.get<JobAnalysis>(
    `/applications/${applicationId}/analyses/${analysisId}`
  );
}
