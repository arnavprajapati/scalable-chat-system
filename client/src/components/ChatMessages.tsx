import { Message } from "@/app/chat/page";
import { User } from "@/context/AppContext";
import React, { useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { Check, CheckCheck, MessagesSquare } from "lucide-react";

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
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#141414] flex items-center justify-center mb-4">
              <MessagesSquare className="w-7 h-7 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">
              No chat selected
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Please select a user to start chatting
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
                    className={`px-4 py-2.5 max-w-[75%] text-[15px] leading-relaxed ${
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
                          className="max-w-full h-auto rounded-xl"
                        />
                      </div>
                    )}

                    {e.text && <p className="mt-1">{e.text}</p>}
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
    </div>
  );
};

export default ChatMessages;
