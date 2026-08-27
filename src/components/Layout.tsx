import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // HashRouter double-hash: #/what-to-see#pilgrim-center → split on "#" and take last segment
      // Single hash: #visit → visit. Handles both #/route#anchor and #anchor.
      const id = hash.includes("#") ? (hash.split("#").pop() ?? "") : hash.slice(1);
      // strip leading "/" if present (e.g., "/pilgrim-center" → "pilgrim-center")
      const cleanId = id.replace(/^\//, "");
      if (cleanId) {
        const el = document.getElementById(cleanId);
        if (el) {
          const timer = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
          return () => clearTimeout(timer);
        }
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col bg-shrine-cream">
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
