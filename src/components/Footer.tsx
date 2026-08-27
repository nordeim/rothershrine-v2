import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Emblem } from "@/components/Emblem";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/SocialIcons";
import { footerNav } from "@/data/nav";
import { site } from "@/data/site";

const exploreLinks = footerNav.slice(0, 4);
const involvedLinks = footerNav.slice(4, 7);
const visitLinks = footerNav.slice(7);

export function Footer() {
  return (
    <footer className="bg-shrine-maroon-900 text-shrine-cream">
      <div className="divider-weave-thin" />
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <Emblem className="text-shrine-gold-300" />
            <span className="font-display text-xl font-semibold">Blessed Stanley Rother Shrine</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-shrine-cream/70">
            The National Shrine of Blessed Stanley Rother welcomes pilgrims of every background to walk the story of
            the shepherd who stayed — from an Oklahoma wheat farm to a martyr's grave in Guatemala.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.facebook.com/"
              aria-label="Rother Shrine on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-shrine-cream/25 transition-colors hover:border-shrine-gold-300 hover:text-shrine-gold-300"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/"
              aria-label="Rother Shrine on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-shrine-cream/25 transition-colors hover:border-shrine-gold-300 hover:text-shrine-gold-300"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.youtube.com/"
              aria-label="Rother Shrine on YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-shrine-cream/25 transition-colors hover:border-shrine-gold-300 hover:text-shrine-gold-300"
            >
              <YoutubeIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <nav aria-label="Explore">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-shrine-gold-300">Explore</h3>
          <ul className="mt-4 space-y-2.5">
            {exploreLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-shrine-cream/75 transition-colors hover:text-shrine-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Get involved">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-shrine-gold-300">Get Involved</h3>
          <ul className="mt-4 space-y-2.5">
            {involvedLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-shrine-cream/75 transition-colors hover:text-shrine-cream">
                  {link.label}
                </Link>
              </li>
            ))}
            {visitLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-shrine-cream/75 transition-colors hover:text-shrine-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-shrine-gold-300">Visit Us</h3>
          <address className="mt-4 space-y-3 text-sm not-italic text-shrine-cream/75">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-shrine-gold-300" aria-hidden="true" />
              {site.address.full}
            </p>
            <p className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-shrine-gold-300" aria-hidden="true" />
              Grounds open daily, 9 a.m.–5 p.m. Mass schedule varies — see Pilgrimage.
            </p>
          </address>
        </div>
      </Container>

      <div className="border-t border-shrine-cream/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-shrine-cream/55 sm:flex-row">
          <p>© {new Date().getFullYear()} National Shrine of Blessed Stanley Rother, Archdiocese of Oklahoma City.</p>
          <p>Feast Day — July 28</p>
        </Container>
      </div>
    </footer>
  );
}
