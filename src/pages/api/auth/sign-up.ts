import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "argon2";

import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (!username || !email || !password || !password) {
        throw new Error("empty_field");
      }

      let user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (user) {
        throw new Error("email_already_exists");
      }

      user = await prisma.user.findUnique({
        where: { username },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (user) {
        throw new Error("username_already_exists");
      }

      if (password !== confirmPassword) throw new Error("no_match");

      const hashedPassword = await hash(password);

      user = await prisma.user.create({
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
      return res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
