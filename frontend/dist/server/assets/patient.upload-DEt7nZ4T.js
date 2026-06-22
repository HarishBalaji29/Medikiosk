import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Sparkles, Send, Upload, Camera, CheckCircle2, Loader2, AlertCircle, CreditCard, IndianRupee, QrCode, Clock, ShieldCheck, PackageCheck, Download } from "lucide-react";
import { g as getSession } from "./session-JGLanhG1.js";
import { s as showNotification, n as notificationTemplates } from "./notifications-D9GoIOmt.js";
import jsPDF from "jspdf";
import { u as usePayment } from "./usePayment-cFQrgJwy.js";
import { c as cn } from "./utils-H80jjgLf.js";
import "sonner";
import "./supabase-xo2Ne9iT.js";
import "@supabase/supabase-js";
import "clsx";
import "tailwind-merge";
function generateAnswer(q, meds, status) {
  const lower = q.toLowerCase();
  const list = meds.map((m) => m.name).join(", ") || "your prescription";
  if (/(when|ready|time|how long|wait)/.test(lower)) {
    if (status === "draft") return "Your prescription hasn't been sent for approval yet. Confirm it from the result screen and a doctor will review it within ~5 minutes.";
    if (status === "pending") return "A doctor is reviewing your prescription right now. Approval usually takes 3–8 minutes — you'll get an SMS the moment it's ready.";
    if (status === "approved") return "✅ Already approved! Tap the DISPENSE MEDICINE button to collect from the kiosk.";
    if (status === "dispensed") return "Your medicines were dispensed successfully. A receipt is available for download.";
  }
  if (/(side effect|reaction|allerg|safe)/.test(lower)) {
    return `Common side effects vary by medicine. For ${list}: mild ones include drowsiness, nausea or stomach upset. Stop use and contact your doctor if you notice rash, difficulty breathing, or swelling.`;
  }
  for (const m of meds) {
    if (lower.includes(m.name.toLowerCase())) {
      const purpose = describePurpose(m.name);
      return `${m.name} (${m.dosage}, ${m.frequency} for ${m.duration}) is typically prescribed for ${purpose}. Take it ${m.frequency.toLowerCase()} as directed.`;
    }
  }
  if (/(what.*for|purpose|why)/.test(lower)) {
    return meds.length ? meds.map((m) => `• ${m.name} — ${describePurpose(m.name)}`).join("\n") : "Once your prescription is processed I can explain what each medicine is for.";
  }
  if (/(food|meal|eat|empty stomach)/.test(lower)) {
    return "Most medicines in your prescription are best taken with food to reduce stomach irritation. Your doctor will note any exceptions on approval.";
  }
  if (/(dose|dosage|how much|how often)/.test(lower)) {
    return meds.length ? meds.map((m) => `• ${m.name}: ${m.dosage}, ${m.frequency} for ${m.duration}`).join("\n") : "Your dosage details will appear here once the prescription is read.";
  }
  if (/(hello|hi|hey)/.test(lower)) {
    return `Hi! I'm your MEDIKIOSK assistant. Ask me anything about ${list} — purpose, dosage, side effects, or when it'll be ready.`;
  }
  return `I'm here to help with your prescription (${list}). Try asking what a medicine is for, possible side effects, or when it'll be ready.`;
}
function describePurpose(name) {
  const map = {
    amoxicillin: "treating bacterial infections like throat or ear infections",
    paracetamol: "relieving mild-to-moderate pain and reducing fever",
    "vitamin d3": "supporting bone health and immune function",
    amlodipine: "lowering high blood pressure",
    cetirizine: "relieving seasonal allergy symptoms",
    ibuprofen: "reducing pain, fever, and inflammation"
  };
  return map[name.toLowerCase()] ?? "the condition described by your doctor";
}
function PatientChatbot({ patientName, meds, status }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState([
    {
      role: "ai",
      text: `Hi ${patientName.split(" ")[0]}! 👋 I'm your MEDIKIOSK assistant. Ask me about your medicines, side effects, or when your order will be ready.`
    }
  ]);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, typing, open]);
  function send(e) {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    const delay = 700 + Math.min(q.length * 18, 1400);
    setTimeout(() => {
      const answer = generateAnswer(q, meds, status);
      setMsgs((m) => [...m, { role: "ai", text: answer }]);
      setTyping(false);
    }, delay);
  }
  const suggestions = [
    "What is this medicine for?",
    "Any side effects?",
    "When will my medicine be ready?"
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        "aria-label": "Open assistant",
        className: "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-surface text-amber shadow-glow transition hover:scale-105 md:h-16 md:w-16",
        children: [
          open ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(MessageCircle, { className: "h-6 w-6" }),
          !open && /* @__PURE__ */ jsxs("span", { className: "absolute -right-0.5 -top-0.5 flex h-3 w-3", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/70" }),
            /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-3 w-3 rounded-full bg-amber" })
          ] })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-24 right-4 z-40 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm animate-fade-up flex-col overflow-hidden rounded-3xl bg-card shadow-glow ring-1 ring-border md:right-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 bg-surface px-5 py-4 text-surface-foreground", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full gradient-amber", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-amber-foreground" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold leading-tight", children: "MEDIKIOSK Assistant" }),
          /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-surface-foreground/60", children: [
            meds.length,
            " medicine",
            meds.length === 1 ? "" : "s",
            " in context"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setOpen(false),
            className: "rounded-full p-1 text-surface-foreground/60 hover:bg-white/10 hover:text-surface-foreground",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { ref: scrollRef, className: "flex-1 space-y-3 overflow-y-auto bg-mint/30 p-4", children: [
        msgs.map((m, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm " + (m.role === "user" ? "ml-auto bg-amber text-amber-foreground" : "bg-card text-surface ring-1 ring-border"),
            children: m.text.split("\n").map((line, j) => /* @__PURE__ */ jsx("p", { children: line }, j))
          },
          i
        )),
        typing && /* @__PURE__ */ jsx("div", { className: "max-w-[60%] rounded-2xl bg-card px-4 py-3 text-sm shadow-sm ring-1 ring-border", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" }),
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" }),
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" })
        ] }) })
      ] }),
      msgs.length <= 1 && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 border-t border-border bg-card px-3 py-2", children: suggestions.map((s) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setInput(s);
          },
          className: "rounded-full bg-mint px-3 py-1 text-[11px] font-medium text-surface hover:bg-accent",
          children: s
        },
        s
      )) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: send, className: "flex items-center gap-2 border-t border-border bg-card p-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: input,
            onChange: (e) => setInput(e.target.value),
            placeholder: "Ask about your prescription…",
            className: "flex-1 rounded-full border border-border bg-mint/40 px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-amber/60"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: !input.trim(),
            className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber text-amber-foreground transition hover:scale-105 disabled:opacity-40",
            "aria-label": "Send",
            children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] });
}
function downloadReceipt(data) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 48;
  const now = /* @__PURE__ */ new Date();
  const dateStr = now.toLocaleString();
  const receiptId = `RCP-${now.getTime().toString().slice(-8)}`;
  const green = [26, 58, 42];
  const amber = [212, 168, 83];
  const muted = [110, 122, 115];
  const ink = [31, 41, 36];
  doc.setFillColor(...green);
  doc.rect(0, 0, W, 110, "F");
  doc.setFillColor(...amber);
  doc.circle(margin + 14, 55, 14, "F");
  doc.setTextColor(...green);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Rx", margin + 14, 60, { align: "center" });
  doc.setTextColor(245, 240, 232);
  doc.setFontSize(20);
  doc.text("MEDIKIOSK", margin + 40, 52);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(245, 240, 232, 0.8);
  doc.text("AI-powered medicine dispensing", margin + 40, 70);
  doc.setFontSize(9);
  doc.text(`Receipt ${receiptId}`, W - margin, 52, { align: "right" });
  doc.text(dateStr, W - margin, 68, { align: "right" });
  let y = 150;
  doc.setTextColor(...ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Dispense Receipt", margin, y);
  doc.setFillColor(34, 139, 90);
  doc.roundedRect(W - margin - 110, y - 16, 110, 22, 11, 11, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("DISPENSED", W - margin - 55, y - 1, { align: "center" });
  y += 30;
  doc.setDrawColor(232, 244, 240);
  doc.setLineWidth(1);
  doc.line(margin, y, W - margin, y);
  y += 24;
  const labelColor = muted;
  const valueColor = ink;
  const col2 = W / 2 + 10;
  function kv(label, value, x, yy) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...labelColor);
    doc.text(label.toUpperCase(), x, yy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...valueColor);
    doc.text(value, x, yy + 14);
  }
  kv("Patient", data.patientName, margin, y);
  kv("Phone", data.patientPhone, col2, y);
  y += 40;
  kv("Approving Doctor", `Dr. ${data.doctorName}`, margin, y);
  kv("Machine ID", data.kioskId, col2, y);
  y += 40;
  kv("Date & Time", dateStr, margin, y);
  kv("Receipt #", receiptId, col2, y);
  y += 50;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...ink);
  doc.text("Medicines Dispensed", margin, y);
  y += 14;
  doc.setFillColor(232, 244, 240);
  doc.rect(margin, y, W - margin * 2, 26, "F");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("MEDICINE", margin + 12, y + 17);
  doc.text("DOSAGE", margin + 200, y + 17);
  doc.text("FREQUENCY", margin + 290, y + 17);
  doc.text("DURATION", margin + 400, y + 17);
  y += 26;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...ink);
  data.meds.forEach((m, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(250, 248, 242);
      doc.rect(margin, y, W - margin * 2, 28, "F");
    }
    doc.text(m.medicine_name || m.name || "Medicine", margin + 12, y + 18);
    doc.text(m.dosage, margin + 200, y + 18);
    doc.text(m.frequency, margin + 290, y + 18);
    doc.text(m.duration, margin + 400, y + 18);
    y += 28;
  });
  doc.setDrawColor(...amber);
  doc.setLineWidth(0.8);
  doc.rect(margin, y - data.meds.length * 28 - 26, W - margin * 2, data.meds.length * 28 + 26);
  y += 30;
  doc.setDrawColor(232, 244, 240);
  doc.line(margin, y, W - margin, y);
  y += 20;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  doc.text(
    "Take medication exactly as prescribed. For questions, consult your doctor.",
    margin,
    y
  );
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing MEDIKIOSK — your prescription, verified & dispensed.", margin, y);
  doc.setFillColor(...green);
  doc.rect(0, doc.internal.pageSize.getHeight() - 28, W, 28, "F");
  doc.setTextColor(245, 240, 232);
  doc.setFontSize(9);
  doc.text("medikiosk.app", margin, doc.internal.pageSize.getHeight() - 10);
  doc.text(receiptId, W - margin, doc.internal.pageSize.getHeight() - 10, { align: "right" });
  doc.save(`MEDIKIOSK-Receipt-${receiptId}.pdf`);
}
const BACKEND = "http://localhost:5000";
const AI_STEPS = ["Reading Prescription", "Extracting Text", "Identifying Medicines", "Validating Data"];
const SAMPLE_MEDS = [{
  name: "Amoxicillin",
  dosage: "500 mg",
  frequency: "3× daily",
  duration: "7 days"
}, {
  name: "Paracetamol",
  dosage: "650 mg",
  frequency: "2× daily",
  duration: "5 days"
}, {
  name: "Vitamin D3",
  dosage: "1000 IU",
  frequency: "1× daily",
  duration: "30 days"
}];
function PatientDashboard() {
  const [stage, setStage] = useState("upload");
  const [preview, setPreview] = useState(null);
  const [aiStep, setAiStep] = useState(0);
  const [dispenseStep, setDispenseStep] = useState(0);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [session, setSession] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const {
    orderData,
    qrData,
    paymentStatus,
    timeLeft,
    initializePayment,
    payByCard
  } = usePayment();
  useEffect(() => {
    setSession(getSession());
    setIsMounted(true);
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  useEffect(() => {
    if (paymentStatus === "paid" && stage === "payment") {
      showNotification("Payment Successful", "Your medicines are being prepared.");
      startDispense();
    }
  }, [paymentStatus, stage]);
  const patientName = (session == null ? void 0 : session.name) ?? "User";
  const patientPhone = (session == null ? void 0 : session.phone) ?? "";
  const dispensedSmsSent = useRef(false);
  const chatStatus = stage === "upload" || stage === "processing" ? "draft" : stage === "result" || stage === "payment" ? "pending" : stage === "dispense" ? "approved" : "dispensed";
  const [extractedMeds, setExtractedMeds] = useState([]);
  async function onFile(file) {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setStage("processing");
    setAiStep(0);
    const interval = setInterval(() => {
      setAiStep((s) => s < 3 ? s + 1 : s);
    }, 1500);
    try {
      const formData = new FormData();
      formData.append("prescription", file);
      formData.append("patient_id", (session == null ? void 0 : session.id) || "");
      const res = await fetch(`${BACKEND}/ai/process-prescription`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      clearInterval(interval);
      if (data.success) {
        setAiStep(4);
        setPrescriptionId(data.prescription.id);
        setExtractedMeds(data.extracted_data || []);
        setTimeout(() => setStage("result"), 800);
      } else {
        throw new Error(data.error || "Processing failed");
      }
    } catch (err) {
      clearInterval(interval);
      console.error("[Prescription] Upload error:", err);
      showNotification("Error", err.message || "Failed to process prescription. Please try again.");
      setStage("upload");
    }
  }
  async function handleConfirmResult() {
    if (!prescriptionId || !(session == null ? void 0 : session.id)) return;
    setStage("payment");
    initializePayment(prescriptionId, session.id);
  }
  async function startDispense() {
    const tpl = notificationTemplates.newPrescription(patientName);
    showNotification(tpl.title, tpl.body);
    setStage("dispense");
    setDispenseStep(0);
    [1, 2, 3].forEach((i) => {
      setTimeout(() => {
        setDispenseStep(i);
        if (i === 3) {
          setTimeout(async () => {
            setStage("done");
            if (session == null ? void 0 : session.id) {
              try {
                await fetch(`${BACKEND}/notifications/send`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    trigger: "dispensed",
                    user_id: session.id,
                    name: patientName,
                    date_time: (/* @__PURE__ */ new Date()).toLocaleString("en-IN")
                  })
                });
              } catch (err) {
                console.error("[Dispense] Notification error:", err);
              }
            }
          }, 1200);
        }
      }, i * 1500);
    });
  }
  useEffect(() => {
    if (stage === "done" && !dispensedSmsSent.current) {
      dispensedSmsSent.current = true;
      const tpl = notificationTemplates.dispensed(patientName);
      showNotification(tpl.title, tpl.body);
    }
    if (stage !== "done") dispensedSmsSent.current = false;
  }, [stage, patientName]);
  function handleDownloadReceipt() {
    downloadReceipt({
      patientName,
      patientPhone,
      doctorName: "Iyer",
      kioskId: "KIOSK-001",
      meds: extractedMeds.length ? extractedMeds : SAMPLE_MEDS
    });
  }
  function reset() {
    setStage("upload");
    setPreview(null);
    setAiStep(0);
    setDispenseStep(0);
    setPrescriptionId(null);
  }
  if (!isMounted) return null;
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-end justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Patient" }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: [
          "Hello, ",
          patientName.split(" ")[0],
          "."
        ] })
      ] }),
      stage !== "upload" && /* @__PURE__ */ jsx("button", { onClick: reset, className: "rounded-full bg-card px-4 py-2 text-xs font-medium text-surface shadow-card hover:bg-mint", children: "Start over" })
    ] }),
    stage === "upload" && /* @__PURE__ */ jsx(UploadView, { onFile }),
    stage === "processing" && /* @__PURE__ */ jsx(ProcessingView, { preview, step: aiStep }),
    stage === "result" && /* @__PURE__ */ jsx(ResultView, { preview, meds: extractedMeds, onConfirm: handleConfirmResult }),
    stage === "payment" && /* @__PURE__ */ jsx(PaymentView, { status: paymentStatus, orderData, qrData, timeLeft, onPayCard: payByCard }),
    stage === "dispense" && /* @__PURE__ */ jsx(DispenseView, { step: dispenseStep }),
    stage === "done" && /* @__PURE__ */ jsx(DoneView, { onReset: reset, onDownload: handleDownloadReceipt, name: patientName, meds: extractedMeds }),
    /* @__PURE__ */ jsx(PatientChatbot, { patientName, meds: extractedMeds.length ? extractedMeds : SAMPLE_MEDS, status: chatStatus })
  ] });
}
function UploadView({
  onFile
}) {
  const [drag, setDrag] = useState(false);
  return /* @__PURE__ */ jsx("div", { className: "animate-fade-up", children: /* @__PURE__ */ jsxs("div", { onDragOver: (e) => {
    e.preventDefault();
    setDrag(true);
  }, onDragLeave: () => setDrag(false), onDrop: (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  }, className: "flex min-h-[420px] flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-card p-8 text-center transition " + (drag ? "border-amber bg-amber/5" : "border-border"), children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-mint", children: /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8 text-surface" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-surface", children: "Drop your prescription here" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-sm text-sm text-muted-foreground", children: "PDF, JPG or PNG. We'll read it, verify it, and queue it for doctor approval." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 flex gap-3", children: [
      /* @__PURE__ */ jsxs("label", { className: "cursor-pointer rounded-full bg-surface px-6 py-3 text-sm font-medium text-surface-foreground hover:opacity-90", children: [
        "Choose file",
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*,.pdf", className: "hidden", onChange: (e) => {
          var _a;
          return ((_a = e.target.files) == null ? void 0 : _a[0]) && onFile(e.target.files[0]);
        } })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center gap-2 rounded-full bg-mint px-6 py-3 text-sm font-medium text-surface hover:bg-accent", children: [
        /* @__PURE__ */ jsx(Camera, { className: "h-4 w-4" }),
        "Use camera",
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", capture: "environment", className: "hidden", onChange: (e) => {
          var _a;
          return ((_a = e.target.files) == null ? void 0 : _a[0]) && onFile(e.target.files[0]);
        } })
      ] })
    ] })
  ] }) });
}
function ProcessingView({
  preview,
  step
}) {
  return /* @__PURE__ */ jsxs("div", { className: "grid animate-fade-up gap-6 md:grid-cols-2", children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-3xl bg-card shadow-card border border-border", children: preview && /* @__PURE__ */ jsx("img", { src: preview, alt: "Prescription", className: "h-full max-h-[480px] w-full object-cover" }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-8 shadow-card border border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full bg-amber/15 px-3 py-1 text-xs font-medium text-amber", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
        "AI processing"
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-surface", children: "Reading your prescription" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Our model is extracting and validating every detail." }),
      /* @__PURE__ */ jsx("ul", { className: "mt-8 space-y-4", children: AI_STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ", done ? "bg-success text-success-foreground" : active ? "bg-amber/20 text-amber" : "bg-mint text-muted-foreground"), children: done ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }) : active ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx("span", { className: "text-xs", children: i + 1 }) }),
          /* @__PURE__ */ jsx("span", { className: cn("text-sm transition ", done || active ? "text-surface" : "text-muted-foreground"), children: s })
        ] }, s);
      }) })
    ] })
  ] });
}
function ResultView({
  preview,
  meds,
  onConfirm
}) {
  const displayMeds = meds.length ? meds : SAMPLE_MEDS;
  return /* @__PURE__ */ jsxs("div", { className: "grid animate-fade-up gap-6 md:grid-cols-[1fr,1.4fr]", children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-3xl bg-card shadow-card border border-border", children: preview && /* @__PURE__ */ jsx("img", { src: preview, alt: "", className: "h-full max-h-[480px] w-full object-cover" }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-8 shadow-card border border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }),
        "Verified"
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold text-surface", children: "Extracted medicines" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: displayMeds.length > 0 ? "Review the details below. Once confirmed, you can proceed to payment and dispensing." : "We couldn't detect any medicines clearly. You can still proceed to payment (minimum fee) or try a clearer photo." }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 overflow-hidden rounded-2xl border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "bg-mint/60 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Medicine" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Dosage" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Frequency" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Duration" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: displayMeds.length > 0 ? displayMeds.map((m, i) => /* @__PURE__ */ jsxs("tr", { className: "bg-card", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-surface", children: m.medicine_name || m.name }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground", children: m.dosage }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground", children: m.frequency }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground", children: m.duration })
        ] }, i)) : /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "px-4 py-8 text-center text-muted-foreground", children: "No medicines found." }) }) })
      ] }) }),
      /* @__PURE__ */ jsxs("button", { onClick: onConfirm, className: "mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-surface px-6 py-3.5 text-sm font-semibold text-surface-foreground hover:opacity-90", children: [
        /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }),
        displayMeds.length > 0 ? "Confirm & Proceed to Payment" : "Proceed Anyway (Min. Fee)"
      ] })
    ] })
  ] });
}
function PaymentView({
  status,
  orderData,
  qrData,
  timeLeft,
  onPayCard
}) {
  var _a, _b, _c;
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  if (status === "loading") {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[400px] flex-col items-center justify-center rounded-3xl bg-card p-12 text-center border border-border", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-12 w-12 animate-spin text-amber mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-surface", children: "Initialising Payment" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Generating order and QR code..." })
    ] });
  }
  if (status === "failed") {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[400px] flex-col items-center justify-center rounded-3xl bg-card p-12 text-center border border-border", children: [
      /* @__PURE__ */ jsx(AlertCircle, { className: "h-12 w-12 text-destructive mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-surface", children: "Payment Failed" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Something went wrong while creating your order." }),
      /* @__PURE__ */ jsx("button", { onClick: () => window.location.reload(), className: "rounded-full bg-surface px-6 py-3 text-sm font-medium text-surface-foreground", children: "Try Again" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "grid animate-fade-up gap-8 lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-8 shadow-card border border-border", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-surface flex items-center gap-2 mb-6", children: [
        /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5 text-amber" }),
        "Order Summary"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        (_a = orderData == null ? void 0 : orderData.medicines) == null ? void 0 : _a.map((m, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
            m.name,
            " x ",
            m.qty
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-surface", children: [
            "₹",
            (m.price * m.qty).toFixed(2)
          ] })
        ] }, i)),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-border flex justify-between text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Service Fee (5%)" }),
          /* @__PURE__ */ jsxs("span", { className: "font-medium text-surface", children: [
            "₹",
            (_b = orderData == null ? void 0 : orderData.service_fee) == null ? void 0 : _b.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t-2 border-dashed border-border flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-surface", children: "Total Amount" }),
          /* @__PURE__ */ jsxs("span", { className: "text-2xl font-bold text-amber", children: [
            "₹",
            (_c = orderData == null ? void 0 : orderData.amount) == null ? void 0 : _c.toFixed(2)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-widest text-muted-foreground", children: "Payment Methods" }),
        /* @__PURE__ */ jsxs("button", { onClick: onPayCard, className: "flex w-full items-center justify-between rounded-2xl bg-mint/40 p-4 transition hover:bg-mint", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-surface p-2.5", children: /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5 text-surface-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-surface", children: "Credit / Debit Card" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: "Powered by Razorpay" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-2xl border border-border p-4 opacity-50 grayscale cursor-not-allowed", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-background p-2.5", children: /* @__PURE__ */ jsx(IndianRupee, { className: "h-5 w-5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-surface", children: "Cash at Counter" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground", children: "Visit help desk" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-8 shadow-card border border-border text-center flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success", children: [
        /* @__PURE__ */ jsx(QrCode, { className: "h-3 w-3" }),
        "Scan to Pay"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative p-4 rounded-3xl bg-white mb-6", children: [
        (qrData == null ? void 0 : qrData.qr_image_url) ? /* @__PURE__ */ jsx("img", { src: qrData.qr_image_url, alt: "Payment QR", className: "w-64 h-64 mx-auto" }) : /* @__PURE__ */ jsxs("div", { className: "w-64 h-64 bg-background flex flex-col items-center justify-center rounded-2xl p-6 text-center", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-10 w-10 text-muted-foreground mb-3" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-surface", children: "QR Code Unavailable" }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "UPI QR is currently disabled for this account. Please use the **Card Payment** option." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 border-2 border-amber/20 rounded-3xl pointer-events-none" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mb-2", children: [
        /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-amber" }),
        /* @__PURE__ */ jsxs("span", { children: [
          "QR expires in ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-surface", children: formatTime(timeLeft) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground max-w-[240px]", children: "Open any UPI app (GPay, PhonePe, Paytm) and scan the code to complete payment." }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 pt-8 border-t border-border w-full", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-success" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-surface uppercase tracking-widest", children: "Secure 256-bit SSL Encrypted" })
      ] }) })
    ] })
  ] });
}
function DispenseView({
  step
}) {
  const messages = ["Dispensing in progress…", "Machine activated…", "Medicine delivered ✅"];
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[60vh] animate-fade-up flex-col items-center justify-center rounded-3xl gradient-forest p-12 text-center border border-border", children: step === 0 ? /* @__PURE__ */ jsxs("button", { onClick: () => {
  }, className: "flex h-56 w-56 items-center justify-center rounded-full gradient-amber text-lg font-semibold text-amber-foreground shadow-glow animate-pulse-ring", children: [
    "DISPENSE",
    /* @__PURE__ */ jsx("br", {}),
    "MEDICINE"
  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "relative mb-8 flex h-56 w-56 items-center justify-center rounded-full gradient-amber shadow-glow", children: step < 3 ? /* @__PURE__ */ jsx(Loader2, { className: "h-16 w-16 animate-spin text-amber-foreground" }) : /* @__PURE__ */ jsx(PackageCheck, { className: "h-20 w-20 text-amber-foreground" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-3xl font-semibold text-surface-foreground", children: messages[step - 1] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 flex gap-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-1.5 w-12 rounded-full transition " + (i <= step ? "bg-amber" : "bg-white/15") }, i)) })
  ] }) });
}
function DoneView({
  onReset,
  onDownload,
  name,
  meds
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[60vh] animate-fade-up flex-col items-center justify-center rounded-3xl bg-card p-12 text-center shadow-card border border-border", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/20 text-success", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-10 w-10" }) }),
    /* @__PURE__ */ jsxs("h3", { className: "text-3xl font-semibold text-surface", children: [
      "All set, ",
      name.split(" ")[0],
      "."
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-md text-muted-foreground", children: "Your medicines have been dispensed. A receipt has been sent to your phone." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxs("button", { onClick: onDownload, className: "flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-amber-foreground shadow-soft transition hover:scale-[1.02]", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
        "Download Receipt"
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onReset, className: "rounded-full bg-surface px-6 py-3 text-sm font-medium text-surface-foreground hover:opacity-90", children: "Start a new prescription" })
    ] })
  ] });
}
function ArrowRight(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M5 12h14" }),
    /* @__PURE__ */ jsx("path", { d: "m12 5 7 7-7 7" })
  ] });
}
export {
  PatientDashboard as component
};
