"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { RevealUp, RevealFromLeft } from "@/components/animations/MotionWrappers";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-6 sm:px-8">
      <RevealUp className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
            DP
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">DropPilot</span>
        </Link>
        <h2 className="text-center text-2xl font-black text-slate-900 tracking-tight">
          Sign In to Your Workspace
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Manage your stores, catalog, suppliers, and customer orders.
        </p>
      </RevealUp>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Quick 1-Click Evaluation Credentials */}
        <RevealFromLeft delay={0.08} className="mb-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-sm">
          <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> 1-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("alex@droppilot.com", "OwnerPass123!")}
              className="px-3 py-2 text-left rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs shadow-sm transition-colors"
            >
              <div className="font-bold text-slate-800">Store Owner</div>
              <div className="text-[11px] text-slate-500">alex@droppilot.com</div>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@droppilot.com", "AdminPass123!")}
              className="px-3 py-2 text-left rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs shadow-sm transition-colors"
            >
              <div className="font-bold text-indigo-700">Platform Admin</div>
              <div className="text-[11px] text-slate-500">admin@droppilot.com</div>
            </button>
          </div>
        </RevealFromLeft>

        <RevealUp delay={0.15} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-sm placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-slate-900 text-sm placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <span>{isSubmitting ? "Authenticating..." : "Sign In to Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link href="/register" className="font-bold text-indigo-600 hover:underline">
              Start Free Trial
            </Link>
          </div>
        </RevealUp>
      </div>
    </div>
  );
}
