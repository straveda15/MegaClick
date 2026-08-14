import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Browser smooth scrolling ko temporarily disable karo
    document.documentElement.style.scrollBehavior = "auto";

    // Immediately top par le jao
    window.scrollTo(0, 0);

    // Agar document scroll ho raha ho
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Existing CSS behavior restore
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;