"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();

  if (status === "unauthenticated") {
    redirect("/sign-in");
  }

  return <div className="mx-4 md:mx-20 xl:mx-70">main posts page</div>;
}
