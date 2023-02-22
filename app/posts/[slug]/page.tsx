"use client";

import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { PostType } from "@/app/types/Post";
import Post from "../Post";
import Loading from "../../components/Loading";
import AddComment from "../AddComment";
import CommentList from "./CommentList";

import Error from "../../../public/assets/404.png";

interface IProps {
  params: {
    slug: string;
  };
}

const getPostDetail = async (slug: string) => {
  const res = await axios.get(`/api/posts/${slug}`);
  return res.data.data;
};

export default function PostDetail(url: IProps) {
  const { status } = useSession();
  const { data, error, isLoading } = useQuery<PostType>({
    queryFn: () => getPostDetail(url.params.slug),
    queryKey: ["post-detail"],
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src={Error} alt="404" />
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (status === "unauthenticated") {
    redirect("/sign-in");
  }

  return (
    <div className="mx-4 md:mx-20 xl:mx-80 flex flex-col gap-6 mb-7">
      <Post
        key={data?.id}
        id={data?.id || ""}
        name={data?.user.name || ""}
        avatar={data?.user.image || ""}
        title={data?.title || ""}
        body={data?.body || ""}
        comments={data?.comments || []}
        isAuth
        isDetail
      />
      <AddComment postId={data?.id || ""} />
      <CommentList comments={data?.comments || []} />
    </div>
  );
}
