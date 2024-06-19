import z from 'zod';

import { Session, Unit } from '@prisma/client';
import {
  authFormSchema,
  emailConfirmCodeSchema,
  healthQuizDataSchema,
  memberDetailsFormSchema,
  pwResetCodeSchema,
} from './validations';

export type UnitEssentials = Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>;

export type SessionEssentials = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;

export type TAuthForm = z.infer<typeof authFormSchema>;

export type TMemberDetailsForm = z.infer<typeof memberDetailsFormSchema>;

export type HealthQuizData = z.infer<typeof healthQuizDataSchema>;

export type EmailConfirmCode = z.infer<typeof emailConfirmCodeSchema>;

export type TPasswordResetForm = z.infer<typeof pwResetCodeSchema>;
