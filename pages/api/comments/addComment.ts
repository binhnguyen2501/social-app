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
    return res.status(401).json({ message: "Please sign in to make a comment" });
  }

  if (req.method === "POST") {
    const { postId, comment } = req.body

    const userLoggedIn: any = await client.user.findUnique({
      where: {
        email: session?.user?.email || ""
      }
    })

    try {
      const result = await client.comment.create({
        data: {
          message: comment,
          postId,
          userId: userLoggedIn.id
        }
      });
      res.status(200).json({
        message: "Create comment successfully",
        data: result
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Create a comment fail" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only POST accepted" });
  }
}
