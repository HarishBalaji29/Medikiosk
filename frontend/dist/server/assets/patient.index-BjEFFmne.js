import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { FileText, Pill, Activity, Clock, LayoutDashboard, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { g as getSession } from "./session-JGLanhG1.js";
const BACKEND = "http://localhost:5000";
function DashboardOverview() {
  const [session] = useState(() => getSession());
  const [profileName, setProfileName] = useState((session == null ? void 0 : session.name) || "Patient");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    prescriptions: 0,
    activeMeds: 0,
    reports: 0,
    lastActivity: "No activity"
  });
  const [timelineData, setTimelineData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  useEffect(() => {
    async function fetchData() {
      var _a;
      try {
        if (!(session == null ? void 0 : session.id)) {
          setLoading(false);
          return;
        }
        const profileRes = await fetch(`${BACKEND}/auth/profile/${session.id}`);
        if (profileRes.ok) {
          const userData = await profileRes.json();
          if (userData.name) setProfileName(userData.name);
        }
        const prescRes = await fetch(`${BACKEND}/prescriptions/patient/${session.id}`);
        const prescDataRaw = prescRes.ok ? await prescRes.json() : [];
        const prescCount = prescDataRaw.length;
        const approvedPresc = prescDataRaw.filter((p) => p.status === "approved");
        const activeMedsCount = approvedPresc.reduce((acc, curr) => {
          var _a2, _b, _c;
          return acc + (((_b = (_a2 = curr.extracted_data) == null ? void 0 : _a2.medicines) == null ? void 0 : _b.length) || ((_c = curr.extracted_data) == null ? void 0 : _c.length) || 0);
        }, 0);
        const reportsRes = await fetch(`${BACKEND}/reports/patient/${session.id}`);
        const reports = reportsRes.ok ? await reportsRes.json() : [];
        const reportCount = reports.length;
        const mappedTimeline = reports.map((r) => {
          const vals = r.extracted_values || {};
          let sugarVal = 0;
          let bpVal = 0;
          const parseVal = (v) => {
            if (!v) return 0;
            const num = parseFloat(v.toString().replace(/[^0-9.]/g, ""));
            return isNaN(num) ? 0 : num;
          };
          if (Array.isArray(vals)) {
            const sugarObj = vals.find((v) => {
              var _a2, _b;
              return ((_a2 = v.test_name) == null ? void 0 : _a2.toLowerCase().includes("sugar")) || ((_b = v.test_name) == null ? void 0 : _b.toLowerCase().includes("glucose"));
            });
            const bpObj = vals.find((v) => {
              var _a2, _b, _c;
              return ((_a2 = v.test_name) == null ? void 0 : _a2.toLowerCase().includes("bp")) || ((_b = v.test_name) == null ? void 0 : _b.toLowerCase().includes("pressure")) || ((_c = v.test_name) == null ? void 0 : _c.toLowerCase().includes("hemoglobin"));
            });
            sugarVal = parseVal(sugarObj == null ? void 0 : sugarObj.value);
            bpVal = parseVal(bpObj == null ? void 0 : bpObj.value);
          } else {
            sugarVal = parseVal(vals.sugar || vals["Blood Sugar"] || vals["Glucose"]);
            bpVal = parseVal(vals.bp || vals["Blood Pressure"] || vals["Hemoglobin"]);
          }
          return {
            date: new Date(r.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short"
            }),
            sugar: sugarVal,
            bp: bpVal,
            fullDate: new Date(r.created_at).toLocaleDateString()
          };
        }).filter((d) => d.sugar > 0 || d.bp > 0).reverse();
        const logsRes = await fetch(`${BACKEND}/prescriptions/dispense-logs/${session.id}`);
        const dispenseLogs = logsRes.ok ? await logsRes.json() : [];
        const activities = [...prescDataRaw.map((p) => ({
          id: `p-${p.id}`,
          type: "Prescription",
          status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
          time: p.created_at,
          icon: CheckCircle2,
          color: p.status === "approved" ? "text-success bg-success/15" : "text-amber bg-amber/15"
        })), ...dispenseLogs.map((l) => ({
          id: `l-${l.id}`,
          type: "Medicine",
          status: "Dispensed",
          time: l.dispensed_at,
          icon: Pill,
          color: "text-mint bg-mint/15"
        })), ...reports.map((r) => ({
          id: `r-${r.id}`,
          type: "Report",
          status: "Uploaded",
          time: r.created_at,
          icon: FileText,
          color: "text-sidebar-accent-foreground bg-sidebar-accent/15"
        }))].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
        const lastAct = ((_a = activities[0]) == null ? void 0 : _a.time) ? new Intl.RelativeTimeFormat("en", {
          numeric: "auto"
        }).format(Math.round((new Date(activities[0].time).getTime() - Date.now()) / (1e3 * 60 * 60 * 24)), "day") : "No recent activity";
        setTimelineData(mappedTimeline);
        setRecentActivity(activities);
        setStats({
          prescriptions: prescCount,
          activeMeds: activeMedsCount,
          reports: reportCount,
          lastActivity: activities.length > 0 ? lastAct : "No activity"
        });
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);
  const firstName = profileName.split(" ")[0] || "Patient";
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "h-10 w-48 rounded bg-card" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "h-32 rounded-3xl bg-card" }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "h-64 rounded-3xl bg-card" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in space-y-8 pb-12", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-semibold text-surface", children: [
        "Hello, ",
        firstName,
        ". 👋"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-muted-foreground", children: "Here's your health overview" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4", children: [{
      label: "Prescriptions",
      val: stats.prescriptions,
      icon: FileText,
      color: "bg-amber/10 text-amber"
    }, {
      label: "Active Medicines",
      val: stats.activeMeds,
      icon: Pill,
      color: "bg-success/10 text-success"
    }, {
      label: "Reports Uploaded",
      val: stats.reports,
      icon: Activity,
      color: "bg-sidebar-accent/10 text-sidebar-accent-foreground"
    }, {
      label: "Last Activity",
      val: stats.lastActivity,
      icon: Clock,
      color: "bg-mint/60 text-surface"
    }].map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col rounded-3xl bg-card p-6 shadow-card transition-hover", children: [
      /* @__PURE__ */ jsx("div", { className: `mb-4 flex h-10 w-10 items-center justify-center rounded-2xl ${s.color}`, children: /* @__PURE__ */ jsx(s.icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-surface", children: s.val }),
      /* @__PURE__ */ jsx("span", { className: "mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wider", children: s.label })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-8 shadow-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-surface", children: "Health Timeline" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "BP, Sugar & Vitals trends from your reports" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-amber" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Sugar/Glucose" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "h-3 w-3 rounded-full bg-sidebar-accent-foreground" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "BP/Hemoglobin" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-[300px] w-full", children: timelineData.length > 0 ? /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: timelineData, children: [
        /* @__PURE__ */ jsxs("defs", { children: [
          /* @__PURE__ */ jsxs("linearGradient", { id: "colorSugar", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#d4a853", stopOpacity: 0.3 }),
            /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#d4a853", stopOpacity: 0 })
          ] }),
          /* @__PURE__ */ jsxs("linearGradient", { id: "colorBP", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#1a3a2a", stopOpacity: 0.3 }),
            /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#1a3a2a", stopOpacity: 0 })
          ] })
        ] }),
        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#e5e7eb" }),
        /* @__PURE__ */ jsx(XAxis, { dataKey: "date", axisLine: false, tickLine: false, tick: {
          fontSize: 12,
          fill: "#6b7280"
        }, dy: 10 }),
        /* @__PURE__ */ jsx(YAxis, { axisLine: false, tickLine: false, tick: {
          fontSize: 12,
          fill: "#6b7280"
        } }),
        /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
          borderRadius: "16px",
          border: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        } }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "sugar", stroke: "#d4a853", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorSugar)" }),
        /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "bp", stroke: "#1a3a2a", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorBP)" })
      ] }) }) : /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center text-muted-foreground", children: [
        /* @__PURE__ */ jsx(LayoutDashboard, { className: "mb-4 h-12 w-12 opacity-20" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "No report data available yet. Upload a health report to see trends." })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 lg:grid-cols-1", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-8 shadow-card", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-6 text-xl font-semibold text-surface", children: "Recent Activity" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: recentActivity.length > 0 ? recentActivity.map((act) => /* @__PURE__ */ jsxs("div", { className: "group flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: `flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${act.color}`, children: /* @__PURE__ */ jsx(act.icon, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-semibold text-surface", children: [
              act.type,
              " ",
              act.status
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: new Date(act.time).toLocaleString() })
          ] })
        ] }),
        act.type === "Prescription" && act.status === "Approved" && /* @__PURE__ */ jsx(Link, { to: "/patient/payment", className: "rounded-full bg-amber px-4 py-2 text-[10px] font-black uppercase tracking-widest text-amber-foreground shadow-soft transition-all hover:scale-105 active:scale-95", children: "Pay & Collect" }),
        /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-5 w-5 text-muted-foreground opacity-0 transition group-hover:opacity-100" })
      ] }, act.id)) : /* @__PURE__ */ jsx("p", { className: "text-center text-sm text-muted-foreground py-8", children: "No recent activity detected." }) })
    ] }) })
  ] });
}
export {
  DashboardOverview as component
};
