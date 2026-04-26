"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search, Bell, Menu, X, User, Package, LogOut,
  LayoutDashboard, Store, ChevronDown, ShoppingCart, LogIn, UserPlus, Settings
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import NotificationPanel from "@/components/NotificationPanel";

const UNREAD_COUNT = 3; // dummy unread count

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { user, logout, isLoggedIn } = useAuth();
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/search", label: "Browse" },
    { href: "/search?category=Second-hand Clothes", label: "Clothes" },
    { href: "/search?category=Second-hand Books", label: "Books" },
    { href: "/search?category=Arts & Crafts", label: "Arts & Crafts" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="container">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg gradient-text hidden sm:block">ThriftHub</span>
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-lg hidden md:block">
              <Link href="/search" className="flex items-center gap-2 input-base cursor-text hover:border-emerald-500/50 transition-colors">
                <Search size={16} className="text-slate-500" />
                <span className="text-slate-500 text-sm">Search listings...</span>
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {/* Mobile search */}
              <Link href="/search" className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400">
                <Search size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse-glow">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>

              {/* Notifications */}
              {isLoggedIn && (
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                    {UNREAD_COUNT > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
                    )}
                  </button>
                  <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
                </div>
              )}

              {/* List Item CTA */}
              {isLoggedIn && (
                <Link href="/seller/create-listing" className="hidden sm:block">
                  <button className="btn btn-primary text-sm px-4 py-2">
                    + List Item
                  </button>
                </Link>
              )}

              {/* Auth links (desktop - shown when not logged in) */}
              {!isLoggedIn && (
                <div className="hidden md:flex items-center gap-1">
                  <Link href="/auth/login">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
                      <LogIn size={14} /> Sign In
                    </button>
                  </Link>
                  <Link href="/auth/register">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors">
                      <UserPlus size={14} /> Register
                    </button>
                  </Link>
                </div>
              )}

              {/* User menu - shown when logged in */}
              {isLoggedIn && user && (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-1 pr-2 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                    <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-12 w-56 glass rounded-xl border border-white/10 py-2 shadow-2xl animate-fade-in z-50"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-white/5 mb-1">
                        <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 capitalize">
                          {user.role}
                        </span>
                      </div>
                      {[
                        { href: "/buyer/dashboard", icon: <User size={14} />, label: "Buyer Dashboard" },
                        { href: "/seller/dashboard", icon: <LayoutDashboard size={14} />, label: "Seller Dashboard" },
                        { href: "/buyer/orders", icon: <Package size={14} />, label: "My Orders" },
                        { href: "/buyer/wishlist", icon: <ShoppingCart size={14} />, label: `My Wishlist` },
                        { href: "/profile/settings", icon: <Settings size={14} />, label: "Profile Settings" },
                        ...(user.role === "admin" ? [{ href: "/admin/dashboard", icon: <Store size={14} />, label: "Admin Panel" }] : []),
                      ].map((item) => (
                        <Link
                          key={item.href + item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-white/5 mt-1 pt-1 px-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 w-full text-left rounded-lg transition-colors"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-white/5 py-3 animate-fade-in space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    isActive(link.href) ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {!isLoggedIn && (
                <div className="px-3 pt-2 grid grid-cols-2 gap-2">
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    <button className="btn btn-secondary w-full text-sm py-2">
                      <LogIn size={14} /> Sign In
                    </button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                    <button className="btn btn-primary w-full text-sm py-2">
                      <UserPlus size={14} /> Register
                    </button>
                  </Link>
                </div>
              )}

              {isLoggedIn && (
                <div className="px-3 pt-1 flex gap-2">
                  <Link href="/seller/create-listing" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <button className="btn btn-secondary w-full text-sm">+ List Item</button>
                  </Link>
                  <button
                    onClick={() => { setCartOpen(true); setMobileOpen(false); }}
                    className="btn btn-secondary text-sm relative"
                  >
                    <ShoppingCart size={16} />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="btn btn-secondary text-sm text-red-400 px-3 flex-1"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
