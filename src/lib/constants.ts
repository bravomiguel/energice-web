export const ONBOARDING_PATHNAMES = [
  '/confirm-email',
  '/member-details',
  '/health-quiz',
  '/waiver',
];

export const RESET_PW_PATHNAME = '/reset-password';

export const IS_STRIPE_TEST_ENV =
  process.env.VERCEL_ENV === 'development' ||
  process.env.VERCEL_URL === 'koldup-preview.vercel.app' ||
  process.env.VERCEL_URL === 'koldup-preview-lock.vercel.app';

export const IS_STRIPE_LIVE_ENV =
  process.env.VERCEL_ENV === 'production' ||
  process.env.VERCEL_URL === 'koldup-preview-pay.vercel.app' ||
  process.env.VERCEL_URL === 'koldup-preview-pay-lock.vercel.app';

export const IS_SEAM_TEST_ENV =
  process.env.VERCEL_ENV === 'development' ||
  process.env.VERCEL_URL === 'koldup-preview.vercel.app' ||
  process.env.VERCEL_URL === 'koldup-preview-pay.vercel.app';

export const IS_SEAM_LIVE_ENV =
  process.env.VERCEL_ENV === 'production' ||
  process.env.VERCEL_URL === 'koldup-preview-lock.vercel.app' ||
  process.env.VERCEL_URL === 'koldup-preview-pay-lock.vercel.app';

export const BASE_URL =
  process.env.VERCEL_ENV === 'development'
    ? `http://localhost:${process.env.PORT}`
    : `https://${process.env.VERCEL_URL}`;

export const ONBOARDING_URLS = ONBOARDING_PATHNAMES.map((pathName) => {
  return `${BASE_URL}${pathName}`;
});

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
    gifUrl: '',
  },
  {
    message: `Open the lid and place your phone in the holder to prep for your plunge.`,
    gifUrl: '',
  },
  {
    message: `It's plunge time. Take a few big breaths and jump in!`,
    gifUrl: '',
  },
  {
    message: `Start the timer to keep track of your plunge progress.`,
    gifUrl: '',
  },
  {
    message: `Done? End your session, jump out and close the lid behind you.`,
    gifUrl: '',
  },
  {
    message: `You did it! Enjoy feeling great for the rest of the day.`,
    gifUrl: '',
  },
];

export const PLUNGE_TIPS_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `Breathing is key. Prep for your plunge with 5-10 big breaths.`,
    gifUrl: '',
  },
  {
    message: `Ready to plunge? Big breath in, and breathe out as you hit the water.`,
    gifUrl: '',
  },
  {
    message: `The first 30 secs can be a shock. Slow the breath as much as you can.`,
    gifUrl: '',
  },
  {
    message: `After 30 secs, you'll notice your body relaxing. Let go, and enjoy it!`,
    gifUrl: '',
  },
  {
    message: `You're in control at all times. End your session whenever you need to.`,
    gifUrl: '',
  },
];

export const DURATION_MINS_OPTIONS = ['00', '01', '02', '03', '04', '05', '06'];

export const DURATION_SECS_OPTIONS = ['00', '10', '20', '30', '40', '50'];

export const SESSION_MAX_TIME_SECS = 6 * 60;
