"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await login(email, password);
      // Navigation will happen after login
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
              <Store size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">ThriftHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl border border-white/10 p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-fade-in">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-slate-500 block mb-1.5 font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="input-base text-sm pl-9 disabled:opacity-50 disabled:cursor-not-allowed"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-500 font-medium">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="input-base text-sm pl-9 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-full ${isLoading ? "opacity-70 cursor-not-allowed" : "animate-pulse-glow"}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Demo info */}
          <div className="mt-6 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300">
            <p className="font-medium mb-1.5">Demo Accounts:</p>
            <div className="space-y-1 font-mono text-emerald-400/80">
              <p>📧 alex@example.com (Seller)</p>
              <p>📧 sarah@example.com (Seller)</p>
              <p>🔑 password123</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-slate-600">or continue with</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Google", emoji: "🔵" },
              { label: "Apple", emoji: "🍎" },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                disabled={isLoading}
                className="btn btn-secondary text-sm py-2.5 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{p.emoji}</span> {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Create one free
          </Link>
        </p>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {[
            { icon: <Shield size={13} />, label: "Secure login" },
            { icon: <Sparkles size={13} />, label: "Free to join" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="text-emerald-500/60">{b.icon}</span>
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
