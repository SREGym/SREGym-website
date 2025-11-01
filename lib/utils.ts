import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDatasetName(name: string): string {
  if (name === "problem-repertoire") {
    return "Problem Repertoire";
  }
  return name;
}
