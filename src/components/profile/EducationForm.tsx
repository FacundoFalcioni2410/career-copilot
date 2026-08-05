"use client";

import { useState, type FormEvent } from "react";
import type { EducationInput, EducationStatus } from "@/lib/education";

const inputClassName =
  "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900";

const statusOptions: Array<{ value: EducationStatus; label: string }> = [
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "paused", label: "Paused" },
  { value: "incomplete", label: "Incomplete" },
];

export default function EducationForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  initialValues: EducationInput;
  onSubmit: (values: EducationInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const [values, setValues] = useState<EducationInput>(initialValues);

  function handleChange(
    name: keyof Omit<EducationInput, "status">,
    value: string
  ) {
    setValues((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded border border-gray-200 p-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="institution" className="block text-sm text-gray-700">
            Institution
          </label>
          <input
            id="institution"
            required
            value={values.institution}
            onChange={(e) => handleChange("institution", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="edu-title" className="block text-sm text-gray-700">
            Title
          </label>
          <input
            id="edu-title"
            required
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="field_of_study" className="block text-sm text-gray-700">
          Field of study
        </label>
        <input
          id="field_of_study"
          value={values.field_of_study ?? ""}
          onChange={(e) => handleChange("field_of_study", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="edu-start_date" className="block text-sm text-gray-700">
            Start date
          </label>
          <input
            id="edu-start_date"
            type="date"
            value={values.start_date ?? ""}
            onChange={(e) => handleChange("start_date", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="edu-end_date" className="block text-sm text-gray-700">
            End date
          </label>
          <input
            id="edu-end_date"
            type="date"
            value={values.end_date ?? ""}
            onChange={(e) => handleChange("end_date", e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={values.status}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              status: e.target.value as EducationStatus,
            }))
          }
          className={inputClassName}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={values.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
