"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ApplicationForm from "@/components/applications/ApplicationForm";
import { ApiError } from "@/lib/api";
import {
  createApplication,
  deleteApplication,
  listApplications,
  updateApplication,
  type Application,
  type ApplicationInput,
} from "@/lib/applications";
import { statusLabels, statusTextClassName } from "@/lib/application-status";

type Mode = { type: "list" } | { type: "adding" } | { type: "editing"; id: number };

const emptyValues: ApplicationInput = {
  company: "",
  position: "",
  description: "",
  salary: null,
  location: null,
  source: null,
  status: "interested",
};

function toInput(app: Application): ApplicationInput {
  return {
    company: app.company,
    position: app.position,
    description: app.description,
    salary: app.salary,
    location: app.location,
    source: app.source,
    status: app.status,
  };
}

export default function ApplicationsPage() {
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [loadError, setLoadError] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [mode, setMode] = useState<Mode>({ type: "list" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    listApplications()
      .then((data) => {
        if (cancelled) return;
        setApplications(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load applications."
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = [...applications].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at)
  );

  async function handleAdd(values: ApplicationInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const created = await createApplication(values);
      setApplications((prev) => [...prev, created]);
      setMode({ type: "list" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save application."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEdit(id: number, values: ApplicationInput) {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const updated = await updateApplication(id, values);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );
      setMode({ type: "list" });
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Failed to save application."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this application?")) return;
    setActionError(null);
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : "Failed to delete application."
      );
    }
  }

  const editingApplication =
    mode.type === "editing"
      ? applications.find((app) => app.id === mode.id)
      : undefined;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Applications</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track and manage your job applications.
          </p>
        </div>
        {mode.type === "list" && status === "ready" && (
          <button
            type="button"
            onClick={() => setMode({ type: "adding" })}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Add application
          </button>
        )}
      </div>

      {status === "loading" && (
        <p className="text-sm text-gray-600">Loading applications...</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{loadError}</p>}

      {status === "ready" && (
        <div className="flex flex-col gap-4">
          {actionError && <p className="text-sm text-red-600">{actionError}</p>}

          {mode.type === "adding" && (
            <div>
              <ApplicationForm
                initialValues={emptyValues}
                onSubmit={handleAdd}
                onCancel={() => setMode({ type: "list" })}
                isSubmitting={isSubmitting}
                submitLabel="Add application"
              />
              {formError && (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              )}
            </div>
          )}

          {mode.type === "editing" && editingApplication && (
            <div>
              <ApplicationForm
                initialValues={toInput(editingApplication)}
                onSubmit={(values) => handleEdit(editingApplication.id, values)}
                onCancel={() => setMode({ type: "list" })}
                isSubmitting={isSubmitting}
                submitLabel="Save changes"
              />
              {formError && (
                <p className="mt-2 text-sm text-red-600">{formError}</p>
              )}
            </div>
          )}

          {sorted.length === 0 ? (
            <p className="text-sm text-gray-600">No applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th className="py-2 pr-4 font-medium">Company</th>
                    <th className="py-2 pr-4 font-medium">Position</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Location</th>
                    <th className="py-2 pr-4 font-medium">Salary</th>
                    <th className="py-2 pr-4 font-medium">Source</th>
                    <th className="py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sorted.map((app) => (
                    <tr key={app.id}>
                      <td className="py-2 pr-4 text-gray-900">{app.company}</td>
                      <td className="py-2 pr-4 text-gray-900">{app.position}</td>
                      <td className={`py-2 pr-4 ${statusTextClassName[app.status]}`}>
                        {statusLabels[app.status]}
                      </td>
                      <td className="py-2 pr-4 text-gray-700">
                        {app.location ?? "—"}
                      </td>
                      <td className="py-2 pr-4 text-gray-700">
                        {app.salary ?? "—"}
                      </td>
                      <td className="py-2 pr-4 text-gray-700">
                        {app.source ?? "—"}
                      </td>
                      <td className="py-2">
                        <div className="flex gap-3">
                          <Link
                            href={`/applications/${app.id}`}
                            className="text-gray-700 hover:underline"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setMode({ type: "editing", id: app.id })
                            }
                            className="text-gray-700 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(app.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
