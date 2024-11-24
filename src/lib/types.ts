import z from 'zod';

import { Session, Unit } from '@prisma/client';
import {
  signinSchema,
  memberDetailsSchema,
  phoneOtpSchema,
  PartnerMemberSchema,
} from './validations';

export type UnitEssentials = Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>;

export type SessionEssentials = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;

export type TSigninForm = z.infer<typeof signinSchema>;

export type TPhoneOtpForm = z.infer<typeof phoneOtpSchema>;

export type TMemberDetailsForm = z.infer<typeof memberDetailsSchema>;

export type TPartnerMemberForm = z.infer<typeof PartnerMemberSchema>;
