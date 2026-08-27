import { Link } from "react-router-dom";
import { ArrowRight, Clock3, MapPin, CalendarDays, Church } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { whatToSee, upcomingEvents } from "@/data/content";

const quickFacts = [
  { icon: Clock3, label: "Grounds Hours", value: "Daily, 9 a.m. – 5 p.m." },
  { icon: MapPin, label: "Location", value: "Oklahoma City, OK" },
  { icon: Church, label: "Mass", value: "Daily & Sunday" },
  { icon: CalendarDays, label: "Feast Day", value: "July 28" },
];

export function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-shrine-maroon-900 pb-32 pt-28 text-shrine-cream sm:pb-40 sm:pt-36">
        <img
          src="https://images.pexels.com/photos/7568339/pexels-photo-7568339.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2200"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          onError={(event) => {
            const target = event.currentTarget as HTMLImageElement;
            if (!target.dataset.fallback) {
              target.dataset.fallback = "1";
              target.src = "/images/hero-shrine.jpg";
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-shrine-maroon-950/60 via-shrine-maroon-900/85 to-shrine-maroon-900" />
        <div className="bg-adobe-texture bg-grain absolute inset-0" />

        <Container className="relative">
          <Reveal>
            <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-shrine-gold-300">
              <span className="h-px w-10 bg-shrine-gold-300/70" />
              National Shrine · Oklahoma City
            </p>
            <h1 className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              The Shepherd Who Stayed
            </h1>
            <p className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-shrine-cream/85 sm:text-xl">
              Blessed Stanley Rother left an Oklahoma wheat farm for a Guatemalan mountain parish — and when danger
              came for his people, he refused to leave them. Walk his story, pray at his tomb, and plan your
              pilgrimage.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button to="/pilgrimage" variant="primary" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
                Plan Your Visit
              </Button>
              <Button to="/about-blessed-stanley-rother" variant="outline-light">
                His Story
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <Container className="relative -mt-20 sm:-mt-24">
        <Reveal delay={100}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-shrine-stone bg-shrine-stone shadow-shrine-lg sm:grid-cols-4">
            {quickFacts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col gap-2 bg-shrine-cream p-6">
                <Icon className="h-5 w-5 text-shrine-maroon-500" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-shrine-charcoal/60">
                  {label}
                </span>
                <span className="font-display text-lg font-semibold text-shrine-maroon-700">{value}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>

      <section className="py-24 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Welcome"
              title="A farm boy from Okarche. A martyr in Guatemala. A shrine in between."
            />
            <div className="mt-6 space-y-5 text-base leading-relaxed text-shrine-charcoal/85 sm:text-lg">
              <p>
                Every pilgrim who walks through the Pilgrim Center's doors meets the same story: a priest who
                struggled through seminary Latin, who fixed tractors better than he preached, and who gave his whole
                life to the Tz'utujil Maya people of Santiago Atitlán.
              </p>
              <p>
                When violence threatened his parish in 1981, Father Rother had the chance to stay safely in Oklahoma.
                He went back anyway. Today, his tomb rests here, in the Oklahoma City he first called home.
              </p>
            </div>
            <blockquote className="mt-8 border-l-2 border-shrine-gold-500 pl-6 font-display text-xl italic leading-snug text-shrine-maroon-700">
              "The shepherd cannot run at the first sign of danger."
            </blockquote>
            <div className="mt-8">
              <Button to="/about-blessed-stanley-rother" variant="ghost" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
                Read his full story
              </Button>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative">
              <div className="overflow-hidden rounded-sm shadow-shrine">
                <img
                  src="https://images.pexels.com/photos/38171640/pexels-photo-38171640.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=900"
                  alt="Storm clouds over Lake Atitlán at sunset, near Santiago Atitlán, Guatemala"
                  className="h-[26rem] w-full object-cover sm:h-[30rem]"
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
              <div className="absolute -bottom-6 -left-6 hidden w-52 rounded-sm border border-shrine-stone bg-shrine-cream p-5 shadow-shrine sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-shrine-maroon-500">Beatified</p>
                <p className="mt-1 font-display text-2xl font-semibold text-shrine-maroon-700">2017</p>
                <p className="mt-1 text-xs text-shrine-charcoal/70">First U.S.-born martyr</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-shrine-parchment py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The Grounds"
              title="Three places to walk his story"
              description="From the exhibit halls of the Pilgrim Center to the quiet paths of Tepeyac Hill, every corner of the Shrine has a purpose for pilgrims."
            />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {whatToSee.map((section, index) => (
              <Reveal key={section.id} delay={index * 120}>
                <Link
                  to={`/what-to-see#${section.id}`}
                  className="group block h-full overflow-hidden rounded-sm bg-shrine-cream shadow-shrine transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={section.image}
                      alt={section.imageAlt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(event) => {
                        const target = event.currentTarget as HTMLImageElement;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = "1";
                          target.src = "/images/hero-shrine.jpg";
                        }
                      }}
                    />
                    <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-shrine-maroon-900/80 font-display text-sm font-semibold text-shrine-gold-300">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-shrine-maroon-700">{section.title}</h3>
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-shrine-charcoal/80">
                      {section.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-shrine-maroon-600">
                      Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-28">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <SectionHeading eyebrow="Stay Close" title="Upcoming at the Shrine" />
            </Reveal>
            <Reveal delay={100}>
              <Button to="/news-events" variant="ghost" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
                All news &amp; events
              </Button>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingEvents.map((event, index) => (
              <Reveal key={event.title} delay={index * 100}>
                <div className="flex h-full flex-col rounded-sm border border-shrine-stone bg-shrine-cream p-6 transition-shadow hover:shadow-shrine">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-shrine-maroon-500">
                    {event.category}
                  </span>
                  <p className="mt-2 font-display text-lg font-semibold leading-snug text-shrine-maroon-700">
                    {event.title}
                  </p>
                  <p className="mt-2 text-sm text-shrine-charcoal/70">{event.date}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-shrine-charcoal/80">{event.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-shrine-maroon-900 py-24 text-shrine-cream sm:py-28">
        <div className="bg-adobe-texture absolute inset-0" />
        <Container className="relative text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-shrine-gold-300">Plan Ahead</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance font-display text-3xl font-semibold sm:text-4xl">
              Bring your parish, your class, or just yourself.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-shrine-cream/80">
              Every pilgrimage is different. Whether it's an afternoon or a full-day retreat, we'll help you plan a
              visit that fits.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button to="/pilgrimage" variant="primary">
                Plan Your Pilgrimage
              </Button>
              <Button to="/volunteer" variant="outline-light">
                Volunteer With Us
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
