import { lifeTimeline, type TimelineEntry } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/utils/cn";

interface TimelineProps {
  entries?: TimelineEntry[];
}

export function Timeline({ entries = lifeTimeline }: TimelineProps) {
  return (
    <ol className="relative space-y-10 border-l border-shrine-stone pl-8 sm:pl-12">
      {entries.map((entry, index) => (
        <Reveal as="li" key={`${entry.year}-${entry.title}`} delay={index * 60} className="relative">
          <span
            className={cn(
              "dot-pulse absolute -left-[37px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-shrine-gold-500 bg-shrine-cream sm:-left-[53px]",
            )}
            aria-hidden="true"
          />
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-shrine-gold-600">
            {entry.year}
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-shrine-maroon-700">
            {entry.title}
          </h3>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-shrine-charcoal/85">
            {entry.description}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}
