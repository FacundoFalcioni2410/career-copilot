import { api } from "@/lib/api";
import type { Skill } from "@/lib/skills";

export type Project = {
  id: number;
  profile_id: number;
  name: string;
  description: string | null;
  responsibilities: string | null;
  achievements: string | null;
  start_date: string | null;
  end_date: string | null;
  url: string | null;
  experience_id: number | null;
  skills: Skill[];
  created_at: string;
  updated_at: string;
};

export type ProjectInput = {
  name: string;
  description: string | null;
  responsibilities: string | null;
  achievements: string | null;
  start_date: string | null;
  end_date: string | null;
  url: string | null;
  experience_id: number | null;
  skill_ids: number[];
};

export function listProjects() {
  return api.get<Project[]>("/profile/projects");
}

export function createProject(input: ProjectInput) {
  return api.post<Project>("/profile/projects", input);
}

export function updateProject(id: number, input: ProjectInput) {
  return api.put<Project>(`/projects/${id}`, input);
}

export function deleteProject(id: number) {
  return api.delete<void>(`/projects/${id}`);
}
