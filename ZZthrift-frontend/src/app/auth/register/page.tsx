"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store, Mail, Lock, Eye, EyeOff, Phone, User,
  ArrowRight, CheckCircle, Shield, Leaf, AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name || form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.phone || form.phone.length < 10) errs.phone = "Enter a valid phone number.";
    if (!form.password || form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(form.password)) errs.password = "Must include an uppercase letter.";
    if (!/[0-9]/.test(form.password)) errs.password = "Must include a number.";
    if (!/[^a-zA-Z0-9]/.test(form.password)) errs.password = "Must include a special character.";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (!agreed) errs.agreed = "You must accept the Terms of Service.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      await register(form.name, form.email, form.phone, form.password);
      setStep(2);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Registration failed. Please try again." });
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    return score;
  };
  
  const strength = passwordStrength();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"][strength];

  if (step === 2) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center animate-fade-in-up">
          <div className="w-24 h-24 rounded-3xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <CheckCircle size={44} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Account Created! 🎉</h1>
          <p className="text-slate-500 text-sm mb-2">
            Welcome to ThriftHub, <span className="text-emerald-400 font-semibold">{form.name.split(" ")[0]}</span>!
          </p>
          <p className="text-slate-600 text-xs mb-8">
            Your account has been created successfully. You can now explore ThriftHub or create your first listing as a seller.
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => router.push("/")} className="btn btn-primary">
              Explore ThriftHub <ArrowRight size={16} />
            </button>
            <Link href="/seller/create-listing">
              <button className="btn btn-secondary w-full">Create Your First Listing</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
              <Store size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">ThriftHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join thousands of sustainable shoppers</p>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-8">
          {errors.submit && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-fade-in">
              <AlertCircle size={14} />
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1.5 font-medium">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={isLoading}
                  className={`input-base text-sm pl-11 disabled:opacity-50 disabled:cursor-not-allowed ${errors.name ? "border-red-500/50" : ""}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5 font-medium">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={isLoading}
                  className={`input-base text-sm pl-11 disabled:opacity-50 disabled:cursor-not-allowed ${errors.email ? "border-red-500/50" : ""}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5 font-medium">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="+1 415 555 0100"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  disabled={isLoading}
                  className={`input-base text-sm pl-11 disabled:opacity-50 disabled:cursor-not-allowed ${errors.phone ? "border-red-500/50" : ""}`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars, upper, number, symbol"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  disabled={isLoading}
                  className={`input-base text-sm pl-11 pr-11 disabled:opacity-50 disabled:cursor-not-allowed ${errors.password ? "border-red-500/50" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50 pointer-events-auto"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-all ${n <= strength ? strengthColor : "bg-slate-700"}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${strength >= 3 ? "text-emerald-400" : strength >= 2 ? "text-amber-400" : "text-red-400"}`}>
                    {strengthLabel} password
                  </p>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1.5 font-medium">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  disabled={isLoading}
                  className={`input-base text-sm pl-11 pr-11 disabled:opacity-50 disabled:cursor-not-allowed ${errors.confirmPassword ? "border-red-500/50" : ""}`}
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                )}
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={isLoading}
                  className="mt-0.5 w-4 h-4 rounded accent-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
                  I agree to ThriftHub&apos;s{" "}
                  <Link href="#" className="text-emerald-400 hover:text-emerald-300">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="#" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</Link>.
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-red-400 mt-1">{errors.agreed}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-full mt-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 gap-3">
            {[
              { icon: <Leaf size={12} />, label: "Eco-friendly marketplace" },
              { icon: <Shield size={12} />, label: "Verified & secure" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="text-emerald-500/60">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
