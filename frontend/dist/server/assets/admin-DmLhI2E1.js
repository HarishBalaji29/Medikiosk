import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { LayoutDashboard, Boxes, Server, ScrollText, Bell, Users, LineChart, Settings, Loader2, Activity, AlertTriangle, Plus, Pencil, Trash2, Download, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart as LineChart$1, CartesianGrid, XAxis, YAxis, Tooltip, Line, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { D as DashboardShell } from "./DashboardShell-CzaCyi6F.js";
import "@tanstack/react-router";
import "firebase/auth";
import "./firebase-sHON1iw5.js";
import "firebase/app";
import "firebase/messaging";
import "./session-JGLanhG1.js";
import "./supabase-xo2Ne9iT.js";
import "@supabase/supabase-js";
import "./utils-H80jjgLf.js";
import "clsx";
import "tailwind-merge";
const NAV = [{
  id: "overview",
  label: "Kiosk Overview",
  icon: LayoutDashboard
}, {
  id: "inventory",
  label: "Inventory",
  icon: Boxes
}, {
  id: "machine",
  label: "Machine Status",
  icon: Server
}, {
  id: "logs",
  label: "Dispense Logs",
  icon: ScrollText
}, {
  id: "alerts",
  label: "Alerts",
  icon: Bell,
  badge: true
}, {
  id: "users",
  label: "Users",
  icon: Users
}, {
  id: "analytics",
  label: "Analytics",
  icon: LineChart
}, {
  id: "settings",
  label: "Settings",
  icon: Settings
}];
function AdminDashboard() {
  var _a, _b, _c;
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showAddMachine, setShowAddMachine] = useState(false);
  const fetchAllData = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1e4);
    try {
      setError(null);
      const res = await fetch(`${"http://localhost:5000"}/admin/stats`, {
        signal: controller.signal
      });
      if (!res.ok) throw new Error(`Server Response: ${res.status}`);
      const stats = await res.json();
      setData(stats);
    } catch (err) {
      console.error("[Admin] Fetch error:", err);
      if (err.name === "AbortError") {
        setError("Request timed out. Mission control is taking too long to respond.");
      } else {
        setError(err.message || "Failed to synchronize with mission control.");
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllData();
    const timer = setInterval(fetchAllData, 3e4);
    return () => clearInterval(timer);
  }, []);
  const navItems = NAV.map((item) => {
    var _a2;
    return {
      to: "#",
      label: item.label,
      icon: item.icon,
      badge: item.badge && ((_a2 = data == null ? void 0 : data.summary) == null ? void 0 : _a2.lowStockCount) > 0 ? data.summary.lowStockCount : void 0
    };
  });
  const handleTabChange = (item) => {
    const navItem = NAV.find((n) => n.label === item.label);
    if (navItem) {
      setActiveTab(navItem.id);
    }
  };
  if (loading && !data && !error) {
    return /* @__PURE__ */ jsx(DashboardShell, { role: "Admin", items: navItems, activeLabel: (_a = NAV.find((n) => n.id === activeTab)) == null ? void 0 : _a.label, onItemClick: handleTabChange, children: /* @__PURE__ */ jsxs("div", { className: "flex h-[60vh] flex-col items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-12 w-12 animate-spin text-amber" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4 text-amber animate-pulse" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-surface tracking-[0.2em] uppercase", children: "Initializing" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1", children: "Establishing Secure Uplink..." })
      ] })
    ] }) });
  }
  if (error && !data) {
    return /* @__PURE__ */ jsx(DashboardShell, { role: "Admin", items: navItems, activeLabel: (_b = NAV.find((n) => n.id === activeTab)) == null ? void 0 : _b.label, onItemClick: handleTabChange, children: /* @__PURE__ */ jsxs("div", { className: "flex h-[60vh] flex-col items-center justify-center gap-6 text-center animate-fade-up", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-full bg-red-50 p-6 shadow-soft", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-12 w-12 text-red-500" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-surface", children: "System Synchronization Failed" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed", children: error })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => {
        setLoading(true);
        fetchAllData();
      }, className: "rounded-full bg-surface px-10 py-4 text-xs font-black uppercase tracking-widest text-surface-foreground shadow-soft hover:opacity-90 transition-all active:scale-95", children: "Retry Handshake" })
    ] }) });
  }
  const dashboardData = data || {
    summary: {
      dispensedToday: 0,
      activeSkus: 0,
      pendingPrescriptions: 0,
      lowStockCount: 0
    },
    charts: {
      lineChartData: [],
      pieChartData: []
    },
    machines: []
  };
  return /* @__PURE__ */ jsxs(DashboardShell, { role: "Admin", items: navItems, activeLabel: (_c = NAV.find((n) => n.id === activeTab)) == null ? void 0 : _c.label, onItemClick: handleTabChange, children: [
    activeTab === "overview" && /* @__PURE__ */ jsx(OverviewPage, { data: dashboardData }),
    activeTab === "inventory" && /* @__PURE__ */ jsx(InventoryPage, { onAdd: () => setShowAddMedicine(true) }),
    activeTab === "machine" && /* @__PURE__ */ jsx(MachinePage, { data: dashboardData }),
    activeTab === "logs" && /* @__PURE__ */ jsx(LogsPage, {}),
    activeTab === "alerts" && /* @__PURE__ */ jsx(AlertsPage, {}),
    activeTab === "users" && /* @__PURE__ */ jsx(UsersPage, {}),
    activeTab === "analytics" && /* @__PURE__ */ jsx(AnalyticsPage, {}),
    activeTab === "settings" && /* @__PURE__ */ jsx(SettingsPage, {}),
    showAddMedicine && /* @__PURE__ */ jsx(AddMedicineModal, { onClose: () => setShowAddMedicine(false), onRefresh: fetchAllData })
  ] });
}
function OverviewPage({
  data
}) {
  var _a;
  const {
    summary,
    charts,
    machines
  } = data;
  const primaryMachine = machines[0] || {};
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Mission Control" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "Kiosk overview" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-3 lg:grid-cols-6", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Dispensed Today", value: summary.dispensedToday, sub: "Live" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Active SKUs", value: summary.activeSkus, sub: "Inventory" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Machine Status", value: primaryMachine.status === "online" ? "Online" : "Offline", sub: "MEDI-001", isStatus: true, status: primaryMachine.status === "online" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Pending", value: summary.pendingPrescriptions, sub: "Prescriptions", isAmber: true }),
      /* @__PURE__ */ jsx(StatCard, { label: "Low Stock", value: summary.lowStockCount, sub: "Alerts", isRed: summary.lowStockCount > 0 }),
      /* @__PURE__ */ jsx(StatCard, { label: "Revenue Today", value: `₹${(_a = summary.revenueToday) == null ? void 0 : _a.toLocaleString()}`, sub: "Paid", isAmber: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-surface", children: "Dispense Trend · Last 30 Days" }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 h-64 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart$1, { data: charts.lineChartData, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f5f0e8", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "date", hide: true }),
          /* @__PURE__ */ jsx(YAxis, { tick: {
            fontSize: 11,
            fill: "#1a3a2a"
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(Tooltip, { contentStyle: {
            borderRadius: 12,
            border: "none",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
          } }),
          /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "count", stroke: "#1a3a2a", strokeWidth: 3, dot: false })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-surface", children: "Prescription Overview" }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 h-64 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(Pie, { data: charts.pieChartData, cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 80, paddingAngle: 5, dataKey: "value", children: charts.pieChartData.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, `cell-${index}`)) }),
          /* @__PURE__ */ jsx(Tooltip, {})
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-6", children: charts.pieChartData.map((d) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "h-2.5 w-2.5 rounded-full", style: {
            backgroundColor: d.color
          } }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-surface", children: d.name })
        ] }, d.name)) })
      ] })
    ] })
  ] });
}
function InventoryPage({
  onAdd
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${"http://localhost:5000"}/admin/inventory`).then((r) => r.json()).then((d) => setItems(d)).finally(() => setLoading(false));
  }, []);
  const lowStockItems = items.filter((i) => i.stock_quantity < i.low_stock_threshold);
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-end justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Pharmacy" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "Inventory" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onAdd, className: "flex items-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-bold text-surface-foreground hover:opacity-90 transition-all active:scale-95 shadow-soft", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        "Add Medicine"
      ] })
    ] }),
    lowStockItems.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-2xl bg-amber/10 border border-amber/30 p-5 flex items-start gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-full bg-amber/20 p-2 text-amber", children: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-surface uppercase tracking-wider", children: "Low Stock Alert" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          lowStockItems.length,
          " medicines need restocking.",
          /* @__PURE__ */ jsxs("span", { className: "ml-2 font-semibold text-surface", children: [
            lowStockItems.slice(0, 3).map((i) => `${i.medicines.name}: ${i.stock_quantity} units`).join(" · "),
            lowStockItems.length > 3 && " ..."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "text-xs font-bold text-amber hover:underline", children: "View All Alerts" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-3xl bg-card p-6 shadow-card overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border", children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Medicine" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Stock" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Threshold" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Expiry" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-4 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-4 text-right font-semibold text-muted-foreground uppercase tracking-wider text-[10px]", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: items.map((item) => {
        const isCritical = item.stock_quantity < item.low_stock_threshold / 2;
        const isLow = item.stock_quantity < item.low_stock_threshold;
        const status = item.stock_quantity === 0 ? "Out of Stock" : isCritical ? "Critical" : isLow ? "Low" : "Good";
        const statusColor = item.stock_quantity === 0 ? "bg-red-500" : isCritical ? "bg-red-500" : isLow ? "bg-amber" : "bg-success";
        return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-background/50 transition-colors", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-5 font-bold text-surface", children: /* @__PURE__ */ jsxs("div", { children: [
            item.medicines.name,
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium text-muted-foreground uppercase", children: item.medicines.category })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-5 font-mono font-medium", children: item.stock_quantity }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-5 text-muted-foreground", children: item.low_stock_threshold }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-5 font-medium", children: item.expiry_date }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: `h-2 w-2 rounded-full ${statusColor}` }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-surface", children: status })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-5 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsx("button", { className: "rounded-full p-2 hover:bg-gray-100 transition-colors text-muted-foreground", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "rounded-full p-2 hover:bg-red-50 transition-colors text-red-500", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }, item.id);
      }) })
    ] }) }) })
  ] });
}
function MachinePage({
  data
}) {
  const {
    machines
  } = data;
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Hardware" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "Machine Status" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2", children: machines.map((m) => /* @__PURE__ */ jsx(MachineDetailCard, { machine: m }, m.machine_id)) })
  ] });
}
function MachineDetailCard({
  machine
}) {
  const isOnline = machine.status === "online";
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-6 shadow-card border border-border", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-surface", children: machine.machine_id }),
          /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${isOnline ? "bg-success/20 text-success" : "bg-red-500/20 text-red-500"}`, children: [
            /* @__PURE__ */ jsx("div", { className: `h-1.5 w-1.5 rounded-full ${isOnline ? "bg-success animate-pulse" : "bg-red-500"}` }),
            machine.status
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: machine.location })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "rounded-full bg-background p-2 text-muted-foreground hover:bg-gray-100 transition-colors", children: /* @__PURE__ */ jsx(Settings, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-background/50 p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Performance" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Total Dispenses" }),
            /* @__PURE__ */ jsx("span", { className: "font-bold text-surface", children: machine.total_dispenses || 0 })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Uptime" }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-success", children: [
              machine.uptime_percentage || 100,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Temperature" }),
            /* @__PURE__ */ jsxs("span", { className: "font-bold text-surface", children: [
              machine.temperature || 24,
              "°C"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-background/50 p-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest", children: "Hardware" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2", children: [
          /* @__PURE__ */ jsx(HardwareStatusRow, { label: "Motor", status: machine.motor_status }),
          /* @__PURE__ */ jsx(HardwareStatusRow, { label: "Scanner", status: machine.scanner_status }),
          /* @__PURE__ */ jsx(HardwareStatusRow, { label: "Network", status: machine.network_status })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex gap-3", children: [
      /* @__PURE__ */ jsxs("button", { className: "flex-1 rounded-full bg-surface px-4 py-3 text-xs font-bold text-surface-foreground hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsx(Activity, { className: "h-3 w-3" }),
        "Run Diagnostics"
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "flex-1 rounded-full border border-border bg-white px-4 py-3 text-xs font-bold text-surface hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }),
        "View History"
      ] })
    ] })
  ] });
}
function HardwareStatusRow({
  label,
  status
}) {
  const ok = status === "operational" || status === "connected";
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsx("div", { className: `h-1.5 w-1.5 rounded-full ${ok ? "bg-success" : "bg-red-500"}` }),
      /* @__PURE__ */ jsx("span", { className: "font-medium text-surface capitalize", children: status })
    ] })
  ] });
}
function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    fetch(`${"http://localhost:5000"}/admin/alerts`).then((r) => r.json()).then((d) => setAlerts(d));
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-red-500", children: "Center" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "System Alerts" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      alerts.map((a) => /* @__PURE__ */ jsxs("div", { className: `rounded-3xl p-6 shadow-card flex items-start gap-4 border ${a.severity === "critical" ? "bg-red-50 border-red-200" : "bg-amber/5 border-amber/20"}`, children: [
        /* @__PURE__ */ jsx("div", { className: `rounded-full p-3 ${a.severity === "critical" ? "bg-red-500 text-white" : "bg-amber text-white"}`, children: a.type === "stock" ? /* @__PURE__ */ jsx(Boxes, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: `text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${a.severity === "critical" ? "bg-red-500 text-white" : "bg-amber text-white"}`, children: a.severity }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-medium", children: new Date(a.created_at).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "mt-1 text-base font-bold text-surface", children: a.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: a.message })
        ] }),
        !a.is_resolved && /* @__PURE__ */ jsx("button", { className: "rounded-full bg-white border border-border px-4 py-2 text-xs font-bold text-surface hover:bg-gray-50 transition-all", children: "Mark Resolved" })
      ] }, a.id)),
      alerts.length === 0 && /* @__PURE__ */ jsx("div", { className: "py-20 text-center text-muted-foreground italic", children: "No active alerts... system is healthy." })
    ] })
  ] });
}
function UsersPage() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`${"http://localhost:5000"}/admin/users`).then((r) => r.json()).then((d) => setUsers(d));
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Community" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "User Management" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-3xl bg-card shadow-card overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-background/50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 font-bold text-muted-foreground uppercase text-[10px]", children: "User" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 font-bold text-muted-foreground uppercase text-[10px]", children: "Role" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 font-bold text-muted-foreground uppercase text-[10px]", children: "Joined" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 font-bold text-muted-foreground uppercase text-[10px]", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right font-bold text-muted-foreground uppercase text-[10px]", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: users.map((u) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [
        /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold text-surface", children: u.name }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: u.phone_number })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded-full text-[10px] font-black uppercase ${u.role === "admin" ? "bg-amber/20 text-amber" : u.role === "doctor" ? "bg-mint/20 text-surface" : "bg-gray-100 text-muted-foreground"}`, children: u.role }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-muted-foreground text-xs", children: new Date(u.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: `h-1.5 w-1.5 rounded-full ${u.is_active ? "bg-success" : "bg-red-500"}` }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: u.is_active ? "Active" : "Disabled" })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx("button", { className: "text-xs font-bold text-surface hover:underline", children: "View Detail" }) })
      ] }, u.id)) })
    ] }) })
  ] });
}
function AnalyticsPage() {
  var _a;
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => {
    fetch(`${"http://localhost:5000"}/admin/analytics`).then((r) => r.json()).then((d) => setAnalytics(d));
  }, []);
  if (!analytics) return /* @__PURE__ */ jsx(Loader2, { className: "animate-spin m-auto" });
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Performance" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "System Analytics" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-5", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Total Dispenses", value: analytics.totalDispenses, sub: "All Time" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Total Patients", value: analytics.totalPatients, sub: "Registered" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Active SKUs", value: analytics.activeMedicines, sub: "In Stock" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Top Med", value: analytics.mostDispensed, sub: "High Demand", isAmber: true }),
      /* @__PURE__ */ jsx(StatCard, { label: "Total Revenue", value: `₹${(_a = analytics.totalRevenue) == null ? void 0 : _a.toLocaleString()}`, sub: "Lifetime", isAmber: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-surface", children: "Revenue Growth · Last 30 Days" }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 h-64 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart$1, { data: analytics.revenueTrend, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f5f0e8", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "date", hide: true }),
          /* @__PURE__ */ jsx(YAxis, { tick: {
            fontSize: 11,
            fill: "#1a3a2a"
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(Tooltip, { formatter: (value) => [`₹${value}`, "Revenue"], contentStyle: {
            borderRadius: 12,
            border: "none",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
          } }),
          /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "amount", stroke: "#d4a853", strokeWidth: 3, dot: false })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold text-surface", children: "Peak Usage Hours · 24h Heatmap" }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 h-64 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: analytics.hourlyUsage, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "#f5f0e8" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "hour", tick: {
            fontSize: 10
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(YAxis, { tick: {
            fontSize: 10
          }, axisLine: false, tickLine: false }),
          /* @__PURE__ */ jsx(Tooltip, { cursor: {
            fill: "#f5f0e8"
          } }),
          /* @__PURE__ */ jsx(Bar, { dataKey: "count", fill: "#1a3a2a", radius: [4, 4, 0, 0] })
        ] }) }) })
      ] })
    ] })
  ] });
}
function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${"http://localhost:5000"}/admin/logs`).then((r) => r.json()).then((d) => setLogs(d)).finally(() => setLoading(false));
  }, []);
  const exportToCSV = () => {
    if (logs.length === 0) return;
    const headers = ["Dispensed At", "Patient", "Machine", "Medicines"];
    const rows = logs.map((l) => {
      var _a;
      return [new Date(l.dispensed_at).toLocaleString(), ((_a = l.users) == null ? void 0 : _a.name) || "Unknown", l.machine_id, (l.medicines_dispensed || []).map((m) => `${m.name} (${m.qty})`).join("; ")];
    });
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `dispense_logs_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Archive" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "Dispense Logs" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: exportToCSV, disabled: logs.length === 0, className: "flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-bold text-surface hover:bg-gray-50 transition-all shadow-soft disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
        "Export as CSV"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-3xl bg-card shadow-card overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-background/50 border-b border-border", children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider", children: "Timestamp" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider", children: "Patient" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider", children: "Machine" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider", children: "Medicines Dispensed" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right font-bold text-muted-foreground uppercase text-[10px] tracking-wider", children: "Receipt" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border", children: [
        loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "py-20 text-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin mx-auto text-amber" }) }) }) : logs.map((l) => {
          var _a, _b;
          return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50/50 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-mono text-xs text-muted-foreground", children: new Date(l.dispensed_at).toLocaleString() }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-surface", children: ((_a = l.users) == null ? void 0 : _a.name) || "Anonymous" }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                "ID: ",
                (_b = l.patient_id) == null ? void 0 : _b.slice(0, 8),
                "..."
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black uppercase text-muted-foreground", children: l.machine_id }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: (l.medicines_dispensed || []).map((m, i) => /* @__PURE__ */ jsxs("span", { className: "rounded-lg bg-mint/10 border border-mint/20 px-2 py-1 text-[10px] font-bold text-surface", children: [
              m.name,
              " x",
              m.qty
            ] }, i)) }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: l.receipt_url ? /* @__PURE__ */ jsx("a", { href: l.receipt_url, target: "_blank", className: "text-xs font-bold text-amber hover:underline", children: "View PDF" }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground italic", children: "No Digital Receipt" }) })
          ] }, l.id);
        }),
        !loading && logs.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "py-20 text-center text-muted-foreground italic", children: "No dispense records found." }) })
      ] })
    ] }) }) })
  ] });
}
function SettingsPage() {
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-surface mb-8", children: "System Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-surface mb-4", children: "Kiosk Configuration" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(SettingRow, { label: "Low Stock Threshold", value: "10 units" }),
          /* @__PURE__ */ jsx(SettingRow, { label: "Expiry Warning Days", value: "30 days" }),
          /* @__PURE__ */ jsx(SettingRow, { label: "Machine Timeout", value: "5 minutes" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-surface mb-4", children: "Alert Preferences" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(ToggleRow, { label: "Push Notifications", active: true }),
          /* @__PURE__ */ jsx(ToggleRow, { label: "SMS Critical Alerts", active: true }),
          /* @__PURE__ */ jsx(ToggleRow, { label: "Daily Summary Email", active: false })
        ] })
      ] })
    ] })
  ] });
}
function StatCard({
  label,
  value,
  sub,
  isStatus,
  status,
  isRed,
  isAmber
}) {
  return /* @__PURE__ */ jsxs("div", { className: `rounded-2xl bg-card p-5 shadow-card border-l-4 ${isRed ? "border-red-500" : isAmber ? "border-amber" : "border-mint"}`, children: [
    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-baseline gap-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-black text-surface", children: value }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-medium text-muted-foreground uppercase", children: sub })
    ] })
  ] });
}
function SettingRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border pb-3 last:border-0", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground font-medium", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-surface", children: value })
  ] });
}
function ToggleRow({
  label,
  active
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border pb-3 last:border-0", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground font-medium", children: label }),
    /* @__PURE__ */ jsx("div", { className: `h-5 w-10 rounded-full p-1 transition-colors ${active ? "bg-success" : "bg-gray-200"}`, children: /* @__PURE__ */ jsx("div", { className: `h-3 w-3 rounded-full bg-white transition-transform ${active ? "translate-x-5" : "translate-x-0"}` }) })
  ] });
}
function AddMedicineModal({
  onClose,
  onRefresh
}) {
  const [form, setForm] = useState({
    name: "",
    generic_name: "",
    category: "General",
    stock_quantity: "0",
    threshold: "10",
    expiry_date: "",
    price: "0",
    slot: "A1"
  });
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${"http://localhost:5000"}/admin/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          stock_quantity: parseInt(form.stock_quantity) || 0,
          threshold: parseInt(form.threshold) || 10,
          price: parseFloat(form.price) || 0
        })
      });
      if (res.ok) {
        onRefresh();
        onClose();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || "Failed to save product"}`);
      }
    } catch (err) {
      alert("Network error: Could not reach mission control.");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-surface/80 p-4 backdrop-blur-sm overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-xl rounded-3xl bg-card p-8 shadow-2xl animate-fade-up my-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-amber uppercase tracking-widest", children: "Inventory Management" }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-surface", children: "Register New Product" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "grid grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block ml-1", children: "Commercial Name" }),
        /* @__PURE__ */ jsx("input", { type: "text", required: true, placeholder: "e.g. Panadol 500mg", value: form.name, onChange: (e) => setForm({
          ...form,
          name: e.target.value
        }), className: "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm focus:border-amber/60 outline-none transition-all shadow-sm" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block ml-1", children: "Generic Name" }),
        /* @__PURE__ */ jsx("input", { type: "text", required: true, placeholder: "e.g. Paracetamol", value: form.generic_name, onChange: (e) => setForm({
          ...form,
          generic_name: e.target.value
        }), className: "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm focus:border-amber/60 outline-none transition-all shadow-sm" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block ml-1", children: "Category" }),
        /* @__PURE__ */ jsxs("select", { value: form.category, onChange: (e) => setForm({
          ...form,
          category: e.target.value
        }), className: "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm focus:border-amber/60 outline-none transition-all shadow-sm appearance-none", children: [
          /* @__PURE__ */ jsx("option", { value: "General", children: "General" }),
          /* @__PURE__ */ jsx("option", { value: "Antibiotic", children: "Antibiotic" }),
          /* @__PURE__ */ jsx("option", { value: "Painkiller", children: "Painkiller" }),
          /* @__PURE__ */ jsx("option", { value: "Chronic", children: "Chronic" }),
          /* @__PURE__ */ jsx("option", { value: "Pediatric", children: "Pediatric" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block ml-1", children: "Initial Stock" }),
        /* @__PURE__ */ jsx("input", { type: "number", required: true, value: form.stock_quantity, onChange: (e) => setForm({
          ...form,
          stock_quantity: e.target.value
        }), className: "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm focus:border-amber/60 outline-none transition-all shadow-sm" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block ml-1", children: "Low Stock Alert (Threshold)" }),
        /* @__PURE__ */ jsx("input", { type: "number", required: true, value: form.threshold, onChange: (e) => setForm({
          ...form,
          threshold: e.target.value
        }), className: "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm focus:border-amber/60 outline-none transition-all shadow-sm" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block ml-1", children: "Unit Price (₹)" }),
        /* @__PURE__ */ jsx("input", { type: "number", step: "0.01", required: true, value: form.price, onChange: (e) => setForm({
          ...form,
          price: e.target.value
        }), className: "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm focus:border-amber/60 outline-none transition-all shadow-sm" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block ml-1", children: "Machine Slot ID" }),
        /* @__PURE__ */ jsx("input", { type: "text", required: true, placeholder: "e.g. A1, B2", value: form.slot, onChange: (e) => setForm({
          ...form,
          slot: e.target.value
        }), className: "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm focus:border-amber/60 outline-none transition-all shadow-sm" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block ml-1", children: "Expiry Date" }),
        /* @__PURE__ */ jsx("input", { type: "date", required: true, value: form.expiry_date, onChange: (e) => setForm({
          ...form,
          expiry_date: e.target.value
        }), className: "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm focus:border-amber/60 outline-none transition-all shadow-sm" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 col-span-2 flex gap-4", children: [
        /* @__PURE__ */ jsx("button", { type: "button", onClick: onClose, className: "flex-1 rounded-full bg-background border border-border px-4 py-4 text-xs font-bold text-muted-foreground hover:bg-surface/5 transition-all", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: submitting, className: "flex-1 rounded-full bg-amber px-4 py-4 text-xs font-bold text-amber-foreground shadow-soft transition-all active:scale-95 hover:shadow-lg disabled:opacity-50", children: submitting ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin m-auto" }) : "Confirm Registration" })
      ] })
    ] })
  ] }) });
}
export {
  AdminDashboard as component
};
