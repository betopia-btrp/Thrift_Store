"use client";
import { useState } from "react";
import { Bell, X, Package, Star, ShoppingBag, AlertCircle, CheckCircle } from "lucide-react";

interface Notification {
  id: string;
  type: "order" | "review" | "listing" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "order",
    title: "New Order Received!",
    message: "Marcus Chen placed an order for your Nike Air Force 1 listing.",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    type: "order",
    title: "Order Confirmed",
    message: "Priya Patel confirmed your order for Zara Wool Coat. Awaiting dispatch.",
    time: "1h ago",
    read: false,
  },
  {
    id: "n3",
    type: "review",
    title: "New Review",
    message: "Sarah Miller left you a ⭐⭐⭐⭐⭐ review! Check your profile.",
    time: "3h ago",
    read: false,
  },
  {
    id: "n4",
    type: "listing",
    title: "Listing Expiring Soon",
    message: "Your Macramé Wall Hanging listing expires in 5 days. Consider renewing.",
    time: "1d ago",
    read: true,
  },
  {
    id: "n5",
    type: "system",
    title: "Listing Published",
    message: "Your H&M Floral Dress listing is now Active and visible to buyers.",
    time: "2d ago",
    read: true,
  },
];

const typeIcon = (type: Notification["type"]) => {
  switch (type) {
    case "order": return <ShoppingBag size={14} className="text-emerald-400" />;
    case "review": return <Star size={14} className="text-amber-400" />;
    case "listing": return <Package size={14} className="text-violet-400" />;
    case "system": return <CheckCircle size={14} className="text-blue-400" />;
    default: return <AlertCircle size={14} className="text-slate-400" />;
  }
};

const typeBg = (type: Notification["type"]) => {
  switch (type) {
    case "order": return "bg-emerald-500/10";
    case "review": return "bg-amber-500/10";
    case "listing": return "bg-violet-500/10";
    case "system": return "bg-blue-500/10";
    default: return "bg-slate-500/10";
  }
};

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const dismiss = (id: string) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-12 w-80 glass border border-white/10 rounded-2xl shadow-2xl z-50 animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-emerald-400" />
            <span className="font-semibold text-slate-200 text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-slate-600 hover:text-slate-400 transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 text-center">
              <Bell size={28} className="text-slate-700 mx-auto mb-2" />
              <p className="text-slate-600 text-sm">All caught up!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 cursor-pointer transition-colors hover:bg-white/5 ${
                  !n.read ? "bg-white/[0.02]" : ""
                }`}
              >
                {/* Icon */}
                <div className={`w-7 h-7 rounded-lg ${typeBg(n.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                  {typeIcon(n.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-semibold ${n.read ? "text-slate-400" : "text-slate-200"}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-700 mt-1">{n.time}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                  className="text-slate-700 hover:text-slate-400 transition-colors shrink-0 mt-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/5 text-center">
          <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}
