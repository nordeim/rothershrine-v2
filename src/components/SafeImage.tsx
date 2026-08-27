import { useState } from "react";
import { cn } from "@/utils/cn";

interface SafeImageProps {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export function SafeImage({
  src,
  fallback = "/images/hero-shrine.jpg",
  alt,
  className,
  loading = "lazy",
}: SafeImageProps) {
  const [current, setCurrent] = useState(src);

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      className={cn("h-full w-full object-cover", className)}
      onError={(event) => {
        const target = event.currentTarget;
        if (!target.dataset.fallback) {
          target.dataset.fallback = "1";
          setCurrent(fallback);
        }
      }}
    />
  );
}
