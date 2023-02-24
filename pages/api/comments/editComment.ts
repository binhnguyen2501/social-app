import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: "Please sign in to update a comment" });
  }

  if (req.method === "PUT") {
    const { id, message } = req.body

    try {
      const result = await client.comment.update({
        where: {
          id
        },
        data: {
          message,
        }
      });
      res.status(200).json({
        message: "Update comment successfully",
        data: result
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Update comment fail" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only PUT accepted" });
  }
}
