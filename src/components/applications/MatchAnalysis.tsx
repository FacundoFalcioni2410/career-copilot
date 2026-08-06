"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import {
  analyzeApplication,
  getAnalysis,
  listAnalyses,
  type JobAnalysis,
} from "@/lib/analysis";
import {
  formatAnalyzedAt,
  formatHistoryTimestamp,
  importanceLabel,
  recommendationLabel,
  recommendationTextClassName,
  statusLabel,
  statusTextClassName,
} from "@/lib/analysis-format";

export default function MatchAnalysis({
  applicationId,
}: {
  applicationId: number;
}) {
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [loadError, setLoadError] = useState("");
  const [analyses, setAnalyses] = useState<JobAnalysis[]>([]);
  const [displayedId, setDisplayedId] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    listAnalyses(applicationId)
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data].sort((a, b) =>
          b.created_at.localeCompare(a.created_at)
        );
        setAnalyses(sorted);
        setDisplayedId(sorted[0]?.id ?? null);
        setLoadStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "Failed to load match analysis."
        );
        setLoadStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setActionError(null);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      const result = await analyzeApplication(applicationId);
      setAnalyses((prev) => [result, ...prev]);
      setDisplayedId(result.id);
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to analyze match."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleViewHistory(id: number) {
    setViewingId(id);
    setActionError(null);
    try {
      const result = await getAnalysis(applicationId, id);
      setAnalyses((prev) => prev.map((a) => (a.id === id ? result : a)));
      setDisplayedId(id);
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to load analysis."
      );
    } finally {
      setViewingId(null);
    }
  }

  const displayed = analyses.find((a) => a.id === displayedId) ?? null;
  const history = analyses.filter((a) => a.id !== displayedId);

  return (
    <div ref={sectionRef} className="mt-10 scroll-mt-6 border-t border-gray-200 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium text-gray-900">
          Match analysis
        </h2>
        {loadStatus === "ready" && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {isAnalyzing
              ? "Analyzing..."
              : analyses.length > 0
                ? "Re-analyze"
                : "Analyze match"}
          </button>
        )}
      </div>

      {loadStatus === "loading" && (
        <p className="text-sm text-gray-600">Loading match analysis...</p>
      )}
      {loadStatus === "error" && (
        <p className="text-sm text-red-600">{loadError}</p>
      )}

      {loadStatus === "ready" && (
        <div className="flex flex-col gap-4">
          {actionError && (
            <p className="text-sm text-red-600">{actionError}</p>
          )}

          {!isAnalyzing && analyses.length === 0 && (
            <p className="text-sm text-gray-600">
              Run the analysis to see how this application matches your
              profile.
            </p>
          )}

          {isAnalyzing && (
            <div className="flex flex-col gap-8 animate-pulse" aria-hidden="true">
              <div className="flex items-baseline gap-12">
                <div>
                  <div className="h-3.5 w-24 rounded bg-gray-200" />
                  <div className="mt-3 h-10 w-20 rounded bg-gray-200" />
                </div>
                <div>
                  <div className="h-3.5 w-28 rounded bg-gray-200" />
                  <div className="mt-3 h-8 w-28 rounded bg-gray-200" />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
              </div>

              <div>
                <div className="mb-3 h-4 w-32 rounded bg-gray-200" />
                <div className="divide-y divide-gray-200 border-t border-gray-200">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className="flex items-center justify-between gap-4 py-4">
                      <div className="h-4 w-48 rounded bg-gray-200" />
                      <div className="h-4 w-20 rounded bg-gray-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isAnalyzing && displayed && (
            <div className="flex flex-col gap-6">
              <div className="flex items-baseline gap-10">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Match score
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {displayed.match_score}%
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Recommendation
                  </p>
                  <p
                    className={`text-lg font-semibold ${recommendationTextClassName(displayed.recommendation)}`}
                  >
                    {recommendationLabel(displayed.recommendation)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                Analyzed {formatAnalyzedAt(displayed.created_at)}
              </p>

              <p className="text-sm text-gray-700">{displayed.summary}</p>

              {displayed.requirements.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900">
                    Requirements
                  </h3>
                  <div className="divide-y divide-gray-200 border-t border-gray-200">
                    {displayed.requirements.map((req) => (
                      <div key={req.id} className="py-3">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-gray-900">
                            {req.requirement}
                          </span>
                          <span className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">
                              {importanceLabel(req.importance)}
                            </span>
                            <span
                              className={`text-sm font-medium ${statusTextClassName(req.status)}`}
                            >
                              {statusLabel(req.status)}
                            </span>
                          </span>
                        </div>
                        {req.explanation && (
                          <p className="mt-2 text-sm text-gray-700">
                            {req.explanation}
                          </p>
                        )}
                        {req.evidence.map((evidence) => (
                          <p
                            key={evidence.id}
                            className="mt-2 border-l-2 border-gray-300 pl-3 text-sm text-gray-700"
                          >
                            <span className="text-gray-500">
                              {evidence.source}:{" "}
                            </span>
                            {evidence.detail}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {displayed.strengths.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900">
                    Strengths
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {displayed.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {displayed.gaps.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900">
                    Gaps
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {displayed.gaps.map((gap, index) => (
                      <li key={index}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}

              {displayed.cv_suggestions_supported.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900">
                    CV suggestions
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {displayed.cv_suggestions_supported.map((s, index) => (
                      <li key={index}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {displayed.cv_suggestions_to_verify.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900">
                    Worth verifying before adding to your CV
                  </h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {displayed.cv_suggestions_to_verify.map((s, index) => (
                      <li key={index}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-gray-900">
                Previous analyses
              </h3>
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {history.map((analysis) => (
                  <button
                    key={analysis.id}
                    type="button"
                    onClick={() => handleViewHistory(analysis.id)}
                    disabled={viewingId === analysis.id}
                    className="flex w-full items-center justify-between gap-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span>
                      {viewingId === analysis.id
                        ? "Loading..."
                        : formatHistoryTimestamp(analysis.created_at)}
                    </span>
                    <span className="text-gray-500">
                      {analysis.match_score}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
