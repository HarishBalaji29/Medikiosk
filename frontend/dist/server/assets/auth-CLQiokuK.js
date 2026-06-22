import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Pill, Phone, Mail, Settings, Stethoscope, User, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { s as setSession } from "./session-JGLanhG1.js";
import { s as showNotification, n as notificationTemplates } from "./notifications-D9GoIOmt.js";
import { getToken } from "firebase/messaging";
import { g as getFirebaseMessaging } from "./firebase-sHON1iw5.js";
import "sonner";
import "firebase/app";
import "firebase/auth";
async function requestNotificationPermission(userId, supabaseUpdateFn) {
  try {
    if (typeof Notification === "undefined") return null;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;
    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;
    const vapidKey = void 0;
    const fcmToken = await getToken(messaging, { vapidKey });
    if (fcmToken && userId) {
      await supabaseUpdateFn(userId, fcmToken);
    }
    return fcmToken;
  } catch (err) {
    console.error("[FCM] Failed to get token:", err);
    return null;
  }
}
const ROLES = ["Patient", "Doctor", "Admin"];
const ROLE_ICONS = {
  Patient: User,
  Doctor: Stethoscope,
  Admin: Settings
};
function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [role, setRole] = useState("Patient");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [activeTab, setActiveTab] = useState("phone");
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const inputs = useRef([]);
  const BACKEND = "http://localhost:5000";
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1e3);
    }
    return () => clearInterval(interval);
  }, [timer]);
  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    if (!phone || phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setLoading(true);
    try {
      if (phone === "9999999999") {
        setStep("otp");
        setTimer(60);
        showNotification("Success", "Development bypass active. Use 123456.");
        setLoading(false);
        return;
      }
      const res = await fetch(`${BACKEND}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setStep("otp");
      setTimer(60);
      showNotification("Success", "SMS sent successfully!");
    } catch (err) {
      console.error("[Auth] OTP send error:", err);
      setError((err == null ? void 0 : err.message) ?? "Failed to send SMS.");
    } finally {
      setLoading(false);
    }
  }
  async function handleSendEmailOtp(e) {
    e.preventDefault();
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/auth/email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send Email OTP");
      setStep("otp");
      setTimer(300);
      showNotification("Success", "OTP sent to your email!");
    } catch (err) {
      console.error("[Auth] Email OTP send error:", err);
      setError((err == null ? void 0 : err.message) ?? "Failed to send email.");
    } finally {
      setLoading(false);
    }
  }
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = activeTab === "email" ? "/auth/email/verify-otp" : "/auth/verify";
      const body = activeTab === "email" ? {
        email,
        otp: code,
        role: role.toLowerCase()
      } : {
        phone,
        code,
        role: role.toLowerCase()
      };
      const res = await fetch(`${BACKEND}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Verification failed");
      const jwt = data.jwt || data.token;
      setIsNewUser(!!data.user.is_new_user);
      if (!data.user.name) {
        window.__pendingAuth = {
          jwt,
          user: data.user
        };
        setStep("profile");
      } else {
        await finaliseLogin({
          jwt,
          user: data.user,
          role: (data.user.role || role).toLowerCase() === "admin" ? "Admin" : (data.user.role || role).toLowerCase() === "doctor" ? "Doctor" : "Patient"
        });
      }
    } catch (err) {
      console.error("[Auth] Verify error:", err);
      setError((err == null ? void 0 : err.message) ?? "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  }
  async function handleProfileSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    try {
      const pending = window.__pendingAuth;
      if (!pending) throw new Error("Session lost, please sign in again.");
      await fetch(`${BACKEND}/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pending.jwt}`
        },
        body: JSON.stringify({
          name: name.trim(),
          role: role.toLowerCase()
        })
      });
      await finaliseLogin({
        jwt: pending.jwt,
        user: {
          ...pending.user,
          name: name.trim()
        },
        role
      });
    } catch (err) {
      setError((err == null ? void 0 : err.message) ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }
  async function finaliseLogin({
    jwt,
    user,
    role: role2
  }) {
    const rawRole = (user.role ?? role2 ?? "patient").toLowerCase();
    setSession({
      id: user.id,
      name: user.name ?? name ?? "User",
      phone: user.phone_number ?? (activeTab === "phone" ? `+91${phone}` : ""),
      email: user.email ?? (activeTab === "email" ? email : ""),
      role: rawRole,
      jwt,
      address: user.address,
      age: user.age,
      blood_group: user.blood_group,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      allergies: user.allergies,
      conditions: user.conditions
    });
    if (isNewUser) {
      const tpl = notificationTemplates.welcome(user.name ?? name ?? "User");
      showNotification(tpl.title, tpl.body);
    }
    setTimeout(() => {
      requestNotificationPermission(user.id, async (userId, token) => {
        await fetch(`${BACKEND}/auth/fcm-token`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify({
            user_id: userId,
            fcm_token: token
          })
        });
      });
    }, 2e3);
    const target = rawRole === "patient" ? "/patient" : rawRole === "doctor" ? "/doctor" : "/admin";
    navigate({
      to: target
    });
  }
  function handleOtp(i, val) {
    var _a;
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) (_a = inputs.current[i + 1]) == null ? void 0 : _a.focus();
  }
  function handleKey(i, e) {
    var _a;
    if (e.key === "Backspace" && !otp[i] && i > 0) (_a = inputs.current[i - 1]) == null ? void 0 : _a.focus();
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-screen items-center justify-center overflow-hidden gradient-forest px-6 py-12", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-amber/20 blur-3xl" }),
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "absolute left-6 top-6 flex items-center gap-2 text-surface-foreground/80 transition hover:text-surface-foreground", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full gradient-amber", children: /* @__PURE__ */ jsx(Pill, { className: "h-4 w-4 text-surface", strokeWidth: 2.5 }) }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tracking-tight", children: "MEDIKIOSK" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md animate-fade-up rounded-3xl glass p-8 shadow-soft md:p-10", children: [
      step === "phone" && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-balance text-3xl font-semibold leading-tight text-surface-foreground", children: "Welcome back." }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-surface-foreground/60", children: "Sign in to your MEDIKIOSK account." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flex border-b border-white/10", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            setActiveTab("phone");
            setError("");
          }, className: `flex-1 pb-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === "phone" ? "text-amber border-b-2 border-amber" : "text-surface-foreground/40 border-b-2 border-transparent"}`, children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }),
            "Phone OTP"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            setActiveTab("email");
            setError("");
          }, className: `flex-1 pb-4 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === "email" ? "text-amber border-b-2 border-amber" : "text-surface-foreground/40 border-b-2 border-transparent"}`, children: [
            /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }),
            "Email OTP"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 inline-flex w-full rounded-full border border-white/15 bg-white/5 p-1", children: ROLES.map((r) => {
          const Icon = ROLE_ICONS[r];
          return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setRole(r), className: "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition " + (role === r ? "bg-amber text-amber-foreground shadow-soft" : "text-surface-foreground/70 hover:text-surface-foreground"), children: [
            /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
            r
          ] }, r);
        }) }),
        activeTab === "phone" ? /* @__PURE__ */ jsxs("form", { onSubmit: handleSendOtp, className: "animate-in fade-in slide-in-from-left-4 duration-300", children: [
          /* @__PURE__ */ jsxs("label", { className: "mt-6 block", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-surface-foreground/60", children: "Phone number" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-surface-foreground transition focus-within:border-amber/60", children: [
              /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-surface-foreground/50" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-surface-foreground/60", children: "+91" }),
              /* @__PURE__ */ jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)), placeholder: "9876543210", className: "flex-1 bg-transparent text-sm outline-none placeholder:text-surface-foreground/30", required: true })
            ] })
          ] }),
          error && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400", children: /* @__PURE__ */ jsx("p", { children: error }) }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-amber-foreground shadow-soft transition hover:scale-[1.01] disabled:opacity-60", children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            "Send OTP ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-0.5" })
          ] }) })
        ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSendEmailOtp, className: "animate-in fade-in slide-in-from-right-4 duration-300", children: [
          /* @__PURE__ */ jsxs("label", { className: "mt-6 block", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-surface-foreground/60", children: "Email address" }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-surface-foreground transition focus-within:border-amber/60", children: [
              /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-surface-foreground/50" }),
              /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email address", className: "flex-1 bg-transparent text-sm outline-none placeholder:text-surface-foreground/30", required: true })
            ] })
          ] }),
          error && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-400", children: /* @__PURE__ */ jsx("p", { children: error }) }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-amber-foreground shadow-soft transition hover:scale-[1.01] disabled:opacity-60", children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            "Send Email OTP ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 transition group-hover:translate-x-0.5" })
          ] }) })
        ] })
      ] }),
      step === "otp" && /* @__PURE__ */ jsxs("form", { onSubmit: handleVerifyOtp, children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-amber/20", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6 text-amber" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-surface-foreground", children: "Enter verification code" }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-surface-foreground/60", children: [
          "We sent a 6-digit code to ",
          activeTab === "email" ? email : `+91${phone}`
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 grid grid-cols-6 gap-2", children: otp.map((d, i) => /* @__PURE__ */ jsx("input", { ref: (el) => {
          inputs.current[i] = el;
        }, value: d, onChange: (e) => handleOtp(i, e.target.value), onKeyDown: (e) => handleKey(i, e), inputMode: "numeric", maxLength: 1, className: "h-14 w-full min-w-0 rounded-xl border border-white/15 bg-white/5 text-center text-lg font-semibold text-surface-foreground outline-none transition focus:border-amber/60 focus:ring-2 focus:ring-amber/30" }, i)) }),
        error && /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-red-400", children: error }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-amber-foreground shadow-soft transition hover:scale-[1.01] disabled:opacity-60", children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Verify & Continue" }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center text-xs text-surface-foreground/60", children: timer > 0 ? /* @__PURE__ */ jsxs("span", { children: [
          "Resend OTP in ",
          Math.floor(timer / 60),
          ":",
          String(timer % 60).padStart(2, "0")
        ] }) : /* @__PURE__ */ jsx("button", { type: "button", onClick: activeTab === "email" ? handleSendEmailOtp : handleSendOtp, className: "text-amber hover:underline font-semibold", children: "Resend OTP" }) }),
        /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => {
          setStep("phone");
          setOtp(["", "", "", "", "", ""]);
          setError("");
        }, className: "mt-4 w-full text-center text-xs text-surface-foreground/50 hover:text-surface-foreground underline", children: [
          "← Start Over / Change ",
          activeTab === "email" ? "Email" : "Phone"
        ] })
      ] }),
      step === "profile" && /* @__PURE__ */ jsxs("form", { onSubmit: handleProfileSubmit, children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold text-surface-foreground", children: "One last step 👋" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-surface-foreground/60", children: "Tell us your name to personalise your experience." }),
        /* @__PURE__ */ jsxs("label", { className: "mt-8 block", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium uppercase tracking-wider text-surface-foreground/60", children: "Your name" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Priya Sharma", className: "mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-surface-foreground outline-none placeholder:text-surface-foreground/30 focus:border-amber/60", required: true })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 inline-flex w-full rounded-full border border-white/15 bg-white/5 p-1", children: ROLES.map((r) => {
          const Icon = ROLE_ICONS[r];
          return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setRole(r), className: "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition " + (role === r ? "bg-amber text-amber-foreground shadow-soft" : "text-surface-foreground/70 hover:text-surface-foreground"), children: [
            /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
            r
          ] }, r);
        }) }),
        error && /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-red-400", children: error }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-amber-foreground shadow-soft transition hover:scale-[1.01] disabled:opacity-60", children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "Go to Dashboard →" })
      ] })
    ] })
  ] });
}
export {
  AuthPage as component
};
