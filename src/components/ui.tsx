import Link from "next/link";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Page-width container. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-shell px-6 md:px-8", className)}>
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "outline" | "ghost" | "light";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-wide transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:scale-[1.02] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-ivory";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-cinnamon text-ivory hover:bg-oak shadow-soft",
  outline: "border border-oak/30 text-oak hover:bg-oak hover:text-ivory",
  ghost: "text-oak hover:bg-oak/5",
  light: "bg-ivory text-soil hover:bg-sand shadow-soft",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
};

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

/** Brand wordmark/monogram using the provided ivory PNGs. `dark` inverts for
 *  light backgrounds via CSS (the source art is ivory + transparent). */
export function Wordmark({
  className,
  dark = false,
  priority = false,
}: {
  className?: string;
  dark?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/wordmark-ivory.png"
      alt="Beaumont"
      width={1500}
      height={500}
      priority={priority}
      className={cn("object-contain", dark && "invert", className)}
    />
  );
}

export function Monogram({
  size = 40,
  className,
  dark = false,
}: {
  size?: number;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Image
      src="/brand/monogram-ivory.png"
      alt="Beaumont"
      width={size}
      height={size}
      className={cn("object-contain", dark && "invert", className)}
    />
  );
}

/** Small uppercase label used above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold uppercase tracking-[0.25em] text-ochre",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "mt-3 font-display text-4xl leading-[1.05] md:text-5xl lg:text-[56px] font-normal tracking-tight",
          light ? "text-ivory" : "text-oak",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-5 text-lg",
            light ? "text-ivory/70" : "text-soil/70",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
