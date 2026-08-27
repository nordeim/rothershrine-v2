import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.28em]",
            light ? "text-shrine-gold-300" : "text-shrine-maroon-500",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <div
        className={cn(
          "mt-4 h-px w-16",
          align === "center" && "mx-auto",
          light ? "bg-shrine-gold-500/70" : "bg-shrine-gold-500",
        )}
      />
      <h2
        className={cn(
          "mt-5 text-balance font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl",
          light ? "text-shrine-cream" : "text-shrine-maroon-700",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto",
            light ? "text-shrine-cream/75" : "text-shrine-charcoal/80",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
