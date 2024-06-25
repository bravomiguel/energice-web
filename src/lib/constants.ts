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
    message:
      `Set your plunge timer, and hit start session to begin`,
    gifUrl: '',
  },
  {
    message: `Wait for the plunge to unlock, open the lid and place your phone in the holder`,
    gifUrl: '',
  },
  {
    message: `Take some big breaths for composure... and jump in!`,
    gifUrl: '',
  },
  {
    message: `Start your plunge timer to keep track of progress. You can pause any time.`,
    gifUrl: '',
  },
  {
    message: `Ready to jump out? Just hit end session, and close the lid when you're done`,
    gifUrl: '',
  },
  {
    message: `Note, you can go over your timer but your session will time out after 6 minutes`,
    gifUrl: '',
  },
  {
    message: `Make sure to close the lid when you're done to avoid getting charged twice!`,
    gifUrl: '',
  },
];
