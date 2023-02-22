import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function getAuthPosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: "Please sign in to get auth posts" });
    }
    try {
      const result = await client.user.findUnique({
        where: {
          email: session?.user?.email || "",
        },
        include: {
          posts: {
            orderBy: {
              createdAt: "desc"
            },
            include: {
              comments: true,
              hearts: true
            }
          }
        }
      });
      res.status(200).json({
        message: "Fetch auth post successfully",
        data: result
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error fetching auth posts" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only GET accepted" });
  }
}
