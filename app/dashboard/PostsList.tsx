"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AuthPostType } from "../types/AuthPost";

import Post from "../posts/Post";

const getAuthPosts = async () => {
  const res = await axios.get("/api/posts/getAuthPosts");
  return res.data.data;
};

export default function PostsList() {
  const { data, error, isLoading } = useQuery<AuthPostType>({
    queryFn: getAuthPosts,
    queryKey: ["auth-posts"],
  });

  if (error) {
    return <div>error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log("auth posts: ", data);

  return (
    <div className="flex flex-col gap-6">
      {data?.posts.map((post: any) => (
        <Post
          key={post.id}
          id={post.id}
          name={data.name}
          avatar={data.image}
          title={post.title}
          body={post.body}
          comments={post.comments}
          isAuth
        />
      ))}
    </div>
  );
}
