import { NextApiRequest, NextApiResponse } from "next";
import Ably from "ably/promises";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "@api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "You must be logged in" });
  }

  const client = new Ably.Realtime({
    key: process.env.ABLY_API_KEY,
  });

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: session.user.username,
  });

  return res.status(200).json(tokenRequestData);
}
