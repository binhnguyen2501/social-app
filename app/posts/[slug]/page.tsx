"use client";

import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { format, parseISO } from "date-fns";

import { CommentType } from "@/app/types/Comment";
import Loading from "../../components/Loading";
import Post from "../Post";
import AddComment from "../AddComment";

import Error from "../../../public/assets/404.png";
import User from "../../../public/assets/user.svg";
import { PostType } from "@/app/types/Post";

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
  const { data: session, status } = useSession();
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
      <div className="flex flex-col gap-6">
        {data?.comments.map((comment: CommentType) => {
          return (
            <div className="bg-white p-8 rounded-xl" key={comment.id}>
              <div className="flex items-center gap-2">
                <Image
                  src={comment.user.image || User}
                  width={40}
                  height={40}
                  alt="avatar"
                  className={classNames("rounded-full", {
                    ["border-2 border-[#e60112] bg-white"]: !comment.user.image,
                  })}
                />
                <div className="font-bold">{comment.user.name}</div>
                <div className="font-normal text-sm text-gray-500">
                  {format(parseISO(comment.createdAt), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
              <div className="mt-4">{comment.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
