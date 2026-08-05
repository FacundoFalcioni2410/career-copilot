import { api } from "@/lib/api";

export type Skill = {
  id: number;
  profile_id: number;
  name: string;
  category: string | null;
  created_at: string;
};

export type SkillInput = {
  name: string;
  category: string | null;
};

export function listSkills() {
  return api.get<Skill[]>("/profile/skills");
}

export function createSkills(skills: SkillInput[]) {
  return api.post<Skill[]>("/profile/skills", { skills });
}

export function deleteSkill(id: number) {
  return api.delete<void>(`/skills/${id}`);
}
