"use client";
import { useState } from "react";
import Link from "next/link";
import { Store, Mail, ArrowRight, ArrowLeft, CheckCircle, Lock } from "lucide-react";

type Step = "email" | "sent" | "reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep("sent");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("reset");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
              <Store size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">ThriftHub</span>
          </Link>
        </div>

        {/* Step: Email */}
        {step === "email" && (
          <div className="glass rounded-2xl border border-white/10 p-8 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mb-5 mx-auto">
              <Mail size={22} className="text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-100 text-center mb-1">Forgot your password?</h1>
            <p className="text-slate-500 text-sm text-center mb-6">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSendReset} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1.5 font-medium">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base text-sm pl-9"
                    autoComplete="email"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary w-full ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>Send Reset Link <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="text-center mt-5">
              <Link href="/auth/login" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1">
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Step: Email sent */}
        {step === "sent" && (
          <div className="glass rounded-2xl border border-white/10 p-8 text-center animate-fade-in">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Check your inbox</h2>
            <p className="text-slate-500 text-sm mb-2">
              We sent a password reset link to:
            </p>
            <p className="text-emerald-400 font-semibold mb-6">{email}</p>
            <p className="text-slate-600 text-xs mb-6">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button onClick={() => setStep("email")} className="text-emerald-400 hover:text-emerald-300 underline">
                try again
              </button>.
            </p>
            {/* Demo: simulate clicking the link */}
            <button onClick={() => setStep("reset")} className="btn btn-secondary text-sm w-full">
              Simulate: I clicked the reset link →
            </button>
            <div className="mt-4">
              <Link href="/auth/login" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors flex items-center justify-center gap-1">
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Step: New password */}
        {step === "reset" && (
          <div className="glass rounded-2xl border border-white/10 p-8 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center mb-5 mx-auto">
              <Lock size={22} className="text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 text-center mb-1">Set new password</h2>
            <p className="text-slate-500 text-sm text-center mb-6">
              Must be at least 8 characters with uppercase, number, and symbol.
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {loading === false && newPassword === "" ? (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-base text-sm pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="password" placeholder="••••••••" className="input-base text-sm pl-9" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  Reset Password <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="text-center">
                <CheckCircle size={48} className="text-emerald-400 mx-auto mb-3 animate-pulse-glow" />
                <p className="font-semibold text-slate-200 mb-1">Password reset successfully!</p>
                <p className="text-slate-500 text-sm mb-5">You can now sign in with your new password.</p>
                <Link href="/auth/login">
                  <button className="btn btn-primary w-full">Sign In Now</button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
