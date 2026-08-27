import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Timeline } from "@/components/Timeline";
import type { TimelineEntry } from "@/data/content";
import { lifeTimeline } from "@/data/content";

const pathToSainthood = lifeTimeline.filter((entry) => ["1981", "2016–2017", "2023"].includes(entry.year));

const shrineMilestones: TimelineEntry[] = [
  {
    year: "2017",
    title: "A Home for the Beatification",
    description:
      "Following the September 2017 beatification Mass in Oklahoma City — attended by more than 20,000 pilgrims — the Archdiocese committed to building a permanent shrine so the newly Blessed Stanley Rother would have a lasting home for pilgrimage and prayer.",
  },
  {
    year: "2018",
    title: "Groundbreaking",
    description:
      "Ground was broken on farmland northeast of Oklahoma City, chosen for its proximity to Rother's boyhood home in Okarche and its capacity to welcome pilgrim buses, school groups, and outdoor feast-day crowds.",
  },
  {
    year: "2020",
    title: "Foundations Through a Pandemic",
    description:
      "Construction of the Pilgrim Center and Shrine Church continued through 2020, with craftsmen sourcing stone, timber, and stained glass to reflect both Oklahoma's plains heritage and Guatemala's highland culture.",
  },
  {
    year: "2023",
    title: "Dedication & Opening",
    description:
      "The Shrine Church was dedicated and the grounds opened to pilgrims, completing a promise made at the beatification six years earlier — a home where Blessed Stanley's story could be walked, not just read.",
  },
];

export function History() {
  return (
    <div>
      <PageHero
        eyebrow="Our History"
        title="History of the Shrine"
        description="From a beatification Mass that filled an Oklahoma City arena to a permanent home for pilgrimage on Tepeyac Hill."
        image="https://images.pexels.com/photos/10244422/pexels-photo-10244422.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1800"
      />

      <section className="py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Path to Sainthood"
              title="From martyrdom to beatification"
              description="Three moments from Blessed Stanley's life mark the road that led here — his death in 1981, his beatification in 2017, and the Shrine's opening in 2023."
              align="center"
            />
          </Reveal>
          <div className="mx-auto mt-14 max-w-4xl">
            <Timeline entries={pathToSainthood} />
          </div>
        </Container>
      </section>

      <section className="bg-shrine-parchment py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Building the Shrine"
              title="How Tepeyac Hill became sacred ground"
              description="Six years separate the beatification Mass from the Shrine's dedication — years of fundraising, design, and construction guided by one goal: a place worthy of the story."
              align="center"
            />
          </Reveal>
          <div className="mx-auto mt-14 max-w-4xl">
            <Timeline entries={shrineMilestones} />
          </div>
        </Container>
      </section>
    </div>
  );
}
