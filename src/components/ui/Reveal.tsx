import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}

/**
 * Fades + slides content into view on scroll via IntersectionObserver.
 * Renders visible immediately if IntersectionObserver is unavailable
 * (older browsers) so content is never permanently hidden.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  // Keep a ref for the callback so React doesn't warn about state during render
  const nodeRef = useRef<HTMLElement | null>(null);
  const assignNode = (el: HTMLElement | null) => {
    nodeRef.current = el;
    setNode(el);
  };

  useEffect(() => {
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  const sharedProps = {
    className: cn("reveal", visible && "reveal-visible", className),
    style: { transitionDelay: visible ? `${delay}ms` : "0ms" },
  };

  if (as === "li") {
    return (
      <li ref={assignNode} {...sharedProps}>
        {children}
      </li>
    );
  }

  return (
    <div ref={assignNode} {...sharedProps}>
      {children}
    </div>
  );
}
