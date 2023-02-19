import React from "react";
import Link from "next/link";
import UserInfo from "./UserInfo";
// import client from "../../prisma/client";

export default function Header() {
  // const test = async () => {
  //   await client.$connect();
  //   try {
  //     // ... you will write your Prisma Client queries here
  //     const allUser = await client.user.findMany();
  //     const allAccount = await client.account.findMany();
  //     const session = await client.session.findMany();
  //     console.log("allUser: ", allUser);
  //     console.log("allAccount: ", allAccount);
  //     console.log("session: ", session);
  //   } catch (e) {
  //     console.error(e);
  //     await client.$disconnect();
  //     process.exit(1);
  //   } finally {
  //     await client.$disconnect();
  //   }
  // };
  // test();

  return (
    <div className="flex justify-between items-center py-8 mx-4 md:mx-20 xl:mx-70">
      <Link href={"/"}>
        <h1 className="font-bold text-3xl cursor-pointer">SentIt.</h1>
      </Link>
      <UserInfo />
    </div>
  );
}
