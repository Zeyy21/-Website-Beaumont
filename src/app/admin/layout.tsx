import Link from "next/link";
import { adminGate } from "@/lib/admin";
import { Monogram } from "@/components/ui";

const adminNav = [
  { href: "/admin", label: "Requests" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/pricing", label: "Pricing" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/door-tags", label: "Door Tags" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gate = await adminGate();

  if (!gate.allowed) {
    const messages: Record<string, string> = {
      "no-backend":
        "Connect Supabase to enable the staff admin panel (see README).",
      "signed-out": "Please sign in with a staff account to access admin.",
      "not-staff":
        "This area is for Beaumont staff. Your account doesn't have admin access.",
    };
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory p-6">
        <div className="max-w-md rounded-2xl border border-ochre/30 bg-sand/30 p-8 text-center">
          <Monogram size={40} dark className="mx-auto" />
          <h1 className="mt-4 font-display text-2xl text-oak">Staff only</h1>
          <p className="mt-2 text-soil/70">
            {messages[gate.reason ?? "not-staff"]}
          </p>
          <div className="mt-5 flex justify-center gap-3 text-sm">
            <Link href="/" className="text-cinnamon hover:underline">
              Home
            </Link>
            {gate.reason === "signed-out" && (
              <Link href="/login?next=/admin" className="text-cinnamon hover:underline">
                Sign in
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Monogram size={28} />
            <span className="font-display tracking-[0.18em]">
              BEAUMONT <span className="text-sand">· Admin</span>
            </span>
          </Link>
          <nav className="flex gap-1">
            {adminNav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-2 text-sm text-ivory/70 transition-colors hover:bg-ivory/10 hover:text-ivory"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
