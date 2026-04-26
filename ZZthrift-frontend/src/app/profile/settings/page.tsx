"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, MapPin, Upload, Save, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, isLoggedIn, updateProfile, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    avatar: "",
  });

  // Initialize form with user data
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, isLoggedIn, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        avatar: formData.avatar,
      });
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-12 relative">
      {/* Background orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-2xl relative">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-4">
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-100">Profile Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account information and preferences</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-fade-in">
            <span className="text-base">⚠️</span>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2 animate-fade-in">
            <span className="text-base">✅</span>
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl border border-white/10 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div>
                  <label className="text-sm font-semibold text-slate-200 block mb-4">Profile Picture</label>
                  <div className="flex items-end gap-6">
                    <div className="relative">
                      <img
                        src={formData.avatar || "https://i.pravatar.cc/150?img=default"}
                        alt={formData.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-emerald-500/30"
                      />
                      <div className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full">
                        <Upload size={14} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-2">Upload a new profile picture</p>
                      <input
                        type="text"
                        placeholder="Image URL (e.g., https://example.com/avatar.jpg)"
                        value={formData.avatar}
                        onChange={handleChange}
                        name="avatar"
                        className="input-base text-sm w-full"
                      />
                      <p className="text-xs text-slate-600 mt-1">Supports JPG, PNG, GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Name */}
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-medium">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="input-base text-sm pl-11"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-medium">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="input-base text-sm pl-11 bg-slate-900/50 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Email cannot be changed for security reasons</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="input-base text-sm pl-11"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs text-slate-500 block mb-1.5 font-medium">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State or Country"
                      className="input-base text-sm pl-11"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn btn-primary flex items-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    <Save size={16} />
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (user) {
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone,
                          location: user.location,
                          avatar: user.avatar,
                        });
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Info Card */}
            <div className="glass rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Member Since</p>
                  <p className="text-sm text-slate-300 font-medium">
                    {new Date(user.joinedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Role</p>
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 capitalize">
                    {user.role}
                  </span>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-slate-500 mb-2">Account ID</p>
                  <p className="text-xs text-slate-400 font-mono break-all">{user.id}</p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="glass rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Listings</p>
                  <p className="text-sm font-semibold text-emerald-400">{user.totalListings}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500">Sales</p>
                  <p className="text-sm font-semibold text-slate-300">{user.totalSales}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <p className="text-xs text-slate-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-300">{user.rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">({user.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Card */}
            <div className="glass rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-slate-200 mb-4">Session</h3>
              <button
                onClick={handleLogout}
                className="btn btn-secondary w-full text-sm flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut size={14} />
                Sign Out
              </button>
              <p className="text-xs text-slate-600 mt-3 text-center">
                You&apos;ll be signed out from all devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
