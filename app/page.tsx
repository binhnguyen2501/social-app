"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { PostType } from "./types/Post";
import AddPost from "./posts/AddPost";
import Post from "./posts/Post";

const getPosts = async () => {
  const res = await axios.get("/api/posts/getPosts");
  return res.data.data;
};

export default function Home() {
  const { status } = useSession();
  const { data, error, isLoading } = useQuery<PostType[]>({
    queryFn: getPosts,
    queryKey: ["posts"],
  });

  if (error) {
    return <div>error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect("/sign-in");
  }

  return (
    <div className="mx-4 md:mx-20 xl:mx-80 flex flex-col gap-6 mb-7">
      <AddPost />
      {data?.map((post: PostType) => (
        <Post
          key={post.id}
          id={post.id}
          name={post.user.name}
          title={post.title}
          body={post.body}
          avatar={post.user.image}
          comments={post.comments}
        />
      ))}
    </div>
  );
}
