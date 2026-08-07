"use client";
import { useAppData, user_service } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import ThemeToggle from "@/components/ThemeToggle";
import { ArrowLeft, AtSign, Camera, Loader2, Save, User } from "lucide-react";
import { validateUsername } from "@/lib/username";
import Avatar from "@/components/Avatar";

type UsernameStatus =
  | { state: "idle" }
  | { state: "invalid"; reason: string }
  | { state: "checking" }
  | { state: "taken" }
  | { state: "available" };

const ProfilePage = () => {
  const { user, isAuth, loading, setUser } = useAppData();

  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string | undefined>("");

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>({
    state: "idle",
  });
  const [savingUsername, setSavingUsername] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const checkIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const editHandler = () => {
    setIsEdit(!isEdit);
    setName(user?.name);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const token = Cookies.get("token");
    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/update/user`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      toast.success(data.message);
      setUser(data.user);
      setIsEdit(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to update profile");
    }
  };

  const avatarChangeHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    // Reset immediately so picking the same file twice still fires onChange.
    e.target.value = "";
    if (!file) return;

    setUploadingAvatar(true);
    const token = Cookies.get("token");
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await axios.post(
        `${user_service}/api/v1/update/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // The whole user document is signed into the JWT, so the new avatar only
      // survives a reload if we swap the cookie too.
      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      toast.success(data.message);
      setUser(data.user);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile picture"
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus({ state: "idle" });
      return;
    }

    const { ok, reason } = validateUsername(username);
    if (!ok) {
      setUsernameStatus({ state: "invalid", reason: reason! });
      return;
    }

    setUsernameStatus({ state: "checking" });
    const requestId = ++checkIdRef.current;

    const timer = setTimeout(async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${user_service}/api/v1/username/check`,
          {
            params: { username },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (requestId !== checkIdRef.current) return;

        if (data.available) {
          setUsernameStatus({ state: "available" });
        } else {
          setUsernameStatus({ state: "taken" });
        }
      } catch {
        if (requestId !== checkIdRef.current) return;
        setUsernameStatus({ state: "taken" });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  const usernameSubmitHandler = async (e: any) => {
    e.preventDefault();
    setSavingUsername(true);
    const token = Cookies.get("token");
    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/username/set`,
        { username: username.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      toast.success(data.message);
      setUser(data.user);
      setUsername("");
      setUsernameStatus({ state: "idle" });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to set username"
      );
    } finally {
      setSavingUsername(false);
    }
  };

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  if (loading) return <Loading />;
  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            aria-label="Back to chat"
            onClick={() => router.push("/chat")}
            className="cursor-pointer w-10 h-10 flex items-center justify-center shrink-0 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#1f1f1f] transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Profile Settings
            </h1>
            <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400 mt-1">
              Manage your account information
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="bg-gray-100 dark:bg-[#0a0a0a] p-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-6">
              <button
                type="button"
                aria-label="Change profile picture"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="cursor-pointer relative group rounded-full shadow-md disabled:cursor-not-allowed"
              >
                <Avatar user={user} size="lg" />
                <div
                  className={`absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity ${
                    uploadingAvatar
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={avatarChangeHandler}
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                  {user?.name || "User"}
                </h2>
                {user?.username && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                    @{user.username}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                  Display Name
                </label>

                {isEdit ? (
                  <form onSubmit={submitHandler} className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-4 pr-11 py-3 rounded-xl bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-300 dark:focus:border-white/20"
                      />
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black font-bold transition-all active:scale-95"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={editHandler}
                        className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-[#1f1f1f] transition-colors active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10">
                    <span className="text-gray-900 dark:text-white font-bold truncate">
                      {user?.name || "Not set"}
                    </span>
                    <button
                      onClick={editHandler}
                      className="cursor-pointer shrink-0 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-[#1f1f1f] transition-colors active:scale-95"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                  Username
                </label>

                {user?.username ? (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10">
                    <span className="text-gray-900 dark:text-white font-bold truncate">
                      @{user.username}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={usernameSubmitHandler} className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        placeholder="Choose a username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-4 pr-11 py-3 rounded-xl bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-300 dark:focus:border-white/20"
                      />
                      <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>

                    {usernameStatus.state !== "idle" && (
                      <p
                        className={`text-sm ${
                          usernameStatus.state === "available"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : usernameStatus.state === "checking"
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {usernameStatus.state === "invalid"
                          ? usernameStatus.reason
                          : usernameStatus.state === "checking"
                          ? "Checking…"
                          : usernameStatus.state === "taken"
                          ? "❌ Username already taken"
                          : "✅ Username available"}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      3–20 characters. Letters, numbers and underscores only.
                      Usernames are permanent.
                    </p>

                    <button
                      type="submit"
                      disabled={
                        usernameStatus.state !== "available" || savingUsername
                      }
                      className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                      <Save className="w-4 h-4" /> Save Username
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
