import type { ApplicationStatus } from "@/lib/applications";

export const statusLabels: Record<ApplicationStatus, string> = {
  interested: "Interested",
  applied: "Applied",
  hr_interview: "HR interview",
  technical_interview: "Technical interview",
  challenge: "Challenge",
  final_interview: "Final interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const statusOrder: ApplicationStatus[] = [
  "interested",
  "applied",
  "hr_interview",
  "technical_interview",
  "challenge",
  "final_interview",
  "offer",
  "rejected",
];

// Color communicates state only (no backgrounds/pills): neutral for the
// in-progress stages, green for a positive outcome, red for a closed-out one.
export const statusTextClassName: Record<ApplicationStatus, string> = {
  interested: "text-gray-700",
  applied: "text-gray-700",
  hr_interview: "text-gray-700",
  technical_interview: "text-gray-700",
  challenge: "text-gray-700",
  final_interview: "text-gray-700",
  offer: "text-green-700",
  rejected: "text-red-700",
};
