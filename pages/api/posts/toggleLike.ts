import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function toggleLike(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: "Please sign in to make a post" });
    }

    const userLoggedIn: any = await client.user.findUnique({
      where: {
        email: session?.user?.email || ""
      }
    })

    //check to see if post was liked by user
    const heart = await client.heart.findFirst({
      where: {
        userEmail: userLoggedIn.email,
        postId: req.body.postId,
        userId: userLoggedIn.id,
      },
    })

    try {
      if (!heart) {
        const result = await client.heart.create({
          data: {
            userEmail: userLoggedIn.email,
            postId: req.body.postId,
            userId: userLoggedIn.id,
          },
        })
        res.status(201).json({
          message: "User liked post",
          data: result
        });
      } else {
        const result = await client.heart.delete({
          where: {
            id: heart.id,
          },
        })
        res.status(200).json({
          message: "User unlike post",
          data: result
        });
      }
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Reaction a post fail" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only POST accepted" });
  }
}
