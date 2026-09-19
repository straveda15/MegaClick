import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Show the button once the visitor has scrolled a little.
const SHOW_AFTER_PX = 400;

/* ─────────────────────────────────────────────────────────────
   FLOATING BACK-TO-TOP
   Sits directly above the floating WhatsApp button, using the same
   right offset and the same size at every breakpoint.

   WhatsApp:  bottom 1rem / 1.25rem / 1.5rem   size 2.5rem / 3rem
   This:      WhatsApp bottom + WhatsApp size + 0.75rem gap
──────────────────────────────────────────────────────────── */
const BackToTop = () => {
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && window.scrollY > SHOW_AFTER_PX
  );

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`
        fixed
        right-4
        bottom-[4.25rem]
        sm:right-5
        sm:bottom-20
        lg:right-8
        lg:bottom-[5.25rem]
        z-50
        flex
        h-10
        w-10
        sm:h-12
        sm:w-12
        items-center
        justify-center
        rounded-full
        bg-[#0B4EA2]
        text-white
        shadow-xl
        hover:bg-[#083A7A]
        hover:scale-110
        active:scale-95
        cursor-pointer
        transition-all
        duration-300
        ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none"
        }
      `}
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
    </button>
  );
};

export default BackToTop;
