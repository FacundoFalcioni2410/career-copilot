// The backend types recommendation/status/importance as plain strings (no
// enum in the schema), so these are best-effort labels for the values we've
// observed, with a generic fallback for anything new.

function humanize(value: string): string {
  const spaced = value.replace(/_/g, " ").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const knownRecommendationLabels: Record<string, string> = {
  strong_apply: "Strong apply",
  apply: "Apply",
  maybe: "Maybe",
  skip: "Skip",
};

const knownRecommendationColors: Record<string, string> = {
  strong_apply: "text-green-700",
  apply: "text-green-700",
  maybe: "text-gray-700",
  skip: "text-red-700",
};

export function recommendationLabel(value: string): string {
  return knownRecommendationLabels[value] ?? humanize(value);
}

export function recommendationTextClassName(value: string): string {
  return knownRecommendationColors[value] ?? "text-gray-700";
}

export function statusLabel(value: string): string {
  return humanize(value);
}

export function statusTextClassName(value: string): string {
  if (value.includes("missing")) return "text-red-700";
  if (value.includes("strong")) return "text-green-700";
  if (value.includes("moderate") || value.includes("partial") || value.includes("weak")) {
    return "text-amber-700";
  }
  return "text-gray-700";
}

export function importanceLabel(value: string): string {
  return humanize(value);
}

export function formatAnalyzedAt(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatHistoryTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}
