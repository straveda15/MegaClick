import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "../lib/api";

const VisitorCountContext = createContext(null);

export function VisitorCountProvider({ children }) {
  const [visitorCount, setVisitorCount] = useState(1000);

  useEffect(() => {
    let mounted = true;
    const loadVisitorCount = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/marketing/visitor-count`);
        if (!response.ok) return;
        const data = await response.json();
        if (mounted && Number.isFinite(data.visitors)) setVisitorCount(1000 + data.visitors);
      } catch {
        // Keep the site usable when the visitor counter API is unavailable.
      }
    };

    loadVisitorCount();
    const interval = window.setInterval(loadVisitorCount, 10000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <VisitorCountContext.Provider value={visitorCount}>
      {children}
    </VisitorCountContext.Provider>
  );
}

export function useVisitorCount() {
  return useContext(VisitorCountContext);
}
