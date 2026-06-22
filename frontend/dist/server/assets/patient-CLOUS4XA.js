import { jsx } from "react/jsx-runtime";
import { useNavigate, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LayoutDashboard, Upload, Pill, FileText, Bot, Search, History, User } from "lucide-react";
import { D as DashboardShell } from "./DashboardShell-CzaCyi6F.js";
import { g as getSession, s as setSession } from "./session-JGLanhG1.js";
import "firebase/auth";
import "./firebase-sHON1iw5.js";
import "firebase/app";
import "firebase/messaging";
import "./supabase-xo2Ne9iT.js";
import "@supabase/supabase-js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
const NAV = [{
  to: "/patient",
  label: "Dashboard",
  icon: LayoutDashboard
}, {
  to: "/patient/upload",
  label: "Upload Prescription",
  icon: Upload
}, {
  to: "/patient/medicines",
  label: "My Medicines",
  icon: Pill
}, {
  to: "/patient/reports",
  label: "Health Reports",
  icon: FileText
}, {
  to: "/patient/ai-assistant",
  label: "AI Assistant",
  icon: Bot
}, {
  to: "/patient/prices",
  label: "Medicine Prices",
  icon: Search
}, {
  to: "/patient/history",
  label: "History",
  icon: History
}, {
  to: "/patient/profile",
  label: "My Profile",
  icon: User
}];
const BACKEND = "http://localhost:5000";
function PatientLayout() {
  const navigate = useNavigate();
  const [session, setSession$1] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      navigate({
        to: "/auth"
      });
      return;
    }
    setSession$1(currentSession);
    setIsMounted(true);
    async function syncProfile() {
      if (!(currentSession == null ? void 0 : currentSession.id)) return;
      try {
        const res = await fetch(`${BACKEND}/auth/profile/${currentSession.id}`);
        if (res.ok) {
          const userData = await res.json();
          const updatedSession = {
            ...currentSession,
            ...userData,
            phone: userData.phone_number
          };
          setSession(updatedSession);
          setSession$1(updatedSession);
        }
      } catch (err) {
        console.error("Layout sync error:", err);
      }
    }
    syncProfile();
  }, []);
  if (!isMounted) return null;
  const displayRole = (session == null ? void 0 : session.role) || "Patient";
  return /* @__PURE__ */ jsx(DashboardShell, { role: displayRole, items: NAV, children: /* @__PURE__ */ jsx("div", { className: "mb-0", children: /* @__PURE__ */ jsx(Outlet, {}) }) });
}
export {
  PatientLayout as component
};
