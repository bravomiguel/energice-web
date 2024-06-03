import { z } from "zod";

import { DEFAULT_PET_IMAGE } from "./constants";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z.object({
  name: z.string().trim().min(1, {message: "Name is required"}).max(100, "Must be less than 100 characters"),
  ownerName: z.string().trim().min(1, {message: "Owner name is required"}).max(100, "Must be less than 100 characters"),
  imageUrl: z.union([z.literal(''), z.string().trim().url({message: "Image url must be a valid url"})]),
  age: z.coerce.number().int().positive({message: "Age must be greater than zero"}).max(99999),
  notes: z.union([z.literal(""), z.string().trim().max(1000, "Must be less than 1000 characters")]),
}).transform((data) => ({
  ...data,
  imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
}))

export type TPetForm = z.infer<typeof petFormSchema>;