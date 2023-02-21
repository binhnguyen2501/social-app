import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function deletePost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: "Please sign in to delete a post" });
    }

    try {
      const postId = req.body
      const result = await client.post.delete({
        where: {
          id: postId
        }
      })
      res.status(200).json({
        message: "Delete post successfully",
        data: result
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Delete post fail" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only POST accepted" });
  }
}
