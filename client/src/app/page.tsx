"use client";
import ThemeToggle from "@/components/ThemeToggle";
import { useAppData } from "@/context/AppContext";
import { ArrowRight, MessagesSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

const LandingPage = () => {
  const { isAuth } = useAppData();

  // Already signed in? Send them straight to the chat instead of the login form.
  const ctaHref = isAuth ? "/chat" : "/login";
  const ctaLabel = isAuth ? "Open chat" : "Log in";

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-transparent">
      <header className="shrink-0 flex items-center justify-between px-5 sm:px-8 h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center">
            <MessagesSquare className="w-5 h-5 text-white dark:text-black" />
          </div>
          <span className="font-extrabold text-gray-900 dark:text-white">
            ChillZone
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={ctaHref}
            className="h-10 px-4 flex items-center gap-1.5 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black text-sm font-bold transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-3xl">
          Chat, minus the clutter.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-md">
          Realtime messages, no password to forget. Sign in with your email and
          start talking.
        </p>

        <Link
          href={ctaHref}
          className="mt-9 h-12 px-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-black font-bold transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20"
        >
          {isAuth ? "Open chat" : "Get started"}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </main>

      <footer className="shrink-0 h-14 flex items-center justify-center text-xs text-gray-500 dark:text-gray-500">
        Built with Next.js and Socket.IO
      </footer>
    </div>
  );
};

export default LandingPage;
