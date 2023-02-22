"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { toast } from "react-hot-toast";

import Button from "../components/Button";

import styles from "../components/AuthLayout/AuthLayout.module.scss";

interface IFormData {
  postId: string;
  comment: string;
}

interface IProps {
  postId: string;
}

export default function AddComment({ postId }: IProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<IFormData>();
  let toastPostID: string;
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: IFormData) =>
      await axios.post("/api/comments/addComment", data),
    onError(error: any) {
      toast.error(error.response.data.message, {
        id: toastPostID,
      });
    },
    onSuccess(res) {
      toast.success(res.data.message, {
        id: toastPostID,
      });
      queryClient.invalidateQueries({
        queryKey: ["post-detail"],
      });
      reset();
    },
  });

  const onSubmit = handleSubmit((data) => {
    const dataForm = {
      comment: data.comment,
      postId,
    };
    toastPostID = toast.loading("Adding your comment", {
      id: toastPostID,
    });
    mutate(dataForm);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 bg-white lg:p-8 p-6 rounded-xl"
    >
      <div className="flex flex-col gap-1">
        <div className={styles.form_item_vertical}>
          <textarea
            {...register("comment", {
              required: "Comment is required",
              maxLength: 300,
            })}
            rows={10}
            className={classNames("bg-gray-100", styles.form_input, {
              [styles.form_input_error]: errors.comment,
            })}
            placeholder="What's your comment?"
          />
        </div>
        <div
          className={classNames("text-sm font-semibold", {
            ["text-red-500"]: watch("comment")?.length > 300,
          })}
        >{`${watch("comment")?.length ? watch("comment").length : 0}/300`}</div>
        {errors.comment && (
          <span className="text-red-500 text-xs text-left">
            {errors.comment.message}
          </span>
        )}
      </div>
      <div className="flex justify-end">
        <Button
          variant="basic"
          type="submit"
          disabled={isLoading}
          width="max-content"
        >
          {isLoading ? "Loading..." : "Add Comment"}
        </Button>
      </div>
    </form>
  );
}
