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

export const PLUNGE_TIME_INFO_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `The plunge timer (mm:ss) indicates how long you're aiming to plunge for during your session.`,
    gifUrl: '',
  },
  {
    message: `The timer is completely optional. You're in control and can exit when you want.`,
    gifUrl: '',
  },
  {
    message: `You can go over the timer, just note your session times out after 6 mins.`,
    gifUrl: '',
  },
];

export const HOW_IT_WORKS_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `Set your timer, and start a new session to unlock the plunge.`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/how-it-works-1.gif?t=2024-07-22T22%3A11%3A13.857Z',
  },
  {
    message: `Open the lid, place your phone in the holder... and take the plunge!`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/how-it-works-2.gif?t=2024-07-25T22%3A37%3A42.770Z',
  },
  {
    message: `Start the timer and lean back into your plunge.`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/how-it-works-3.gif?t=2024-07-25T23%3A08%3A55.519Z',
  },
  {
    message: `Done? End your session and jump out at your own pace.`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/how-it-works-4.gif?t=2024-07-25T23%3A18%3A15.405Z',
  },
  {
    message: `Give the plunge a quick skim and close the lid. You did it!`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/how-it-works-5.gif?t=2024-07-25T23%3A22%3A07.469Z',
  },
];

export const PLUNGE_TIPS_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `Breathing is key. Prep for your plunge with 5-10 big breaths.`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/plunge-tips-1.gif?t=2024-07-25T22%3A38%3A54.754Z',
  },
  {
    message: `Ready to plunge? Big breath in, and breathe out as you lower into the water.`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/plunge-tips-2.gif?t=2024-07-25T23%3A29%3A33.880Z',
  },
  {
    message: `The first 30 secs can be a shock. Slow down the breath as much as you can.`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/plunge-tips-3.gif?t=2024-07-25T22%3A40%3A19.304Z',
  },
  {
    message: `After 30 secs, you'll notice your body relaxing. Let go, and enjoy it!`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/plunge-tips-4.gif?t=2024-07-25T22%3A40%3A28.453Z',
  },
  {
    message: `You're in control at all times. End your session whenever you need to.`,
    gifUrl: 'https://yzswukrjljsdoupmonyl.supabase.co/storage/v1/object/public/explainer-gifs/plunge-tips-5.gif?t=2024-07-25T23%3A35%3A09.193Z',
  },
];

export const DURATION_MINS_OPTIONS = ['00', '01', '02', '03', '04', '05', '06'];

export const DURATION_SECS_OPTIONS = ['00', '10', '20', '30', '40', '50'];

export const SESSION_MAX_TIME_SECS = 6 * 60;
