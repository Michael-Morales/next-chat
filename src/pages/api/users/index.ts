import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { username, email } = req.query;

    let user;

    if (username) {
      user = await prisma.user.findUnique({
        where: {
          username: username as string,
        },
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: {
          email: email as string,
        },
      });
    }

    if (!user) return res.status(200).json({ found: false });

    return res.status(200).json({ found: true });
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
