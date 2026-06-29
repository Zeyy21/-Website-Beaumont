import Link from "next/link";
import { adminGate } from "@/lib/admin";
import { Monogram } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

const adminNav = [
  { href: "/admin", key: "inbox" },
  { href: "/admin/clients", key: "clients" },
  { href: "/admin/jobs", key: "jobs" },
  { href: "/admin/payments", key: "payments" },
  { href: "/admin/settings", key: "settings" },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = getDict();
  const tg = dict.admin.gate;
  const tn = dict.admin.nav;
  const gate = await adminGate();

  if (!gate.allowed) {
    const messages: Record<string, string> = {
      "no-backend": tg.noBackend,
      "signed-out": tg.signedOut,
      "not-staff": tg.notStaff,
    };
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory p-6">
        <div className="max-w-md rounded-2xl border border-ochre/30 bg-sand/30 p-8 text-center">
          <Monogram size={40} dark className="mx-auto" />
          <h1 className="mt-4 font-display text-2xl text-oak">{tg.staffOnly}</h1>
          <p className="mt-2 text-soil/70">
            {messages[gate.reason ?? "not-staff"]}
          </p>
          <div className="mt-5 flex justify-center gap-3 text-sm">
            <Link href="/" className="text-cinnamon hover:underline">
              {tg.home}
            </Link>
            {gate.reason === "signed-out" && (
              <Link href="/login?next=/admin" className="text-cinnamon hover:underline">
                {tg.signIn}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <header className="texture-soil text-ivory">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Monogram size={28} />
            <span className="font-display tracking-[0.18em]">
              BEAUMONT <span className="text-sand">{dict.common.brandSuffix}</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-1">
            {adminNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-2 text-sm text-ivory/70 transition-colors hover:bg-ivory/10 hover:text-ivory"
              >
                {tn[n.key]}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
