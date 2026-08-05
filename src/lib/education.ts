import { api } from "@/lib/api";

export type EducationStatus =
  | "in_progress"
  | "completed"
  | "paused"
  | "incomplete";

export type Education = {
  id: number;
  profile_id: number;
  institution: string;
  title: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  status: EducationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type EducationInput = {
  institution: string;
  title: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  status: EducationStatus;
  notes: string | null;
};

export function listEducation() {
  return api.get<Education[]>("/profile/education");
}

export function createEducation(input: EducationInput) {
  return api.post<Education>("/profile/education", input);
}

export function updateEducation(id: number, input: EducationInput) {
  return api.put<Education>(`/education/${id}`, input);
}

export function deleteEducation(id: number) {
  return api.delete<void>(`/education/${id}`);
}
