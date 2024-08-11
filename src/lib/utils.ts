import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export function isWithinTimeLimit(dateTime: Date, timeLimitMins: number) {
  const now = new Date();
  const timeLimit = new Date(now.getTime() - timeLimitMins * 60 * 1000);
  return dateTime > timeLimit;
}

export function formatSecsToMins(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

export function formatPlungeTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  // const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${String(minutes)}:${formattedSeconds}`;
}

export function getTimeDiffSecs(startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) return null;
  return Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
}

export function isUserOver18(dob: Date | null) {
  if (!dob) return false;

  const today = new Date();
  const isOver18 =
    Math.ceil(
      (today.getTime() - dob.getTime()) /
        (1000 * 60 * 60 * 24),
    ) >=
    365 * 18;

  return isOver18;
}
