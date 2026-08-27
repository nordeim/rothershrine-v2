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
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em]",
            align === "center" && "justify-center",
            light ? "text-shrine-gold-300" : "text-shrine-maroon-500",
          )}
        >
          <span className={cn("h-px w-8", light ? "bg-shrine-gold-300/70" : "bg-shrine-maroon-500/60")} />
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "text-balance text-3xl font-semibold leading-tight sm:text-4xl",
          light ? "text-shrine-cream" : "text-shrine-maroon-700",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-shrine-cream/80" : "text-shrine-charcoal/85")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
