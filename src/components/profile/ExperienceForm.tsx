"use client";

import { useState, type FormEvent } from "react";
import type { ExperienceInput } from "@/lib/experiences";

const inputClassName =
  "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900";
const disabledInputClassName = `${inputClassName} disabled:bg-gray-100 disabled:text-gray-400`;

export default function ExperienceForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  initialValues: ExperienceInput;
  onSubmit: (values: ExperienceInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const [values, setValues] = useState<ExperienceInput>(initialValues);

  function handleChange(
    name: keyof Omit<ExperienceInput, "is_current">,
    value: string
  ) {
    setValues((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  }

  function handleCurrentChange(checked: boolean) {
    setValues((prev) => ({
      ...prev,
      is_current: checked,
      end_date: checked ? null : prev.end_date,
    }));
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
          <label htmlFor="title" className="block text-sm text-gray-700">
            Title
          </label>
          <input
            id="title"
            required
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm text-gray-700">
            Company
          </label>
          <input
            id="company"
            value={values.company ?? ""}
            onChange={(e) => handleChange("company", e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm text-gray-700">
            Start date
          </label>
          <input
            id="start_date"
            type="date"
            value={values.start_date ?? ""}
            onChange={(e) => handleChange("start_date", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="end_date" className="block text-sm text-gray-700">
            End date
          </label>
          <input
            id="end_date"
            type="date"
            value={values.end_date ?? ""}
            disabled={values.is_current}
            onChange={(e) => handleChange("end_date", e.target.value)}
            className={disabledInputClassName}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.is_current}
          onChange={(e) => handleCurrentChange(e.target.checked)}
        />
        I currently work here
      </label>

      <div>
        <label htmlFor="description" className="block text-sm text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={values.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="responsibilities"
          className="block text-sm text-gray-700"
        >
          Responsibilities
        </label>
        <textarea
          id="responsibilities"
          rows={3}
          value={values.responsibilities ?? ""}
          onChange={(e) => handleChange("responsibilities", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="achievements" className="block text-sm text-gray-700">
          Achievements
        </label>
        <textarea
          id="achievements"
          rows={3}
          value={values.achievements ?? ""}
          onChange={(e) => handleChange("achievements", e.target.value)}
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
