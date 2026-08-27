import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { SafeImage } from "@/components/SafeImage";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { images, whatToSee } from "@/data/content";

export function WhatToSee() {
  return (
    <div>
      <PageHero
        eyebrow="The Campus"
        title="What to See"
        description="Three sites on one pilgrimage: the Pilgrim Center, the Shrine Church & Chapel of the Tomb, and Tepeyac Hill."
        image={images.hero}
      />

      <nav
        aria-label="Jump to a site"
        className="sticky top-[4.25rem] z-40 border-b border-shrine-stone bg-shrine-cream/95 backdrop-blur sm:top-[6.4rem]"
      >
        <Container className="flex flex-wrap gap-2 py-3">
          {whatToSee.map((place) => (
            <Link
              key={place.id}
              to={`/what-to-see#${place.id}`}
              className="rounded-sm border border-shrine-stone px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-shrine-maroon-700 transition-colors hover:border-shrine-gold-500 hover:text-shrine-maroon-500"
            >
              {place.title}
            </Link>
          ))}
        </Container>
      </nav>

      <div className="space-y-0">
        {whatToSee.map((place, index) => (
          <section
            key={place.id}
            id={place.id}
            className={index % 2 === 1 ? "bg-shrine-parchment" : "bg-shrine-cream"}
          >
            <Container className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
              <Reveal className={index % 2 === 1 ? "lg:order-2" : undefined}>
                <SafeImage
                  src={place.image}
                  alt={place.imageAlt}
                  className="h-80 w-full object-cover shadow-shrine sm:h-[28rem]"
                />
              </Reveal>
              <Reveal delay={80} className={index % 2 === 1 ? "lg:order-1" : undefined}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-shrine-maroon-500">
                  0{index + 1} / 03
                </p>
                <h2 className="mt-4 font-display text-4xl font-semibold text-shrine-maroon-700 sm:text-5xl">
                  {place.title}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-shrine-charcoal/85 sm:text-lg">
                  {place.summary}
                </p>
                <ul className="mt-8 space-y-3">
                  {place.details.map((detail) => (
                    <li
                      key={detail}
                      className="border-l-2 border-shrine-gold-500 pl-4 text-sm leading-relaxed text-shrine-charcoal/85"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Container>
          </section>
        ))}
      </div>
    </div>
  );
}
