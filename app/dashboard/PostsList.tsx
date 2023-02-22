"use client";

import React from "react";
import Image from "next/image";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AuthPostType } from "../types/AuthPost";

import Post from "../posts/Post";
import Loading from "../components/Loading";

import Error from "../../public/assets/404.png";

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
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src={Error} alt="404" />
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-6">
      {data?.posts.length === 0 ? (
        <div>Post something news!</div>
      ) : (
        data?.posts.map((post: any) => (
          <Post
            key={post.id}
            id={post.id}
            name={data.name}
            avatar={data.image}
            title={post.title}
            body={post.body}
            comments={post.comments}
            hearts={post.hearts}
            isAuth
          />
        ))
      )}
    </div>
  );
}
