import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { username } = req.query;

    const user = await prisma.user.findUnique({
      where: {
        username: username as string,
      },
    });

    if (!user) return res.status(404).json({ statusCode: 404 });

    return res.status(200).json({ statusCode: 200 });
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
