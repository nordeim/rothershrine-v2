import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { upcomingEvents, type EventItem } from "@/data/content";
import { CalendarDays, MapPin } from "lucide-react";
import { cn } from "@/utils/cn";

const categoryStyles: Record<EventItem["category"], string> = {
  Feast: "bg-shrine-gold-500 text-shrine-maroon-900",
  Pilgrimage: "bg-shrine-pine-600 text-shrine-cream",
  Formation: "bg-shrine-maroon-600 text-shrine-cream",
  Community: "bg-shrine-terracotta-500 text-shrine-cream",
};

export function NewsEvents() {
  return (
    <div>
      <PageHero
        eyebrow="Stay Close"
        title="News & Events"
        description="Feast day celebrations, monthly rosary walks, and formation series for pilgrims near and far."
        image="https://images.pexels.com/photos/35687682/pexels-photo-35687682.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800"
        compact
      />

      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Calendar" title="Upcoming at the Shrine" />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {upcomingEvents.map((event, index) => (
              <Reveal key={event.title} delay={index * 100}>
                <article className="flex h-full flex-col overflow-hidden rounded-sm border border-shrine-stone bg-shrine-cream shadow-shrine transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between gap-4 border-b border-shrine-stone bg-shrine-parchment px-6 py-4">
                    <span className="flex items-center gap-2 text-sm font-semibold text-shrine-charcoal">
                      <CalendarDays className="h-4 w-4 text-shrine-maroon-500" aria-hidden="true" />
                      {event.date}
                    </span>
                    <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide", categoryStyles[event.category])}>
                      {event.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-semibold text-shrine-maroon-700">{event.title}</h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-shrine-charcoal/70">
                      <MapPin className="h-3.5 w-3.5 text-shrine-maroon-500" aria-hidden="true" />
                      {event.location}
                    </p>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-shrine-charcoal/85">{event.description}</p>
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
