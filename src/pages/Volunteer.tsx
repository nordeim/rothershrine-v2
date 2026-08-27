import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";
import { BookOpen, HandHeart, Sprout } from "lucide-react";

const roles = [
  {
    icon: BookOpen,
    title: "Docents & Guides",
    description:
      "Lead pilgrims and school groups through the Pilgrim Center exhibits and share Blessed Stanley's story. Training and scripts provided — no experience necessary.",
    commitment: "3-hour shifts, weekly or monthly",
  },
  {
    icon: HandHeart,
    title: "Hospitality",
    description:
      "Greet pilgrims at the welcome desk, staff the gift shop and café, and help group leaders check in smoothly on busy feast days.",
    commitment: "Flexible shifts, weekday or weekend",
  },
  {
    icon: Sprout,
    title: "Grounds & Gardens",
    description:
      "Tend the native plantings along the Tepeyac Hill rosary walk and help set up the amphitheater for outdoor Masses and events.",
    commitment: "Seasonal Saturday mornings",
  },
];

export function Volunteer() {
  return (
    <div>
      <PageHero
        eyebrow="Serve"
        title="Volunteer at the Shrine"
        description="Docents, hospitality teams, and grounds stewards make every pilgrim's visit possible. There's a place for your gifts here."
        image="https://images.pexels.com/photos/6647026/pexels-photo-6647026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800"
        compact
      />

      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Where We Need You" title="Three ways to serve" align="center" />
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-3">
            {roles.map((role, index) => (
              <Reveal key={role.title} delay={index * 120}>
                <div className="flex h-full flex-col rounded-sm border border-shrine-stone bg-shrine-cream p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-shrine-maroon-600 text-shrine-gold-300">
                    <role.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-shrine-maroon-700">{role.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-shrine-charcoal/85">{role.description}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-shrine-maroon-500">
                    {role.commitment}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-shrine-parchment py-24 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <img
              src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
              alt="Volunteers distributing supplies and assisting visitors outdoors"
              className="h-80 w-full rounded-sm object-cover shadow-shrine sm:h-96"
              loading="lazy"
                  onError={(event) => {
                    const target = event.currentTarget as HTMLImageElement;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = "1";
                      target.src = "/images/hero-shrine.jpg";
                    }
                  }}
            />
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading
              eyebrow="Getting Started"
              title="Every volunteer begins with a short orientation"
              description="New volunteers attend a one-hour orientation covering the Shrine's story, safety guidelines, and their specific role. Background checks are required for roles working with minors."
            />
            <div className="mt-8">
              <Button href={`mailto:${site.contact.volunteerEmail}`} variant="primary">
                Email the Volunteer Office
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
