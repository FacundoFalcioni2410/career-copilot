import { api } from "@/lib/api";

export type Experience = {
  id: number;
  profile_id: number;
  title: string;
  company: string | null;
  description: string | null;
  responsibilities: string | null;
  achievements: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
};

export type ExperienceInput = {
  title: string;
  company: string | null;
  description: string | null;
  responsibilities: string | null;
  achievements: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
};

export function listExperiences() {
  return api.get<Experience[]>("/profile/experiences");
}

export function createExperience(input: ExperienceInput) {
  return api.post<Experience>("/profile/experiences", input);
}

export function updateExperience(id: number, input: ExperienceInput) {
  return api.put<Experience>(`/experiences/${id}`, input);
}

export function deleteExperience(id: number) {
  return api.delete<void>(`/experiences/${id}`);
}
