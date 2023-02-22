import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";

export default async function postDetail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const result = await client.post.findUnique({
        where: {
          id: req?.query?.details as string
        },
        include: {
          user: true,
          comments: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              user: true
            }
          }
        }
      })
      res.status(200).json({
        message: "Get post detail successfully",
        data: result
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Get post detail fail" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only GET accepted" });
  }
}