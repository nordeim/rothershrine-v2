import { Link } from "react-router-dom";
import { ArrowRight, Church, Clock, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SafeImage } from "@/components/SafeImage";
import { images, upcomingEvents, whatToSee } from "@/data/content";
import { site } from "@/data/site";

const facts = [
  { label: "Hours", value: site.hours.grounds, icon: Clock },
  { label: "Location", value: site.address.full, icon: MapPin },
  { label: "Daily Mass", value: site.mass.daily, icon: Church },
  { label: "Feast Day", value: "July 28", icon: Sparkles },
];

export function Home() {
  return (
    <div>
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-shrine-maroon-950 text-shrine-cream">
        <SafeImage
          src={images.hero}
          fallback={images.heroFallback}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover hero-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-shrine-maroon-950/90 via-shrine-maroon-950/55 to-shrine-maroon-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-shrine-maroon-950 via-shrine-maroon-950/20 to-shrine-maroon-950/40" />
        <div className="bg-grain absolute inset-0 opacity-60" aria-hidden="true" />

        <Container className="relative flex min-h-[100svh] flex-col justify-end pb-16 pt-36 sm:pb-20 lg:pb-24">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="rise-in text-xs font-semibold uppercase tracking-[0.35em] text-shrine-gold-300">
                National Shrine · Oklahoma City
              </p>
              <div className="gold-rule-left rise-in rise-in-d1 mt-5 w-24" />
              <h1 className="rise-in rise-in-d1 mt-6 max-w-3xl text-balance font-display text-5xl font-medium leading-[0.98] italic text-shrine-cream sm:text-6xl lg:text-7xl">
                The shepherd who stayed.
              </h1>
              <p className="rise-in rise-in-d2 mt-6 max-w-xl text-base leading-relaxed text-shrine-cream/80 sm:text-lg">
                Walk the story of Blessed Stanley Rother — Oklahoma farm boy, missionary priest,
                and the first U.S.-born martyr to be beatified — through the Pilgrim Center,
                Shrine Church, and Tepeyac Hill.
              </p>
              <div className="rise-in rise-in-d3 mt-9 flex flex-wrap gap-4">
                <Button to="/pilgrimage" variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
                  Plan Your Visit
                </Button>
                <Button to="/about-blessed-stanley-rother" variant="outline-light">
                  His Story
                </Button>
              </div>
            </div>

            <aside className="rise-in rise-in-d4 border border-shrine-gold-500/25 bg-shrine-maroon-950/70 p-6 shadow-shrine-lg backdrop-blur-sm sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-shrine-gold-300">
                Arrive today
              </p>
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-shrine-cream/55">Hours</dt>
                  <dd className="mt-1 font-display text-xl text-shrine-cream">{site.hours.grounds}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-shrine-cream/55">Daily Mass</dt>
                  <dd className="mt-1 text-sm text-shrine-cream/85">{site.mass.daily}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-shrine-cream/55">Find us</dt>
                  <dd className="mt-1 text-sm text-shrine-cream/85">{site.address.full}</dd>
                </div>
              </dl>
              <Link
                to="/pilgrimage#visit"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-shrine-gold-300 hover:text-shrine-gold-100"
              >
                Full schedule
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </Container>
        <div className="divider-weave-thin relative" />
      </section>

      <section className="border-b border-shrine-stone bg-shrine-parchment">
        <Container className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <Reveal key={fact.label} delay={index * 80}>
                <div className="flex gap-4 bg-shrine-parchment px-1 py-8 sm:px-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-shrine-maroon-600" aria-hidden="true" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-shrine-maroon-500">
                      {fact.label}
                    </p>
                    <p className="mt-1 text-sm leading-snug text-shrine-ink">{fact.value}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="grid grid-cols-2 gap-3">
              <SafeImage
                src={images.wheat}
                fallback={images.wheatFallback}
                alt="Golden Oklahoma wheat field at harvest"
                className="h-72 w-full object-cover sm:h-[28rem]"
              />
              <SafeImage
                src={images.atitlan}
                alt="Lake Atitlán and Cerro de Oro in the Guatemalan highlands"
                className="mt-10 h-72 w-full object-cover sm:h-[28rem]"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <SectionHeading
              eyebrow="A Welcome"
              title="From a wheat farm to a highland parish"
            />
            <p className="mt-6 text-base leading-relaxed text-shrine-charcoal/85 sm:text-lg">
              Every pilgrim who walks through the Pilgrim Center's doors meets the same story: a
              priest who struggled through seminary Latin, who fixed tractors better than he
              preached, and who gave his whole life to the Tz'utujil Maya people of Santiago
              Atitlán.
            </p>
            <p className="mt-4 text-base leading-relaxed text-shrine-charcoal/85 sm:text-lg">
              When violence threatened his parish in 1981, Father Rother had the chance to stay
              safely in Oklahoma. He went back anyway. Today, his tomb rests here, in the Oklahoma
              City he first called home.
            </p>
            <div className="mt-8">
              <Button
                to="/about-blessed-stanley-rother"
                variant="secondary"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Read his life
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-shrine-maroon-950 py-20 text-shrine-cream sm:py-24">
        <Container>
          <Reveal>
            <blockquote className="mx-auto max-w-4xl text-center">
              <p className="font-display text-3xl font-medium italic leading-snug sm:text-4xl lg:text-5xl">
                “The shepherd cannot run at the first sign of danger.”
              </p>
              <footer className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-shrine-gold-300">
                Blessed Stanley Rother · to his family, 1981
              </footer>
            </blockquote>
          </Reveal>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The Grounds"
              title="Three places, one pilgrimage"
              description="Begin in the exhibits, pray at the tomb, and walk Tepeyac Hill before you leave."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            {whatToSee.map((place, index) => (
              <Reveal
                key={place.id}
                delay={index * 80}
                className={index === 0 ? "lg:col-span-7" : "lg:col-span-5"}
              >
                <Link
                  to={`/what-to-see#${place.id}`}
                  className="group relative block overflow-hidden"
                >
                  <SafeImage
                    src={place.image}
                    alt={place.imageAlt}
                    className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[26rem]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-shrine-maroon-950/90 via-shrine-maroon-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-shrine-gold-300">
                      0{index + 1}
                    </p>
                    <h3 className="mt-2 font-display text-3xl text-shrine-cream">{place.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-shrine-cream/75">
                      {place.summary}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-shrine-parchment py-24 sm:py-32">
        <Container>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="This Season"
              title="News & gatherings"
              description="Feast days, rosary walks, and formation for pilgrims and parish groups."
            />
            <Button to="/news-events" variant="ghost" icon={<ArrowRight className="h-4 w-4" />}>
              All events
            </Button>
          </div>

          <div className="mt-12 divide-y divide-shrine-stone border-y border-shrine-stone">
            {upcomingEvents.map((event, index) => (
              <Reveal key={event.title} delay={index * 50}>
                <article className="grid gap-4 px-4 py-8 transition-colors duration-200 hover:bg-shrine-maroon-50/60 md:grid-cols-[10rem_1fr_12rem] md:items-baseline">
                  <p className="font-display text-lg text-shrine-maroon-600">{event.date}</p>
                  <div>
                    <p className="inline-block border border-shrine-gold-500/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-shrine-terracotta-500">
                      {event.category}
                    </p>
                    <h3 className="mt-1.5 font-display text-2xl text-shrine-maroon-700">{event.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-shrine-charcoal/80">
                      {event.description}
                    </p>
                  </div>
                  <p className="text-sm text-shrine-charcoal/70">{event.location}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-shrine-maroon-900 py-24 text-shrine-cream sm:py-32">
        <SafeImage
          src={images.atitlanSunset}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-shrine-maroon-950/70" />
        <Container className="relative text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-shrine-gold-300">
              Come as you are
            </p>
            <h2 className="mx-auto mt-5 max-w-2xl text-balance font-display text-4xl font-semibold text-shrine-cream sm:text-5xl">
              Admission is free. The invitation is older than the doors.
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button to="/pilgrimage" variant="primary">
                Plan a pilgrimage
              </Button>
              <Button to="/give" variant="outline-light">
                Support the shrine
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
