import { z } from "zod";

export const userSchema = z.object({
  username: z.string().trim().min(1, { message: "Required" }),
});

export type IUser = z.infer<typeof userSchema>;
