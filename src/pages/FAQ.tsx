import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { faqs } from "@/data/content";
import { site } from "@/data/site";

export function FAQ() {
  return (
    <div>
      <PageHero
        eyebrow="Good to Know"
        title="Frequently Asked Questions"
        description="Admission, Mass times, accessibility, and where Blessed Stanley is buried — answered here."
        image="https://images.pexels.com/photos/9614110/pexels-photo-9614110.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800"
        compact
      />

      <section className="py-24 sm:py-28">
        <Container className="max-w-3xl">
          <Reveal>
            <SectionHeading eyebrow="Before You Go" title="Common questions from pilgrims" align="center" />
          </Reveal>
          <div className="mt-12">
            <Reveal delay={100}>
              <Accordion items={faqs} />
            </Reveal>
          </div>
          <Reveal delay={150} className="mt-12 rounded-sm border border-shrine-stone bg-shrine-parchment p-7 text-center">
            <p className="text-shrine-charcoal/85">Still have a question we haven't answered?</p>
            <div className="mt-5">
              <Button href={`mailto:${site.contact.email}`} variant="secondary">
                Ask the Pilgrimage Office
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
