import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "argon2";

import prisma from "../../../lib/prismadb";

import { signUpSchema } from "../../../lib/validation/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { username, email, password, confirmPassword } = signUpSchema.parse(
        req.body
      );

      if (password !== confirmPassword) throw Error("Passwords don't match.");

      const hashedPassword = await hash(password);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
        },
      });

      return res.status(201).json({
        message: "User created",
        user,
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
