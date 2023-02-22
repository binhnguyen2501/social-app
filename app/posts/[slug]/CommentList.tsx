"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";
import classNames from "classnames";
import { format, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

import { CommentType } from "../../types/Comment";
import Modal from "../../components/Modal";

import User from "../../../public/assets/user.svg";

import styles from "../../components/AuthLayout/AuthLayout.module.scss";

interface IProps {
  comments: CommentType[];
}

interface IFormData {
  id: string;
  message: string;
}

export default function CommentList({ comments }: IProps) {
  const { data: session } = useSession();
  const [selectedComment, setSelectedComment] = useState<string>("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  let toastPostID: string;
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IFormData>();

  useEffect(() => {
    if (openDeleteModal || openEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openDeleteModal, openEditModal]);

  const deleteComment = useMutation({
    mutationFn: async (id: string) =>
      await axios.delete("/api/comments/deleteComment", { data: id }),
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
      setSelectedComment("");
      queryClient.invalidateQueries({
        queryKey: ["post-detail"],
      });
    },
  });

  const editComment = useMutation({
    mutationFn: async (data: IFormData) =>
      await axios.put("/api/comments/editComment", data),
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
      setSelectedComment("");
      queryClient.invalidateQueries({
        queryKey: ["post-detail"],
      });
      reset();
    },
  });

  const onSubmit = handleSubmit((data) => {
    const dataForm = {
      id: selectedComment,
      message: data.message,
    };
    toastPostID = toast.loading("Updating your comment", {
      id: toastPostID,
    });
    editComment.mutate(dataForm);
  });

  const handleDelete = () => {
    toastPostID = toast.loading("Deleting your comment", {
      id: toastPostID,
    });
    deleteComment.mutate(selectedComment);
  };

  return (
    <React.Fragment>
      <div className="flex flex-col gap-6">
        {comments.map((comment: CommentType) => {
          return (
            <div className="bg-white p-8 rounded-xl" key={comment.id}>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={comment.user.image || User}
                    width={40}
                    height={40}
                    alt="avatar"
                    className={classNames("rounded-full", {
                      ["border-2 border-[#e60112] bg-white"]:
                        !comment.user.image,
                    })}
                  />
                  <div className="flex md:items-center items-start md:flex-row flex-col md:gap-2 gap-0">
                    <div className="font-bold">{comment.user.name}</div>
                    <div className="font-normal text-sm text-gray-500">
                      {format(parseISO(comment.createdAt), "dd/MM/yyyy HH:mm")}
                    </div>
                  </div>
                </div>
                {session?.user?.email === comment.user.email && (
                  <div className="flex gap-3">
                    <div
                      className="text-sm font-bold text-gray-500 cursor-pointer"
                      onClick={() => {
                        setOpenEditModal(true);
                        setSelectedComment(comment.id);
                        setValue("message", comment.message);
                      }}
                    >
                      Edit
                    </div>
                    <div
                      className="text-sm font-bold text-[#e60112] cursor-pointer"
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setSelectedComment(comment.id);
                      }}
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">{comment.message}</div>
            </div>
          );
        })}
      </div>
      <AnimatePresence initial={false} exitBeforeEnter={true}>
        {openDeleteModal && (
          <Modal closeModal={() => setOpenDeleteModal(false)} title="Delete">
            <div className="flex flex-col gap-5 mt-4">
              <div className="text-sm">
                Are you sure you want to delete this comment?
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
                  Delete Comment
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
                  <textarea
                    {...register("message", {
                      required: "Comment is required",
                      maxLength: 300,
                    })}
                    rows={10}
                    className={classNames("bg-gray-100", styles.form_input, {
                      [styles.form_input_error]: errors.message,
                    })}
                    placeholder="What's do your wanna comment?"
                  />
                </div>
                <div
                  className={classNames("text-sm font-semibold", {
                    ["text-red-500"]:
                      watch("message")?.length > 300 || errors.message,
                  })}
                >{`${
                  watch("message")?.length ? watch("message").length : 0
                }/300`}</div>
                {errors.message && (
                  <span className="text-red-500 text-xs text-left">
                    {errors.message.message}
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
                  disabled={editComment.isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {editComment.isLoading ? "Loading..." : "Edit Comment"}
                </motion.button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
