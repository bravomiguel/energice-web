export const ONBOARDING_PATHNAMES = [
  '/confirm-email',
  '/member-details',
  '/guardian-waiver',
  '/health-quiz',
  '/waiver',
];

export const RESET_PW_PATHNAME = '/reset-password';

export const BASE_URL =
  process.env.VERCEL_ENV === 'development'
    ? `http://localhost:${process.env.PORT}`
    : process.env.CANONICAL_URL;

export const APP_PATHNAMES = ['/', '/profile', '/unit'];

// const GDRIVE_BASE_URL = `https://drive.usercontent.google.com/download`;
// const SUPABASE_BASE_URL = `https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public`;
const GCLOUD_BASE_URL = `https://storage.googleapis.com`;

// console.log(process.env.VERCEL_ENV);

export const PLUNGE_BENEFITS_ARRAY: string[] = [
  'Accelerates muscle recovery',
  'Boosts your stamina and power ',
  'Sky-rockets your happy chemicals',
  'Reduces soreness and inflammation',
  'Supercharges your immune system',
  'Burns fat and calories',
];

export const PLUNGE_TIME_INFO_ARRAY: {
  message: React.ReactNode;
  url: string;
}[] = [
  {
    message: `The plunge timer (mins / secs) indicates how long you're aiming to plunge for during your session.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/plunge-timer-1.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/plunge-timer-1.mp4`,
  },
  {
    message: `The timer is completely optional. You're in control and can exit when you want.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/how-it-works-4.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/how-it-works-4.mp4`,
  },
  {
    message: `You can go over the timer, just note your session times out after 6 mins.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/plunge-timer-3.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/plunge-timer-3.mp4`,
  },
];

export const HOW_IT_WORKS_ARRAY: {
  message: React.ReactNode;
  url: string;
}[] = [
  {
    message: `Set your timer, and start a new session to unlock the plunge.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/how-it-works-1.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/how-it-works-1.mp4`,
  },
  {
    message: `Open the lid, place your phone in the holder... and take the plunge!`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/how-it-works-2.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/how-it-works-2.mp4`,
  },
  {
    message: `Start the timer and lean back into your plunge.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/how-it-works-3.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/how-it-works-3.mp4`,
  },
  {
    message: `Done? End your session and jump out at your own pace.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/how-it-works-4.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/how-it-works-4.mp4`,
  },
  {
    message: `Give the plunge a quick skim and close the lid. You did it!`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/how-it-works-5.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/how-it-works-5.mp4`,
  },
];

export const PLUNGE_TIPS_ARRAY: {
  message: React.ReactNode;
  url: string;
}[] = [
  {
    message: `Breathing is key. Prep for your plunge with 5-10 big breaths.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/plunge-tips-1.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/plunge-tips-1.mp4`,
  },
  {
    message: `Ready to plunge? Big breath in, and breathe out as you lower into the water.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/plunge-tips-2.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/plunge-tips-2.mp4`,
  },
  {
    message: `The first 30 secs can be a shock. Slow down the breath as much as you can.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/plunge-tips-3.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/plunge-tips-3.mp4`,
  },
  {
    message: `After 30 secs, you'll notice your body relaxing. Let go, and enjoy it!`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/plunge-tips-4.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/plunge-tips-4.mp4`,
  },
  {
    message: `You're in control at all times. End your session whenever you need to.`,
    url:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
        ? `/explainer-videos/plunge-tips-5.mp4`
        : `${GCLOUD_BASE_URL}/explainer-videos/plunge-tips-5.mp4`,
  },
];

export const DURATION_MINS_OPTIONS = ['00', '01', '02', '03', '04', '05', '06'];

export const DURATION_SECS_OPTIONS = ['00', '10', '20', '30', '40', '50'];

export const SESSION_MAX_TIME_SECS = 6 * 60;
