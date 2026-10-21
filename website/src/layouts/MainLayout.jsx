import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { API_BASE } from "../lib/api";
import { VisitorCountProvider } from "../contexts/VisitorCountContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const pendingPageViews = new Set();

const MainLayout = () => {

  const location = useLocation();

  useEffect(() => {
    const makeId = () => window.crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const now = Date.now();
    let visitorId = window.localStorage.getItem("mcsite_visitor_id");
    if (!visitorId) {
      visitorId = `mcsite_visitor_${makeId()}`;
      window.localStorage.setItem("mcsite_visitor_id", visitorId);
    }

    let sessionId = window.sessionStorage.getItem("mcsite_session_id");
    const lastActive = Number(window.sessionStorage.getItem("mcsite_last_active") || 0);
    if (!sessionId || now - lastActive > 30 * 60 * 1000) {
      sessionId = `mcsite_${makeId()}`;
      window.sessionStorage.setItem("mcsite_session_id", sessionId);
    }
    window.sessionStorage.setItem("mcsite_last_active", String(now));

    const pageKey = `${sessionId}:${location.pathname}${location.search}`;
    const successMarker = "mcsite_last_successful_page_view";
    if (window.sessionStorage.getItem(successMarker) === pageKey || pendingPageViews.has(pageKey)) return;
    pendingPageViews.add(pageKey);

    fetch(`${API_BASE}/api/v1/marketing/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        visitorId,
        eventType: "page_view",
        eventData: { path: `${location.pathname}${location.search}`, page: document.title },
        landingPage: location.pathname,
      }),
      keepalive: true,
    })
      .then((response) => {
        pendingPageViews.delete(pageKey);
        if (!response.ok) return;
        window.sessionStorage.setItem(successMarker, pageKey);
        window.dispatchEvent(new Event("mcsite:visitor-tracked"));
      })
      .catch(() => pendingPageViews.delete(pageKey));
  }, [location.pathname, location.search]);

  return (
    <VisitorCountProvider>
      <Navbar showTopBar={true} />
      <Outlet />
      <Footer />
    </VisitorCountProvider>
  );
};

export default MainLayout;
