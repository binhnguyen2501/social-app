"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import classNames from "classnames";

import Button from "../components/Button";
import User from "../../public/assets/user.svg";

export default function UserInfo() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="cursor-pointer" onClick={() => router.push("/dashboard")}>
        <Image
          src={session?.user?.image || User}
          alt={session?.user?.name || ""}
          width={session?.user?.image ? 50 : 40}
          height={session?.user?.image ? 50 : 40}
          className={classNames("rounded-full", {
            ["border-2 border-[#e60112] bg-white"]: !session?.user?.image,
          })}
        />
      </div>
      <Button width={60} onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}
