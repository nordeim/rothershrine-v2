import { useEffect, useState } from "react";
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrent(src);
    setLoaded(false);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      className={cn(
        "h-full w-full object-cover transition-opacity duration-500 ease-out",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
      onLoad={() => setLoaded(true)}
      onError={(event) => {
        const target = event.currentTarget;
        if (!target.dataset.fallback) {
          target.dataset.fallback = "1";
          setLoaded(false);
          setCurrent(fallback);
        }
      }}
    />
  );
}
