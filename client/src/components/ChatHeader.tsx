import { User } from "@/context/AppContext";
import { Menu, UserCircle } from "lucide-react";
import React from "react";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
}

const ChatHeader = ({
  user,
  setSidebarOpen,
  isTyping,
  onlineUsers,
}: ChatHeaderProps) => {
  const isOnlineUser = user && onlineUsers.includes(user._id);
  return (
    <>
      {/* mobile menu toggle */}
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          aria-label="Open sidebar"
          className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl bg-white/95 dark:bg-[#141414] backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors active:scale-95"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* chat header */}
      <div className="shrink-0 sticky top-0 z-20 bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                {/* online user setup */}
                {isOnlineUser && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 dark:bg-emerald-400 ring-2 ring-white dark:ring-[#0f0f0f]">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping opacity-75"></span>
                  </span>
                )}
              </div>

              {/* user info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold leading-tight text-gray-900 dark:text-white truncate">
                  {user.name}
                </h2>

                {user.username && (
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate">
                    @{user.username}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
                        typing...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isOnlineUser
                            ? "bg-emerald-500 dark:bg-emerald-400"
                            : "bg-gray-400 dark:bg-gray-600"
                        }`}
                      ></div>
                      <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                        {isOnlineUser ? "Online" : "Offline"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 rounded-full bg-gray-100 dark:bg-[#141414] flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                  Select a conversation
                </h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  Choose a chat from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
