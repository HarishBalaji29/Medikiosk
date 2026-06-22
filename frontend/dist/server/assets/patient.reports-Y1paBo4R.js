import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Upload, Sparkles, CheckCircle2, Loader2, Activity, FileText, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { g as getSession } from "./session-JGLanhG1.js";
import { s as showNotification } from "./notifications-D9GoIOmt.js";
import "sonner";
const BACKEND = "http://localhost:5000";
const REPORT_TYPES = ["Blood Test", "BP Report", "Sugar Test", "Thyroid", "ECG", "Scan/X-Ray"];
const ANALYSIS_STEPS = ["Reading Report", "Extracting Values", "Analyzing Results", "Generating Summary"];
function ReportsPage() {
  var _a;
  const [session] = useState(() => getSession());
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState(REPORT_TYPES[0]);
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  useEffect(() => {
    async function fetchReports() {
      if (!(session == null ? void 0 : session.id)) return;
      try {
        const res = await fetch(`${BACKEND}/reports/patient/${session.id}`);
        const data = await res.json();
        setReports(data);
      } catch (err) {
        console.error("Reports fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [session]);
  const onUpload = async (file) => {
    setUploading(true);
    setAnalysisStep(0);
    const stepInterval = setInterval(() => {
      setAnalysisStep((s) => s < 3 ? s + 1 : s);
    }, 2e3);
    try {
      if (!(session == null ? void 0 : session.id)) return;
      const formData = new FormData();
      formData.append("report", file);
      formData.append("patient_id", session.id);
      formData.append("report_type", selectedType);
      const res = await fetch(`${BACKEND}/reports/analyze`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      clearInterval(stepInterval);
      if (data.success) {
        setAnalysisStep(4);
        setLastAnalysis(data.report);
        setReports((prev) => [data.report, ...prev]);
        showNotification("Success", "Report analyzed successfully");
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      clearInterval(stepInterval);
      showNotification("Error", "Failed to analyze report");
      setAnalysisStep(-1);
    } finally {
      setUploading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-in space-y-8 pb-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-[0.2em] text-amber", children: "Records" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-semibold text-surface md:text-4xl", children: "Health Reports" })
      ] }),
      lastAnalysis && /* @__PURE__ */ jsx("button", { onClick: () => {
        setLastAnalysis(null);
        setAnalysisStep(-1);
      }, className: "rounded-full bg-card px-4 py-2 text-xs font-medium text-surface shadow-card hover:bg-mint", children: "Upload another" })
    ] }),
    !uploading && !lastAnalysis && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: REPORT_TYPES.map((t) => /* @__PURE__ */ jsx("button", { onClick: () => setSelectedType(t), className: `rounded-full px-4 py-2 text-xs font-semibold transition ${selectedType === t ? "bg-amber text-amber-foreground shadow-soft" : "bg-card text-surface hover:bg-mint"}`, children: t }, t)) }),
      /* @__PURE__ */ jsx("div", { className: "animate-fade-up", children: /* @__PURE__ */ jsxs("label", { className: "flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center transition hover:border-amber hover:bg-amber/5", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-mint text-surface", children: /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8" }) }),
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-surface", children: [
          "Click or drag your ",
          selectedType
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "PDF, JPG or PNG. Our AI will extract and summarize results." }),
        /* @__PURE__ */ jsx("input", { type: "file", className: "hidden", accept: "image/*,.pdf", onChange: (e) => {
          var _a2;
          return ((_a2 = e.target.files) == null ? void 0 : _a2[0]) && onUpload(e.target.files[0]);
        } })
      ] }) })
    ] }),
    uploading && /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-12 shadow-card text-center animate-fade-up", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 inline-flex items-center gap-2 rounded-full bg-amber/15 px-4 py-2 text-xs font-bold text-amber uppercase tracking-widest", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }),
        " AI Analyzing"
      ] }),
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-surface mb-8", children: [
        "Processing your ",
        selectedType,
        "..."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-sm space-y-4", children: ANALYSIS_STEPS.map((s, i) => {
        const done = i < analysisStep;
        const active = i === analysisStep;
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${done ? "bg-success text-success-foreground" : active ? "bg-amber/20 text-amber" : "bg-mint text-muted-foreground"}`, children: done ? /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }) : active ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx("span", { children: i + 1 }) }),
          /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${done || active ? "text-surface" : "text-muted-foreground"}`, children: s })
        ] }, s);
      }) })
    ] }),
    lastAnalysis && /* @__PURE__ */ jsxs("div", { className: "animate-fade-up grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-3xl bg-card shadow-card", children: /* @__PURE__ */ jsx("img", { src: lastAnalysis.image_url, alt: "Report", className: "h-full w-full object-cover max-h-[500px]" }) }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-8 shadow-card space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-[10px] font-bold text-success uppercase", children: [
            /* @__PURE__ */ jsx(Activity, { className: "h-3 w-3" }),
            " ",
            lastAnalysis.report_type
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: new Date(lastAnalysis.created_at).toLocaleDateString() })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-2xl border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-mint/60 text-[10px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Test Name" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Value" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-2 text-right", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: (_a = lastAnalysis.extracted_values) == null ? void 0 : _a.map((v, i) => /* @__PURE__ */ jsxs("tr", { className: "bg-card", children: [
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-surface", children: v.test_name }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-muted-foreground", children: [
              v.value,
              " ",
              v.unit
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${v.status === "High" || v.status === "Low" ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}`, children: v.status || "Normal" }) })
          ] }, i)) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-mint/30 p-5", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-surface mb-2 uppercase tracking-wide", children: "AI Summary" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-surface/80 leading-relaxed", children: lastAnalysis.ai_summary })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-amber/30 p-5 bg-amber/5", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold text-amber mb-2 uppercase tracking-wide", children: "Recommendation" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-surface/80 leading-relaxed font-medium", children: lastAnalysis.ai_recommendation })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => {
            localStorage.setItem("health_report_context", JSON.stringify({
              type: lastAnalysis.report_type,
              summary: lastAnalysis.ai_summary,
              recommendation: lastAnalysis.ai_recommendation,
              values: lastAnalysis.extracted_values
            }));
            window.location.href = "/patient/ai-assistant";
          }, className: "flex-1 rounded-full bg-surface py-3 text-xs font-bold text-surface-foreground hover:opacity-90", children: "Ask AI About This" }),
          /* @__PURE__ */ jsx("button", { onClick: async () => {
            if (!(session == null ? void 0 : session.id)) return;
            try {
              showNotification("Requesting Consultation", "Connecting you with a specialist...");
              await fetch(`${BACKEND}/prescriptions`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  patient_id: session.id,
                  doctor_id: null,
                  status: "pending",
                  type: "consultation",
                  report_id: lastAnalysis.id,
                  doctor_notes: `Patient requested consultation regarding ${lastAnalysis.report_type} report.`
                })
              });
              showNotification("Consultation Booked", "A doctor will contact you soon.");
            } catch (err) {
              showNotification("Error", "Could not request consultation");
            }
          }, className: "flex-1 rounded-full border border-border py-3 text-xs font-bold text-surface hover:bg-mint transition", children: "Consult Doctor" })
        ] })
      ] })
    ] }),
    !lastAnalysis && !uploading && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-surface", children: "Recent Reports" }),
      reports.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: reports.map((r) => /* @__PURE__ */ jsxs("div", { onClick: () => setLastAnalysis(r), className: "group cursor-pointer rounded-3xl bg-card p-5 shadow-card transition-hover", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-amber/15 text-amber", children: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }) }),
          r.has_critical_values && /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-destructive" })
        ] }),
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-surface", children: r.report_type }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
            " ",
            new Date(r.created_at).toLocaleDateString()
          ] }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-1" })
        ] })
      ] }, r.id)) }) : /* @__PURE__ */ jsxs("div", { className: "flex h-48 flex-col items-center justify-center rounded-3xl bg-card/50 border border-dashed border-border", children: [
        /* @__PURE__ */ jsx(FileText, { className: "mb-2 h-8 w-8 text-muted-foreground opacity-30" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No reports found." })
      ] })
    ] })
  ] });
}
export {
  ReportsPage as component
};
