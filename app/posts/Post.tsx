import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { AiFillHeart } from "react-icons/ai";
import { useSession } from "next-auth/react";

import { HeartType } from "../types/Heart";
import { CommentType } from "../types/Comment";
import Modal from "../components/Modal";

import User from "../../public/assets/user.svg";

import styles from "../components/AuthLayout/AuthLayout.module.scss";

interface IFormData {
  id: string;
  title: string;
  body: string;
}

interface IProps {
  id: string;
  avatar: string | null;
  name: string;
  title: string;
  body: string;
  comments: CommentType[];
  hearts: HeartType[];
  isAuth?: boolean;
  isDetail?: boolean;
}

export default function Posts({
  id,
  avatar,
  name,
  title,
  body,
  comments,
  hearts,
  isAuth = false,
  isDetail = false,
}: IProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  let toastPostID: string;
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<IFormData>({
    defaultValues: {
      title,
      body,
    },
  });

  useEffect(() => {
    if (openDeleteModal || openEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openDeleteModal, openEditModal]);

  useEffect(() => {
    if (
      hearts.length &&
      hearts.some(function (el) {
        return el.userEmail === session?.user?.email;
      })
    ) {
      setLiked(true);
    }
  }, [session, hearts]);

  const deletePost = useMutation({
    mutationFn: async (id: string) =>
      await axios.delete("/api/posts/deletePost", { data: id }),
    onError(error: any) {
      toast.error(error.response.data.message, {
        id: toastPostID,
      });
    },
    onSuccess(res) {
      toast.success(res.data.message, {
        id: toastPostID,
      });
      setOpenDeleteModal(false);
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["auth-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["post-detail"],
      });
    },
  });

  const editPost = useMutation({
    mutationFn: async (data: IFormData) =>
      await axios.put("/api/posts/editPost", data),
    onError(error: any) {
      toast.error(error.response.data.message, {
        id: toastPostID,
      });
    },
    onSuccess(res) {
      toast.success(res.data.message, {
        id: toastPostID,
      });
      setOpenEditModal(false);
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["auth-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["post-detail"],
      });
      reset();
    },
  });

  const togglePost = useMutation({
    mutationFn: async () =>
      await axios.post("/api/posts/toggleLike", {
        postId: id,
      }),
    onError: (error: any) => {
      toast.error(error.response.data.message, {
        id: toastPostID,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["auth-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["post-detail"],
      });
      if (data.status === 201) setLiked(true);
      if (data.status === 200) setLiked(false);
    },
  });

  const onSubmit = handleSubmit((data) => {
    const dataForm = {
      id,
      title: data.title,
      body: data.body,
    };
    toastPostID = toast.loading("Updating your post", {
      id: toastPostID,
    });
    editPost.mutate(dataForm);
  });

  const handleDelete = () => {
    toastPostID = toast.loading("Deleting your post", {
      id: toastPostID,
    });
    deletePost.mutate(id);
  };

  return (
    <React.Fragment>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ ease: "easeOut" }}
        className="bg-white p-8 rounded-lg"
      >
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
          {isAuth && !isDetail && (
            <div className="flex gap-3">
              <div
                className="text-sm font-bold text-gray-500 cursor-pointer"
                onClick={() => setOpenEditModal(true)}
              >
                Edit
              </div>
              <div
                className="text-sm font-bold text-[#e60112] cursor-pointer"
                onClick={() => setOpenDeleteModal(true)}
              >
                Delete
              </div>
            </div>
          )}
        </div>
        <div className="my-8 flex flex-col gap-2">
          <div className="text-lg font-semibold text-gray-600">{title}</div>
          <div className="text-base font-normal">{body}</div>
        </div>
        <div className="flex items-center gap-4">
          {isAuth ? (
            <p className="text-sm text-gray-700 font-bold w-max">
              {comments?.length} Comments
            </p>
          ) : (
            <Link href={`posts/${id}`}>
              <p className="text-sm text-gray-700 font-bold w-max">
                {comments?.length} Comments
              </p>
            </Link>
          )}
          <div
            onClick={() => togglePost.mutate()}
            className={`text-sm font-bold flex items-center gap-1 ${
              liked ? "text-red-700" : "text-gray-700"
            }`}
          >
            {hearts?.length}
            <AiFillHeart className="text-2xl cursor-pointer" />
          </div>
        </div>
      </motion.div>
      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {openDeleteModal && (
          <Modal closeModal={() => setOpenDeleteModal(false)} title="Delete">
            <div className="flex flex-col gap-5 mt-4">
              <div className="text-sm">
                Are you sure you want to delete this post?
              </div>
              <div className="flex justify-end space-x-3">
                <motion.button
                  className="px-3 py-1 hover:text-red-600 rounded-lg"
                  onClick={() => setOpenDeleteModal(false)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="px-3 py-1 bg-[#EF4638] hover:bg-red-600 text-white rounded-lg"
                  onClick={handleDelete}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Delete Post
                </motion.button>
              </div>
            </div>
          </Modal>
        )}
        {openEditModal && (
          <Modal closeModal={() => setOpenEditModal(false)} title="Edit">
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-4 mt-4 md:w-[500px] w-[300px]"
            >
              <div className="flex flex-col gap-1">
                <div className={styles.form_item_vertical}>
                  <input
                    {...register("title", {
                      required: "Title is required",
                    })}
                    type="text"
                    className={classNames("bg-gray-100", styles.form_input, {
                      [styles.form_input_error]: errors.title,
                    })}
                    placeholder="what's your title?"
                  />
                </div>
                {errors.title && (
                  <span className="text-red-500 text-xs text-left">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <div className={styles.form_item_vertical}>
                  <textarea
                    {...register("body", {
                      required: "Body is required",
                      maxLength: 300,
                    })}
                    rows={10}
                    className={classNames("bg-gray-100", styles.form_input, {
                      [styles.form_input_error]: errors.body,
                    })}
                    placeholder="What's on your mind?"
                  />
                </div>
                <div
                  className={classNames("text-sm font-semibold", {
                    ["text-red-500"]:
                      watch("body")?.length > 300 || errors.body,
                  })}
                >{`${
                  watch("body")?.length ? watch("body").length : 0
                }/300`}</div>
                {errors.body && (
                  <span className="text-red-500 text-xs text-left">
                    {errors.body.message}
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <motion.button
                  className="px-3 py-1 hover:text-red-600 rounded-lg"
                  onClick={() => setOpenEditModal(false)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="px-3 py-1 bg-[#EF4638] hover:bg-red-600 text-white rounded-lg"
                  type="submit"
                  disabled={editPost.isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {editPost.isLoading ? "Loading..." : "Edit Post"}
                </motion.button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
