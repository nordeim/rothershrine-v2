import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/data/content";
import { site } from "@/data/site";

const roles = [
  {
    title: "Docent",
    commitment: "One morning or afternoon each month",
    description:
      "Walk pilgrims through the exhibits and help a first visit become a story they can carry home.",
  },
  {
    title: "Hospitality",
    commitment: "Weekend Masses or feast days",
    description:
      "Greet coaches, point families toward the chapel, and keep the Pilgrim Center feeling like an arrival.",
  },
  {
    title: "Grounds",
    commitment: "Seasonal mornings on Tepeyac Hill",
    description:
      "Tend native plantings, keep the rosary walk clear, and prepare the amphitheater for outdoor Mass.",
  },
  {
    title: "Gift shop & welcome desk",
    commitment: "A weekday or Saturday shift",
    description:
      "Help visitors find a book, a medal, or the right door — the quiet work that makes a shrine hospitable.",
  },
];

export function Volunteer() {
  return (
    <div>
      <PageHero
        eyebrow="Serve"
        title="Volunteer"
        description="The shrine is kept by people who show up — docents, greeters, gardeners, and the ones who unlock the doors."
        image={images.garden}
        compact
      />

      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Ways to Serve"
              title="A place for ordinary faithfulness"
              description="No special credentials required. Write us, tell us what you can offer, and we will find a fit."
              align="center"
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {roles.map((role, index) => (
              <Reveal key={role.title} delay={index * 70}>
                <article className="card-lift h-full border border-shrine-stone bg-shrine-cream p-7">
                  <h3 className="font-display text-2xl text-shrine-maroon-700">{role.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-shrine-charcoal/80">{role.description}</p>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-shrine-gold-600">
                    {role.commitment}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href={`mailto:${site.contact.volunteerEmail}`} variant="secondary">
              Write the volunteer office
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
