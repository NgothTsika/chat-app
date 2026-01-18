"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";

import MessageInput from "./MessageInput";

const Form = () => {
  const { conversationId } = useConversation();

  const { register, handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };

  const handleUpload = (result: unknown) => {
    const uploadResult = result as Record<string, unknown>;
    const secureUrl = (uploadResult?.info as Record<string, unknown>)
      ?.secure_url;

    if (!secureUrl) {
      console.error("Upload failed or secure_url missing:", result);
      return;
    }

    axios
      .post("/api/messages", {
        image: secureUrl,
        conversationId,
      })
      .catch((err) => console.error("Image send failed:", err));
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        uploadPreset="CHAT-APP"
        onSuccess={handleUpload}
        options={{
          maxFiles: 1,
          multiple: false,
          sources: ["local", "camera"],
          cropping: false, // or true if you want to allow cropping
          resourceType: "image",
        }}
        className="cursor-pointer hover:opacity-75 transition"
      >
        <HiPhoto className="text-sky-500" size={30} />
      </CldUploadButton>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
