import Link from "next/link";
import { Monogram } from "@/components/ui";
import { site } from "@/lib/config";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* brand panel */}
      <div className="texture-soil relative hidden flex-col justify-between p-12 text-ivory lg:flex">
        <Link href="/" className="flex items-center gap-3">
          <Monogram size={36} />
          <span className="font-display text-xl tracking-[0.18em]">BEAUMONT</span>
        </Link>
        <div>
          <h1 className="max-w-md font-display text-5xl leading-tight">
            Your home, returned to quiet perfection.
          </h1>
          <p className="mt-5 max-w-sm text-ivory/60">{site.promise}</p>
        </div>
        <p className="text-sm text-ivory/40">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>

      {/* form panel */}
      <div className="flex items-center justify-center bg-ivory p-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center gap-3 lg:hidden"
          >
            <Monogram size={32} dark />
            <span className="font-display text-lg tracking-[0.18em] text-oak">
              BEAUMONT
            </span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
