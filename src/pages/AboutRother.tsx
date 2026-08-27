import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Timeline } from "@/components/Timeline";
import { Button } from "@/components/ui/Button";
import { lifeTimeline } from "@/data/content";
import { ArrowRight } from "lucide-react";

export function AboutRother() {
  return (
    <div>
      <PageHero
        eyebrow="His Story"
        title="Blessed Stanley Rother"
        description="Farm boy. Failed seminarian. Missionary priest. Martyr. The life of the shepherd who would not run."
        image="https://images.pexels.com/photos/38171640/pexels-photo-38171640.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800"
      />

      <section className="py-24 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="Padre Apla's" title="Padre Apla's" />
            <p className="mt-6 text-base leading-relaxed text-shrine-charcoal/85 sm:text-lg">
              The Tz'utujil Maya of Santiago Atitlán could not pronounce "Francisco," his middle name — so they
              called him Padre Apla's instead. It became the name of a man who fixed engines, built a hospital by
              hand, translated Scripture into a language with no written form, and, in the end, gave his life rather
              than abandon his flock.
            </p>
            <div className="mt-8 overflow-hidden rounded-sm shadow-shrine">
              <img
                src="https://images.pexels.com/photos/33235131/pexels-photo-33235131.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200"
                alt="Aerial view of a lakeside town nestled among the highlands near Lake Atitlán, Guatemala"
                className="h-64 w-full object-cover"
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

          <div>
            <Reveal>
              <SectionHeading eyebrow="A Life in Eight Chapters" title="From Okarche to Santiago Atitlán" />
            </Reveal>
            <div className="mt-12">
              <Timeline entries={lifeTimeline} />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-shrine-maroon-900 py-24 text-shrine-cream sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <img
              src="https://images.pexels.com/photos/38135623/pexels-photo-38135623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200"
              alt="Scenic view of Cerro de Oro rising above Lake Atitlán, Guatemala"
              className="h-80 w-full rounded-sm object-cover shadow-shrine-lg sm:h-96"
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
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-shrine-gold-300">A Heart Divided, A Life Whole</p>
            <blockquote className="mt-5 font-display text-2xl italic leading-snug sm:text-3xl">
              "I don't want to desert those people, and that is what would be effectively happening if I left now."
            </blockquote>
            <p className="mt-6 text-shrine-cream/80">
              Written to his bishop in the months before his death, these words explain why — offered safety in
              Oklahoma — Father Rother chose to return to Guatemala for Holy Week 1981. His body rests in Okarche; by
              his parishioners' request, his heart remains in the church he served in Santiago Atitlán.
            </p>
            <div className="mt-8">
              <Button to="/history" variant="outline-light" icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}>
                How the Shrine came to be
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
