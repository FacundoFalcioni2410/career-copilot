"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ExperienceSection from "@/components/profile/ExperienceSection";
import { ApiError } from "@/lib/api";
import {
  createProfile,
  getProfile,
  updateProfile,
  type Profile,
  type ProfileInput,
} from "@/lib/profile";

type Status = "loading" | "error" | "empty" | "view" | "editing";

const emptyValues: ProfileInput = {
  full_name: "",
  headline: null,
  summary: null,
  email: null,
  phone: null,
  location: null,
  linkedin_url: null,
  github_url: null,
  website_url: null,
};

const displayFields: Array<{ key: keyof ProfileInput; label: string }> = [
  { key: "headline", label: "Headline" },
  { key: "summary", label: "Summary" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location", label: "Location" },
  { key: "linkedin_url", label: "LinkedIn" },
  { key: "github_url", label: "GitHub" },
  { key: "website_url", label: "Website" },
];

function toInput(profile: Profile): ProfileInput {
  return {
    full_name: profile.full_name,
    headline: profile.headline,
    summary: profile.summary,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    linkedin_url: profile.linkedin_url,
    github_url: profile.github_url,
    website_url: profile.website_url,
  };
}

export default function ProfilePage() {
  const [status, setStatus] = useState<Status>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getProfile()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setStatus("view");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setStatus("empty");
        } else {
          setLoadError(
            err instanceof ApiError ? err.message : "Failed to load profile."
          );
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(values: ProfileInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const created = await createProfile(values);
      setProfile(created);
      setStatus("view");
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(values: ProfileInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const updated = await updateProfile(values);
      setProfile(updated);
      setStatus("view");
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save profile."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Professional Profile"
        description="Manage your profile, experience, skills, and education."
      />

      {status === "loading" && (
        <p className="text-sm text-gray-600">Loading profile...</p>
      )}

      {status === "error" && <p className="text-sm text-red-600">{loadError}</p>}

      {status === "empty" && (
        <div>
          <p className="mb-4 text-sm text-gray-600">
            You haven&apos;t created a profile yet.
          </p>
          <ProfileForm
            initialValues={emptyValues}
            onSubmit={handleCreate}
            isSubmitting={isSubmitting}
            submitLabel="Create profile"
          />
          {formError && (
            <p className="mt-2 text-sm text-red-600">{formError}</p>
          )}
        </div>
      )}

      {status === "view" && profile && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-medium text-gray-900">
              {profile.full_name}
            </h2>
            <button
              type="button"
              onClick={() => setStatus("editing")}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Edit
            </button>
          </div>

          <dl className="divide-y divide-gray-200 border-t border-gray-200">
            {displayFields.map((field) => (
              <div key={field.key} className="grid grid-cols-3 gap-4 py-3 text-sm">
                <dt className="text-gray-600">{field.label}</dt>
                <dd className="col-span-2 text-gray-900">
                  {profile[field.key] || (
                    <span className="text-gray-400">Not set</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {status === "editing" && profile && (
        <div>
          <ProfileForm
            initialValues={toInput(profile)}
            onSubmit={handleUpdate}
            onCancel={() => setStatus("view")}
            isSubmitting={isSubmitting}
            submitLabel="Save changes"
          />
          {formError && (
            <p className="mt-2 text-sm text-red-600">{formError}</p>
          )}
        </div>
      )}

      {profile && <ExperienceSection />}
    </div>
  );
}
