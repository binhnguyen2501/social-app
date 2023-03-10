"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import PostsList from "./PostsList";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-6 mx-4 md:mx-20 xl:mx-80 mb-7">
      <div className="text-xl font-bold">
        Welcome back {session?.user?.name}!
      </div>
      <PostsList />
    </div>
  );
}
