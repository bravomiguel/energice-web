import { z } from 'zod';

export const userIdSchema = z.string().cuid();

export const authFormSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Not a valid email' })
    .min(1, { message: 'Email is required' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export const memberDetailsFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: 'Must be at least 2 characters' })
    .transform((val) => {
      return val[0].toUpperCase() + val.slice(1).toLowerCase();
    }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: 'Must be at least 2 characters' })
    .transform((val) => {
      return val[0].toUpperCase() + val.slice(1).toLowerCase();
    }),
  dob: z.union([
    z
      .string()
      .trim()
      .min(1, { message: 'Cannot be left blank' })
      .transform((val, ctx) => {
        const dob = new Date(val);

        if (!dob) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Not a valid date',
          });
          return z.NEVER;
        }

        const today = new Date();
        const isDobInFuture =
          Math.ceil((dob.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) >
          0;
        if (isDobInFuture) {
          {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Cannot select a date in the future',
            });
            return z.NEVER;
          }
        }

        const isOver18 =
          Math.ceil(
            (today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24),
          ) >=
          365 * 18;
        if (!isOver18) {
          {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'You must be over 18 to sign up',
            });
            return z.NEVER;
          }
        }

        return dob;
      }),
    z.date(),
  ]),
});
