import type { Recommendation } from "@/lib/analysis";

export const recommendationLabels: Record<Recommendation, string> = {
  strong_apply: "Strong apply",
  apply: "Apply",
  maybe: "Maybe",
  skip: "Skip",
};

export const recommendationTextClassName: Record<Recommendation, string> = {
  strong_apply: "text-green-700",
  apply: "text-green-700",
  maybe: "text-gray-700",
  skip: "text-red-700",
};
