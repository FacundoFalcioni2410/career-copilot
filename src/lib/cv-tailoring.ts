import { api } from "@/lib/api";

export type CVRewriteSuggestion = {
  source_type: "experience" | "project";
  source_id: number;
  source_name: string;
  original_text: string;
  suggested_text: string;
  reason: string;
  targets_requirements: string[];
};

export type CVTailoringResult = {
  summary: string;
  skills_to_emphasize: string[];
  experience_suggestions: CVRewriteSuggestion[];
  project_suggestions: CVRewriteSuggestion[];
  questions_to_verify: string[];
};

export function tailorApplicationCv(
  applicationId: number,
  analysisId: number
) {
  return api.post<CVTailoringResult>(
    `/applications/${applicationId}/cv-tailoring?analysis_id=${analysisId}`
  );
}
