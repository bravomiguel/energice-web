import { z } from 'zod';

export const userIdSchema = z.string().cuid();

export const authFormSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email({message: "Not a valid email"})
      .min(1, { message: 'Email is required' }),
    password: z
      .string()
      .trim()
      .min(8, { message: 'Password must be at least 8 characters' }),
  })
  // .transform((data) => ({
  //   ...data,
  //   imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
  // }));

export type TAuthForm = z.infer<typeof authFormSchema>;
