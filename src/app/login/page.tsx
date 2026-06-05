"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm p-8 sm:p-10 flex flex-col items-center">
        
        {/* Logo */}
        <div className="w-[52px] h-[52px] bg-gradient-to-br from-[#002f6c] to-[#004b93] rounded-[14px] flex items-center justify-center shadow-md mb-6">
          <span className="material-symbols-outlined text-white text-[30px]">travel_explore</span>
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-bold text-[#000666] dark:text-white mb-2 font-display-lg tracking-tight">
          Welcome Back
        </h1>
        <p className="text-[#5f6368] dark:text-gray-400 text-[15px] mb-8">
          Log in to your GlobeTrek account
        </p>

        {/* Form */}
        <form className="w-full space-y-5" onSubmit={(e) => e.preventDefault()}>
          
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] text-[#1f2937] dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#000666]/20 focus:border-[#000666] dark:focus:ring-blue-500/20 dark:focus:border-blue-500 transition-all text-[15px]"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] text-[#1f2937] dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#000666]/20 focus:border-[#000666] dark:focus:ring-blue-500/20 dark:focus:border-blue-500 transition-all text-[15px] tracking-[0.2em]"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#000666] hover:bg-[#000555] active:bg-[#000444] text-white font-medium py-3.5 rounded-xl transition-colors mt-2 text-[16px]"
          >
            Log In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-[14.5px] text-[#5f6368] dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/" className="font-bold text-[#000666] dark:text-blue-400 hover:underline">
            Go back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
