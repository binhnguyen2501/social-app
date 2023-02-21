import React from "react";
import Link from "next/link";
import UserInfo from "./UserInfo";

export default function Header() {
  return (
    <div className="flex justify-between items-center py-8 mx-4 md:mx-20 xl:mx-80">
      <Link href={"/"}>
        <h1 className="font-bold text-3xl cursor-pointer">SentIt.</h1>
      </Link>
      <UserInfo />
    </div>
  );
}
