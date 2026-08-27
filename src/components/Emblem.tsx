import { cn } from "@/utils/cn";

interface EmblemProps {
  className?: string;
}

export function Emblem({ className }: EmblemProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-10 w-10", className)}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M24 8.5v22.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 11.5c6.2 1.6 9.8 5.4 9.8 10.2 0 3.4-1.8 6.2-4.8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 31.5c2.2 2.4 4.6 4 7 5.5 2.4-1.5 4.8-3.1 7-5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.5 33.5c2.6 1.6 5.4 2.6 8.5 3.2 3.1-.6 5.9-1.6 8.5-3.2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M18 36.5c1.8 1.2 3.8 2 6 2.4 2.2-.4 4.2-1.2 6-2.4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
