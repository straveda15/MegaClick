import { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useSocket } from "@/hooks/useSocket";

// Mounts the Socket.IO connection for the lifetime of the authenticated session.
// Query cache invalidation happens inside useSocket — no further wiring needed.
function SocketBridge() {
  useSocket();
  return null;
}

const AppLayout = ({ children }: { children: ReactNode }) => {
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();

  // The <main> scroll container persists across route changes, so navigating
  // (e.g. clicking an analytics card near the bottom of the overview) would
  // otherwise open the next page still scrolled down. Reset to the top on every
  // path change so each page opens from the top.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full">
      <SocketBridge />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main ref={mainRef} className="flex-1 p-6 overflow-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
