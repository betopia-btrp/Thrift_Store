import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function conditionColor(condition: string): string {
  switch (condition) {
    case "New": return "badge-new";
    case "Like New": return "badge-like-new";
    case "Good": return "badge-good";
    case "Fair": return "badge-fair";
    default: return "badge-draft";
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case "Active": return "badge-active";
    case "Draft": return "badge-draft";
    case "Sold": return "badge-sold";
    case "Archived": return "badge-draft";
    case "Pending": return "badge-pending";
    case "Confirmed": return "badge-like-new";
    case "Dispatched": return "badge-good";
    case "Completed": return "badge-active";
    case "Cancelled": return "badge-fair";
    default: return "badge-draft";
  }
}

export function renderStars(rating: number): { filled: boolean }[] {
  return Array.from({ length: 5 }, (_, i) => ({ filled: i < Math.round(rating) }));
}
