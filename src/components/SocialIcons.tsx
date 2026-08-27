import { cn } from "@/utils/cn";

interface IconProps {
  className?: string;
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} aria-hidden="true" fill="currentColor">
      <path d="M14.5 8.5V6.8c0-.7.5-1.1 1.2-1.1h1.3V3h-2.3C12.2 3 11 4.4 11 6.6v1.9H9v2.7h2V21h3.5v-9.8h2.3l.3-2.7h-2.6Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} aria-hidden="true" fill="currentColor">
      <path d="M22 12.2s0-3.1-.4-4.4c-.2-.8-.9-1.5-1.7-1.7C18.5 5.6 12 5.6 12 5.6s-6.5 0-7.9.5c-.8.2-1.5.9-1.7 1.7C2 9.1 2 12.2 2 12.2s0 3.1.4 4.4c.2.8.9 1.5 1.7 1.7 1.4.5 7.9.5 7.9.5s6.5 0 7.9-.5c.8-.2 1.5-.9 1.7-1.7.4-1.3.4-4.4.4-4.4ZM10.2 15.1V9.3l5.3 2.9-5.3 2.9Z" />
    </svg>
  );
}
