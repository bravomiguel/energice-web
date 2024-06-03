import { Session, Unit } from '@prisma/client';

export type UnitEssentials = Omit<Unit, "id" | "createdAt" | "updatedAt">

export type SessionEssentials = Omit<Session, "id" | "createdAt" | "updatedAt">