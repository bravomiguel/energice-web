import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function isWithinTimeLimit(dateTime: Date, timeLimitMins: number) {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - timeLimitMins * 60 * 1000);
  return dateTime > fifteenMinutesAgo;
}
