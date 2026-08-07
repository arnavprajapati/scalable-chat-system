import { User } from "@/context/AppContext";
import { Menu, MessagesSquare, X } from "lucide-react";
import React, { useState } from "react";
import Avatar from "./Avatar";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
  onCloseChat: () => void;
}

const ChatHeader = ({
  user,
  setSidebarOpen,
  isTyping,
  onlineUsers,
  onCloseChat,
}: ChatHeaderProps) => {
  const isOnlineUser = user && onlineUsers.includes(user._id);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      {profileOpen && user?.avatar?.url && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ animation: "fadeInP 0.2s ease" }}
          onClick={() => setProfileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <button
            onClick={() => setProfileOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={user.avatar.url}
            alt={user.name}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-64 h-64 object-cover rounded-full shadow-2xl ring-4 ring-white/20"
            style={{ animation: "zoomInP 0.25s cubic-bezier(.34,1.56,.64,1)" }}
          />
          <style>{`
            @keyframes fadeInP { from { opacity:0 } to { opacity:1 } }
            @keyframes zoomInP { from { opacity:0; transform:scale(0.7) } to { opacity:1; transform:scale(1) } }
          `}</style>
        </div>
      )}
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          aria-label="Open sidebar"
          className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl bg-white/95 dark:bg-[#141414] backdrop-blur-md border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors active:scale-95"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="shrink-0 sticky top-0 z-20 bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Avatar
                user={user}
                size="md"
                online={!!isOnlineUser}
                onClick={user?.avatar?.url ? () => setProfileOpen(true) : undefined}
              />

              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold leading-tight text-gray-900 dark:text-white truncate">
                  {user.name}
                </h2>

                <div className="flex items-center gap-2 min-h-[20px]">
                  {isTyping ? (
                    <>
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
                    </>
                  ) : (
                    <div className="text-[13px] text-gray-500 dark:text-gray-400 truncate">
                      {user.username && `@${user.username} · `}
                      {isOnlineUser ? "Online" : "Offline"}
                    </div>
                  )}
                </div>
              </div>

              <button
                aria-label="Close chat"
                title="Close chat"
                onClick={onCloseChat}
                className="cursor-pointer shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] hover:text-gray-900 dark:hover:text-white transition-colors active:scale-95 mr-12 sm:mr-0"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 rounded-full bg-gray-100 dark:bg-[#141414] flex items-center justify-center">
                <MessagesSquare className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                  No conversation selected
                </h2>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  Pick someone and say hi
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
