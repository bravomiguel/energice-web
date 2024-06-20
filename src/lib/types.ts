import z from 'zod';

import { Session, Unit } from '@prisma/client';
import {
  signupSchema,
  emailConfirmCodeSchema,
  healthQuizDataSchema,
  memberDetailsSchema,
  pwResetCodeSchema,
  signinSchema,
} from './validations';

export type UnitEssentials = Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>;

export type SessionEssentials = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;

export type TSignupForm = z.infer<typeof signupSchema>;

export type TSigninForm = z.infer<typeof signinSchema>;

export type TMemberDetailsForm = z.infer<typeof memberDetailsSchema>;

export type HealthQuizData = z.infer<typeof healthQuizDataSchema>;

export type EmailConfirmCode = z.infer<typeof emailConfirmCodeSchema>;

export type TPasswordResetForm = z.infer<typeof pwResetCodeSchema>;
