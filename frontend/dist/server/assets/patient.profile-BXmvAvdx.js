import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ShieldCheck, Calendar, X, Save, Edit2, FileText, Pill, Activity, Mail, Phone, MapPin, Info, Dna, Scale, Ruler } from "lucide-react";
import { g as getSession, s as setSession } from "./session-JGLanhG1.js";
import { c as cn } from "./utils-H80jjgLf.js";
import { s as showNotification } from "./notifications-D9GoIOmt.js";
import "clsx";
import "tailwind-merge";
import "sonner";
const BACKEND = "http://localhost:5000";
function ProfilePage() {
  var _a;
  const [session] = useState(() => getSession());
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    prescriptions: 0,
    medicines: 0,
    reports: 0
  });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    blood_group: "",
    weight: "",
    height: "",
    gender: "",
    allergies: "",
    conditions: ""
  });
  useEffect(() => {
    async function fetchData() {
      try {
        if (!(session == null ? void 0 : session.id)) {
          setLoading(false);
          return;
        }
        const res = await fetch(`${BACKEND}/auth/profile/${session.id}`);
        if (!res.ok) throw new Error("Failed to fetch profile from server");
        const user = await res.json();
        if (user) {
          const toStr = (val) => {
            if (!val) return "";
            if (Array.isArray(val)) return val.join(", ");
            return val.toString();
          };
          setFormData({
            name: user.name || "",
            phone: user.phone_number || "",
            email: user.email || "",
            address: user.address || "",
            age: (user.age ?? "").toString(),
            blood_group: user.blood_group || "",
            weight: (user.weight ?? "").toString(),
            height: (user.height ?? "").toString(),
            gender: user.gender || "",
            allergies: toStr(user.allergies),
            conditions: toStr(user.conditions)
          });
          const updatedSession = {
            ...session,
            ...user,
            phone: user.phone_number
          };
          setSession(updatedSession);
        }
        const prescRes = await fetch(`${BACKEND}/prescriptions/patient/${session.id}`);
        const prescData = prescRes.ok ? await prescRes.json() : [];
        const approvedPresc = prescData.filter((p) => p.status === "approved");
        const activeMedsCount = approvedPresc.reduce((acc, curr) => {
          var _a2, _b, _c;
          return acc + (((_b = (_a2 = curr.extracted_data) == null ? void 0 : _a2.medicines) == null ? void 0 : _b.length) || ((_c = curr.extracted_data) == null ? void 0 : _c.length) || 0);
        }, 0);
        const reportsRes = await fetch(`${BACKEND}/reports/patient/${session.id}`);
        const reportsData = reportsRes.ok ? await reportsRes.json() : [];
        setStats({
          prescriptions: prescData.length,
          medicines: activeMedsCount,
          reports: reportsData.length
        });
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session == null ? void 0 : session.id]);
  const handleSave = async () => {
    if (!(session == null ? void 0 : session.id)) {
      showNotification("Error", "No active session found");
      return;
    }
    console.log("[Profile] Save button clicked. Data:", formData);
    setSaving(true);
    try {
      const res = await fetch(`${BACKEND}/auth/save-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: session.id,
          ...formData,
          phone_number: formData.phone
          // Map phone to DB phone_number
        })
      });
      console.log("[Profile] Backend response status:", res.status);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }
      const updatedUser = await res.json();
      console.log("[Profile] Save successful. Updated user:", updatedUser);
      const updatedSession = {
        ...session,
        ...updatedUser,
        phone: updatedUser.phone_number
      };
      setSession(updatedSession);
      setIsEditing(false);
      showNotification("Success", "Profile updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1e3);
    } catch (err) {
      console.error("[Profile] Save failed:", err);
      alert(`Save Failed: ${err.message}`);
      showNotification("Error", err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "animate-pulse space-y-8", children: [
      /* @__PURE__ */ jsx("div", { className: "h-40 rounded-3xl bg-card" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx("div", { className: "h-32 rounded-3xl bg-card" }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "h-64 rounded-3xl bg-card" })
    ] });
  }
  const initials = ((_a = session == null ? void 0 : session.name) == null ? void 0 : _a.split(" ").map((n) => n[0]).join("").toUpperCase()) || "P";
  return /* @__PURE__ */ jsxs("div", { className: "animate-fade-up space-y-8 pb-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-card shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-sidebar opacity-5 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center gap-6 p-8 md:flex-row md:items-end md:p-12", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-28 w-28 items-center justify-center rounded-3xl bg-sidebar text-3xl font-bold text-white shadow-glow ring-4 ring-white/10 ring-offset-2 ring-offset-background animate-float", children: initials }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 text-center md:text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 md:justify-start", children: [
            isEditing ? /* @__PURE__ */ jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData({
              ...formData,
              name: e.target.value
            }), className: "rounded-lg border-none bg-background px-3 py-1 text-2xl font-bold text-surface focus:ring-2 focus:ring-amber" }) : /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-surface", children: session == null ? void 0 : session.name }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full bg-mint/20 px-2.5 py-0.5 text-xs font-medium text-surface ring-1 ring-mint/30", children: (session == null ? void 0 : session.role) || "Patient" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-muted-foreground", children: "Managing your health at Medikiosk" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-4 md:justify-start", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-background/50 px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-border", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-success" }),
              "Verified Account"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl bg-background/50 px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-border", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 text-amber" }),
              "Joined March 2024"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => setIsEditing(false), className: "flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-bold text-surface transition-hover hover:bg-background", children: [
            /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
            "Cancel"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: handleSave, disabled: saving, className: "flex items-center gap-2 rounded-2xl bg-success px-6 py-3 text-sm font-bold text-white shadow-soft transition-hover hover:scale-105 active:scale-95 disabled:opacity-50", children: [
            saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
            "Save Changes"
          ] })
        ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setIsEditing(true), className: "flex items-center gap-2 rounded-2xl bg-amber px-6 py-3 text-sm font-bold text-amber-foreground shadow-soft transition-hover hover:scale-105 active:scale-95", children: [
          /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" }),
          "Edit Profile"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [{
      label: "Prescriptions",
      value: stats.prescriptions,
      icon: FileText,
      color: "text-amber bg-amber/10"
    }, {
      label: "Active Medicines",
      value: stats.medicines,
      icon: Pill,
      color: "text-success bg-success/10"
    }, {
      label: "Health Reports",
      value: stats.reports,
      icon: Activity,
      color: "text-sidebar-accent-foreground bg-sidebar-accent/10"
    }].map((s, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5 rounded-3xl bg-card p-6 shadow-card transition-hover", children: [
      /* @__PURE__ */ jsx("div", { className: cn("flex h-14 w-14 items-center justify-center rounded-2xl", s.color), children: /* @__PURE__ */ jsx(s.icon, { className: "h-7 w-7" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-surface", children: s.value }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: s.label })
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 rounded-3xl bg-card p-8 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-surface", children: "Contact" }),
          !isEditing && /* @__PURE__ */ jsx("button", { onClick: () => setIsEditing(true), className: "text-sm font-medium text-amber hover:underline", children: "Manage" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "mt-1 rounded-xl bg-background p-2", children: /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Email Address" }),
              isEditing ? /* @__PURE__ */ jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({
                ...formData,
                email: e.target.value
              }), className: "mt-1 w-full rounded-lg border-none bg-background px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber", placeholder: "Enter email" }) : /* @__PURE__ */ jsx("p", { className: "font-semibold text-surface", children: formData.email || "Not set" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "mt-1 rounded-xl bg-background p-2", children: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Phone Number" }),
              isEditing ? /* @__PURE__ */ jsx("input", { type: "tel", value: formData.phone, onChange: (e) => setFormData({
                ...formData,
                phone: e.target.value
              }), className: "mt-1 w-full rounded-lg border-none bg-background px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber" }) : /* @__PURE__ */ jsx("p", { className: "font-semibold text-surface", children: formData.phone })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "mt-1 rounded-xl bg-background p-2", children: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Location / Address" }),
              isEditing ? /* @__PURE__ */ jsx("textarea", { value: formData.address, onChange: (e) => setFormData({
                ...formData,
                address: e.target.value
              }), className: "mt-1 w-full rounded-lg border-none bg-background px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber", rows: 2, placeholder: "Enter address" }) : /* @__PURE__ */ jsx("p", { className: "font-semibold text-surface", children: formData.address || "Not set" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-3xl bg-card p-8 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-surface", children: "Health Profile" }),
          /* @__PURE__ */ jsx(Info, { className: "h-5 w-5 text-muted-foreground opacity-30" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6 md:grid-cols-4 mb-8", children: [{
          label: "Age",
          value: formData.age,
          field: "age",
          icon: Calendar,
          suffix: "yrs"
        }, {
          label: "Blood",
          value: formData.blood_group,
          field: "blood_group",
          icon: Dna,
          placeholder: "O+"
        }, {
          label: "Weight",
          value: formData.weight,
          field: "weight",
          icon: Scale,
          suffix: "kg"
        }, {
          label: "Height",
          value: formData.height,
          field: "height",
          icon: Ruler,
          suffix: "cm"
        }].map((item, i) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-background/40 p-4 border border-border/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground mb-2", children: [
            /* @__PURE__ */ jsx(item.icon, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider", children: item.label })
          ] }),
          isEditing ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("input", { type: "text", value: item.value, onChange: (e) => setFormData({
              ...formData,
              [item.field]: e.target.value
            }), className: "w-full bg-transparent p-0 text-sm font-bold text-surface border-none focus:ring-0", placeholder: item.placeholder || "0" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: item.suffix })
          ] }) : /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-surface", children: [
            item.value || "--",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-xs font-normal text-muted-foreground", children: item.suffix })
          ] })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3", children: "Known Allergies" }),
            isEditing ? /* @__PURE__ */ jsx("textarea", { value: formData.allergies, onChange: (e) => setFormData({
              ...formData,
              allergies: e.target.value
            }), className: "w-full rounded-2xl border-none bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-amber", rows: 2, placeholder: "List any allergies (e.g., Penicillin, Peanuts)" }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: formData.allergies ? formData.allergies.split(",").map((a, i) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive", children: a.trim() }, i)) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground italic", children: "No allergies reported" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3", children: "Chronic Conditions" }),
            isEditing ? /* @__PURE__ */ jsx("textarea", { value: formData.conditions, onChange: (e) => setFormData({
              ...formData,
              conditions: e.target.value
            }), className: "w-full rounded-2xl border-none bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-amber", rows: 2, placeholder: "List any chronic conditions (e.g., Diabetes, Hypertension)" }) : /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: formData.conditions ? formData.conditions.split(",").map((c, i) => /* @__PURE__ */ jsx("span", { className: "rounded-full bg-sidebar-accent/10 px-3 py-1 text-xs font-medium text-sidebar-accent-foreground", children: c.trim() }, i)) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground italic", children: "No chronic conditions reported" }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-card p-8 shadow-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-surface", children: "Security & Privacy" }),
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-success" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: [{
        label: "Notification Preferences",
        desc: "Manage how you receive alerts",
        icon: Activity
      }, {
        label: "Two-Factor Authentication",
        desc: "Add an extra layer of security",
        icon: ShieldCheck,
        status: "Enabled",
        statusColor: "text-success"
      }].map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border/50 p-4 transition-all hover:bg-background", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-sidebar/5 p-2.5", children: /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4 text-sidebar" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-surface", children: item.label }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: item.desc })
          ] })
        ] }),
        item.status && /* @__PURE__ */ jsx("span", { className: cn("text-[10px] font-bold uppercase tracking-wider", item.statusColor), children: item.status })
      ] }, i)) })
    ] })
  ] });
}
function Loader2(props) {
  return /* @__PURE__ */ jsx("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: cn("animate-spin", props.className), children: /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }) });
}
export {
  ProfilePage as component
};
