import { Loader2, Paperclip, Send, X } from "lucide-react";
import React, { useState } from "react";

interface MessageInputProps {
  selectedUser: string | null;
  message: string;
  setMessage: (message: string) => void;
  handleMessageSend: (e: any, imageFile?: File | null) => void;
}

const MessageInput = ({
  selectedUser,
  message,
  setMessage,
  handleMessageSend,
}: MessageInputProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    setIsUploading(true);
    await handleMessageSend(e, imageFile);
    setImageFile(null);
    setIsUploading(false);
  };

  if (!selectedUser) return null;
  return (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 flex flex-col gap-3 border-t border-gray-200 dark:border-white/10 px-4 md:px-6 pt-3 pb-4"
    >
      {imageFile && (
        <div className="relative w-fit">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-xl border border-gray-200 dark:border-white/10"
          />
          <button
            type="button"
            aria-label="Remove attached image"
            className="cursor-pointer absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white dark:bg-white dark:text-black active:scale-95"
            onClick={() => setImageFile(null)}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label
          aria-label="Attach an image"
          className="cursor-pointer w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1f1f1f] transition-colors active:scale-95"
        >
          <Paperclip className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && file.type.startsWith("image/")) {
                setImageFile(file);
              }
            }}
          />
        </label>

        <input
          type="text"
          aria-label="Message"
          className="flex-1 min-w-0 rounded-xl bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 px-4 py-2.5 text-[15px] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors focus:outline-none focus:border-gray-300 dark:focus:border-white/20"
          placeholder={imageFile ? "Add a caption..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          aria-label="Send message"
          disabled={(!imageFile && !message) || isUploading}
          className="cursor-pointer w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
