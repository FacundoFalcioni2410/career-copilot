"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { listAnalyses, type JobAnalysis } from "@/lib/analysis";
import { formatAnalyzedAt } from "@/lib/analysis-format";
import {
  tailorApplicationCv,
  type CVRewriteSuggestion,
  type CVTailoringResult,
} from "@/lib/cv-tailoring";

function SuggestionCard({ suggestion }: { suggestion: CVRewriteSuggestion }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(suggestion.suggested_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <p className="text-sm font-medium text-gray-900">
        {suggestion.source_name}
      </p>

      <div className="mt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Original
        </p>
        <p className="mt-1 text-sm text-gray-600">{suggestion.original_text}</p>
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Suggested
        </p>
        <p className="mt-1 border-l-2 border-gray-300 pl-3 text-sm text-gray-900">
          {suggestion.suggested_text}
        </p>
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Why
        </p>
        <p className="mt-1 text-sm text-gray-600">{suggestion.reason}</p>
      </div>

      {suggestion.targets_requirements.length > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          Targets: {suggestion.targets_requirements.join(" · ")}
        </p>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 rounded border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export default function CvTailoring({
  applicationId,
}: {
  applicationId: number;
}) {
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "ready">(
    "loading"
  );
  const [loadError, setLoadError] = useState("");
  const [latestAnalysis, setLatestAnalysis] = useState<JobAnalysis | null>(
    null
  );

  const [generateStatus, setGenerateStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [generateError, setGenerateError] = useState("");
  const [result, setResult] = useState<CVTailoringResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    listAnalyses(applicationId)
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data].sort((a, b) =>
          b.created_at.localeCompare(a.created_at)
        );
        setLatestAnalysis(sorted[0] ?? null);
        setLoadStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? err.message : "Failed to load analyses."
        );
        setLoadStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  async function handleGenerate() {
    if (!latestAnalysis) return;
    setGenerateStatus("loading");
    setGenerateError("");
    try {
      const data = await tailorApplicationCv(applicationId, latestAnalysis.id);
      setResult(data);
      setGenerateStatus("success");
    } catch (err) {
      setGenerateError(
        err instanceof ApiError ? err.message : "Failed to generate CV tailoring."
      );
      setGenerateStatus("error");
    }
  }

  if (loadStatus === "loading") {
    return <p className="text-sm text-gray-600">Loading...</p>;
  }

  if (loadStatus === "error") {
    return <p className="text-sm text-red-600">{loadError}</p>;
  }

  if (!latestAnalysis) {
    return (
      <p className="text-sm text-gray-600">
        Run a match analysis first, then generate CV tailoring suggestions.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Based on analysis from {formatAnalyzedAt(latestAnalysis.created_at)}
        </p>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generateStatus === "loading"}
          className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {generateStatus === "loading"
            ? "Generating..."
            : generateStatus === "success"
              ? "Regenerate"
              : "Generate CV tailoring"}
        </button>
      </div>

      {generateStatus === "error" && (
        <p className="text-sm text-red-600">{generateError}</p>
      )}

      {generateStatus === "loading" && (
        <div className="flex flex-col gap-3 animate-pulse" aria-hidden="true">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      )}

      {generateStatus === "success" && result && (
        <div className="flex flex-col gap-8">
          <p className="text-sm text-gray-700">{result.summary}</p>

          {result.skills_to_emphasize.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">
                Skills to emphasize
              </h3>
              <p className="text-sm text-gray-700">
                {result.skills_to_emphasize.join(" · ")}
              </p>
            </div>
          )}

          {result.experience_suggestions.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">
                Experience suggestions
              </h3>
              <div className="border-t border-gray-200">
                {result.experience_suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={`${suggestion.source_id}-${index}`}
                    suggestion={suggestion}
                  />
                ))}
              </div>
            </div>
          )}

          {result.project_suggestions.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">
                Project suggestions
              </h3>
              <div className="border-t border-gray-200">
                {result.project_suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={`${suggestion.source_id}-${index}`}
                    suggestion={suggestion}
                  />
                ))}
              </div>
            </div>
          )}

          {result.questions_to_verify.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">
                Questions to verify
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {result.questions_to_verify.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
