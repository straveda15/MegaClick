import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE } from "@/hooks/api-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  const cleanBase = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  if (url.startsWith("/")) {
    return `${cleanBase}${url}`;
  }
  return `${cleanBase}/${url}`;
}
