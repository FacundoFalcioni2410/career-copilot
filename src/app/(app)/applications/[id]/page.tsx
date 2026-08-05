"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import { getApplication, type Application } from "@/lib/applications";
import { statusLabels, statusTextClassName } from "@/lib/application-status";

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [loadError, setLoadError] = useState("");
  const [application, setApplication] = useState<Application | null>(null);

  useEffect(() => {
    let cancelled = false;

    getApplication(Number(id))
      .then((data) => {
        if (cancelled) return;
        setApplication(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load application."
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div>
      <Link href="/applications" className="text-sm text-gray-600 hover:underline">
        ← Back to applications
      </Link>

      {status === "loading" && (
        <p className="mt-4 text-sm text-gray-600">Loading application...</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-red-600">{loadError}</p>
      )}

      {status === "ready" && application && (
        <div>
          <div className="mb-6 mt-4 border-b border-gray-200 pb-4">
            <h1 className="text-lg font-semibold text-gray-900">
              {application.position}
            </h1>
            <p className="mt-1 text-sm text-gray-600">{application.company}</p>
          </div>

          <dl className="divide-y divide-gray-200 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 py-3 text-sm">
              <dt className="text-gray-600">Status</dt>
              <dd className={`col-span-2 ${statusTextClassName[application.status]}`}>
                {statusLabels[application.status]}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 text-sm">
              <dt className="text-gray-600">Salary</dt>
              <dd className="col-span-2 text-gray-900">
                {application.salary ?? (
                  <span className="text-gray-400">Not set</span>
                )}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 text-sm">
              <dt className="text-gray-600">Location</dt>
              <dd className="col-span-2 text-gray-900">
                {application.location ?? (
                  <span className="text-gray-400">Not set</span>
                )}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 text-sm">
              <dt className="text-gray-600">Source</dt>
              <dd className="col-span-2 text-gray-900">
                {application.source ?? (
                  <span className="text-gray-400">Not set</span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h2 className="mb-2 text-sm font-medium text-gray-900">
              Description
            </h2>
            <p className="whitespace-pre-line text-sm text-gray-700">
              {application.description}
            </p>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">
                Match analysis
              </h2>
              <button
                type="button"
                className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white"
              >
                Analyze match
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Run the analysis to see how this application matches your
              profile.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
