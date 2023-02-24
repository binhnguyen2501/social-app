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
    return res.status(401).json({ message: "Please sign in to update a post" });
  }

  if (req.method === "PUT") {
    const { id, title, body } = req.body

    if (title.length > 300) {
      return res.status(403).json({ message: "Please write a shorter post title" });
    }

    try {
      const result = await client.post.update({
        where: {
          id
        },
        data: {
          title,
          body
        }
      });
      res.status(200).json({
        message: "Update post successfully",
        data: result
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Update post fail" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only PUT accepted" });
  }
}