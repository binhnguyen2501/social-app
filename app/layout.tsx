import React, { ReactNode } from "react";
import { Roboto } from "@next/font/google";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import AuthProvider from "../utils/AuthProvider";
import QueryProvider from "../utils/QueryProvider";
import Header from "./header";

import "./globals.css";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
});

interface IRootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: IRootLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head />
      <body className={`${roboto.variable} bg-gray-200`}>
        <AuthProvider session={session}>
          <QueryProvider>
            <Header />
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
