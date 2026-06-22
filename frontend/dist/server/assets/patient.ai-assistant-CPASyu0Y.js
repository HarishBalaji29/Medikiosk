import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Bot, Volume2, VolumeX, Loader2, User, AlertCircle, Stethoscope, MicOff, Mic, Send } from "lucide-react";
import { g as getSession } from "./session-JGLanhG1.js";
import { s as showNotification } from "./notifications-D9GoIOmt.js";
import "sonner";
const BACKEND = "http://localhost:5000";
function AssistantPage() {
  const [session] = useState(() => getSession());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [language, setLanguage] = useState("en");
  const scrollRef = useRef(null);
  useEffect(() => {
    const fetchHistory = async () => {
      var _a, _b;
      if (!(session == null ? void 0 : session.id)) return;
      try {
        const res = await fetch(`${BACKEND}/chat/history/${session.id}`);
        const data = await res.json();
        if (data && data.length > 0) {
          setMessages(data);
        } else {
          const greeting = language === "en" ? `Hello ${((_a = session == null ? void 0 : session.name) == null ? void 0 : _a.split(" ")[0]) || "there"}. I'm your MEDIKIOSK Health Assistant. How can I help you today?` : `வணக்கம் ${((_b = session == null ? void 0 : session.name) == null ? void 0 : _b.split(" ")[0]) || "நண்பரே"}. நான் உங்கள் மெடிகியோஸ்க் (MEDIKIOSK) சுகாதார உதவியாளர். நான் இன்று உங்களுக்கு எப்படி உதவ முடியும்?`;
          setMessages([{
            role: "ai",
            content: greeting,
            time: (/* @__PURE__ */ new Date()).toISOString()
          }]);
        }
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [session == null ? void 0 : session.id]);
  useEffect(() => {
    var _a;
    (_a = scrollRef.current) == null ? void 0 : _a.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);
  useEffect(() => {
    const contextStr = localStorage.getItem("health_report_context");
    if (contextStr) {
      const context = JSON.parse(contextStr);
      localStorage.removeItem("health_report_context");
      const content = language === "en" ? `I see you have questions about your ${context.type}. Based on the analysis, your ${context.summary}. How can I help you understand these results better?` : `உங்கள் ${context.type} பற்றிய கேள்விகள் இருப்பதாக நான் காண்கிறேன். பகுப்பாய்வின் அடிப்படையில், உங்கள் ${context.summary}. இந்த முடிவுகளை நன்றாகப் புரிந்துகொள்ள நான் உங்களுக்கு எப்படி உதவ முடியும்?`;
      setMessages((prev) => [...prev, {
        role: "ai",
        content,
        time: (/* @__PURE__ */ new Date()).toISOString()
      }]);
    }
  }, [language]);
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-US" : "ta-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };
  const handleSend = async (text = input) => {
    if (!text.trim() || loading) return;
    const userMsg = {
      role: "user",
      content: text.trim(),
      time: (/* @__PURE__ */ new Date()).toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      if (!(session == null ? void 0 : session.id)) return;
      const res = await fetch(`${BACKEND}/chat/health-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patient_id: session.id,
          message: text.trim(),
          language
        })
      });
      const data = await res.json();
      const aiMsg = {
        role: "ai",
        content: data.response,
        is_serious: data.is_serious,
        time: (/* @__PURE__ */ new Date()).toISOString()
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (autoRead) speak(data.response);
      if (data.is_serious) {
        showNotification("Emergency Detected", "Please consider consulting a doctor immediately.");
      }
    } catch (err) {
      showNotification("Error", "AI Assistant is offline");
    } finally {
      setLoading(false);
    }
  };
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showNotification("Not Supported", "Voice input is not supported in this browser.");
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "en" ? "en-US" : "ta-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => handleSend(transcript), 1e3);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };
  const handleEscalate = async () => {
    if (!(session == null ? void 0 : session.id)) return;
    try {
      await fetch(`${BACKEND}/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patient_id: session.id,
          doctor_id: null,
          // Assign to general queue
          status: "consultation",
          doctor_notes: "Urgent AI Assistant Escalation"
        })
      });
      showNotification("Urgent Case Created", "A doctor has been notified of your situation.");
    } catch (err) {
      console.error(err);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex h-[calc(100vh-160px)] flex-col animate-fade-in", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-surface flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground", children: /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" }) }),
          "AI Health Assistant"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1 ml-11", children: "Powered by your health records" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex bg-card rounded-full p-1 border border-border/40", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setLanguage("en"), className: `px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition ${language === "en" ? "bg-surface text-white shadow-soft" : "text-muted-foreground hover:text-surface"}`, children: "English" }),
          /* @__PURE__ */ jsx("button", { onClick: () => setLanguage("ta"), className: `px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition ${language === "ta" ? "bg-surface text-white shadow-soft" : "text-muted-foreground hover:text-surface"}`, children: "தமிழ் (Tamil)" })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setAutoRead(!autoRead), className: `flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold uppercase transition ${autoRead ? "bg-amber text-amber-foreground shadow-soft" : "bg-card text-muted-foreground border border-border/40"}`, children: [
          autoRead ? /* @__PURE__ */ jsx(Volume2, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(VolumeX, { className: "h-3 w-3" }),
          "Voice ",
          autoRead ? "ON" : "OFF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto rounded-3xl bg-card/40 p-6 shadow-sm border border-border/40 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      historyLoading ? /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center gap-4 py-20", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-amber" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: "Retrieving history..." })
      ] }) : /* @__PURE__ */ jsx(Fragment, { children: messages.map((m, i) => /* @__PURE__ */ jsxs("div", { className: `flex flex-col ${m.role === "user" ? "items-end" : "items-start"} animate-fade-up`, children: [
        /* @__PURE__ */ jsxs("div", { className: `flex max-w-[80%] items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx("div", { className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "ai" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "bg-amber text-amber-foreground"}`, children: m.role === "ai" ? /* @__PURE__ */ jsx(Bot, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-2xl px-5 py-3 shadow-sm ${m.role === "ai" ? "bg-card text-surface" : "bg-surface text-surface-foreground"}`, children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", children: m.content }),
            m.role === "ai" && /* @__PURE__ */ jsx("button", { onClick: () => speak(m.content), className: "mt-2 text-muted-foreground hover:text-amber transition active:scale-95", children: /* @__PURE__ */ jsx(Volume2, { className: "h-3 w-3" }) })
          ] })
        ] }),
        m.is_serious && /* @__PURE__ */ jsx("div", { className: "mt-4 w-full animate-pulse-ring rounded-2xl bg-destructive/10 border border-destructive/20 p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center text-destructive", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-surface text-lg", children: "🚨 This sounds serious" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-surface/70 mt-1", children: "Based on our conversation, you should seek medical attention immediately." }),
            /* @__PURE__ */ jsxs("button", { onClick: handleEscalate, className: "mt-4 flex items-center gap-2 rounded-full bg-destructive px-6 py-2.5 text-xs font-bold text-white hover:bg-destructive/90 transition shadow-lg", children: [
              /* @__PURE__ */ jsx(Stethoscope, { className: "h-4 w-4" }),
              "Consult Doctor Now"
            ] })
          ] })
        ] }) })
      ] }, i)) }),
      loading && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground animate-pulse ml-11", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: "Assistant is thinking..." })
      ] }),
      /* @__PURE__ */ jsx("div", { ref: scrollRef })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 flex items-center gap-3", children: /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
      /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Ask anything about your health...", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSend(), className: "w-full rounded-2xl border-none bg-card py-4 pl-6 pr-24 text-sm shadow-card focus:ring-2 focus:ring-amber" }),
      /* @__PURE__ */ jsxs("div", { className: "absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: toggleListening, className: `p-2 rounded-xl transition ${isListening ? "bg-destructive text-white animate-pulse" : "text-muted-foreground hover:bg-mint hover:text-surface"}`, children: isListening ? /* @__PURE__ */ jsx(MicOff, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Mic, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => handleSend(), disabled: !input.trim() || loading, className: "rounded-xl bg-sidebar-accent p-2 text-sidebar-accent-foreground hover:opacity-90 disabled:opacity-50", children: /* @__PURE__ */ jsx(Send, { className: "h-5 w-5" }) })
      ] })
    ] }) }),
    isListening && /* @__PURE__ */ jsx("p", { className: "text-center text-[10px] font-bold uppercase tracking-widest text-destructive mt-2", children: "Listening..." })
  ] });
}
export {
  AssistantPage as component
};
