import { PageHero } from "@/components/PageHero";
import { Timeline } from "@/components/Timeline";
import { SafeImage } from "@/components/SafeImage";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images, lifeTimeline } from "@/data/content";

export function History() {
  return (
    <div>
      <PageHero
        eyebrow="The Shrine"
        title="History of the Shrine"
        description="From beatification on an Oklahoma field in 2017 to a national place of pilgrimage."
        image={images.hero}
        compact
      />

      <section className="py-24 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="A National Home"
                title="Built so the shepherd could be visited"
                description="The shrine church was designed in the Spanish mission style, echoing the parish Father Rother served in Santiago Atitlán."
              />
            </Reveal>
            <div className="mt-12">
              <Timeline entries={lifeTimeline.slice(6)} />
            </div>
            <Reveal className="mt-12 space-y-4 text-base leading-relaxed text-shrine-charcoal/85">
              <p>
                After the 2017 beatification — the first of a U.S.-born priest and martyr — the
                Archdiocese of Oklahoma City set out to build a place large enough for the
                pilgrims already arriving. The campus opened in 2023: a church seating more than
                a thousand, a museum and pilgrim center, and Tepeyac Hill dedicated to Our Lady
                of Guadalupe.
              </p>
              <p>
                His tomb is here. His heart remains in Guatemala. The shrine holds both halves of
                that story so visitors can pray them as one.
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:sticky lg:top-28">
            <SafeImage
              src={images.hero}
              fallback={images.heroFallback}
              alt="The Blessed Stanley Rother Shrine under a clear Oklahoma sky"
              className="h-[28rem] w-full object-cover shadow-shrine-lg sm:h-[36rem]"
            />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
