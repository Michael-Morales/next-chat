import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@lib/prismadb";
import { userSchema } from "@lib/validation/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  if (req.method === "PUT") {
    try {
      const { username } = userSchema.parse(req.body);
      const { id } = req.query;

      const user = await prisma.user.update({
        where: {
          id: id as string,
        },
        data: {
          username,
        },
      });

      return res.status(201).json({
        message: "Username updated",
        user,
      });
    } catch (err: any) {
      res
        .status(500)
        .json({ statusCode: 500, message: "Something went wrong" });
    }
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
