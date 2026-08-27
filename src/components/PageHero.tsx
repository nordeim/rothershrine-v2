import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SafeImage } from "@/components/SafeImage";
import { cn } from "@/utils/cn";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  children?: ReactNode;
  compact?: boolean;
}

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-shrine-maroon-950 text-shrine-cream",
        compact ? "min-h-[22rem] sm:min-h-[26rem]" : "min-h-[28rem] sm:min-h-[34rem]",
      )}
    >
      <SafeImage
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-shrine-maroon-950/88 via-shrine-maroon-900/72 to-shrine-maroon-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-shrine-maroon-950/70 via-transparent to-shrine-maroon-950/30" />
      <div className="bg-grain absolute inset-0 opacity-70" aria-hidden="true" />

      <Container
        className={cn(
          "relative flex flex-col justify-end",
          compact ? "pt-32 pb-14 sm:pt-36 sm:pb-16" : "pt-36 pb-16 sm:pt-44 sm:pb-20",
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-shrine-gold-300">
          {eyebrow}
        </p>
        <div className="gold-rule-left mt-4 w-20" />
        <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.08] text-shrine-cream sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-shrine-cream/80 sm:text-lg">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
      <div className="divider-weave-thin relative" />
    </section>
  );
}
