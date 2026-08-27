import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/utils/cn";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  children?: ReactNode;
  compact?: boolean;
}

export function PageHero({ eyebrow, title, description, image, children, compact = false }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-shrine-maroon-900 text-shrine-cream",
        compact ? "py-24 sm:py-28" : "py-28 sm:py-36",
      )}
    >
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        onError={(event) => {
          const target = event.currentTarget as HTMLImageElement;
          if (!target.dataset.fallback) {
            target.dataset.fallback = "1";
            target.src = "/images/hero-shrine.jpg";
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-shrine-maroon-900/70 via-shrine-maroon-900/85 to-shrine-maroon-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-shrine-maroon-950/60 via-transparent to-shrine-maroon-950/40" />
      <div className="bg-adobe-texture bg-grain absolute inset-0" />
      <Container className="relative">
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-shrine-gold-300">
          <span className="h-px w-10 bg-shrine-gold-300/70" />
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-shrine-cream/85 sm:text-xl">
            {description}
          </p>
        ) : null}
        {children}
      </Container>
      <div className="divider-weave-thin absolute inset-x-0 bottom-0" />
    </section>
  );
}
