import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Loader2, CheckCircle2, Package, XCircle, RefreshCcw, CreditCard, ArrowLeft } from "lucide-react";
import { u as usePayment } from "./usePayment-cFQrgJwy.js";
import { c as cn } from "./utils-H80jjgLf.js";
import "./supabase-xo2Ne9iT.js";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
function CountdownTimer({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isUrgent = seconds < 120;
  return /* @__PURE__ */ jsxs("div", { className: cn(
    "flex items-center gap-2 text-sm font-medium transition-colors",
    isUrgent ? "text-red-500 animate-pulse" : "text-surface-foreground/60"
  ), children: [
    /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-current" }),
    "⏱ Expires in ",
    mins,
    ":",
    secs.toString().padStart(2, "0")
  ] });
}
function PaymentPage() {
  const {
    orderData,
    qrData,
    paymentStatus,
    timeLeft,
    initializePayment,
    payByCard
  } = usePayment();
  const navigate = useNavigate();
  const prescriptionId = "rx_demo_123";
  const patientId = "patient_demo_123";
  useEffect(() => {
    initializePayment(prescriptionId, patientId);
  }, []);
  if (paymentStatus === "loading") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "mx-auto h-12 w-12 animate-spin text-amber" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg font-medium text-surface-foreground/60", children: "Initializing secure payment..." })
    ] }) });
  }
  if (paymentStatus === "paid") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md space-y-8 text-center animate-in zoom-in-95 duration-500", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/20 text-success", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-16 w-16" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-surface-foreground", children: "Payment Successful!" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-xl text-surface-foreground/60", children: [
          "₹",
          orderData == null ? void 0 : orderData.amount,
          " received"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "mt-4 text-xs font-mono text-surface-foreground/40 uppercase tracking-widest", children: [
          "ID: ",
          orderData == null ? void 0 : orderData.order_id
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/patient/dispense"
      }), className: "group flex w-full items-center justify-center gap-3 rounded-3xl bg-surface-foreground py-6 text-xl font-bold text-surface transition-all hover:scale-[1.02] active:scale-95 shadow-2xl", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-6 w-6" }),
        "Collect Your Medicine"
      ] })
    ] }) });
  }
  if (paymentStatus === "failed" || paymentStatus === "expired") {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background p-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md space-y-8 text-center animate-in fade-in slide-in-from-bottom-10 duration-500", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20 text-red-500", children: /* @__PURE__ */ jsx(XCircle, { className: "h-16 w-16" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-surface-foreground", children: paymentStatus === "expired" ? "QR Expired" : "Payment Failed" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg text-surface-foreground/60", children: paymentStatus === "expired" ? "The payment session has timed out. Please generate a new QR code." : "Something went wrong with the transaction. Please try again." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => initializePayment(prescriptionId, patientId), className: "flex items-center justify-center gap-2 rounded-2xl bg-amber py-4 font-bold text-surface transition-all hover:bg-amber/90", children: [
          /* @__PURE__ */ jsx(RefreshCcw, { className: "h-5 w-5" }),
          "Generate New QR"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: payByCard, className: "flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 font-bold text-surface-foreground transition-all hover:bg-white/10", children: [
          /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5" }),
          "Try Card Payment"
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/patient/profile", className: "flex items-center justify-center gap-2 py-4 text-sm font-medium text-surface-foreground/40 hover:text-surface-foreground/60", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Back to Profile"
        ] })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-white/5 bg-surface/30 px-8 py-10 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/patient/profile", className: "flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-surface-foreground transition-all hover:bg-white/10", children: /* @__PURE__ */ jsx(ArrowLeft, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-surface-foreground", children: "💊 Complete Payment" }),
          /* @__PURE__ */ jsx("p", { className: "text-surface-foreground/50", children: "Prescription approved by Dr. Iyer" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-surface-foreground/30", children: "Total Payable" }),
        /* @__PURE__ */ jsxs("p", { className: "text-4xl font-black text-amber", children: [
          "₹",
          orderData == null ? void 0 : orderData.amount
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-12 p-8 lg:grid-cols-2 lg:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-[2.5rem] bg-surface/20 p-10 ring-1 ring-white/10", children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-8 text-xl font-bold uppercase tracking-widest text-surface-foreground/40", children: "Order Summary" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: orderData == null ? void 0 : orderData.medicines.map((med, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber font-bold", children: med.qty }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-bold text-surface-foreground", children: med.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-surface-foreground/40", children: [
                  "₹",
                  med.price,
                  " per unit"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "font-bold text-surface-foreground", children: [
              "₹",
              med.price * med.qty
            ] })
          ] }, i)) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 space-y-4 border-t border-white/5 pt-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-surface-foreground/60", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "₹",
                orderData == null ? void 0 : orderData.medicines_cost
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-surface-foreground/60", children: [
              /* @__PURE__ */ jsx("span", { children: "Service Fee (5%)" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "₹",
                orderData == null ? void 0 : orderData.service_fee
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-4 text-2xl font-black text-surface-foreground", children: [
              /* @__PURE__ */ jsx("span", { children: "TOTAL" }),
              /* @__PURE__ */ jsxs("span", { className: "text-amber", children: [
                "₹",
                orderData == null ? void 0 : orderData.amount
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 px-6 text-sm text-surface-foreground/40", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-success" }),
          "Secure transaction powered by Razorpay. Your medical data is encrypted."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md space-y-8 rounded-[3rem] bg-white p-12 shadow-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-black uppercase tracking-[0.2em] text-surface", children: "Pay with QR Code" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-surface/50", children: "Scan with any UPI app" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative aspect-square overflow-hidden rounded-3xl border-4 border-surface/5 p-4 bg-white shadow-inner", children: [
            (qrData == null ? void 0 : qrData.qr_image_url) ? /* @__PURE__ */ jsx("img", { src: qrData.qr_image_url, alt: "Payment QR", className: "h-full w-full object-contain" }) : /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "h-10 w-10 animate-spin text-surface/20" }) }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 border-[20px] border-transparent pointer-events-none ring-1 ring-surface/10 rounded-3xl" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6", children: [
            /* @__PURE__ */ jsx(CountdownTimer, { seconds: timeLeft }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-3 opacity-40", children: [
              /* @__PURE__ */ jsx("img", { src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg", alt: "UPI", className: "h-4 grayscale" }),
              /* @__PURE__ */ jsx("img", { src: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo.svg", alt: "GPay", className: "h-4 grayscale" }),
              /* @__PURE__ */ jsx("img", { src: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg", alt: "Paytm", className: "h-3 grayscale" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 flex w-full max-w-md flex-col gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center py-4", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute h-[1px] w-full bg-white/5" }),
            /* @__PURE__ */ jsx("span", { className: "relative bg-background px-4 text-xs font-bold uppercase tracking-widest text-surface-foreground/20", children: "OR" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: payByCard, className: "flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 py-5 font-bold text-surface-foreground transition-all hover:bg-white/10 active:scale-95", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5 text-amber" }),
            "Pay by Card / Net Banking"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function ShieldCheck({
  className
}) {
  return /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className, children: [
    /* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" }),
    /* @__PURE__ */ jsx("path", { d: "m9 12 2 2 4-4" })
  ] });
}
export {
  PaymentPage as component
};
