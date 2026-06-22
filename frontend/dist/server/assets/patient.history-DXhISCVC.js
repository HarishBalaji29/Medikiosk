import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FileText, Clock, Hash, ChevronRight } from "lucide-react";
import { g as getSession } from "./session-JGLanhG1.js";
function HistoryPage() {
  const [session] = useState(() => getSession());
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND = "http://localhost:5000";
  useEffect(() => {
    async function fetchHistory() {
      if (!(session == null ? void 0 : session.id)) return;
      try {
        const res = await fetch(`${BACKEND}/prescriptions/patient/${session.id}`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [session, BACKEND]);
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Records" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "Prescription History" })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" }) }) : history.length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: history.map((item, i) => {
      var _a, _b;
      return /* @__PURE__ */ jsxs("div", { className: "group flex items-center justify-between rounded-3xl bg-card p-5 shadow-card transition-all hover:bg-mint/10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-surface/5 text-muted-foreground group-hover:bg-amber/10 group-hover:text-amber", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-surface", children: [
                "Prescription #",
                ((_a = item.id) == null ? void 0 : _a.slice(-6)) || i + 1
              ] }),
              /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${item.status === "dispensed" ? "bg-success/15 text-success" : "bg-amber/15 text-amber"}`, children: item.status || "Processed" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                " ",
                new Date(item.created_at).toLocaleDateString()
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Hash, { className: "h-3 w-3" }),
                " ",
                ((_b = item.extracted_data) == null ? void 0 : _b.length) || 0,
                " Medicines"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-surface text-surface-foreground transition hover:bg-amber hover:text-amber-foreground", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5" }) })
      ] }, item.id || i);
    }) }) : /* @__PURE__ */ jsxs("div", { className: "flex min-h-[300px] flex-col items-center justify-center rounded-3xl bg-card p-12 text-center shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint", children: /* @__PURE__ */ jsx(Clock, { className: "h-8 w-8 text-surface" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-surface", children: "No history yet" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Your processed prescriptions will appear here." })
    ] })
  ] });
}
export {
  HistoryPage as component
};
