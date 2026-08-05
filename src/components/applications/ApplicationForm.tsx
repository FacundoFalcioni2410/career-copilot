"use client";

import { useState, type FormEvent } from "react";
import type { ApplicationInput, ApplicationStatus } from "@/lib/applications";
import { statusLabels, statusOrder } from "@/lib/application-status";

const inputClassName =
  "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900";

export default function ApplicationForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  initialValues: ApplicationInput;
  onSubmit: (values: ApplicationInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const [values, setValues] = useState<ApplicationInput>(initialValues);

  function handleChange(
    name: keyof Omit<ApplicationInput, "status">,
    value: string
  ) {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleNullableChange(
    name: "salary" | "location" | "source",
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
          <label htmlFor="company" className="block text-sm text-gray-700">
            Company
          </label>
          <input
            id="company"
            required
            value={values.company}
            onChange={(e) => handleChange("company", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="position" className="block text-sm text-gray-700">
            Position
          </label>
          <input
            id="position"
            required
            value={values.position}
            onChange={(e) => handleChange("position", e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="salary" className="block text-sm text-gray-700">
            Salary
          </label>
          <input
            id="salary"
            value={values.salary ?? ""}
            onChange={(e) => handleNullableChange("salary", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm text-gray-700">
            Location
          </label>
          <input
            id="location"
            value={values.location ?? ""}
            onChange={(e) => handleNullableChange("location", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="source" className="block text-sm text-gray-700">
            Source
          </label>
          <input
            id="source"
            value={values.source ?? ""}
            onChange={(e) => handleNullableChange("source", e.target.value)}
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
              status: e.target.value as ApplicationStatus,
            }))
          }
          className={inputClassName}
        >
          {statusOrder.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
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
