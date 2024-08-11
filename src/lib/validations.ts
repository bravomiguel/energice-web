import { z } from 'zod';

export const userIdSchema = z.string().cuid();

export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Not a valid email' })
    .min(1, { message: 'Email is required' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters' }),
  passwordConfirm: z.string().trim(),
});

export const signupSchemaPwConfirm = signupSchema.refine(
  (data) => data.passwordConfirm === data.password,
  {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  },
);

export const signinSchema = z.object({
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

export const memberDetailsSchema = z.object({
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

        // const isOver18 =
        //   Math.ceil(
        //     (today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24),
        //   ) >=
        //   365 * 18;
        // if (!isOver18) {
        //   {
        //     ctx.addIssue({
        //       code: z.ZodIssueCode.custom,
        //       message: 'You must be over 18 to sign up',
        //     });
        //     return z.NEVER;
        //   }
        // }

        return dob;
      }),
    z.date(),
  ]),
});

export const healthQuizDataSchema = z.array(
  z.object({
    id: z.number(),
    question: z.string().trim().min(1),
    answer: z.union([z.null(), z.boolean()]),
  }),
);

export const plungeTimerSecsSchema = z.union([
  z
    .string()
    .trim()
    .min(1, { message: 'Cannot be left blank' })
    .regex(/^(0[0-9]|[1-5][0-9]):([0-5][0-9])$/, {
      message: 'Invalid time format',
    })
    .transform((val, ctx) => {
      const [minutes, seconds] = val.split(':').map(Number);
      const timerSecs = minutes * 60 + seconds;

      if (!timerSecs && timerSecs !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Not a valid time',
        });
        return z.NEVER;
      }

      if (timerSecs === 0) {
        {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Timer cannot be zero',
          });
          return z.NEVER;
        }
      }

      if (timerSecs > 60 * 6) {
        {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Max time is 6 mins',
          });
          return z.NEVER;
        }
      }

      return timerSecs;
    }),
  z.number(),
]);

export const waiverDataSchema = z.object({
  waiverSigName: z.string().regex(/^[a-zA-Z]{2,} [a-zA-Z]+(?: [a-zA-Z]*)*$/),
});

export const emailConfirmCodeSchema = z.object({
  eConfCode: z.string().trim().length(6, { message: 'Code is 6 digits long' }),
});

export const pwResetCodeSchema = z.object({
  pwResetCode: z
    .string()
    .trim()
    .length(6, { message: 'Code is 6 digits long' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Not a valid email' })
    .min(1, { message: 'Email is required' }),
  newPassword: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters' }),
  newPasswordConfirm: z.string().trim(),
});

export const pwResetCodeSchemaPwConfirm = pwResetCodeSchema.refine(
  (data) => data.newPasswordConfirm === data.newPassword,
  {
    message: 'Passwords do not match',
    path: ['newPasswordConfirm'],
  },
);
