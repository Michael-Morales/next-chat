import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "argon2";

import prisma from "@/lib/prismadb";
import { signUpSchema } from "@/lib/validation/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { username, email, password } = await signUpSchema.parseAsync(
        req.body
      );

      const hashedPassword = await hash(password);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      return res.status(201).json({
        message: "User created",
        user,
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ statusCode: 500, message: "Something went wrong" });
    }
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
