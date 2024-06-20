export const ONBOARDING_URLS = [
  '/confirm-email',
  '/member-details',
  '/health-quiz',
  '/waiver',
].map((pathName) => {
  if (!process.env.CANONICAL_URL)
    return `http://localhost:${process.env.PORT}${pathName}`;
  return `${process.env.CANONICAL_URL}${pathName}`;
});

export const APP_PATHNAMES = ['/', '/profile', '/unit']