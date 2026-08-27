import { cn } from "@/utils/cn";

interface EmblemProps {
  className?: string;
}

/**
 * Bespoke vector emblem — a shepherd's crook crossed with a wheat sheaf,
 * nodding to the farm boy from Okarche who became a shepherd of souls.
 * Rendered as inline SVG so it stays crisp at any size with no image request.
 */
export function Emblem({ className }: EmblemProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("h-10 w-10", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeOpacity="0.35" />
      <path
        d="M24 6c1.5 3 2 6 0 9-2-3-1.5-6 0-9Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M24 13v24"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M24 13c-4 0-7-2.6-7-6.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M15 21c3 2 5 2 9 0m-9 6c3 2 5 2 9 0m-9 6c3 2 5 2 9 0"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M33 21c-3 2-5 2-9 0m9 6c-3 2-5 2-9 0m9 6c-3 2-5 2-9 0"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}
