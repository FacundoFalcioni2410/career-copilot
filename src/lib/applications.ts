import { api } from "@/lib/api";

export type ApplicationStatus =
  | "interested"
  | "applied"
  | "hr_interview"
  | "technical_interview"
  | "challenge"
  | "final_interview"
  | "offer"
  | "rejected";

export type Application = {
  id: number;
  user_id: number;
  company: string;
  position: string;
  description: string;
  salary: string | null;
  location: string | null;
  source: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

export type ApplicationInput = {
  company: string;
  position: string;
  description: string;
  salary: string | null;
  location: string | null;
  source: string | null;
  status: ApplicationStatus;
};

export function listApplications() {
  return api.get<Application[]>("/applications");
}

export function getApplication(id: number) {
  return api.get<Application>(`/applications/${id}`);
}

export function createApplication(input: ApplicationInput) {
  return api.post<Application>("/applications", input);
}

export function updateApplication(
  id: number,
  input: Partial<ApplicationInput>
) {
  return api.patch<Application>(`/applications/${id}`, input);
}

export function deleteApplication(id: number) {
  return api.delete<void>(`/applications/${id}`);
}
