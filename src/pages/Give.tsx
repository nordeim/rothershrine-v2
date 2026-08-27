import type { ComponentType } from "react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { givingOptions, type GivingOption } from "@/data/content";
import { BookOpen, Church, Flame, Globe, HandHeart, Heart, Landmark, Sprout, type LucideProps } from "lucide-react";

const iconMap: Record<GivingOption["icon"], ComponentType<LucideProps>> = {
  flame: Flame,
  church: Church,
  sprout: Sprout,
  heart: Heart,
  book: BookOpen,
  "hand-heart": HandHeart,
  landmark: Landmark,
  globe: Globe,
};

export function Give() {
  return (
    <div>
      <PageHero
        eyebrow="Support the Shrine"
        title="Give"
        description="Every gift — general or designated — helps welcome the next pilgrim through the Pilgrim Center's doors."
        image="https://images.pexels.com/photos/6663862/pexels-photo-6663862.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800"
        compact
      />

      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Where Your Gift Goes"
              title="Eight ways to support the mission"
              description="Choose the fund closest to your heart, or give to the General Fund and let the Shrine direct it where it's needed most."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {givingOptions.map((option, index) => {
              const Icon = iconMap[option.icon];
              return (
                <Reveal key={option.name} delay={(index % 4) * 90}>
                  <div className="flex h-full flex-col rounded-sm border border-shrine-stone bg-shrine-cream p-6 transition-shadow hover:shadow-shrine">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-shrine-maroon-50 text-shrine-maroon-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-shrine-maroon-700">{option.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-shrine-charcoal/80">{option.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-shrine-maroon-900 py-24 text-shrine-cream sm:py-28">
        <div className="bg-adobe-texture absolute inset-0" />
        <Container className="relative text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-shrine-gold-300">Ready to Give?</p>
            <h2 className="mx-auto mt-4 max-w-xl text-balance font-display text-3xl font-semibold sm:text-4xl">
              A gift of any size carries a pilgrim forward.
            </h2>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button href="https://www.rothershrine.org/give" variant="primary">
                Give Online Now
              </Button>
              <Button to="/pilgrimage" variant="outline-light">
                Visit In Person
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
