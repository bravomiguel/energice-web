import z from 'zod';

import { Session, Unit } from '@prisma/client';
import {
  signupSchema,
  healthQuizDataSchema,
  memberDetailsSchema,
  signinSchema,
  phoneOtpSchema,
  phoneConfirmSchema,
} from './validations';

export type UnitEssentials = Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>;

export type SessionEssentials = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;

export type TSignupForm = z.infer<typeof signupSchema>;

export type TPhoneOtpForm = z.infer<typeof phoneOtpSchema>;

export type TPhoneConfirmForm = z.infer<typeof phoneConfirmSchema>;

export type TSigninForm = z.infer<typeof signinSchema>;

export type TMemberDetailsForm = z.infer<typeof memberDetailsSchema>;
