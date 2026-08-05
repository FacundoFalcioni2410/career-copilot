"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { analyzeApplication, type JobAnalysis } from "@/lib/analysis";
import {
  recommendationLabels,
  recommendationTextClassName,
} from "@/lib/recommendation";

type Strength = "strong" | "partial" | "missing";

type Requirement = {
  requirement: string;
  strength: Strength;
  evidence?: string;
  gap?: string;
};

const strengthLabels: Record<Strength, string> = {
  strong: "Strong",
  partial: "Partial",
  missing: "Missing",
};

const strengthTextClassName: Record<Strength, string> = {
  strong: "text-green-700",
  partial: "text-amber-700",
  missing: "text-red-700",
};

function toRequirements(analysis: JobAnalysis): Requirement[] {
  return [
    ...analysis.strong_matches.map((m) => ({
      requirement: m.requirement,
      strength: "strong" as const,
      evidence: m.evidence,
    })),
    ...analysis.partial_matches.map((m) => ({
      requirement: m.requirement,
      strength: "partial" as const,
      evidence: m.evidence,
      gap: m.gap,
    })),
    ...analysis.missing_requirements.map((requirement) => ({
      requirement,
      strength: "missing" as const,
    })),
  ];
}

export default function MatchAnalysis({
  applicationId,
}: {
  applicationId: number;
}) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);

  async function handleAnalyze() {
    setStatus("loading");
    try {
      const result = await analyzeApplication(applicationId);
      setAnalysis(result);
      setStatus("success");
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : "Failed to analyze match."
      );
      setStatus("error");
    }
  }

  const requirements = analysis ? toRequirements(analysis) : [];

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium text-gray-900">
          Match analysis
        </h2>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={status === "loading"}
          className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {status === "loading"
            ? "Analyzing..."
            : status === "success"
              ? "Re-analyze"
              : "Analyze match"}
        </button>
      </div>

      {status === "idle" && (
        <p className="text-sm text-gray-600">
          Run the analysis to see how this application matches your profile.
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      {status === "success" && analysis && (
        <div className="flex flex-col gap-6">
          <div className="flex items-baseline gap-10">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Match score
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {analysis.match_score}%
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Recommendation
              </p>
              <p
                className={`text-lg font-semibold ${recommendationTextClassName[analysis.recommendation]}`}
              >
                {recommendationLabels[analysis.recommendation]}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-700">{analysis.summary}</p>

          {requirements.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">
                Requirements
              </h3>
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {requirements.map((req, index) => (
                  <div key={`${req.requirement}-${index}`} className="py-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-gray-900">
                        {req.requirement}
                      </span>
                      <span
                        className={`text-sm font-medium ${strengthTextClassName[req.strength]}`}
                      >
                        {strengthLabels[req.strength]}
                      </span>
                    </div>
                    {req.evidence && (
                      <p className="mt-2 border-l-2 border-gray-300 pl-3 text-sm text-gray-700">
                        {req.evidence}
                      </p>
                    )}
                    {req.gap && (
                      <p className="mt-2 border-l-2 border-amber-300 pl-3 text-sm text-gray-700">
                        <span className="font-medium">Gap: </span>
                        {req.gap}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.cv_suggestions.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-900">
                CV suggestions
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                {analysis.cv_suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
