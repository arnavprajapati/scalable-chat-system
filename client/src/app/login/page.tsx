"use client";
import Loading from "@/components/Loading";
import ThemeToggle from "@/components/ThemeToggle";
import { useAppData, user_service } from "@/context/AppContext";
import axios from "axios";
import { ArrowLeft, ArrowRight, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { isAuth, loading: userLoading } = useAppData();

  const handleSubmit = async (
    e: React.FormEvent<HTMLElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });

      toast.success(data.message);
      router.push(`/verify?email=${email}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) return redirect("/chat");
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <Link
        href="/"
        className="fixed top-4 left-4 z-30 h-10 px-3 flex items-center gap-1.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#141414] hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="fixed top-4 right-4 z-30">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        {/* Header sits outside the card so the card stays a tight, focused form */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center mb-5">
            <Mail className="w-7 h-7 text-white dark:text-black" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-[15px] text-gray-600 dark:text-gray-400">
            Sign in with your email — no password needed.
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-900/5 dark:shadow-black/40 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                autoFocus
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/15 focus:border-gray-300 dark:focus:border-white/20"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer w-full h-12 flex items-center justify-center gap-2 bg-gray-900 text-white dark:bg-white dark:text-black rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  Send verification code
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
          We&apos;ll email you a one-time code. It expires in 5 minutes.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
