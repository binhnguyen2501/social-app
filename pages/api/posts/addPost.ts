import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function addPost(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, body } = req.body

    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: "Please sign in to make a post" });
    }

    if (title.length > 300) {
      return res.status(403).json({ message: "Please write a shorter post title" });
    }

    const userLoggedIn: any = await client.user.findUnique({
      where: {
        email: session?.user?.email || ""
      }
    })

    try {
      const result = await client.post.create({
        data: {
          title,
          body,
          userId: userLoggedIn?.id
        },
      });
      res.status(200).json({
        message: "Create post successfully",
        data: result
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Create a post fail" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only POST accepted" });
  }
}