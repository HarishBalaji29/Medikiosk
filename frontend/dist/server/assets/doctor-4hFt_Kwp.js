import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Search, AlertCircle, Clock, CheckCircle2, XCircle, TrendingUp, AlertTriangle, ChevronRight, Stethoscope, Loader2, Save, Users, Home, Inbox, History, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell } from "recharts";
import { D as DashboardShell } from "./DashboardShell-CzaCyi6F.js";
import { n as notificationTemplates, s as showNotification } from "./notifications-D9GoIOmt.js";
import { g as getSession } from "./session-JGLanhG1.js";
import { s as supabase } from "./supabase-xo2Ne9iT.js";
import { useState, useEffect } from "react";
import "@tanstack/react-router";
import "firebase/auth";
import "./firebase-sHON1iw5.js";
import "firebase/app";
import "firebase/messaging";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
import "sonner";
import "@supabase/supabase-js";
const NAV = (counts) => [{
  to: "/doctor",
  label: "Dashboard",
  icon: Home
}, {
  to: "/doctor",
  label: "Queue",
  icon: Inbox,
  badge: counts == null ? void 0 : counts.queue
}, {
  to: "/doctor",
  label: "Urgent",
  icon: AlertCircle,
  badge: counts == null ? void 0 : counts.urgent,
  badgeColor: "bg-red-500"
}, {
  to: "/doctor",
  label: "Approved",
  icon: CheckCircle2
}, {
  to: "/doctor",
  label: "History",
  icon: History
}, {
  to: "/doctor",
  label: "Analytics",
  icon: BarChart3
}];
function statusStyle(s) {
  if (s === "pending" || s === "urgent") return "bg-amber/15 text-amber";
  if (s === "approved") return "bg-success/15 text-success";
  return "bg-destructive/15 text-destructive";
}
function DoctorDashboard() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const session = getSession();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [deciding, setDeciding] = useState(false);
  const [counts, setCounts] = useState({
    queue: 0,
    urgent: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalReviewed: 0,
    approvalRate: 0,
    weeklyData: [],
    rejectionReasons: {}
  });
  const [analytics, setAnalytics] = useState({
    summary: {
      total: 0,
      approved: 0,
      rejected: 0,
      approvalRate: 0,
      avgTime: 0
    },
    rejectionReasons: {},
    weeklyData: []
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const doctorName = (session == null ? void 0 : session.name) ?? "Doctor";
  const hour = (/* @__PURE__ */ new Date()).getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  async function decide(id, status, reason, note) {
    var _a2, _b2, _c2;
    if (!(session == null ? void 0 : session.id) || deciding) return;
    try {
      setDeciding(true);
      const res = await fetch(`${"http://localhost:5000"}/prescriptions/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status,
          doctor_id: session.id,
          rejection_reason: reason,
          notes: note || (status === "approved" ? "Verified and approved." : "Rejected by physician.")
        })
      });
      if (!res.ok) throw new Error("Failed to update status");
      if (status === "approved") {
        const patientName = ((_b2 = (_a2 = selected == null ? void 0 : selected.users) == null ? void 0 : _a2.name) == null ? void 0 : _b2.split(" ")[0]) ?? "Patient";
        const tpl = notificationTemplates.approved(patientName, doctorName.split(" ").pop() || "Doctor");
        showNotification(tpl.title, tpl.body);
      } else {
        showNotification("Case Rejected", `Notification sent to ${(_c2 = selected == null ? void 0 : selected.users) == null ? void 0 : _c2.name}`);
      }
      await fetchAll();
      const next = list.find((r) => r.id !== id && r.status === "pending");
      setSelectedId((next == null ? void 0 : next.id) || null);
    } catch (err) {
      console.error("Decision error:", err);
    } finally {
      setDeciding(false);
    }
  }
  const fetchAll = async () => {
    if (!(session == null ? void 0 : session.id)) return;
    try {
      setLoading(true);
      const [queueRes, historyRes] = await Promise.all([fetch(`${"http://localhost:5000"}/prescriptions/queue`), fetch(`${"http://localhost:5000"}/prescriptions/doctor/${session.id}`)]);
      if (queueRes.ok && historyRes.ok) {
        const queueData = await queueRes.json();
        const historyData = await historyRes.json();
        const merged = [...queueData, ...historyData].reduce((acc, curr) => {
          if (!acc.find((item) => item.id === curr.id)) acc.push(curr);
          return acc;
        }, []);
        const getLocalDate = (d) => new Date(d).toLocaleDateString("en-CA");
        const todayLocal = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
        const approvedToday = merged.filter((r) => r.status === "approved" && getLocalDate(r.updated_at || r.created_at) === todayLocal).length;
        const rejectedToday = merged.filter((r) => r.status === "rejected" && getLocalDate(r.updated_at || r.created_at) === todayLocal).length;
        const totalApproved = merged.filter((r) => r.status === "approved").length;
        const totalRejected = merged.filter((r) => r.status === "rejected").length;
        const totalReviewed = totalApproved + totalRejected;
        const approvalRate = totalReviewed > 0 ? Math.round(totalApproved / totalReviewed * 100) : 0;
        const fmt = new Intl.DateTimeFormat("en-US", {
          weekday: "short"
        });
        const last7Days = Array.from({
          length: 7
        }, (_, i) => {
          const d = /* @__PURE__ */ new Date();
          d.setDate(d.getDate() - (6 - i));
          return fmt.format(d);
        });
        const weeklyData = last7Days.map((day) => {
          const dayData = merged.filter((p) => fmt.format(new Date(p.updated_at || p.created_at)) === day);
          return {
            name: day,
            App: dayData.filter((p) => p.status === "approved").length,
            Rej: dayData.filter((p) => p.status === "rejected").length
          };
        });
        const rejectionReasons = merged.filter((p) => p.status === "rejected" && p.rejection_reason).reduce((acc, curr) => {
          acc[curr.rejection_reason] = (acc[curr.rejection_reason] || 0) + 1;
          return acc;
        }, {});
        setList(merged);
        setCounts({
          queue: queueData.filter((r) => r.status === "pending" && r.type !== "consultation").length,
          urgent: queueData.filter((r) => r.status === "pending" && r.type === "consultation").length,
          approvedToday,
          rejectedToday,
          approvalRate,
          totalReviewed,
          weeklyData,
          rejectionReasons
        });
      }
      const analyticsRes = await fetch(`${"http://localhost:5000"}/ai/doctor-analytics/${session.id}`);
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      } else {
        setAnalytics({
          summary: {
            total: 0,
            approved: 0,
            rejected: 0,
            approvalRate: 0,
            avgTime: 0
          },
          rejectionReasons: {}
        });
      }
    } catch (err) {
      console.error("Data fetch error:", err);
      if (!analytics) setAnalytics({
        summary: {
          total: 0,
          approved: 0,
          rejected: 0,
          approvalRate: 0,
          avgTime: 0
        },
        rejectionReasons: {}
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
    const channel = supabase.channel("doctor-dashboard").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "prescriptions"
    }, () => {
      console.log("Realtime update received");
      fetchAll();
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session == null ? void 0 : session.id]);
  const handleTabClick = (label) => {
    setActiveTab(label);
    setSelectedId(null);
  };
  const selected = list.find((r) => r.id === selectedId);
  const runAiAnalysis = async (rxId) => {
    try {
      setAnalyzing(true);
      const res = await fetch(`${"http://localhost:5000"}/ai/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prescription_id: rxId
        })
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };
  useEffect(() => {
    if (selectedId && activeTab !== "Dashboard" && activeTab !== "Analytics") {
      setAiAnalysis(null);
      runAiAnalysis(selectedId);
    }
  }, [selectedId, activeTab]);
  return /* @__PURE__ */ jsxs(DashboardShell, { role: "Doctor", items: NAV(counts), onItemClick: (item) => handleTabClick(item.label), activeLabel: activeTab, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8 pb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.2em] text-amber", children: "Doctor Command Center" }),
          /* @__PURE__ */ jsxs("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: [
            greeting,
            ", ",
            doctorName,
            "."
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-muted-foreground font-medium", children: [
            "You have ",
            counts.queue,
            " prescriptions and ",
            counts.urgent,
            " urgent requests waiting."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-black/5", children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 opacity-40" }) }),
          /* @__PURE__ */ jsxs("div", { className: "relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-black/5", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-red-500" }),
            counts.urgent > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse", children: counts.urgent })
          ] })
        ] })
      ] }),
      activeTab === "Dashboard" && /* @__PURE__ */ jsxs("div", { className: "grid gap-8 animate-fade-up", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4", children: [{
          label: "Pending Today",
          val: counts.queue,
          icon: Clock,
          color: "text-amber"
        }, {
          label: "Approved Today",
          val: counts.approvedToday,
          icon: CheckCircle2,
          color: "text-success"
        }, {
          label: "Rejected Today",
          val: counts.rejectedToday,
          icon: XCircle,
          color: "text-red-500"
        }, {
          label: "Approval Rate",
          val: `${counts.approvalRate}%`,
          icon: TrendingUp,
          color: "text-sidebar-accent-foreground"
        }].map((s, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-white p-6 shadow-soft transition-all hover:scale-[1.02]", children: [
          /* @__PURE__ */ jsx("div", { className: `mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 ${s.color}`, children: /* @__PURE__ */ jsx(s.icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-surface", children: s.val }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: s.label })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1", children: [
            /* @__PURE__ */ jsxs("h3", { className: "mb-4 text-sm font-bold text-surface uppercase tracking-widest flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-red-500" }),
              " Urgent Alerts"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              list.filter((r) => r.type === "consultation" && r.status === "pending").map((u, i) => {
                var _a2;
                return /* @__PURE__ */ jsxs("div", { onClick: () => {
                  setActiveTab("Urgent");
                  setSelectedId(u.id);
                }, className: "group cursor-pointer rounded-2xl bg-red-50 p-4 border border-red-100 flex items-center gap-3 transition-all hover:bg-red-100", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-red-500 animate-pulse" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-red-900", children: (_a2 = u.users) == null ? void 0 : _a2.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-red-700 opacity-80 line-clamp-1", children: u.notes || "Reported Symptoms" })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" })
                ] }, i);
              }),
              counts.urgent === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border-2 border-dashed border-gray-100 p-8 text-center text-muted-foreground", children: /* @__PURE__ */ jsx("p", { className: "text-sm opacity-50", children: "No urgent alerts at this moment" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-4 text-sm font-bold text-surface uppercase tracking-widest", children: "Recent Activity" }),
            /* @__PURE__ */ jsx("div", { className: "rounded-3xl bg-white shadow-soft overflow-hidden", children: list.slice(0, 5).map((r, i) => {
              var _a2;
              return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b border-gray-50 p-4 last:border-0 hover:bg-gray-50 transition-colors", children: [
                /* @__PURE__ */ jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-full ${r.status === "approved" ? "bg-success/10 text-success" : r.status === "pending" ? "bg-amber/10 text-amber" : "bg-red-50 text-red-500"}`, children: r.status === "approved" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" }) : r.status === "pending" ? /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-surface", children: (_a2 = r.users) == null ? void 0 : _a2.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground uppercase font-bold tracking-tighter", children: [
                    r.status,
                    " — ",
                    new Date(r.updated_at || r.created_at).toLocaleTimeString()
                  ] })
                ] }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  setActiveTab(r.status === "pending" ? "Queue" : "History");
                  setSelectedId(r.id);
                }, className: "text-xs font-bold text-amber hover:underline px-4 py-2 bg-amber/5 rounded-lg", children: "View Details" })
              ] }, i);
            }) })
          ] })
        ] })
      ] }),
      (activeTab === "Queue" || activeTab === "Urgent" || activeTab === "Approved" || activeTab === "History") && /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr,1.8fr] animate-fade-up", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          list.filter((r) => {
            if (activeTab === "Queue") return r.status === "pending" && r.type !== "consultation";
            if (activeTab === "Urgent") return r.status === "pending" && r.type === "consultation";
            if (activeTab === "Approved") return r.status === "approved";
            if (activeTab === "History") return r.status !== "pending";
            return true;
          }).map((r) => {
            var _a2;
            return /* @__PURE__ */ jsxs("button", { onClick: () => setSelectedId(r.id), className: `group flex w-full items-center gap-4 rounded-2xl p-4 text-left shadow-card transition-all hover:-translate-y-0.5  ${selectedId === r.id ? "ring-2 ring-amber bg-white" : "bg-white/60 hover:bg-white"}`, children: [
              /* @__PURE__ */ jsx("div", { className: `flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm ${r.type === "consultation" ? "bg-red-100 text-red-600" : "bg-mint text-surface"}`, children: r.type === "consultation" ? /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Stethoscope, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "truncate text-sm font-bold text-surface", children: ((_a2 = r.users) == null ? void 0 : _a2.name) || "Unknown Patient" }),
                  /* @__PURE__ */ jsx("span", { className: `ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyle(r.status)}`, children: r.status })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-3 text-xs text-muted-foreground font-medium", children: [
                  /* @__PURE__ */ jsxs("span", { className: "opacity-60", children: [
                    "#",
                    r.id.slice(0, 8)
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                    new Date(r.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(ChevronRight, { className: `h-4 w-4 transition-transform ${selectedId === r.id ? "translate-x-1 text-amber" : "text-muted-foreground opacity-30"}` })
            ] }, r.id);
          }),
          list.filter((r) => {
            if (activeTab === "Queue") return r.status === "pending" && r.type !== "consultation";
            if (activeTab === "Urgent") return r.status === "pending" && r.type === "consultation";
            if (activeTab === "Approved") return r.status === "approved";
            if (activeTab === "History") return r.status !== "pending";
            return true;
          }).length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center text-muted-foreground", children: /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold opacity-40 uppercase tracking-widest", children: [
            "No cases in ",
            activeTab
          ] }) })
        ] }),
        selected ? /* @__PURE__ */ jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.5fr,1fr]", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-white p-6 shadow-soft md:p-8 flex flex-col gap-8", children: [
            analyzing ? /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-surface p-6 text-white animate-pulse", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin text-amber" }),
                /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-widest opacity-70", children: "Deep Case Analysis..." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("div", { className: "h-3 w-¾ bg-white/10 rounded" }),
                /* @__PURE__ */ jsx("div", { className: "h-3 w-½ bg-white/10 rounded" })
              ] })
            ] }) : aiAnalysis && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-surface p-6 text-white shadow-lg shadow-black/10", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded bg-amber/20 text-amber", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold uppercase tracking-[0.15em] text-amber", children: "AI Clinical Safety Analysis" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${aiAnalysis.risk_level === "low" ? "bg-success/20 text-success" : "bg-red-500/20 text-red-400"}`, children: [
                  /* @__PURE__ */ jsx("div", { className: `h-1.5 w-1.5 rounded-full ${aiAnalysis.risk_level === "low" ? "bg-success" : "bg-red-400"}` }),
                  aiAnalysis.risk_level,
                  " Risk"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-y-4 gap-x-6 text-[11px] font-medium border-y border-white/5 py-4 mb-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "opacity-30 uppercase tracking-tighter", children: "Drug Interaction" }),
                  /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5 line-clamp-1", children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3 text-success" }),
                    " ",
                    aiAnalysis.drug_interaction
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "opacity-30 uppercase tracking-tighter", children: "Dosage Safety" }),
                  /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5 line-clamp-1", children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3 text-success" }),
                    " ",
                    aiAnalysis.dosage_safety
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "opacity-30 uppercase tracking-tighter", children: "Allergy Check" }),
                  /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5 line-clamp-1", children: [
                    /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3 text-success" }),
                    " ",
                    aiAnalysis.allergy_check
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm italic opacity-90 leading-relaxed font-serif", children: [
                '"',
                aiAnalysis.suggestion,
                '"'
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 rounded-3xl bg-amber/5 border border-amber/10", children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-[10px] font-bold uppercase tracking-widest text-dark-800 mb-3 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Save, { className: "h-3 w-3" }),
                " Private Notes"
              ] }),
              /* @__PURE__ */ jsx("textarea", { className: "w-full bg-transparent border-0 focus:ring-0 text-sm font-medium text-surface placeholder:text-amber/40 min-h-[80px]", placeholder: "Click to add private clinical notes..." })
            ] }),
            selected.status === "pending" && /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-2", children: [
              /* @__PURE__ */ jsx("button", { disabled: deciding, onClick: () => decide(selected.id, "approved"), className: "flex items-center justify-center gap-2 rounded-2xl bg-success px-6 py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-success/20 disabled:opacity-50", children: deciding ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin h-5 w-5" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" }),
                " APPROVE"
              ] }) }),
              /* @__PURE__ */ jsxs("button", { disabled: deciding, onClick: () => setShowRejectModal(true), className: "flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-6 py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/20", children: [
                /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5" }),
                " REJECT"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-white p-6 shadow-soft flex flex-col gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-mint text-surface", children: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-surface", children: (_a = selected.users) == null ? void 0 : _a.name }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-muted-foreground opacity-60 tracking-tighter", children: (_b = selected.users) == null ? void 0 : _b.phone_number })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: [{
              label: "Age",
              val: ((_c = selected.users) == null ? void 0 : _c.age) || "—"
            }, {
              label: "Blood",
              val: ((_d = selected.users) == null ? void 0 : _d.blood_group) || "O+"
            }, {
              label: "Weight",
              val: `${((_e = selected.users) == null ? void 0 : _e.weight) || "65"} kg`
            }, {
              label: "Height",
              val: `${((_f = selected.users) == null ? void 0 : _f.height) || "165"} cm`
            }].map((h, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-gray-50/50 p-4 border border-gray-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-40", children: h.label }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-surface", children: h.val })
            ] }, i)) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 px-1", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 opacity-30", children: "Chronic Conditions" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: (((_g = selected.users) == null ? void 0 : _g.conditions) || ["None reported"]).map((c, j) => /* @__PURE__ */ jsx("span", { className: "rounded-lg bg-sidebar-accent/10 px-2.5 py-1 text-[10px] font-bold text-sidebar-accent-foreground", children: c }, j)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 opacity-30", children: "Known Allergies" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: (((_h = selected.users) == null ? void 0 : _h.allergies) || ["None reported"]).map((a, j) => /* @__PURE__ */ jsxs("span", { className: `rounded-lg px-2.5 py-1 text-[10px] font-bold ${a === "None reported" ? "bg-gray-100 text-gray-400" : "bg-red-50 text-red-600"}`, children: [
                  a === "None reported" ? "" : "⚠ ",
                  " ",
                  a
                ] }, j)) })
              ] })
            ] })
          ] }) })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex h-[500px] flex-col items-center justify-center rounded-3xl bg-white border-2 border-dashed border-gray-100 text-muted-foreground p-12", children: [
          /* @__PURE__ */ jsx("div", { className: "h-16 w-16 rounded-full bg-mint/10 flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(Search, { className: "h-8 w-8 text-mint" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold uppercase tracking-widest opacity-30", children: "Select a case to begin review" })
        ] })
      ] }),
      activeTab === "Analytics" && /* @__PURE__ */ jsxs("div", { className: "grid gap-8 animate-fade-up", children: [
        /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-3", children: [{
          label: "Total Reviewed",
          val: counts.totalReviewed,
          icon: Users,
          delta: "Live"
        }, {
          label: "Avg Review Time",
          val: `${((_i = analytics == null ? void 0 : analytics.summary) == null ? void 0 : _i.avgTime) ?? 0}m`,
          icon: Clock,
          delta: "Trend"
        }, {
          label: "Decision Accuracy",
          val: `${counts.approvalRate}%`,
          icon: Stethoscope,
          delta: "High"
        }].map((a, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-white p-6 shadow-soft border border-white", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-surface text-amber", children: /* @__PURE__ */ jsx(a.icon, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold px-2 py-1 rounded-lg bg-mint/10 text-mint uppercase tracking-widest", children: a.delta })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-surface", children: a.val }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1", children: a.label })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-white p-8 shadow-soft border border-white min-h-[420px] flex flex-col", children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-8 text-sm font-bold text-surface uppercase tracking-widest", children: "Decision Breakdown (Weekly)" }),
            /* @__PURE__ */ jsx("div", { className: "flex-1 w-full min-h-[300px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: ((_j = counts.weeklyData) == null ? void 0 : _j.length) ? counts.weeklyData : [{
              name: "Mon",
              App: 0,
              Rej: 0
            }, {
              name: "Tue",
              App: 0,
              Rej: 0
            }, {
              name: "Wed",
              App: 0,
              Rej: 0
            }, {
              name: "Thu",
              App: 0,
              Rej: 0
            }, {
              name: "Fri",
              App: 0,
              Rej: 0
            }, {
              name: "Sat",
              App: 0,
              Rej: 0
            }, {
              name: "Sun",
              App: 0,
              Rej: 0
            }], children: [
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f1f1f1" }),
              /* @__PURE__ */ jsx(XAxis, { dataKey: "name", fontSize: 10, axisLine: false, tickLine: false, tick: {
                fill: "#94a3b8"
              }, dy: 10 }),
              /* @__PURE__ */ jsx(YAxis, { fontSize: 10, axisLine: false, tickLine: false, tick: {
                fill: "#94a3b8"
              } }),
              /* @__PURE__ */ jsx(Tooltip, { cursor: {
                fill: "#f8fafc"
              }, contentStyle: {
                borderRadius: "16px",
                border: "none",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"
              } }),
              /* @__PURE__ */ jsx(Bar, { dataKey: "App", fill: "#1a3a2a", radius: [4, 4, 0, 0], barSize: 20 }),
              /* @__PURE__ */ jsx(Bar, { dataKey: "Rej", fill: "#ef4444", radius: [4, 4, 0, 0], barSize: 20 })
            ] }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-white p-8 shadow-soft border border-white min-h-[420px] flex flex-col justify-center text-center", children: [
            /* @__PURE__ */ jsx("h4", { className: "mb-0 text-sm font-bold text-surface uppercase tracking-widest", children: "Root Causes for Rejection" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full min-h-[300px] flex flex-col justify-center items-center", children: [
              /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
                /* @__PURE__ */ jsx(Pie, { data: Object.keys(counts.rejectionReasons || {}).length > 0 ? Object.entries(counts.rejectionReasons).map(([name, value]) => ({
                  name,
                  value
                })) : [{
                  name: "No Rejections",
                  value: 1
                }], innerRadius: 70, outerRadius: 100, paddingAngle: 8, dataKey: "value", stroke: "none", children: ["#d4a853", "#1a3a2a", "#ef4444", "#10b981", "#6366f1"].map((color, i) => /* @__PURE__ */ jsx(Cell, { fill: color }, i)) }),
                /* @__PURE__ */ jsx(Tooltip, {})
              ] }) }),
              !Object.keys((analytics == null ? void 0 : analytics.rejectionReasons) || {}).length && /* @__PURE__ */ jsx("p", { className: "mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40", children: "No record of clinical rejection yet" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    showRejectModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-surface", children: "Reason for Rejection" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground font-medium", children: "Please select a reason for denying this prescription. This will be shared with the patient." }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-2", children: ["Image quality too low", "Prescription expired", "Incomplete prescription", "Suspected forgery", "Wrong dosage requested", "Medicine not available in stock", "Other"].map((reason) => /* @__PURE__ */ jsxs("button", { onClick: () => setRejectReason(reason), className: `w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${rejectReason === reason ? "border-amber bg-amber/5 text-surface" : "border-gray-50 text-muted-foreground hover:border-gray-100"}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold", children: reason }),
        /* @__PURE__ */ jsx("div", { className: `h-5 w-5 rounded-full border-2 flex items-center justify-center ${rejectReason === reason ? "border-amber" : "border-gray-200"}`, children: rejectReason === reason && /* @__PURE__ */ jsx("div", { className: "h-2.5 w-2.5 rounded-full bg-amber" }) })
      ] }, reason)) }),
      /* @__PURE__ */ jsx("textarea", { className: "mt-6 w-full rounded-2xl border-2 border-gray-50 bg-gray-50/30 p-4 text-sm font-medium placeholder:text-muted-foreground/30 focus:border-amber/20 focus:ring-0 transition-all font-serif italic", placeholder: "Additional note (optional)...", onChange: (e) => setRejectNote(e.target.value) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setShowRejectModal(false), className: "rounded-2xl px-6 py-4 text-sm font-bold text-muted-foreground hover:bg-gray-50 transition-colors uppercase tracking-widest", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          if (selected) {
            decide(selected.id, "rejected", rejectReason, rejectNote);
            setShowRejectModal(false);
          }
        }, disabled: !rejectReason || deciding, className: "rounded-2xl bg-red-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 uppercase tracking-widest", children: deciding ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin h-5 w-5" }) : "Confirm Reject" })
      ] })
    ] }) })
  ] });
}
export {
  DoctorDashboard as component
};
