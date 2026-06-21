import type { ReactNode } from "react";

export function Reveal({ children, className }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return <div className={className}>{children}</div>;
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
