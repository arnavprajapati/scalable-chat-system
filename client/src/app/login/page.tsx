"use client";
import Loading from "@/components/Loading";
import ThemeToggle from "@/components/ThemeToggle";
import { useAppData, user_service } from "@/context/AppContext";
import axios from "axios";
import { ArrowRight, Loader2, Mail } from "lucide-react";
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
      <div className="fixed top-4 right-4 z-30">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full">
        <div className="rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center mb-6 shadow-md">
              <Mail className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Welcome To ChatApp
            </h1>
            <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              Enter your email to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 transition-colors focus:outline-none focus:border-gray-300 dark:focus:border-white/20"
                placeholder="Enter Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer w-full bg-gray-900 text-white dark:bg-white dark:text-black py-3 px-4 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Otp to your mail...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
