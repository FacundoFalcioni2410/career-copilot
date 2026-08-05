import { api } from "@/lib/api";

export type Profile = {
  id: number;
  full_name: string;
  headline: string | null;
  summary: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileInput = {
  full_name: string;
  headline: string | null;
  summary: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
};

export function getProfile() {
  return api.get<Profile>("/profile");
}

export function createProfile(input: ProfileInput) {
  return api.post<Profile>("/profile", input);
}

export function updateProfile(input: ProfileInput) {
  return api.put<Profile>("/profile", input);
}
