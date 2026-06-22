import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, ArrowUpDown, CheckCircle2, Info, Sparkles } from "lucide-react";
const BACKEND = "http://localhost:5000";
function PatientPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(`${BACKEND}/payment/prices`);
        if (res.ok) {
          const data = await res.json();
          setPrices(data);
        }
      } catch (err) {
        console.error("Fetch prices error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrices();
  }, []);
  const filteredPrices = prices.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-surface", children: "Real-time Prices" }),
        /* @__PURE__ */ jsx("p", { className: "text-surface-foreground/60 mt-1", children: "Live inventory pricing at MEDIKIOSK-001" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search medicines...", value: search, onChange: (e) => setSearch(e.target.value), className: "h-11 w-full rounded-2xl border-none bg-surface/50 pl-10 pr-4 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-amber/50 md:w-64" })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setSortOrder((v) => v === "asc" ? "desc" : "asc"), className: "flex h-11 items-center gap-2 rounded-2xl bg-surface/50 px-4 text-sm font-medium ring-1 ring-border hover:bg-surface", children: [
          /* @__PURE__ */ jsx(ArrowUpDown, { className: "h-4 w-4" }),
          sortOrder === "asc" ? "Low to High" : "High to Low"
        ] })
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-40 animate-pulse rounded-3xl bg-surface/50" }, i)) }) : filteredPrices.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: filteredPrices.map((med) => /* @__PURE__ */ jsxs("div", { className: "group relative overflow-hidden rounded-3xl bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-glow ring-1 ring-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-start justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/10 text-amber", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx("span", { className: "rounded-full bg-mint/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-surface", children: "In Stock" })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-surface", children: med.name }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-surface-foreground/50 mb-4", children: med.category || "General Medicine" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between border-t border-border pt-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground", children: "Price per tab" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-black text-amber", children: [
            "₹",
            med.price.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[10px] text-emerald-500 font-bold", children: [
          /* @__PURE__ */ jsx(Info, { className: "h-3 w-3" }),
          "TAX INCLUDED"
        ] })
      ] })
    ] }, med.id)) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-full bg-surface/50 p-6", children: /* @__PURE__ */ jsx(Search, { className: "h-10 w-10 text-muted-foreground/30" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-surface", children: "No medicines found" }),
      /* @__PURE__ */ jsx("p", { className: "text-surface-foreground/60", children: "Try searching with a different name" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-surface p-8 text-center ring-1 ring-border", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "mx-auto h-8 w-8 text-amber mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-surface", children: "Can't find your medicine?" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-foreground/60 max-w-md mx-auto mt-2", children: "Our inventory is updated daily. If a specific prescription is not listed, our AI will automatically suggest the closest verified alternative." })
    ] })
  ] });
}
export {
  PatientPrices as component
};
