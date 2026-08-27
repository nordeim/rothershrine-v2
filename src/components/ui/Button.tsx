import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline-light";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-shrine-gold-500 text-shrine-maroon-900 hover:bg-shrine-gold-300 shadow-shrine",
  secondary:
    "bg-shrine-maroon-600 text-shrine-cream hover:bg-shrine-maroon-500",
  ghost:
    "bg-transparent text-shrine-maroon-600 hover:bg-shrine-maroon-50",
  "outline-light":
    "border border-shrine-cream/60 text-shrine-cream hover:bg-shrine-cream/10",
};

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

interface LinkButtonProps
  extends BaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children"> {
  to: string;
  href?: never;
}

interface AnchorButtonProps
  extends BaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children"> {
  href: string;
  to?: never;
}

interface NativeButtonProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  to?: never;
  href?: never;
}

type ButtonProps = LinkButtonProps | AnchorButtonProps | NativeButtonProps;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shrine-gold-500 disabled:cursor-not-allowed disabled:opacity-60";

export function Button(props: ButtonProps) {
  const { variant = "primary", children, className, icon, ...rest } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("to" in props && props.to) {
    const { to, ...anchorRest } = rest as LinkButtonProps;
    return (
      <Link to={to} className={classes} {...anchorRest}>
        {children}
        {icon}
      </Link>
    );
  }

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as AnchorButtonProps;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as NativeButtonProps)}>
      {children}
      {icon}
    </button>
  );
}
