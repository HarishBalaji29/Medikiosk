import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Pill, Calendar, ChevronRight } from "lucide-react";
import { g as getSession } from "./session-JGLanhG1.js";
function MedicinesPage() {
  const [session] = useState(() => getSession());
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND = "http://localhost:5000";
  useEffect(() => {
    async function fetchMeds() {
      if (!(session == null ? void 0 : session.id)) return;
      try {
        const res = await fetch(`${BACKEND}/prescriptions/patient/${session.id}`);
        const data = await res.json();
        const allMeds = data.flatMap((p) => {
          const ex = p.extracted_data;
          if (Array.isArray(ex)) return ex;
          if (ex && typeof ex === "object" && Array.isArray(ex.medicines)) return ex.medicines;
          return [];
        });
        setMeds(allMeds);
      } catch (err) {
        console.error("Failed to fetch meds:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMeds();
  }, [session, BACKEND]);
  (session == null ? void 0 : session.role) || "Patient";
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Active Treatments" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "My Medicines" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex items-center gap-4", children: /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
      /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search your medicines...", className: "w-full rounded-2xl border-none bg-card py-3 pl-11 pr-4 text-sm shadow-card focus:ring-2 focus:ring-amber" })
    ] }) }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" }) }) : meds.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: meds.map((med, i) => /* @__PURE__ */ jsxs("div", { className: "group overflow-hidden rounded-3xl bg-card p-6 shadow-card transition-all hover:shadow-soft", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/15 text-amber", children: /* @__PURE__ */ jsx(Pill, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx("div", { className: "rounded-full bg-success/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-success", children: "Active" })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-surface", children: med.medicine_name || med.name }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: med.dosage }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "text-surface/80", children: med.frequency })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
          /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { className: "text-surface/80", children: med.duration })
        ] })
      ] })
    ] }, i)) }) : /* @__PURE__ */ jsxs("div", { className: "flex min-h-[300px] flex-col items-center justify-center rounded-3xl bg-card p-12 text-center shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint", children: /* @__PURE__ */ jsx(Pill, { className: "h-8 w-8 text-surface" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-surface", children: "No medicines found" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Upload a prescription to see your active medicines here." })
    ] })
  ] });
}
export {
  MedicinesPage as component
};
