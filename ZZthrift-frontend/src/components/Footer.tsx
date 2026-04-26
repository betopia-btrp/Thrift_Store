import Link from "next/link";
import { Store, Twitter, Instagram, Facebook, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
                <Store size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">ThriftHub</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              The sustainable marketplace for second-hand clothes, books, and handmade treasures.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Twitter, Instagram, Facebook, Github].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Browse",
              links: [
                { label: "All Listings", href: "/search" },
                { label: "Clothes", href: "/search?category=Second-hand Clothes" },
                { label: "Books", href: "/search?category=Second-hand Books" },
                { label: "Arts & Crafts", href: "/search?category=Arts & Crafts" },
              ],
            },
            {
              title: "Selling",
              links: [
                { label: "Create Listing", href: "/seller/create-listing" },
                { label: "Seller Dashboard", href: "/seller/dashboard" },
                { label: "Pricing & Fees", href: "#" },
                { label: "Seller Guide", href: "#" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "Help Center", href: "#" },
                { label: "Contact Us", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-slate-300 mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">© 2026 ThriftHub Platform. All rights reserved.</p>
          <p className="text-xs text-slate-600 flex items-center gap-1">
            Made with <Heart size={11} className="text-emerald-500" /> for sustainable commerce
          </p>
        </div>
      </div>
    </footer>
  );
}
