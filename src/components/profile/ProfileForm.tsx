"use client";

import { useState, type FormEvent } from "react";
import type { ProfileInput } from "@/lib/profile";

type Field = {
  name: keyof ProfileInput;
  label: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
};

const fields: Field[] = [
  { name: "full_name", label: "Full name", required: true },
  { name: "headline", label: "Headline" },
  { name: "summary", label: "Summary", multiline: true },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone" },
  { name: "location", label: "Location" },
  { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
  { name: "github_url", label: "GitHub URL", type: "url" },
  { name: "website_url", label: "Website URL", type: "url" },
];

const inputClassName =
  "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900";

export default function ProfileForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  initialValues: ProfileInput;
  onSubmit: (values: ProfileInput) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const [values, setValues] = useState<ProfileInput>(initialValues);

  function handleChange(name: keyof ProfileInput, value: string) {
    setValues((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm text-gray-700">
            {field.label}
          </label>
          {field.multiline ? (
            <textarea
              id={field.name}
              rows={4}
              value={values[field.name] ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={inputClassName}
            />
          ) : (
            <input
              id={field.name}
              type={field.type ?? "text"}
              required={field.required}
              value={values[field.name] ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={inputClassName}
            />
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
