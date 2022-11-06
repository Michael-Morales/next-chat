import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, { message: "Required" }).email(),
  password: z
    .string()
    .min(6, { message: "Must be at least 6 characters long" }),
});

export const signUpSchema = signInSchema
  .extend({
    username: z
      .string()
      .min(3, { message: "Must be at least 3 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Must be at least 6 characters long" }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  })
  .refine(
    async ({ username }) => {
      const res = await (await fetch(`/api/users/${username}`)).json();

      return res.statusCode === 404;
    },
    { message: "Username already exists", path: ["username"] }
  )
  .refine(
    async ({ email }) => {
      const res = await (await fetch(`/api/users/${email}`)).json();

      return res.statusCode === 404;
    },
    { message: "Email already exists", path: ["email"] }
  );

export type ISignIn = z.infer<typeof signInSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
