import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Pill, X, Menu, Sparkles, ArrowRight, Upload, Brain, Stethoscope, PackageCheck, Search, Mic, RefreshCw, XCircle, CheckCircle2, Quote, User, ShieldCheck, Zap, Play } from "lucide-react";
import { c as cn } from "./utils-H80jjgLf.js";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import CountUpImport from "react-countup";
import "clsx";
import "tailwind-merge";
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-500 px-6 py-4",
        isScrolled ? "py-3" : "py-6"
      ),
      children: [
        /* @__PURE__ */ jsxs(
          "nav",
          {
            className: cn(
              "mx-auto flex max-w-7xl items-center justify-between rounded-full border transition-all duration-500 px-4 py-2",
              isScrolled ? "bg-surface/80 backdrop-blur-xl border-white/10 shadow-2xl" : "bg-transparent border-transparent"
            ),
            children: [
              /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 pl-2", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full gradient-amber shadow-glow", children: /* @__PURE__ */ jsx(Pill, { className: "h-4.5 w-4.5 text-surface", strokeWidth: 2.5 }) }),
                /* @__PURE__ */ jsx("span", { className: cn(
                  "text-lg font-bold tracking-tight transition-colors",
                  isScrolled ? "text-surface-foreground" : "text-white"
                ), children: "MEDIKIOSK" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: cn(
                "hidden items-center gap-8 text-sm font-semibold md:flex transition-colors",
                isScrolled ? "text-surface-foreground/70" : "text-white/70"
              ), children: [
                /* @__PURE__ */ jsx("a", { href: "/#how", className: "hover:text-amber transition-colors", children: "How It Works" }),
                /* @__PURE__ */ jsx("a", { href: "/#roles", className: "hover:text-amber transition-colors", children: "Roles" }),
                /* @__PURE__ */ jsx("a", { href: "/#faq", className: "hover:text-amber transition-colors", children: "FAQ" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    to: "/auth",
                    className: cn(
                      "hidden md:flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-soft",
                      isScrolled ? "bg-surface-foreground text-surface" : "bg-white text-surface"
                    ),
                    children: "Get Started"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                    className: cn(
                      "flex md:hidden p-2 rounded-full transition-colors",
                      isScrolled ? "text-surface-foreground hover:bg-surface/10" : "text-white hover:bg-white/10"
                    ),
                    children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: cn(
          "fixed inset-0 z-[-1] bg-surface flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        ), children: [
          /* @__PURE__ */ jsx("a", { href: "/#how", onClick: () => setMobileMenuOpen(false), className: "text-3xl font-bold text-white hover:text-amber", children: "How It Works" }),
          /* @__PURE__ */ jsx("a", { href: "/#roles", onClick: () => setMobileMenuOpen(false), className: "text-3xl font-bold text-white hover:text-amber", children: "Roles" }),
          /* @__PURE__ */ jsx("a", { href: "/#faq", onClick: () => setMobileMenuOpen(false), className: "text-3xl font-bold text-white hover:text-amber", children: "FAQ" }),
          /* @__PURE__ */ jsx(Link, { to: "/auth", onClick: () => setMobileMenuOpen(false), className: "mt-4 rounded-full bg-amber px-10 py-4 text-xl font-black text-surface", children: "Get Started" })
        ] })
      ]
    }
  );
}
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "bg-surface text-surface-foreground", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl px-6 py-16", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6 text-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full gradient-amber", children: /* @__PURE__ */ jsx(Pill, { className: "h-5 w-5 text-surface", strokeWidth: 2.5 }) }),
      /* @__PURE__ */ jsx("span", { className: "text-xl font-semibold", children: "MEDIKIOSK" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "max-w-md text-balance text-base text-surface-foreground/70", children: "Your prescription. Verified. Dispensed. Care made instant, accurate, and human." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-8 text-sm text-surface-foreground/60", children: [
      /* @__PURE__ */ jsx("a", { href: "/#how", className: "hover:text-surface-foreground", children: "How it works" }),
      /* @__PURE__ */ jsx("a", { href: "/#roles", className: "hover:text-surface-foreground", children: "Roles" }),
      /* @__PURE__ */ jsx("a", { href: "/#faq", className: "hover:text-surface-foreground", children: "FAQ" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-8 text-xs text-surface-foreground/40", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " MEDIKIOSK. All rights reserved."
    ] })
  ] }) }) });
}
const heroBg = "/assets/hero-bg-C9tjcmH7.jpg";
const fan1 = "/assets/step1-B-yjRayu.png";
const fan2 = "/assets/step2-DqYXPhki.png";
const fan3 = "/assets/step3-BTX2oANJ.png";
const fan4 = "/assets/step4-CPchHt4S.png";
const fan5 = "/assets/step5-y4UOWmE8.png";
const fan6 = "/assets/step6-BntV158d.png";
const CountUp = CountUpImport.default || CountUpImport;
const stats = [{
  value: 98.7,
  suffix: "%",
  label: "AI Accuracy"
}, {
  value: 30,
  prefix: "< ",
  suffix: " sec",
  label: "Dispense Time"
}, {
  value: 24,
  suffix: " / 7",
  label: "Available"
}];
const features = [{
  icon: Search,
  title: "Prescription Verification",
  desc: "AI detects real vs fake prescriptions automatically — 24/7, zero human needed"
}, {
  icon: Mic,
  title: "Voice Health Assistant",
  desc: "Ask about your medicines by voice. Get instant personalized answers from your own health records."
}, {
  icon: Stethoscope,
  title: "Smart Doctor Routing",
  desc: "On-call doctor system ensures someone always reviews urgent cases. AI handles the safe ones instantly."
}, {
  icon: RefreshCw,
  title: "Live Inventory Sync",
  desc: "Never dispensed an out-of-stock medicine. Real-time kiosk slot tracking."
}];
const testimonials = [{
  text: "MEDIKIOSK reduced our pharmacy queue time by 80% in the first week. The AI prescription reading is incredibly accurate.",
  author: "Dr. Priya Kumar",
  role: "Head Pharmacist, City Hospital Salem",
  accent: true
}, {
  text: "I uploaded my prescription at 2 AM and had my medicines in 3 minutes. I didn't know this was even possible.",
  author: "Ravi K.",
  role: "Patient, Salem"
}, {
  text: "Managing inventory used to take hours every day. Now the system alerts us automatically. Game changer.",
  author: "Admin Team",
  role: "Government Hospital, Tamil Nadu"
}];
const steps = [{
  icon: Upload,
  title: "Upload",
  desc: "Snap or upload your prescription in seconds."
}, {
  icon: Brain,
  title: "AI Scan",
  desc: "Our model reads, extracts and validates every line."
}, {
  icon: Stethoscope,
  title: "Doctor Approval",
  desc: "A licensed doctor reviews and approves remotely."
}, {
  icon: PackageCheck,
  title: "Dispense",
  desc: "The kiosk releases your medicine. Done."
}];
const roles = [{
  icon: User,
  title: "Patient",
  desc: "Upload, get verified, walk away with your meds — all in under a minute.",
  accent: "bg-amber/15 text-amber"
}, {
  icon: Stethoscope,
  title: "Doctor",
  desc: "Review extracted prescriptions remotely. Approve or reject with one tap.",
  accent: "bg-success/15 text-success"
}, {
  icon: ShieldCheck,
  title: "Admin",
  desc: "Manage inventory, monitor machines, and audit every dispense.",
  accent: "bg-mint text-surface"
}];
const faqs = [{
  q: "How accurate is the AI prescription scan?",
  a: "Our model is trained on millions of prescriptions and achieves over 99% accuracy on medicine name and dosage extraction. Every result is also reviewed by a licensed doctor before dispense."
}, {
  q: "Is my prescription data secure?",
  a: "Yes. All uploads are encrypted end-to-end and stored in HIPAA-compliant infrastructure. Only authorized doctors can view your data."
}, {
  q: "What if a medicine isn't in stock?",
  a: "The kiosk will instantly notify you and route you to the nearest stocked location, or place a same-day delivery order."
}, {
  q: "Can I use MEDIKIOSK without an internet connection?",
  a: "An internet connection is required for AI scanning and doctor approval. The kiosk caches your verified prescription so dispense works even on intermittent connectivity."
}];
const fanSteps = [{
  img: fan1,
  label: "Upload Prescription",
  num: "#01"
}, {
  img: fan2,
  label: "AI Scanning",
  num: "#02"
}, {
  img: fan3,
  label: "Medicine Extraction",
  num: "#03"
}, {
  img: fan4,
  label: "Doctor Approval",
  num: "#04"
}, {
  img: fan5,
  label: "Payment",
  num: "#05"
}, {
  img: fan6,
  label: "Medicine Dispensed",
  num: "#06"
}];
const SectionHeading = ({
  amber,
  main,
  light
}) => /* @__PURE__ */ jsxs(motion.div, { initial: {
  opacity: 0,
  y: 20
}, whileInView: {
  opacity: 1,
  y: 0
}, viewport: {
  once: true
}, className: "mb-16", children: [
  amber && /* @__PURE__ */ jsx("p", { className: "mb-3 text-xs font-black uppercase tracking-[0.3em] text-amber", children: amber }),
  /* @__PURE__ */ jsx("h2", { className: cn("text-balance text-4xl font-semibold md:text-5xl lg:text-6xl", light ? "text-white" : "text-surface"), children: main })
] });
const DemoVideoSection = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "bg-[#f5f0e8] px-6 py-24 md:py-40 flex flex-col items-center", children: [
    /* @__PURE__ */ jsx(SectionHeading, { amber: "LIVE DEMO", main: "See it in action" }),
    /* @__PURE__ */ jsxs(motion.div, { initial: {
      opacity: 0,
      scale: 0.95
    }, whileInView: {
      opacity: 1,
      scale: 1
    }, viewport: {
      once: true
    }, className: "relative w-full max-w-5xl aspect-video rounded-[2rem] bg-surface shadow-[0_50px_100px_rgba(0,0,0,0.2)] overflow-hidden border-[12px] border-surface cursor-pointer group", onClick: togglePlay, children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute top-0 left-0 right-0 h-8 bg-surface/50 backdrop-blur-md flex items-center px-4 gap-1.5 z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-red-500/50" }),
        /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-amber/50" }),
        /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-success/50" })
      ] }),
      /* @__PURE__ */ jsx("video", { ref: videoRef, loop: true, playsInline: true, className: "w-full h-full object-cover", onPlay: () => setIsPlaying(true), onPause: () => setIsPlaying(false), children: /* @__PURE__ */ jsx("source", { src: "/demo.mp4", type: "video/mp4" }) }),
      /* @__PURE__ */ jsx(AnimatePresence, { children: !isPlaying && /* @__PURE__ */ jsx(motion.div, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, exit: {
        opacity: 0
      }, className: "absolute inset-0 flex items-center justify-center bg-surface/20 backdrop-blur-[2px]", children: /* @__PURE__ */ jsx("div", { className: "h-24 w-24 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110", children: /* @__PURE__ */ jsx(Play, { className: "h-10 w-10 text-surface fill-surface ml-1" }) }) }) })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-12 text-lg md:text-xl font-medium text-surface opacity-60", children: "From prescription to medicine in under 2 minutes." }),
    /* @__PURE__ */ jsxs("button", { onClick: togglePlay, className: "mt-8 flex items-center gap-3 text-sm font-black uppercase tracking-widest text-surface hover:text-amber transition-colors group", children: [
      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full border border-surface/20 flex items-center justify-center group-hover:border-amber group-hover:bg-amber group-hover:text-surface transition-all", children: isPlaying ? /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 animate-spin-slow" }) : /* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }) }),
      isPlaying ? "Restart Demo" : "Watch Full Demo"
    ] })
  ] });
};
function Landing() {
  const {
    scrollYProgress
  } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  return /* @__PURE__ */ jsxs("div", { className: "relative bg-background selection:bg-amber selection:text-surface overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 pointer-events-none z-0", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-[0.03] grayscale bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,58,42,0.05)_0%,transparent_100%)]" })
    ] }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("section", { className: "relative isolate min-h-screen overflow-hidden flex flex-col items-center", children: [
      /* @__PURE__ */ jsxs(motion.div, { style: {
        y: backgroundY
      }, className: "absolute inset-0 -z-10", children: [
        /* @__PURE__ */ jsx("img", { src: heroBg, alt: "", className: "h-full w-full object-cover" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-surface/40 via-surface/80 to-surface" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-40 pb-20 text-center", children: [
        /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          ease: "easeOut"
        }, className: "mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/90", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 text-amber animate-pulse" }),
          "The Future of Pharmacy is here"
        ] }),
        /* @__PURE__ */ jsxs(motion.h1, { initial: {
          opacity: 0,
          y: 30
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          delay: 0.1
        }, className: "text-balance text-5xl font-semibold leading-[1.05] text-white md:text-7xl lg:text-8xl", children: [
          "Your Prescription. ",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "italic text-amber", children: "Verified." }),
          " Dispensed."
        ] }),
        /* @__PURE__ */ jsx(motion.p, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          delay: 0.2
        }, className: "mt-8 max-w-2xl text-balance text-lg text-white/70 md:text-xl lg:text-2xl", children: "AI-powered medicine dispensing — no queues, no errors, just care." }),
        /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.8,
          delay: 0.3
        }, className: "mt-12 flex flex-col gap-4 sm:flex-row", children: [
          /* @__PURE__ */ jsxs(Link, { to: "/auth", className: "group relative flex items-center justify-center gap-2 rounded-full bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-surface shadow-2xl transition hover:scale-[1.02] active:scale-95 overflow-hidden", children: [
            /* @__PURE__ */ jsx("span", { className: "relative z-10", children: "Get Started" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "relative z-10 h-4 w-4 transition group-hover:translate-x-1" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-amber opacity-0 group-hover:opacity-10 transition-opacity" })
          ] }),
          /* @__PURE__ */ jsx("a", { href: "#how", className: "flex items-center justify-center rounded-full border border-white/20 glass px-10 py-5 text-sm font-bold text-white transition hover:bg-white/10 active:scale-95", children: "See how it works" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-24 w-full max-w-4xl", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-1 bg-surface/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 shadow-2xl", children: stats.map((stat, i) => /* @__PURE__ */ jsxs("div", { className: "bg-surface/30 p-10 flex flex-col items-center justify-center relative group", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-4xl md:text-5xl font-black text-white mb-2 flex items-baseline", children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl opacity-50 mr-1", children: stat.prefix }),
            /* @__PURE__ */ jsx(CountUp, { end: stat.value, duration: 2.5, decimals: stat.value % 1 !== 0 ? 1 : 0, enableScrollSpy: true, scrollSpyOnce: true }),
            /* @__PURE__ */ jsx("span", { className: "text-2xl opacity-50 ml-1", children: stat.suffix })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-amber uppercase tracking-[0.3em]", children: stat.label }),
          i < stats.length - 1 && /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-white/10" })
        ] }, i)) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative mt-20 w-full overflow-hidden py-10", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 bottom-0 left-0 w-40 bg-gradient-to-r from-surface to-transparent z-10" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 bottom-0 right-0 w-40 bg-gradient-to-l from-surface to-transparent z-10" }),
        /* @__PURE__ */ jsx(motion.div, { className: "flex gap-8 items-start w-max px-4", animate: {
          x: [0, -1728]
          // Width of one set of cards (260px + 32px gap) * 6
        }, transition: {
          duration: 40,
          repeat: Infinity,
          ease: "linear"
        }, children: [...fanSteps, ...fanSteps, ...fanSteps].map((step, idx) => /* @__PURE__ */ jsxs("div", { className: "w-[280px] shrink-0 group flex flex-col items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-amber/50 transition-all duration-500", children: [
            /* @__PURE__ */ jsx("img", { src: step.img, alt: step.label, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" }),
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-40 group-hover:opacity-20" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col items-center text-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-amber tracking-[0.2em] mb-1", children: step.num }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-white uppercase tracking-widest whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity", children: step.label })
          ] })
        ] }, idx)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(DemoVideoSection, {}),
    /* @__PURE__ */ jsx("section", { id: "how", className: "bg-background px-6 py-24 md:py-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsx(SectionHeading, { amber: "PROCESS", main: /* @__PURE__ */ jsxs(Fragment, { children: [
        "From paper to pill, ",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "italic text-muted-foreground", children: "in four quiet steps." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4", children: steps.map((step, i) => {
        const Icon = step.icon;
        return /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, whileInView: {
          opacity: 1,
          y: 0
        }, viewport: {
          once: true
        }, transition: {
          delay: i * 0.1
        }, className: "group relative flex flex-col rounded-[2.5rem] bg-card p-8 shadow-card transition-all hover:-translate-y-2 hover:shadow-soft border border-border/50", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-12 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-amber tracking-widest opacity-40 group-hover:opacity-100 transition-opacity", children: [
              "0",
              i + 1
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-surface transition group-hover:bg-amber group-hover:text-surface group-hover:rotate-12", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }) })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-surface", children: step.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted-foreground", children: step.desc })
        ] }, step.title);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-[#f5f0e8] px-6 py-24 md:py-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl text-center", children: [
      /* @__PURE__ */ jsx(SectionHeading, { amber: "WHY MEDIKIOSK", main: /* @__PURE__ */ jsxs(Fragment, { children: [
        "Built different. ",
        /* @__PURE__ */ jsx("br", {}),
        " For a reason."
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-20 grid gap-8 md:grid-cols-2", children: features.map((f, i) => {
        const Icon = f.icon;
        return /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          scale: 0.95
        }, whileInView: {
          opacity: 1,
          scale: 1
        }, viewport: {
          once: true
        }, transition: {
          delay: i * 0.1
        }, className: "flex flex-col items-start text-left p-10 bg-white rounded-[3rem] shadow-card hover:-translate-y-2 hover:border-amber/30 border border-transparent transition-all group", children: [
          /* @__PURE__ */ jsx("div", { className: "h-14 w-14 rounded-full bg-mint flex items-center justify-center mb-8 shadow-soft group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Icon, { className: "h-7 w-7 text-surface" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-surface mb-4", children: f.title }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed", children: f.desc })
        ] }, i);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-background px-6 py-24 md:py-40 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl text-center", children: [
      /* @__PURE__ */ jsx(SectionHeading, { main: "The old way. The new way." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-20 relative flex flex-col md:flex-row gap-8 items-stretch", children: [
        /* @__PURE__ */ jsxs(motion.div, { initial: {
          x: -100,
          opacity: 0
        }, whileInView: {
          x: 0,
          opacity: 1
        }, viewport: {
          once: true
        }, className: "flex-1 p-10 bg-card/50 rounded-[3rem] border border-border/40 grayscale opacity-60", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xl font-black text-surface/40 uppercase tracking-widest mb-10 flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5" }),
            " The Old Way"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-6 text-left", children: ["30-45 minute queue", "Manual prescription reading", "Human errors in dispensing", "Limited pharmacy hours", "Paper records lost easily", "No medicine interaction check"].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-4 text-sm font-medium text-surface/60", children: [
            /* @__PURE__ */ jsx("span", { className: "text-red-500/50", children: "❌" }),
            " ",
            item
          ] }, item)) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-16 w-16 items-center justify-center rounded-full bg-amber text-surface font-black shadow-glow", children: "VS" }),
        /* @__PURE__ */ jsxs(motion.div, { initial: {
          x: 100,
          opacity: 0
        }, whileInView: {
          x: 0,
          opacity: 1
        }, viewport: {
          once: true
        }, className: "flex-1 p-10 bg-surface rounded-[3rem] shadow-glow border border-amber/20", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-xl font-black text-amber uppercase tracking-widest mb-10 flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "h-5 w-5" }),
            " MEDIKIOSK"
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-6 text-left", children: ["Under 2 minutes", "AI reads any handwriting", "Zero dispensing errors", "24/7 availability", "Permanent digital records", "Automatic safety validation"].map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-4 text-sm font-bold text-white", children: [
            /* @__PURE__ */ jsx("span", { className: "text-success", children: "✅" }),
            " ",
            item
          ] }, item)) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-[#f5f0e8] px-6 py-24 md:py-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsx(SectionHeading, { amber: "STORIES", main: "Patients. Doctors. All saying the same thing." }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-8 md:grid-cols-3", children: testimonials.map((t, i) => /* @__PURE__ */ jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.9
      }, whileInView: {
        opacity: 1,
        scale: 1
      }, viewport: {
        once: true
      }, transition: {
        delay: i * 0.1
      }, className: cn("relative p-10 bg-white rounded-[3rem] shadow-card flex flex-col", t.accent && "border-l-8 border-amber"), children: [
        /* @__PURE__ */ jsx(Quote, { className: "h-10 w-10 text-amber opacity-20 mb-6" }),
        /* @__PURE__ */ jsxs("p", { className: "text-lg font-medium text-surface leading-relaxed mb-10 flex-1 italic", children: [
          '"',
          t.text,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold text-surface", children: t.author }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1", children: t.role })
        ] })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "roles", className: "bg-background px-6 py-24 md:py-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsx(SectionHeading, { amber: "ROLES", main: /* @__PURE__ */ jsxs(Fragment, { children: [
        "One kiosk. ",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "italic", children: "Three experiences." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-8 md:grid-cols-3", children: roles.map((role, i) => {
        const Icon = role.icon;
        return /* @__PURE__ */ jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, whileInView: {
          opacity: 1,
          y: 0
        }, viewport: {
          once: true
        }, transition: {
          delay: i * 0.1
        }, className: "flex flex-col rounded-[3rem] bg-card p-10 shadow-card transition-all hover:-translate-y-2 border border-border/40 group", children: [
          /* @__PURE__ */ jsx("div", { className: cn("mb-8 flex h-14 w-14 items-center justify-center rounded-[1.25rem] transition-all group-hover:rotate-6", role.accent), children: /* @__PURE__ */ jsx(Icon, { className: "h-7 w-7" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-surface", children: role.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-4 text-base leading-relaxed text-muted-foreground", children: role.desc }),
          /* @__PURE__ */ jsxs("button", { className: "mt-10 flex items-center gap-2 text-sm font-black text-surface uppercase tracking-widest hover:text-amber transition-colors", children: [
            "Explore Role ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] }, role.title);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "faq", className: "bg-[#f5f0e8] px-6 py-24 md:py-40", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-6xl gap-20 md:grid-cols-[1fr,1.5fr]", children: [
      /* @__PURE__ */ jsx(SectionHeading, { amber: "FAQ", main: /* @__PURE__ */ jsxs(Fragment, { children: [
        "Questions, ",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "italic", children: "answered." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4", children: faqs.map((faq, i) => /* @__PURE__ */ jsxs(motion.details, { initial: {
        opacity: 0,
        x: 20
      }, whileInView: {
        opacity: 1,
        x: 0
      }, viewport: {
        once: true
      }, transition: {
        delay: i * 0.1
      }, className: "group rounded-3xl bg-white p-8 shadow-card open:ring-2 open:ring-amber/30 transition-all", children: [
        /* @__PURE__ */ jsxs("summary", { className: "flex cursor-pointer items-center justify-between text-lg font-bold text-surface marker:hidden [&::-webkit-details-marker]:hidden", children: [
          faq.q,
          /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-mint text-surface transition group-open:rotate-45 group-open:bg-amber group-open:text-surface", children: /* @__PURE__ */ jsx("span", { className: "text-xl", children: "+" }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-base leading-relaxed text-muted-foreground", children: faq.a })
      ] }, faq.q)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "bg-surface px-6 py-32 md:py-48 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber/10 blur-[150px] pointer-events-none" }),
      /* @__PURE__ */ jsxs(motion.div, { initial: {
        opacity: 0,
        y: 40
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, className: "relative z-10 max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsx("p", { className: "mb-6 text-xs font-black uppercase tracking-[0.4em] text-amber", children: "READY TO START?" }),
        /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-7xl font-bold text-white mb-8 leading-tight", children: "Your health journey starts with a single upload." }),
        /* @__PURE__ */ jsx("p", { className: "text-lg md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto", children: "No appointments. No queues. Just medicines you can trust." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center", children: [
          /* @__PURE__ */ jsx(Link, { to: "/auth", className: "rounded-full bg-amber px-12 py-5 text-sm font-black uppercase tracking-widest text-surface shadow-glow transition hover:scale-105 active:scale-95", children: "Get Started →" }),
          /* @__PURE__ */ jsx("button", { className: "rounded-full border border-white/20 glass px-12 py-5 text-sm font-bold text-white transition hover:bg-white/10 active:scale-95", children: "Watch Demo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }),
            " Secure"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4" }),
            " Instant"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Brain, { className: "h-4 w-4" }),
            " AI-Powered"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Landing as component
};
