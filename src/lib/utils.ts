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
  const fifteenMinutesAgo = new Date(now.getTime() - timeLimitMins * 60 * 1000);
  return dateTime > fifteenMinutesAgo;
}

export function formatSecsToMins(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}

export function getTimeDiffSecs(date1: Date | null, date2: Date | null) {
  if (!date1 || !date2) return null;
  return Math.floor(Math.abs(date1.getTime() - date2.getTime()) / 1000);
}

export function repeatUntilTrueOrTimeout(func: () => Promise<boolean>, interval: number, maxTime: number) {
  return new Promise((resolve, reject) => {
      const endTime = Date.now() + maxTime;

      const intervalId = setInterval(async () => {
          if (Date.now() > endTime) {
              clearInterval(intervalId);
              reject(new Error('Max time reached'));
              return;
          }

          try {
              const result = await func();
              if (result === true) {
                  clearInterval(intervalId);
                  resolve(true);
              }
          } catch (error) {
              clearInterval(intervalId);
              reject(error);
          }
      }, interval);
  });
}
