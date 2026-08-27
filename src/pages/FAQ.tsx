import { PageHero } from "@/components/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs, images } from "@/data/content";

export function FAQ() {
  return (
    <div>
      <PageHero
        eyebrow="Questions"
        title="FAQ"
        description="Hours, cost, Mass, accessibility, and where Blessed Stanley is buried."
        image={images.chapel}
        compact
      />

      <section className="py-24 sm:py-28">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading
              eyebrow="Before You Come"
              title="What pilgrims usually ask"
            />
          </Reveal>
          <div className="mt-12">
            <Accordion items={faqs} />
          </div>
        </Container>
      </section>
    </div>
  );
}
