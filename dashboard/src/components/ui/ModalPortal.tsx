import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renders its children into document.body via a React portal so that
 * fixed-position overlays/modals escape any parent stacking context or
 * overflow clipping.
 */
const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

export default ModalPortal;
