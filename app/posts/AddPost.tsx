"use client";

import React from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

import Button from "../components/Button";

import styles from "../components/AuthLayout/AuthLayout.module.scss";

interface IFormData {
  title: string;
  body: string;
}

export default function AddPost() {
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
      await axios.post("/api/posts/addPost", data),
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
        queryKey: ["posts"],
      });
      reset();
    },
  });

  const onSubmit = handleSubmit((data) => {
    const dataForm = {
      title: data.title,
      body: data.body,
    };
    toastPostID = toast.loading("Creating your post", {
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
            ["text-red-500"]: watch("body")?.length > 300 || errors.body,
          })}
        >{`${watch("body")?.length ? watch("body").length : 0}/300`}</div>
        {errors.body && (
          <span className="text-red-500 text-xs text-left">
            {errors.body.message}
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
          {isLoading ? "Loading..." : "Create a post"}
        </Button>
      </div>
    </form>
  );
}
