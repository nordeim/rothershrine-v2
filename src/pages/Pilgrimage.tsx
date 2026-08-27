import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";
import { Clock3, MapPin, Users, Navigation } from "lucide-react";

const hours = [
  { label: "Pilgrim Center & Grounds", value: "Daily, 9 a.m. – 5 p.m." },
  { label: "Shrine Church", value: "Daily, 7 a.m. – 7 p.m." },
  { label: "Chapel of the Tomb", value: "Daily, 8 a.m. – 6 p.m." },
  { label: "Gift Shop & Café", value: "Daily, 9 a.m. – 4:30 p.m." },
];

const massSchedule = [
  { label: "Sunday", value: "8:00 a.m. · 10:30 a.m. · 5:00 p.m. (Spanish)" },
  { label: "Saturday Vigil", value: "5:00 p.m." },
  { label: "Monday – Friday", value: "12:10 p.m." },
  { label: "Holy Days", value: "See parish bulletin — times shift seasonally" },
];

const groupSteps = [
  {
    title: "Reserve a date",
    description: "Contact the pilgrimage office at least three weeks ahead for groups of 15 or more.",
  },
  {
    title: "Choose your experience",
    description: "Add a guided tour, Mass, a Guatemalan cultural presentation, or a boxed lunch in the café.",
  },
  {
    title: "Arrive and check in",
    description: "Group leaders check in at the Pilgrim Center welcome desk for orientation and parking guidance.",
  },
];

export function Pilgrimage() {
  return (
    <div>
      <PageHero
        eyebrow="Plan Your Visit"
        title="Pilgrimage"
        description="Hours, Mass times, and everything a parish group, school tour, or individual pilgrim needs before arriving."
        image="https://images.pexels.com/photos/7621196/pexels-photo-7621196.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800"
        compact
      />

      <section id="visit" className="scroll-mt-28 py-24 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-12">
            <Reveal>
              <SectionHeading eyebrow="Hours & Location" title="When to come, and how to find us" />
              <div className="mt-8 divide-y divide-shrine-stone rounded-sm border border-shrine-stone bg-shrine-cream">
                {hours.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 px-6 py-4">
                    <span className="text-sm font-semibold text-shrine-charcoal">{row.label}</span>
                    <span className="text-sm text-shrine-charcoal/75">{row.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <SectionHeading eyebrow="Mass Schedule" title="Join us for Mass" />
              <div className="mt-8 divide-y divide-shrine-stone rounded-sm border border-shrine-stone bg-shrine-cream">
                {massSchedule.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 px-6 py-4">
                    <span className="text-sm font-semibold text-shrine-charcoal">{row.label}</span>
                    <span className="text-right text-sm text-shrine-charcoal/75">{row.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="rounded-sm border border-shrine-stone bg-shrine-maroon-900 p-8 text-shrine-cream shadow-shrine">
              <MapPin className="h-8 w-8 text-shrine-gold-300" aria-hidden="true" />
              <h3 className="mt-4 font-display text-2xl font-semibold">Find Us</h3>
              <p className="mt-3 text-shrine-cream/80">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.state} {site.address.zip}
              </p>
              <div className="mt-6 flex items-center gap-3 text-sm text-shrine-cream/70">
                <Clock3 className="h-4 w-4 text-shrine-gold-300" aria-hidden="true" />
                Free onsite parking, including accessible spaces near the main entrance.
              </div>
              <Button
                href={site.mapsUrl}
                variant="outline-light"
                className="mt-7 w-full"
                icon={<Navigation className="h-4 w-4" aria-hidden="true" />}
              >
                Get Directions
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-shrine-parchment py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Group Visits"
              title="Bringing a parish or school group?"
              description="Most groups spend two to three hours; add Mass or a cultural presentation for a half-day pilgrimage."
              align="center"
            />
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
            {groupSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 120}>
                <div className="rounded-sm border border-shrine-stone bg-shrine-cream p-7 text-center">
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-shrine-maroon-600 font-display text-sm font-semibold text-shrine-gold-300">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-shrine-maroon-700">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-shrine-charcoal/80">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} className="mt-12 flex justify-center">
            <div className="flex items-center gap-3 rounded-sm bg-shrine-cream px-6 py-4 text-sm text-shrine-charcoal shadow-shrine">
              <Users className="h-5 w-5 text-shrine-maroon-500" aria-hidden="true" />
              Groups of 15+: email <a href={`mailto:${site.contact.pilgrimageEmail}`} className="font-semibold text-shrine-maroon-600 underline underline-offset-2">{site.contact.pilgrimageEmail}</a>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
