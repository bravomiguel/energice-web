import z from 'zod';

import { Session, Unit } from '@prisma/client';
import { authFormSchema } from './validations';

export type UnitEssentials = Omit<Unit, "id" | "createdAt" | "updatedAt">

export type SessionEssentials = Omit<Session, "id" | "createdAt" | "updatedAt">

export type AuthForm = z.infer<typeof authFormSchema>;