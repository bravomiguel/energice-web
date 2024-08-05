export const ONBOARDING_PATHNAMES = [
  '/confirm-email',
  '/member-details',
  '/health-quiz',
  '/waiver',
];

export const RESET_PW_PATHNAME = '/reset-password';

export const BASE_URL =
  process.env.VERCEL_ENV === 'development'
    ? `http://localhost:${process.env.PORT}`
    : process.env.CANONICAL_URL;

export const ONBOARDING_URLS = ONBOARDING_PATHNAMES.map(
  (pathName) => `${BASE_URL}${pathName}`,
);

export const APP_PATHNAMES = ['/', '/profile', '/unit'];

const GIFS_GDRIVE_BASE_URL = `https://drive.usercontent.google.com/download`;
const GIFS_SUPABASE_BASE_URL = `https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public`;

// console.log(process.env.VERCEL_ENV);

export const PLUNGE_TIME_INFO_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `The plunge timer (mm:ss) indicates how long you're aiming to plunge for during your session.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1co7EMfBZQ-heWZRoOsq5o047B7ZNqfeH`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/plunge-timer-1.gif`
        : `/explainer-gifs/plunge-timer-1.gif`,
  },
  {
    message: `The timer is completely optional. You're in control and can exit when you want.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1mDlc_fGXudGSjeGSptq_GOQmK_WTI4dy`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/how-it-works-4.gif`
        : `/explainer-gifs/how-it-works-4.gif`,
  },
  {
    message: `You can go over the timer, just note your session times out after 6 mins.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1AXKZx_3h_C9Sg52qTcObpcy-ZY6NRIpf`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/plunge-timer-3.gif`
        : `/explainer-gifs/plunge-timer-3.gif`,
  },
];

export const HOW_IT_WORKS_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `Set your timer, and start a new session to unlock the plunge.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1mRocREDKUHxlCtkOjc1ksiXyNwXQ6edE`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/how-it-works-1.gif`
        : `/explainer-gifs/how-it-works-1.gif`,
  },
  {
    message: `Open the lid, place your phone in the holder... and take the plunge!`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1EKvvq96yGdldiRJyHr81V0C62U8zOwc6`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/how-it-works-2.gif`
        : `/explainer-gifs/how-it-works-2.gif`,
  },
  {
    message: `Start the timer and lean back into your plunge.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=180aMpD6b1KB0eMhobO6alku-OuQSIp9q`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/how-it-works-3.gif`
        : `/explainer-gifs/how-it-works-3.gif`,
  },
  {
    message: `Done? End your session and jump out at your own pace.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1mDlc_fGXudGSjeGSptq_GOQmK_WTI4dy`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/how-it-works-4.gif`
        : `/explainer-gifs/how-it-works-4.gif`,
  },
  {
    message: `Give the plunge a quick skim and close the lid. You did it!`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1QR1HgXOH9_0vUSMS9Un8eklYJNOxlHge`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/how-it-works-5.gif`
        : `/explainer-gifs/how-it-works-5.gif`,
  },
];

export const PLUNGE_TIPS_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `Breathing is key. Prep for your plunge with 5-10 big breaths.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1GX99dDSI0zwGizwR9xVcqfayf7mRajlQ`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/plunge-tips-1.gif`
        : `/explainer-gifs/plunge-tips-1.gif`,
  },
  {
    message: `Ready to plunge? Big breath in, and breathe out as you lower into the water.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1gvL1ONzTm20-55QfTxhR4KMIo9vJIgUj`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/plunge-tips-2.gif`
        : `/explainer-gifs/plunge-tips-2.gif`,
  },
  {
    message: `The first 30 secs can be a shock. Slow down the breath as much as you can.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1y0Jup9sLcUwMqRIK575l5l9UzJ-nuOy3`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/plunge-tips-3.gif`
        : `/explainer-gifs/plunge-tips-3.gif`,
  },
  {
    message: `After 30 secs, you'll notice your body relaxing. Let go, and enjoy it!`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1YKpJmtBDfmL9RrlsXBojrcYOh13Vm-Er`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/plunge-tips-4.gif`
        : `/explainer-gifs/plunge-tips-4.gif`,
  },
  {
    message: `You're in control at all times. End your session whenever you need to.`,
    gifUrl:
      process.env.VERCEL_ENV === 'preview'
        ? `${GIFS_GDRIVE_BASE_URL}?id=1K4GqWXvDy0e4h7DggjgepUVYWSiLfY8W`
        : process.env.VERCEL_ENV === 'production'
        ? `${GIFS_SUPABASE_BASE_URL}/explainer-gifs/plunge-tips-5.gif`
        : `/explainer-gifs/plunge-tips-5.gif`,
  },
];

export const DURATION_MINS_OPTIONS = ['00', '01', '02', '03', '04', '05', '06'];

export const DURATION_SECS_OPTIONS = ['00', '10', '20', '30', '40', '50'];

export const SESSION_MAX_TIME_SECS = 6 * 60;
