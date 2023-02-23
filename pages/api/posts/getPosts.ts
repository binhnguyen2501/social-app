import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";
import runMiddleware, { cors } from "../cors";

export default async function getPosts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  if (req.method === "GET") {
    try {
      const result = await client.post.findMany({
        include: {
          user: true,
          comments: true,
          hearts: true
        },
        orderBy: {
          createdAt: "desc"
        }
      })
      res.status(200).json({
        message: "Fetch post successfully",
        data: result,
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Error fetching posts" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only GET accepted" });
  }
}
