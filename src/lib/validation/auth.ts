import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signUpSchema = signInSchema.extend({
  username: z.string(),
});

export type ISignIn = z.infer<typeof signInSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
