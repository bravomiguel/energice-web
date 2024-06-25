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
    message: `The timer is completely optional. You're in control of your plunge, and can exit when you want`,
    gifUrl: '',
  },
  {
    message: `You can go over the timer, just note your session will time-out after 6 minutes`,
    gifUrl: '',
  },
];
