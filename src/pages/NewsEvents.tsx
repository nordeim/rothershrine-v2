import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images, upcomingEvents } from "@/data/content";

export function NewsEvents() {
  return (
    <div>
      <PageHero
        eyebrow="The Calendar"
        title="News & Events"
        description="Feast days, rosary walks, formation, and evenings of music at the shrine."
        image={images.hillChapel}
        compact
      />

      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Upcoming"
              title="Gatherings on the grounds"
              description="Times can shift around major feasts — confirm with the pilgrimage office before you travel."
            />
          </Reveal>
          <div className="mt-12 divide-y divide-shrine-stone border-y border-shrine-stone">
            {upcomingEvents.map((event, index) => (
              <Reveal key={event.title} delay={index * 60}>
                <article className="grid gap-6 py-10 lg:grid-cols-[12rem_1fr]">
                  <div>
                    <p className="font-display text-xl text-shrine-maroon-600">{event.date}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-shrine-terracotta-500">
                      {event.category}
                    </p>
                  </div>
                  <div>
                    <h2 className="font-display text-3xl text-shrine-maroon-700">{event.title}</h2>
                    <p className="mt-2 text-sm text-shrine-charcoal/70">{event.location}</p>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-shrine-charcoal/85">
                      {event.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
