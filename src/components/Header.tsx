import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Emblem } from "@/components/Emblem";
import { primaryNav } from "@/data/nav";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/utils/cn";

export function Header() {
  const scrolled = useScrolled();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDesktopMenu(null);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-shrine-maroon-900/95 shadow-shrine backdrop-blur"
          : "bg-shrine-maroon-900",
      )}
    >
      <div className="hidden border-b border-shrine-cream/10 bg-shrine-maroon-950/60 lg:block">
        <Container className="flex items-center justify-end gap-6 py-1.5 text-xs font-medium uppercase tracking-wide text-shrine-cream/70">
          <Link to="/pilgrimage" className="transition-colors hover:text-shrine-gold-300">
            Hours &amp; Location
          </Link>
          <Link to="/faq" className="transition-colors hover:text-shrine-gold-300">
            FAQ
          </Link>
          <Link to="/give" className="transition-colors hover:text-shrine-gold-300">
            Give
          </Link>
        </Container>
      </div>

      <Container className="flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 text-shrine-cream" aria-label="Blessed Stanley Rother Shrine — home">
          <Emblem className="text-shrine-gold-300" />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold tracking-wide">Rother Shrine</span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-shrine-cream/60">
              Oklahoma City
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenDesktopMenu(item.label)}
              onMouseLeave={() => item.children && setOpenDesktopMenu(null)}
            >
              {item.children ? (
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-sm px-4 py-2 text-sm font-semibold uppercase tracking-wide text-shrine-cream/85 transition-colors hover:text-shrine-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shrine-gold-500"
                  aria-haspopup="true"
                  aria-expanded={openDesktopMenu === item.label}
                  onClick={() => setOpenDesktopMenu((cur) => (cur === item.label ? null : item.label))}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : (
                <RouterNavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-sm px-4 py-2 text-sm font-semibold uppercase tracking-wide text-shrine-cream/85 transition-colors hover:text-shrine-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shrine-gold-500",
                      isActive && "text-shrine-gold-300",
                    )
                  }
                >
                  {item.label}
                </RouterNavLink>
              )}

              {item.children && openDesktopMenu === item.label ? (
                <div className="absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3">
                  <div className="overflow-hidden rounded-sm border border-shrine-gold-300/20 bg-shrine-maroon-950 shadow-shrine-lg">
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.to}>
                          <Link
                            to={child.to}
                            className="block px-5 py-3.5 transition-colors hover:bg-shrine-maroon-800"
                          >
                            <span className="block text-sm font-semibold text-shrine-cream">{child.label}</span>
                            {child.description ? (
                              <span className="mt-0.5 block text-xs text-shrine-cream/60">{child.description}</span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button to="/give" variant="primary">
            Give
          </Button>
        </div>

        <button
          type="button"
          className="rounded-sm p-2 text-shrine-cream lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </Container>

      {mobileOpen ? (
        <div className="border-t border-shrine-cream/10 bg-shrine-maroon-950 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <div key={item.label} className="border-b border-shrine-cream/10 py-2 last:border-none">
                <Link to={item.to} className="block py-2 text-base font-semibold text-shrine-cream">
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="ml-3 flex flex-col gap-1 border-l border-shrine-cream/15 pl-4">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link to={child.to} className="block py-1.5 text-sm text-shrine-cream/75">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            <Button to="/give" variant="primary" className="mt-3 w-full">
              Give
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
