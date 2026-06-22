import { jsx, jsxs } from "react/jsx-runtime";
import { createRootRoute, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter, useRouter } from "@tanstack/react-router";
const appCss = "/assets/styles-C9aEYmfN.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$f = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Medikiosk" },
      { name: "description", content: "Medikiosk App" },
      { name: "author", content: "Medikiosk" },
      { property: "og:title", content: "Medikiosk" },
      { property: "og:description", content: "Medikiosk App" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Medikiosk" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400;1,9..40,500&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx("script", { src: "https://checkout.razorpay.com/v1/checkout.js" }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const $$splitComponentImporter$e = () => import("./patient-CLOUS4XA.js");
const Route$e = createFileRoute("/patient")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./doctor-4hFt_Kwp.js");
const Route$d = createFileRoute("/doctor")({
  head: () => ({
    meta: [{
      title: "Doctor Command Center — MEDIKIOSK"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./auth-CLQiokuK.js");
const Route$c = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Sign in — MEDIKIOSK"
    }, {
      name: "description",
      content: "Sign in to MEDIKIOSK with your phone or email."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin-DmLhI2E1.js");
const Route$b = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./index-Bnd4iozq.js");
const Route$a = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "MEDIKIOSK — AI-powered medicine dispensing"
    }, {
      name: "description",
      content: "Your prescription, verified and dispensed by AI. No queues, no errors — just care."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./patient.index-BjEFFmne.js");
const Route$9 = createFileRoute("/patient/")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./patient.upload-DEt7nZ4T.js");
const Route$8 = createFileRoute("/patient/upload")({
  head: () => ({
    meta: [{
      title: "Patient — MEDIKIOSK"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./patient.reports-Y1paBo4R.js");
const Route$7 = createFileRoute("/patient/reports")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./patient.profile-BXmvAvdx.js");
const Route$6 = createFileRoute("/patient/profile")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./patient.prices-BuSG_uZQ.js");
const Route$5 = createFileRoute("/patient/prices")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./patient.payment-DbsYdF9P.js");
const Route$4 = createFileRoute("/patient/payment")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./patient.medicines-Dz9RzICN.js");
const Route$3 = createFileRoute("/patient/medicines")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./patient.history-DXhISCVC.js");
const Route$2 = createFileRoute("/patient/history")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./patient.dispense-D43jQigb.js");
const Route$1 = createFileRoute("/patient/dispense")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./patient.ai-assistant-CPASyu0Y.js");
const Route = createFileRoute("/patient/ai-assistant")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const PatientRoute = Route$e.update({
  id: "/patient",
  path: "/patient",
  getParentRoute: () => Route$f
});
const DoctorRoute = Route$d.update({
  id: "/doctor",
  path: "/doctor",
  getParentRoute: () => Route$f
});
const AuthRoute = Route$c.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$f
});
const AdminRoute = Route$b.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$f
});
const IndexRoute = Route$a.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$f
});
const PatientIndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => PatientRoute
});
const PatientUploadRoute = Route$8.update({
  id: "/upload",
  path: "/upload",
  getParentRoute: () => PatientRoute
});
const PatientReportsRoute = Route$7.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => PatientRoute
});
const PatientProfileRoute = Route$6.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => PatientRoute
});
const PatientPricesRoute = Route$5.update({
  id: "/prices",
  path: "/prices",
  getParentRoute: () => PatientRoute
});
const PatientPaymentRoute = Route$4.update({
  id: "/payment",
  path: "/payment",
  getParentRoute: () => PatientRoute
});
const PatientMedicinesRoute = Route$3.update({
  id: "/medicines",
  path: "/medicines",
  getParentRoute: () => PatientRoute
});
const PatientHistoryRoute = Route$2.update({
  id: "/history",
  path: "/history",
  getParentRoute: () => PatientRoute
});
const PatientDispenseRoute = Route$1.update({
  id: "/dispense",
  path: "/dispense",
  getParentRoute: () => PatientRoute
});
const PatientAiAssistantRoute = Route.update({
  id: "/ai-assistant",
  path: "/ai-assistant",
  getParentRoute: () => PatientRoute
});
const PatientRouteChildren = {
  PatientAiAssistantRoute,
  PatientDispenseRoute,
  PatientHistoryRoute,
  PatientMedicinesRoute,
  PatientPaymentRoute,
  PatientPricesRoute,
  PatientProfileRoute,
  PatientReportsRoute,
  PatientUploadRoute,
  PatientIndexRoute
};
const PatientRouteWithChildren = PatientRoute._addFileChildren(PatientRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  AuthRoute,
  DoctorRoute,
  PatientRoute: PatientRouteWithChildren
};
const routeTree = Route$f._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router;
};
export {
  getRouter
};
