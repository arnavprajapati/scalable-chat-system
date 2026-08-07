import { Message } from "@/app/chat/page";
import { User } from "@/context/AppContext";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import moment from "moment";
import { Check, CheckCheck, MessagesSquare, X, ZoomIn } from "lucide-react";

interface ChatMessagesProps {
  selectedUser: string | null;
  messages: Message[] | null;
  loggedInUser: User | null;
}

const ChatMessages = ({
  selectedUser,
  messages,
  loggedInUser,
}: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const openLightbox = useCallback((url: string) => setLightboxUrl(url), []);
  const closeLightbox = useCallback(() => setLightboxUrl(null), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (lightboxUrl) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxUrl, closeLightbox]);

  //   seen feature
  const uniqueMessages = useMemo(() => {
    if (!messages) return [];
    const seen = new Set();
    return messages.filter((message) => {
      if (seen.has(message._id)) {
        return false;
      }
      seen.add(message._id);
      return true;
    });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser, uniqueMessages]);
  return (
    <div className="flex-1 min-h-0">
      <div className="h-full overflow-y-auto px-4 md:px-6 py-4 space-y-2 custom-scroll">
        {!selectedUser ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5">
              <MessagesSquare className="w-9 h-9 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              It&apos;s quiet in here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
              Suspiciously quiet. Pick a chat or start a new one.
            </p>
          </div>
        ) : uniqueMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 flex items-center justify-center mb-5">
              <MessagesSquare className="w-9 h-9 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              No messages yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
              Say hello to start the conversation.
            </p>
          </div>
        ) : (
          <>
            {uniqueMessages.map((e, i) => {
              const isSentByMe = e.sender === loggedInUser?._id;
              const uniqueKey = `${e._id}-${i}`;

              return (
                <div
                  className={`flex flex-col gap-1 mt-2 ${
                    isSentByMe ? "items-end" : "items-start"
                  }`}
                  key={uniqueKey}
                >
                  <div
                    className={`max-w-[75%] text-[15px] leading-relaxed ${
                      e.messageType === "image" ? "p-1.5" : "px-4 py-2.5"
                    } ${
                      isSentByMe
                        ? "bg-gray-900 text-white dark:bg-white dark:text-black rounded-2xl rounded-br-md"
                        : "bg-gray-100 dark:bg-[#141414] text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl rounded-bl-md"
                    }`}
                  >
                    {e.messageType === "image" && e.image && (
                      <div className="relative group">
                        <img
                          src={e.image.url}
                          alt="shared image"
                          onClick={() => openLightbox(e.image!.url)}
                          className="max-h-[280px] max-w-[260px] w-auto object-cover rounded-xl cursor-zoom-in transition-transform duration-200 hover:scale-[1.02]"
                        />
                        <div
                          onClick={() => openLightbox(e.image!.url)}
                          className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center cursor-zoom-in"
                        >
                          <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
                        </div>
                      </div>
                    )}

                    {e.text && (
                      <p className={e.messageType === "image" ? "mt-1 px-2.5 pb-1" : ""}>
                        {e.text}
                      </p>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-500 ${
                      isSentByMe ? "pr-2 flex-row-reverse" : "pl-2"
                    }`}
                  >
                    <span>{moment(e.createdAt).format("hh:mm A . MMM D")}</span>

                    {isSentByMe && (
                      <div className="flex items-center ml-1">
                        {e.seen ? (
                          <div className="flex items-center gap-1 text-blue-500">
                            <CheckCheck className="w-3 h-3" />
                            {e.seenAt && (
                              <span>{moment(e.seenAt).format("hh:mm A")}</span>
                            )}
                          </div>
                        ) : (
                          <Check className="w-3 h-3 text-gray-500 dark:text-gray-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ animation: "fadeIn 0.2s ease" }}
          onClick={closeLightbox}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={lightboxUrl}
            alt="Full size"
            onClick={(ev) => ev.stopPropagation()}
            className="relative z-10 max-w-[92vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl"
            style={{ animation: "zoomIn 0.25s cubic-bezier(.34,1.56,.64,1)" }}
          />

          <style>{`
            @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
            @keyframes zoomIn  { from { opacity:0; transform:scale(0.85) } to { opacity:1; transform:scale(1) } }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
