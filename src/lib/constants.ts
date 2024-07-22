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
    gifUrl: '/how-it-works-01.gif',
  },
  {
    message: `Open the lid and place your phone in the holder to prep for your plunge.`,
    gifUrl: '/how-it-works-02.gif',
  },
  {
    message: `It's plunge time. Take a few big breaths and jump in!`,
    gifUrl: '/how-it-works-03.gif',
  },
  {
    message: `Start the timer to keep track of your plunge progress.`,
    gifUrl: '/how-it-works-04.gif',
  },
  {
    message: `Done? End your session, jump out and close the lid behind you.`,
    gifUrl: '/how-it-works-05.gif',
  },
  {
    message: `You did it! Enjoy feeling great for the rest of the day.`,
    gifUrl: '/how-it-works-06.gif',
  },
];

export const PLUNGE_TIPS_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `Breathing is key. Prep for your plunge with 5-10 big breaths.`,
    gifUrl: '/plunge-tips-01.gif',
  },
  {
    message: `Ready to plunge? Big breath in, and breathe out as you hit the water.`,
    gifUrl: '/plunge-tips-02.gif',
  },
  {
    message: `The first 30 secs can be a shock. Slow the breath as much as you can.`,
    gifUrl: '/plunge-tips-03.gif',
  },
  {
    message: `After 30 secs, you'll notice your body relaxing. Let go, and enjoy it!`,
    gifUrl: '/plunge-tips-04.gif',
  },
  {
    message: `You're in control at all times. End your session whenever you need to.`,
    gifUrl: '/plunge-tips-05.gif',
  },
];

export const DURATION_MINS_OPTIONS = ['00', '01', '02', '03', '04', '05', '06'];

export const DURATION_SECS_OPTIONS = ['00', '10', '20', '30', '40', '50'];

export const SESSION_MAX_TIME_SECS = 6 * 60;
