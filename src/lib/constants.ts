export const ONBOARDING_PATHNAMES = [
  '/confirm-email',
  '/member-details',
  '/health-quiz',
  '/waiver',
];

export const RESET_PW_PATHNAME = '/reset-password';

export const ONBOARDING_URLS = ONBOARDING_PATHNAMES.map((pathName) => {
  if (!process.env.CANONICAL_URL)
    return `http://localhost:${process.env.PORT}${pathName}`;
  return `${process.env.CANONICAL_URL}${pathName}`;
});

export const APP_PATHNAMES = ['/', '/profile', '/unit'];

export const PLUNGE_TIME_INFO_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message:
      `The plunge timer is there to help you track your progress, and have a goal to aim for`,
    gifUrl: '',
  },
  {
    message: `The timer is completely optional. You're in control and can exit when you want`,
    gifUrl: '',
  },
  {
    message: `You can go over the timer, just note your session will time-out after 6 minutes`,
    gifUrl: '',
  },
];

export const HOW_IT_WORKS_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `Set your timer & start a new session to unlock the plunge`,
    gifUrl: '',
  },
  {
    message: `Get ready. Open the lid & place your phone in the holder`,
    gifUrl: '',
  },
  {
    message: `It's plunge time. Take some big breaths & jump in!`,
    gifUrl: '',
  },
  {
    message: `Use the timer to keep track of your plunge progress`,
    gifUrl: '',
  },
  {
    message: `Done? End your session, jump out & close the lid behind you`,
    gifUrl: '',
  },
  {
    message: `You did it! Enjoy feeling great for the rest of the day`,
    gifUrl: '',
  },
];

export const PLUNGE_TIPS_ARRAY: {
  message: React.ReactNode;
  gifUrl: string;
}[] = [
  {
    message: `Breathing is key. Prep for your plunge with 5-10 big breaths`,
    gifUrl: '',
  },
  {
    message: `Ready? Breathe in. Hold. Breathe out as you smoothly get in`,
    gifUrl: '',
  },
  {
    message: `The first 30s are a shock. Slow your breath as much as you can`,
    gifUrl: '',
  },
  {
    message: `Release any tension in your body. More relaxed = more benefits`,
    gifUrl: '',
  },
  {
    message: `You're in full control. End your session whenever you need to`,
    gifUrl: '',
  },
];
