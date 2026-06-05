"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, this just logs your input to the developer console
    console.log("Login attempt:", { email, password });
    alert("Login button clicked! This is where you would connect to a database.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-container-lowest p-4 pt-24">
      <div className="w-full max-w-md bg-white dark:bg-surface-container-low p-8 rounded-2xl shadow-xl border border-outline-variant/20 dark:border-white/10">
        <div className="flex flex-col items-center mb-8">
           {/* The GlobeTrek Logo Icon */}
           <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-sm mb-4">
             <span className="material-symbols-outlined text-white text-[24px]">travel_explore</span>
           </div>
           <h1 className="text-2xl font-bold text-primary dark:text-white">Welcome Back</h1>
           <p className="text-on-surface-variant dark:text-white/50 text-sm mt-1">Log in to your GlobeTrek account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-label-bold text-on-surface dark:text-white/70 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-lowest dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-label-bold text-on-surface dark:text-white/70 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 dark:border-white/10 bg-surface-container-lowest dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-on-primary dark:text-white font-label-bold py-3 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-on-surface-variant dark:text-white/40">
          Don&apos;t have an account? <Link href="/" className="text-primary font-bold hover:underline">Go back Home</Link>
        </div>
      </div>
    </div>
  );
}