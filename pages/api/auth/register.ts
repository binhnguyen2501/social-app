import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/prisma/client";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!req.body) {
      return res.status(404).json({ message: "Empty register data" });
    }

    const exists = await client.user.count({
      where: {
        email: req.body.email,
      },
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "User already exists with that email" });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await client.user.create({
        data: {
          name: name,
          email: email,
          emailVerified: null,
          password: passwordHash,
        },
      });
      res.status(200).json({
        message: "Register successfully",
        data: {
          id: newUser.id,
          name,
          email,
        },
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Register fail" });
    }
  } else {
    res
      .status(500)
      .json({ message: "HTTP method not valid only POST accepted" });
  }
}
