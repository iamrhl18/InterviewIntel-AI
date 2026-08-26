import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export function getPriorityColor(priority: "HIGH" | "MEDIUM" | "LOW") {
  switch (priority) {
    case "HIGH":
      return {
        badge: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-600",
        label: "High Priority",
      };
    case "MEDIUM":
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-600",
        label: "Medium Priority",
      };
    case "LOW":
      return {
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        dot: "bg-slate-500",
        label: "Low Priority",
      };
  }
}

export function getCertaintyBadge(certainty: "verified" | "high_confidence" | "inferred") {
  switch (certainty) {
    case "verified":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Verified Source",
      };
    case "high_confidence":
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        label: "High Confidence",
      };
    case "inferred":
      return {
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        label: "Industry Inferred",
      };
  }
}
