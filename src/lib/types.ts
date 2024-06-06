import z from 'zod';

import { Session, Unit } from '@prisma/client';
import { authFormSchema, memberDetailsFormSchema } from './validations';

export type UnitEssentials = Omit<Unit, "id" | "createdAt" | "updatedAt">

export type SessionEssentials = Omit<Session, "id" | "createdAt" | "updatedAt">

export type TAuthForm = z.infer<typeof authFormSchema>;

export type TMemberDetailsForm = z.infer<typeof memberDetailsFormSchema>;