import React from "react";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames";

import { CommentType } from "../types/Comment";

import User from "../../public/assets/user.svg";

interface IProps {
  id: string;
  avatar: string | null;
  name: string;
  title: string;
  body: string;
  comments: CommentType[];
  isAuth?: boolean;
}

export default function Posts({
  id,
  avatar,
  name,
  title,
  body,
  comments,
  isAuth = false,
}: IProps) {
  return (
    <div className="bg-white p-8 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src={avatar || User}
            width={50}
            height={50}
            alt="avatar"
            className={classNames("rounded-full", {
              ["border-2 border-[#e60112] bg-white"]: !avatar,
            })}
          />
          <h3 className="font-bold text-gray-700 text-lg">{name}</h3>
        </div>
        {isAuth && (
          <div className="flex gap-3">
            <div className="text-sm font-bold text-gray-500 cursor-pointer">
              Edit
            </div>
            <div className="text-sm font-bold text-[#e60112] cursor-pointer">
              Delete
            </div>
          </div>
        )}
      </div>
      <div className="my-8 flex flex-col gap-2">
        <div className="text-lg font-semibold text-gray-600">{title}</div>
        <div className="text-base font-normal">{body}</div>
      </div>
      <Link href={`${isAuth ? "/dashboard" : `posts/${id}`}`}>
        <p className="text-sm text-gray-700 font-bold">
          {comments?.length} Comments
        </p>
      </Link>
    </div>
  );
}
