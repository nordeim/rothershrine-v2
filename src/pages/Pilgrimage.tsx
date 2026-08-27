import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/data/content";
import { site } from "@/data/site";

const groupSteps = [
  {
    title: "Write the pilgrimage office",
    description:
      "Share your parish or school name, preferred dates, group size, and whether you hope to attend Mass or add a meal.",
  },
  {
    title: "Shape the itinerary",
    description:
      "Most groups spend two to three hours. Add Mass, the museum film, Tepeyac Hill, or a Guatemalan cultural presentation for a half-day visit.",
  },
  {
    title: "Arrive and begin",
    description:
      "Orientation starts in the Pilgrim Center. Accessible parking is beside the main entrance; coaches have a dedicated drop-off.",
  },
];

export function Pilgrimage() {
  return (
    <div>
      <PageHero
        eyebrow="Plan Your Visit"
        title="Pilgrimage"
        description="Hours, Mass times, and how to bring a parish, school, or family to the shrine."
        image={images.hero}
      />

      <section id="visit" className="scroll-mt-28 py-24 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Find Us"
              title="A day's pilgrimage in south Oklahoma City"
              description="The shrine, museum, gift shop, and Pilgrim Center keep the same public hours. Mass and confession follow their own rhythm."
            />
            <address className="mt-10 space-y-5 not-italic">
              <p className="flex gap-3 text-shrine-charcoal/85">
                <MapPin className="mt-1 h-5 w-5 text-shrine-maroon-600" aria-hidden="true" />
                <span>
                  <span className="block font-semibold text-shrine-ink">{site.address.full}</span>
                  <a
                    href={site.mapsUrl}
                    className="mt-1 inline-block text-sm text-shrine-maroon-600 underline-offset-2 hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </span>
              </p>
              <p className="flex gap-3 text-shrine-charcoal/85">
                <Phone className="mt-1 h-5 w-5 text-shrine-maroon-600" aria-hidden="true" />
                <a href={`tel:${site.contact.phone.replace(/\D/g, "")}`}>{site.contact.phone}</a>
              </p>
              <p className="flex gap-3 text-shrine-charcoal/85">
                <Mail className="mt-1 h-5 w-5 text-shrine-maroon-600" aria-hidden="true" />
                <a href={`mailto:${site.contact.pilgrimageEmail}`}>{site.contact.pilgrimageEmail}</a>
              </p>
              <p className="flex gap-3 text-shrine-charcoal/85">
                <Clock className="mt-1 h-5 w-5 text-shrine-maroon-600" aria-hidden="true" />
                Grounds, museum & gift shop — {site.hours.grounds}
              </p>
            </address>
          </Reveal>

          <Reveal delay={80}>
            <div className="border border-shrine-stone bg-shrine-parchment p-7 sm:p-9">
              <h3 className="font-display text-2xl text-shrine-maroon-700">Mass & confession</h3>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-shrine-maroon-500">
                    Saturday
                  </dt>
                  <dd className="mt-1 text-shrine-ink">{site.mass.saturday}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-shrine-maroon-500">
                    Sunday
                  </dt>
                  <dd className="mt-1 space-y-1 text-shrine-ink">
                    {site.mass.sunday.map((time) => (
                      <p key={time}>{time}</p>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-shrine-maroon-500">
                    Daily
                  </dt>
                  <dd className="mt-1 text-shrine-ink">{site.mass.daily}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-shrine-maroon-500">
                    Confession
                  </dt>
                  <dd className="mt-1 text-shrine-ink">{site.mass.confession}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-shrine-maroon-500">
                    Adoration
                  </dt>
                  <dd className="mt-1 text-shrine-ink">{site.mass.adoration}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-shrine-parchment py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Groups"
              title="Bring a parish, school, or family"
              description="Write us before you travel. We will help you build a visit that fits the time you have."
              align="center"
            />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {groupSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 80}>
                <p className="font-display text-5xl text-shrine-gold-500">0{index + 1}</p>
                <h3 className="mt-4 font-display text-2xl text-shrine-maroon-700">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-shrine-charcoal/80">{step.description}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href={`mailto:${site.contact.pilgrimageEmail}`} variant="secondary">
              Email the pilgrimage office
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="The Road" title="Find Us" />
            <div className="mt-10 overflow-hidden border border-shrine-stone shadow-shrine">
              <iframe
                title="Map to Blessed Stanley Rother Shrine"
                src={site.mapsEmbedSrc}
                className="h-80 w-full grayscale-[20%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
