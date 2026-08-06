"use client";

import { useState, type FormEvent } from "react";
import type { ProjectInput } from "@/lib/projects";
import type { Experience } from "@/lib/experiences";
import type { Skill } from "@/lib/skills";

const inputClassName =
  "mt-1 w-full rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900";

export default function ProjectForm({
  initialValues,
  experiences,
  skills,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  initialValues: ProjectInput;
  experiences: Experience[];
  skills: Skill[];
  onSubmit: (values: ProjectInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const [values, setValues] = useState<ProjectInput>(initialValues);

  function handleChange(
    name: keyof Omit<ProjectInput, "experience_id" | "skill_ids">,
    value: string
  ) {
    setValues((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  }

  function toggleSkill(id: number, checked: boolean) {
    setValues((prev) => ({
      ...prev,
      skill_ids: checked
        ? [...prev.skill_ids, id]
        : prev.skill_ids.filter((skillId) => skillId !== id),
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
          <label htmlFor="project-name" className="block text-sm text-gray-700">
            Name
          </label>
          <input
            id="project-name"
            required
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="project-url" className="block text-sm text-gray-700">
            URL
          </label>
          <input
            id="project-url"
            type="url"
            value={values.url ?? ""}
            onChange={(e) => handleChange("url", e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="project-start_date" className="block text-sm text-gray-700">
            Start date
          </label>
          <input
            id="project-start_date"
            type="date"
            value={values.start_date ?? ""}
            onChange={(e) => handleChange("start_date", e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="project-end_date" className="block text-sm text-gray-700">
            End date
          </label>
          <input
            id="project-end_date"
            type="date"
            value={values.end_date ?? ""}
            onChange={(e) => handleChange("end_date", e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="project-experience" className="block text-sm text-gray-700">
          Related experience
        </label>
        <select
          id="project-experience"
          value={values.experience_id ?? ""}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              experience_id: e.target.value === "" ? null : Number(e.target.value),
            }))
          }
          className={inputClassName}
        >
          <option value="">None</option>
          {experiences.map((exp) => (
            <option key={exp.id} value={exp.id}>
              {exp.title}
              {exp.company && ` · ${exp.company}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-700">Description</label>
        <textarea
          rows={3}
          value={values.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Responsibilities</label>
        <textarea
          rows={3}
          value={values.responsibilities ?? ""}
          onChange={(e) => handleChange("responsibilities", e.target.value)}
          className={inputClassName}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Achievements</label>
        <textarea
          rows={3}
          value={values.achievements ?? ""}
          onChange={(e) => handleChange("achievements", e.target.value)}
          className={inputClassName}
        />
      </div>

      {skills.length > 0 && (
        <div>
          <span className="block text-sm text-gray-700">Skills used</span>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            {skills.map((skill) => (
              <label
                key={skill.id}
                className="flex items-center gap-1.5 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={values.skill_ids.includes(skill.id)}
                  onChange={(e) => toggleSkill(skill.id, e.target.checked)}
                />
                {skill.name}
              </label>
            ))}
          </div>
        </div>
      )}

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
