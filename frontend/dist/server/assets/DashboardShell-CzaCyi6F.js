import { jsxs, jsx } from "react/jsx-runtime";
import { useLocation, Link } from "@tanstack/react-router";
import { Bell, CheckCheck, X, Pill, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { a as auth } from "./firebase-sHON1iw5.js";
import { g as getSession, c as clearSession } from "./session-JGLanhG1.js";
import { useState, useCallback, useEffect, useRef } from "react";
import { s as supabase } from "./supabase-xo2Ne9iT.js";
import { c as cn } from "./utils-H80jjgLf.js";
function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const session = getSession();
  const fetchNotifications = useCallback(async () => {
    if (!(session == null ? void 0 : session.id)) return;
    try {
      const { data, error } = await supabase.from("notifications").select("id, type, message, is_read, sent_at").eq("user_id", session.id).order("sent_at", { ascending: false }).limit(20);
      if (error) throw error;
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    } catch (err) {
      console.warn("[Notifications] Refresh failed:", err);
    }
  }, [session == null ? void 0 : session.id]);
  useEffect(() => {
    if (!(session == null ? void 0 : session.id)) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 6e4);
    return () => clearInterval(interval);
  }, [session == null ? void 0 : session.id, fetchNotifications]);
  const markRead = useCallback(async (id) => {
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
      setNotifications(
        (prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Mark read error:", err);
    }
  }, []);
  const markAllRead = useCallback(async () => {
    if (!(session == null ? void 0 : session.id)) return;
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("user_id", session.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  }, [session == null ? void 0 : session.id]);
  return { notifications, unreadCount, markRead, markAllRead, refresh: fetchNotifications };
}
const TYPE_COLORS = {
  welcome: "bg-amber/20 text-amber",
  approved: "bg-success/20 text-success",
  rejected: "bg-destructive/20 text-destructive",
  dispensed: "bg-mint text-surface"
};
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        id: "notification-bell",
        onClick: () => setOpen((o) => !o),
        "aria-label": "Notifications",
        className: "relative flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent/60 text-sidebar-foreground transition hover:bg-sidebar-accent",
        children: [
          /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }),
          unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber text-[9px] font-bold text-amber-foreground", children: unreadCount > 9 ? "9+" : unreadCount })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-11 z-50 w-80 rounded-2xl border border-border bg-card shadow-soft animate-fade-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-surface", children: "Notifications" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          unreadCount > 0 && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: markAllRead,
              className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-surface",
              children: [
                /* @__PURE__ */ jsx(CheckCheck, { className: "h-3 w-3" }),
                "Mark all read"
              ]
            }
          ),
          /* @__PURE__ */ jsx("button", { onClick: () => setOpen(false), children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-muted-foreground hover:text-surface" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "max-h-80 divide-y divide-border overflow-y-auto", children: [
        notifications.length === 0 && /* @__PURE__ */ jsx("li", { className: "px-4 py-8 text-center text-sm text-muted-foreground", children: "No notifications yet" }),
        notifications.map((n) => /* @__PURE__ */ jsxs(
          "li",
          {
            onClick: () => markRead(n.id),
            className: "cursor-pointer px-4 py-3 transition hover:bg-mint/40 " + (!n.is_read ? "bg-amber/5" : ""),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "mt-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider " + (TYPE_COLORS[n.type] ?? "bg-mint text-surface"),
                    children: n.type
                  }
                ),
                !n.is_read && /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-surface leading-snug", children: n.message }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-[10px] text-muted-foreground", children: new Date(n.sent_at).toLocaleString() })
            ]
          },
          n.id
        ))
      ] })
    ] })
  ] });
}
function SidebarItem({
  item,
  activeLabel,
  onClick
}) {
  const location = useLocation();
  const isActive = activeLabel ? activeLabel === item.label : location.pathname === item.to;
  const content = /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition cursor-pointer",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground"
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(item.icon, { className: cn("h-4 w-4", isActive ? "opacity-100" : "opacity-60") }),
          /* @__PURE__ */ jsx("span", { className: cn("font-medium", isActive ? "font-bold" : ""), children: item.label })
        ] }),
        item.badge !== void 0 && item.badge > 0 && /* @__PURE__ */ jsx("span", { className: cn(
          "flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white",
          item.badgeColor || "bg-amber"
        ), children: item.badge })
      ]
    }
  );
  if (onClick) {
    return /* @__PURE__ */ jsx("div", { onClick: () => onClick(item), children: content });
  }
  return /* @__PURE__ */ jsx(Link, { to: item.to, className: "block", children: content });
}
function DashboardShell({
  role,
  items,
  children,
  activeLabel,
  onItemClick
}) {
  const displayRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  async function handleSignOut() {
    await signOut(auth);
    clearSession();
    window.location.href = "/";
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("aside", { className: "sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-6 mt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur-sm", children: /* @__PURE__ */ jsx(Pill, { className: "h-5 w-5 text-amber" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold tracking-tight text-white", children: "MEDIKIOSK" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40", children: displayRole })
          ] })
        ] }),
        /* @__PURE__ */ jsx(NotificationBell, {})
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "mt-4 flex flex-1 flex-col gap-1 px-4", children: items.map((item) => /* @__PURE__ */ jsx(
        SidebarItem,
        {
          item,
          activeLabel,
          onClick: onItemClick
        },
        item.label
      )) }),
      /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-white/5", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleSignOut,
          className: "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/50 transition hover:bg-red-500/10 hover:text-red-400",
          children: [
            /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
            "Sign out"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-x-hidden", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl px-8 py-10", children }) })
  ] });
}
export {
  DashboardShell as D
};
