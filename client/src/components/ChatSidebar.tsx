import { User } from "@/context/AppContext";
import {
  CornerDownRight,
  CornerUpLeft,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
  users: User[] | null;
  loggedInUser: User | null;
  chats: any[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  handleLogout: () => void;
  createChat: (user: User) => void;
  onlineUsers: string[];
}

const ChatSidebar = ({
  sidebarOpen,
  setShowAllUsers,
  setSidebarOpen,
  showAllUsers,
  users,
  loggedInUser,
  chats,
  selectedUser,
  setSelectedUser,
  handleLogout,
  createChat,
  onlineUsers,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 shrink-0 bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md border-r border-gray-200 dark:border-white/10 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 flex flex-col`}
    >
      {/* header */}
      <div className="p-4 border-b border-gray-200 dark:border-white/10">
        <div className="sm:hidden flex justify-end mb-2">
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1f1f1f] transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center shadow-md">
              <MessageCircle className="w-5 h-5 text-white dark:text-black" />
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">
              {showAllUsers ? "New Chat" : "Messages"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              aria-label={showAllUsers ? "Close new chat" : "Start new chat"}
              className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-xl border transition-colors active:scale-95 bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200 dark:bg-[#141414] dark:border-white/10 dark:text-gray-300 dark:hover:bg-[#1f1f1f]"
              onClick={() => setShowAllUsers((prev) => !prev)}
            >
              {showAllUsers ? (
                <X className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-hidden px-3 py-3">
        {showAllUsers ? (
          <div className="flex flex-col gap-3 h-full">
            <div className="relative shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search Users..."
                aria-label="Search users"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors focus:outline-none focus:border-gray-300 dark:focus:border-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* users list */}
            <div className="flex flex-col gap-1 overflow-y-auto flex-1 pb-4 custom-scroll">
              {users
                ?.filter(
                  (u) =>
                    u._id !== loggedInUser?._id &&
                    u.name
                      .toLowerCase()
                      .includes(searchQuery.toLocaleLowerCase())
                )
                .map((u) => (
                  <button
                    key={u._id}
                    className="cursor-pointer w-full text-left px-4 py-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-[#141414]"
                    onClick={() => createChat(u)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        {onlineUsers.includes(u._id) && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400 ring-2 ring-white dark:ring-[#0f0f0f]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="block font-bold text-gray-900 dark:text-white truncate">
                          {u.name}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                          {/* to show online offline text */}
                          {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="flex flex-col gap-1 overflow-y-auto h-full pb-4 custom-scroll">
            {chats.map((chat) => {
              const latestMessage = chat.chat.latestMessage;
              const isSelected = selectedUser === chat.chat._id;
              const isSentByMe = latestMessage?.sender === loggedInUser?._id;
              const unseenCount = chat.chat.unseenCount || 0;

              return (
                <button
                  key={chat.chat._id}
                  onClick={() => {
                    setSelectedUser(chat.chat._id);
                    setSidebarOpen(false);
                  }}
                  className={`cursor-pointer w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    isSelected
                      ? "bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10"
                      : "border border-transparent hover:bg-gray-100 dark:hover:bg-[#141414]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center">
                        <UserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        {/* onlineuser ka work hai */}
                      </div>
                      {onlineUsers.includes(chat.user._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 dark:bg-emerald-400 ring-2 ring-white dark:ring-[#0f0f0f]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-bold text-gray-900 dark:text-white truncate">
                          {chat.user.name}
                        </span>
                        {unseenCount > 0 && (
                          <div className="shrink-0 bg-gray-900 text-white dark:bg-white dark:text-black text-[11px] font-bold rounded-lg min-w-[22px] h-5 flex items-center justify-center px-1.5">
                            {unseenCount > 99 ? "99+" : unseenCount}
                          </div>
                        )}
                      </div>

                      {latestMessage && (
                        <div className="flex items-center gap-1.5">
                          {isSentByMe ? (
                            <CornerUpLeft
                              size={13}
                              className="shrink-0 text-gray-500 dark:text-gray-500"
                            />
                          ) : (
                            <CornerDownRight
                              size={13}
                              className="shrink-0 text-emerald-500 dark:text-emerald-400"
                            />
                          )}
                          <span className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">
                            {latestMessage.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#141414] flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">
              No conversation yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Start a new chat to begin messaging
            </p>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10 flex flex-col gap-1">
        <Link
          href={"/profile"}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-[#1f1f1f]"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 flex items-center justify-center">
            <UserCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-white">
            Profile
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-[#1f1f1f] text-red-600 dark:text-red-400"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 flex items-center justify-center">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-base font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
