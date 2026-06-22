import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Package, CheckCircle2, Download, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
function DispensePage() {
  const [dispensing, setDispensing] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDispensing(false);
    }, 5e3);
    return () => clearTimeout(timer);
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen flex-col items-center justify-center bg-background p-6", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-lg space-y-12 text-center", children: dispensing ? /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto h-48 w-48", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-8 border-amber/10" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-8 border-transparent border-t-amber animate-spin" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Package, { className: "h-20 w-20 text-amber animate-bounce" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-surface-foreground uppercase tracking-widest", children: "Dispensing..." }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-xl text-surface-foreground/40 font-medium", children: "Please wait while the machine organizes your medicine." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-amber/30 animate-pulse", style: {
      animationDelay: `${i * 200}ms`
    } }, i)) })
  ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-10 animate-in zoom-in-95 duration-500", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-success/20 text-success shadow-[0_0_50px_rgba(34,197,94,0.3)]", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-20 w-20" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-5xl font-black text-surface-foreground", children: "Ready!" }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl text-surface-foreground/60", children: "Please collect your medicine from the tray below." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 pt-8", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => window.print(), className: "flex items-center justify-center gap-3 rounded-3xl bg-amber py-6 text-xl font-bold text-amber-foreground transition-all hover:scale-[1.02] active:scale-95 shadow-xl", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-6 w-6" }),
        "Download Receipt"
      ] }),
      /* @__PURE__ */ jsxs(Link, { to: "/patient", className: "flex items-center justify-center gap-2 py-4 text-sm font-bold text-surface-foreground/30 hover:text-surface-foreground/60 transition-colors", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Back to Home"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-surface-foreground/5 p-8 border border-white/5", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[0.3em] text-surface-foreground/20 mb-4", children: "Safety Reminder" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-surface-foreground/50 leading-relaxed", children: "Please verify the medicine names and dosages against your prescription before leaving the kiosk. If you notice any discrepancy, contact support immediately." })
    ] })
  ] }) }) });
}
export {
  DispensePage as component
};
