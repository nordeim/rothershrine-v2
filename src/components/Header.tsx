import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Emblem } from "@/components/Emblem";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { primaryNav } from "@/data/nav";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/utils/cn";

function pathMatches(pathname: string, to: string) {
  const route = to.split("#")[0] ?? to;
  if (route === "/") return pathname === "/";
  return pathname === route || pathname.startsWith(`${route}/`);
}

export function Header() {
  const { pathname } = useLocation();
  const scrolled = useScrolled(16);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const menuId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";
  const inverted = isHome && !scrolled;

  useEffect(() => {
    setMobileOpen(false);
    setOpenDesktopMenu(null);
    setOpenMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // B1 — mobile drawer focus trap + Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const selector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => el.offsetParent !== null || el.getAttribute("aria-hidden") !== "true",
      );
    // focus first element on open
    window.setTimeout(() => getFocusable()[0]?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    drawer.addEventListener("keydown", onKeyDown);
    return () => drawer.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // B2 — close desktop dropdown on Escape
  useEffect(() => {
    if (!openDesktopMenu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenDesktopMenu(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openDesktopMenu]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-shrine-maroon-950/92 shadow-shrine backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="hidden border-b border-shrine-gold-500/20 bg-shrine-maroon-950/80 lg:block">
        <Container className="flex items-center justify-between py-1.5 text-[11px] uppercase tracking-[0.22em] text-shrine-cream/70">
          <p>National Shrine · Oklahoma City · Feast Day July 28</p>
          <Link to="/give" className="text-shrine-gold-300 transition-colors hover:text-shrine-gold-300/80">
            Support the Shrine
          </Link>
        </Container>
      </div>

      <Container className="flex h-[4.25rem] items-center justify-between gap-4 sm:h-[4.75rem]">
        <Link to="/" className="flex items-center gap-3 text-shrine-cream">
          <Emblem className="text-shrine-gold-300" />
          <span className="leading-tight">
            <span className="block font-display text-base font-semibold sm:text-lg">
              Blessed Stanley Rother
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-shrine-gold-300">
              National Shrine
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => {
            const isActive = pathMatches(pathname, item.to);
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDesktopMenu(item.label)}
                onMouseLeave={() => item.children && setOpenDesktopMenu(null)}
                onFocusCapture={() => item.children && setOpenDesktopMenu(item.label)}
                onBlurCapture={(event) => {
                  if (!item.children) return;
                  const next = event.relatedTarget as HTMLElement | null;
                  if (next && event.currentTarget.contains(next)) return;
                  setOpenDesktopMenu(null);
                }}
              >
                {item.children ? (
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openDesktopMenu === item.label}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-shrine-cream/85 transition-colors hover:text-shrine-gold-300",
                      isActive && "text-shrine-gold-300",
                    )}
                    onClick={() =>
                      setOpenDesktopMenu((current) => (current === item.label ? null : item.label))
                    }
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    className={cn(
                      "block rounded-sm px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-shrine-cream/85 transition-colors hover:text-shrine-gold-300",
                      isActive && "text-shrine-gold-300",
                    )}
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && openDesktopMenu === item.label ? (
                  <div className="absolute left-0 top-full z-50 min-w-[18rem] pt-2">
                    <ul className="rounded-sm border border-shrine-gold-500/20 bg-shrine-maroon-950 py-2 shadow-shrine-lg">
                      {item.children.map((child) => (
                        <li key={child.to}>
                          <Link
                            to={child.to}
                            className="block px-4 py-2.5 transition-colors hover:bg-shrine-cream/5"
                          >
                            <span className="block text-sm font-semibold text-shrine-cream">
                              {child.label}
                            </span>
                            {child.description ? (
                              <span className="mt-0.5 block text-xs text-shrine-cream/60">
                                {child.description}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button to="/give" variant="primary" className="hidden px-5 py-2.5 text-xs sm:inline-flex">
            Give
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-shrine-cream lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div
          ref={drawerRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-x-0 top-[4.25rem] bottom-0 overflow-y-auto bg-shrine-maroon-950 px-5 pb-10 sm:top-[4.75rem] lg:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-lg pt-6">
            <ul className="space-y-1">
              {primaryNav.map((item) => (
                <li key={item.label} className="border-b border-shrine-cream/10">
                  {item.children ? (
                    <div>
                      <button
                        type="button"
                        aria-expanded={openMobileSection === item.label}
                        className="flex w-full items-center justify-between py-4 text-left font-display text-2xl text-shrine-cream"
                        onClick={() =>
                          setOpenMobileSection((current) =>
                            current === item.label ? null : item.label,
                          )
                        }
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-shrine-gold-300 transition-transform",
                            openMobileSection === item.label && "rotate-180",
                          )}
                        />
                      </button>
                      {openMobileSection === item.label ? (
                        <ul className="space-y-1 pb-4">
                          {item.children.map((child) => (
                            <li key={child.to}>
                              <Link
                                to={child.to}
                                className="block py-2 text-shrine-cream/80"
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      to={item.to}
                      className="block py-4 font-display text-2xl text-shrine-cream"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="pt-6">
                <Button to="/give" variant="primary" className="w-full">
                  Give
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}

      <span className="sr-only">{inverted ? "Transparent header" : "Solid header"}</span>
    </header>
  );
}
