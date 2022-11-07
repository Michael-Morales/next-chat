import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1),
});

export type IChatMessage = z.infer<typeof chatMessageSchema>;
