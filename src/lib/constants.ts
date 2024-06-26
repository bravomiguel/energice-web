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
    message: `Set your plunge timer, start your session, and unlock the plunge`,
    gifUrl: '',
  },
  {
    message: `Get ready. Open the lid, and place your phone in the holder`,
    gifUrl: '',
  },
  {
    message: `It's plunge time. Take some big breaths, and jump in!`,
    gifUrl: '',
  },
  {
    message: `Use the timer to keep track of your plunge progress`,
    gifUrl: '',
  },
  {
    message: `Ready to get out? End your session, and close the lid when done`,
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
    message: `Breathing is key. Prep for your plunge with a few big breaths`,
    gifUrl: '',
  },
  {
    message: `Ready? Breathe in. Hold. Get in smoothly as you breathe out`,
    gifUrl: '',
  },
  {
    message: `The first 30 secs can be a shock. Breathe through it as slowly as possible`,
    gifUrl: '',
  },
  {
    message: `Release any tension in your body. The more relaxed, the better`,
    gifUrl: '',
  },
  {
    message: `You're in control. End your session and get out the moment you're ready`,
    gifUrl: '',
  },
];
