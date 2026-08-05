"use client";

import { useEffect, useState } from "react";
import EducationForm from "@/components/profile/EducationForm";
import { ApiError } from "@/lib/api";
import {
  createEducation,
  deleteEducation,
  listEducation,
  updateEducation,
  type Education,
  type EducationInput,
} from "@/lib/education";

type Mode = { type: "list" } | { type: "adding" } | { type: "editing"; id: number };

const emptyValues: EducationInput = {
  institution: "",
  title: "",
  field_of_study: null,
  start_date: null,
  end_date: null,
  status: "in_progress",
  notes: null,
};

const statusLabels: Record<Education["status"], string> = {
  in_progress: "In progress",
  completed: "Completed",
  paused: "Paused",
  incomplete: "Incomplete",
};

function toInput(edu: Education): EducationInput {
  return {
    institution: edu.institution,
    title: edu.title,
    field_of_study: edu.field_of_study,
    start_date: edu.start_date,
    end_date: edu.end_date,
    status: edu.status,
    notes: edu.notes,
  };
}

function formatRange(edu: Education): string {
  const start = edu.start_date ?? "?";
  const end = edu.end_date ?? (edu.status === "in_progress" ? "Present" : "?");
  return `${start} – ${end}`;
}

export default function EducationSection() {
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [loadError, setLoadError] = useState("");
  const [education, setEducation] = useState<Education[]>([]);
  const [mode, setMode] = useState<Mode>({ type: "list" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listEducation()
      .then((data) => {
        if (cancelled) return;
        setEducation(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load education."
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = [...education].sort((a, b) =>
    (b.start_date ?? "").localeCompare(a.start_date ?? "")
  );

  async function handleAdd(values: EducationInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const created = await createEducation(values);
      setEducation((prev) => [...prev, created]);
      setMode({ type: "list" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save education."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEdit(id: number, values: EducationInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const updated = await updateEducation(id, values);
      setEducation((prev) =>
        prev.map((edu) => (edu.id === id ? updated : edu))
      );
      setMode({ type: "list" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save education."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this education entry?")) return;
    setActionError(null);
    try {
      await deleteEducation(id);
      setEducation((prev) => prev.filter((edu) => edu.id !== id));
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to delete education."
      );
    }
  }

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-base font-medium text-gray-900">Education</h2>
        {mode.type === "list" && (
          <button
            type="button"
            onClick={() => setMode({ type: "adding" })}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Add education
          </button>
        )}
      </div>

      {status === "loading" && (
        <p className="text-sm text-gray-600">Loading education...</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{loadError}</p>}

      {status === "ready" && (
        <div className="flex flex-col gap-4">
          {actionError && (
            <p className="text-sm text-red-600">{actionError}</p>
          )}

          {mode.type === "adding" && (
            <div>
              <EducationForm
                initialValues={emptyValues}
                onSubmit={handleAdd}
                onCancel={() => setMode({ type: "list" })}
                isSubmitting={isSubmitting}
                submitLabel="Add education"
              />
              {formError && (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              )}
            </div>
          )}

          {sorted.length === 0 && mode.type === "list" && (
            <p className="text-sm text-gray-600">No education added yet.</p>
          )}

          <div className="divide-y divide-gray-200">
            {sorted.map((edu) =>
              mode.type === "editing" && mode.id === edu.id ? (
                <div key={edu.id} className="py-4">
                  <EducationForm
                    initialValues={toInput(edu)}
                    onSubmit={(values) => handleEdit(edu.id, values)}
                    onCancel={() => setMode({ type: "list" })}
                    isSubmitting={isSubmitting}
                    submitLabel="Save changes"
                  />
                  {formError && (
                    <p className="mt-2 text-sm text-red-600">{formError}</p>
                  )}
                </div>
              ) : (
                <div key={edu.id} className="py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {edu.title}
                        {edu.field_of_study && `, ${edu.field_of_study}`}
                        {edu.institution && ` · ${edu.institution}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatRange(edu)} · {statusLabels[edu.status]}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-3">
                      <button
                        type="button"
                        onClick={() => setMode({ type: "editing", id: edu.id })}
                        className="text-sm text-gray-700 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(edu.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {edu.notes && (
                    <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                      {edu.notes}
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
