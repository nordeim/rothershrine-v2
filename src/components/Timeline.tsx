import { Reveal } from "@/components/ui/Reveal";
import type { TimelineEntry } from "@/data/content";
import { cn } from "@/utils/cn";

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <ol className="relative">
      <div
        className="absolute left-[27px] top-2 hidden h-[calc(100%-1rem)] w-px bg-shrine-stone sm:block lg:left-1/2 lg:-translate-x-1/2"
        aria-hidden="true"
      />
      <div className="space-y-10 lg:space-y-16">
        {entries.map((entry, index) => {
          const isEven = index % 2 === 0;
          return (
            <Reveal as="li" key={entry.year} delay={(index % 4) * 80}>
              <div
                className={cn(
                  "relative grid gap-6 sm:pl-16 lg:grid-cols-2 lg:gap-16 lg:pl-0",
                  !isEven && "lg:[&>*:first-child]:order-2",
                )}
              >
                <span
                  title={entry.year}
                  className="absolute left-0 top-1 flex h-14 w-14 items-center justify-center rounded-full border-4 border-shrine-cream bg-shrine-maroon-600 text-center font-display text-[11px] font-semibold leading-none text-shrine-gold-300 shadow-shrine lg:left-1/2 lg:-translate-x-1/2"
                  aria-hidden="true"
                >
                  {entry.year.includes("–") ? entry.year.split("–")[0] : entry.year.slice(0, 4)}
                </span>

                <div className={cn("rounded-sm border border-shrine-stone bg-shrine-cream p-6 sm:p-7", isEven ? "lg:text-right" : "")}>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-shrine-maroon-500">{entry.year}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-shrine-maroon-700">{entry.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-shrine-charcoal/85 sm:text-base">
                    {entry.description}
                  </p>
                </div>
                <div className="hidden lg:block" />
              </div>
            </Reveal>
          );
        })}
      </div>
    </ol>
  );
}
