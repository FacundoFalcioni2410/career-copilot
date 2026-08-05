"use client";

import { useEffect, useState } from "react";
import ExperienceForm from "@/components/profile/ExperienceForm";
import { ApiError } from "@/lib/api";
import {
  createExperience,
  deleteExperience,
  listExperiences,
  updateExperience,
  type Experience,
  type ExperienceInput,
} from "@/lib/experiences";

type Mode = { type: "list" } | { type: "adding" } | { type: "editing"; id: number };

const emptyValues: ExperienceInput = {
  title: "",
  company: null,
  description: null,
  responsibilities: null,
  achievements: null,
  start_date: null,
  end_date: null,
  is_current: false,
};

function toInput(exp: Experience): ExperienceInput {
  return {
    title: exp.title,
    company: exp.company,
    description: exp.description,
    responsibilities: exp.responsibilities,
    achievements: exp.achievements,
    start_date: exp.start_date,
    end_date: exp.end_date,
    is_current: exp.is_current,
  };
}

function formatRange(exp: Experience): string {
  const start = exp.start_date ?? "?";
  const end = exp.is_current ? "Present" : (exp.end_date ?? "?");
  return `${start} – ${end}`;
}

export default function ExperienceSection() {
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [loadError, setLoadError] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [mode, setMode] = useState<Mode>({ type: "list" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listExperiences()
      .then((data) => {
        if (cancelled) return;
        setExperiences(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load experience."
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = [...experiences].sort((a, b) =>
    (b.start_date ?? "").localeCompare(a.start_date ?? "")
  );

  async function handleAdd(values: ExperienceInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const created = await createExperience(values);
      setExperiences((prev) => [...prev, created]);
      setMode({ type: "list" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save experience."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEdit(id: number, values: ExperienceInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const updated = await updateExperience(id, values);
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === id ? updated : exp))
      );
      setMode({ type: "list" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save experience."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this experience?")) return;
    setActionError(null);
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to delete experience."
      );
    }
  }

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-base font-medium text-gray-900">Experience</h2>
        {mode.type === "list" && (
          <button
            type="button"
            onClick={() => setMode({ type: "adding" })}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Add experience
          </button>
        )}
      </div>

      {status === "loading" && (
        <p className="text-sm text-gray-600">Loading experience...</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{loadError}</p>}

      {status === "ready" && (
        <div className="flex flex-col gap-4">
          {actionError && (
            <p className="text-sm text-red-600">{actionError}</p>
          )}

          {mode.type === "adding" && (
            <div>
              <ExperienceForm
                initialValues={emptyValues}
                onSubmit={handleAdd}
                onCancel={() => setMode({ type: "list" })}
                isSubmitting={isSubmitting}
                submitLabel="Add experience"
              />
              {formError && (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              )}
            </div>
          )}

          {sorted.length === 0 && mode.type === "list" && (
            <p className="text-sm text-gray-600">
              No experience added yet.
            </p>
          )}

          <div className="divide-y divide-gray-200">
            {sorted.map((exp) =>
              mode.type === "editing" && mode.id === exp.id ? (
                <div key={exp.id} className="py-4">
                  <ExperienceForm
                    initialValues={toInput(exp)}
                    onSubmit={(values) => handleEdit(exp.id, values)}
                    onCancel={() => setMode({ type: "list" })}
                    isSubmitting={isSubmitting}
                    submitLabel="Save changes"
                  />
                  {formError && (
                    <p className="mt-2 text-sm text-red-600">{formError}</p>
                  )}
                </div>
              ) : (
                <div key={exp.id} className="py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {exp.title}
                        {exp.company && ` · ${exp.company}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatRange(exp)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-3">
                      <button
                        type="button"
                        onClick={() => setMode({ type: "editing", id: exp.id })}
                        className="text-sm text-gray-700 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(exp.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                      {exp.description}
                    </p>
                  )}
                  {exp.responsibilities && (
                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Responsibilities: </span>
                      <span className="whitespace-pre-line">
                        {exp.responsibilities}
                      </span>
                    </p>
                  )}
                  {exp.achievements && (
                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Achievements: </span>
                      <span className="whitespace-pre-line">
                        {exp.achievements}
                      </span>
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
