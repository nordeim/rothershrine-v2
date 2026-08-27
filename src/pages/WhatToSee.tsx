import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { whatToSee } from "@/data/content";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

export function WhatToSee() {
  return (
    <div>
      <PageHero
        eyebrow="What to See"
        title="Grounds, Art & Architecture"
        description="Three destinations, one story — walk from the Pilgrim Center to the Shrine Church and out onto Tepeyac Hill."
        image="https://images.pexels.com/photos/28892492/pexels-photo-28892492.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800"
        compact
      />

      <nav aria-label="Jump to section" className="sticky top-20 z-30 border-b border-shrine-stone bg-shrine-cream/95 backdrop-blur">
        <Container className="flex gap-6 overflow-x-auto py-4 text-sm font-semibold uppercase tracking-wide text-shrine-maroon-600">
          {whatToSee.map((section) => (
            <Link
              key={section.id}
              to={`/what-to-see#${section.id}`}
              className="whitespace-nowrap transition-colors hover:text-shrine-gold-600"
            >
              {section.title}
            </Link>
          ))}
        </Container>
      </nav>

      {whatToSee.map((section, index) => {
        const isEven = index % 2 === 0;
        return (
          <section
            key={section.id}
            id={section.id}
            className={cn("scroll-mt-36 py-24 sm:py-28", index % 2 === 1 && "bg-shrine-parchment")}
          >
            <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <Reveal className={cn(!isEven && "lg:order-2")}>
                <div className="overflow-hidden rounded-sm shadow-shrine">
                  <img
                    src={section.image}
                    alt={section.imageAlt}
                    className="h-72 w-full object-cover sm:h-96"
                    loading="lazy"
                    onError={(event) => {
                      const target = event.currentTarget as HTMLImageElement;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = "1";
                        target.src = "/images/hero-shrine.jpg";
                      }
                    }}
                  />
                </div>
              </Reveal>
              <Reveal delay={100} className={cn(!isEven && "lg:order-1")}>
                <span className="font-display text-sm font-semibold text-shrine-gold-600">0{index + 1}</span>
                <h2 className="mt-2 text-balance font-display text-3xl font-semibold text-shrine-maroon-700 sm:text-4xl">
                  {section.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-shrine-charcoal/85 sm:text-lg">{section.summary}</p>
                <ul className="mt-6 space-y-3">
                  {section.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-sm leading-relaxed text-shrine-charcoal/85 sm:text-base">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-shrine-pine-600" aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Container>
          </section>
        );
      })}
    </div>
  );
}
