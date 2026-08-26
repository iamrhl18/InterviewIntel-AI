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
        badge: "bg-red-500/10 text-red-500 border-red-500/30 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/60",
        dot: "bg-red-500",
        label: "High Priority",
      };
    case "MEDIUM":
      return {
        badge: "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
        dot: "bg-amber-500",
        label: "Medium Priority",
      };
    case "LOW":
      return {
        badge: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60",
        dot: "bg-blue-500",
        label: "Low Priority",
      };
  }
}

export function getCertaintyBadge(certainty: "verified" | "high_confidence" | "inferred") {
  switch (certainty) {
    case "verified":
      return {
        badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60",
        label: "Verified Source",
      };
    case "high_confidence":
      return {
        badge: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60",
        label: "High Confidence",
      };
    case "inferred":
      return {
        badge: "bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800/60",
        label: "Industry Inferred",
      };
  }
}
