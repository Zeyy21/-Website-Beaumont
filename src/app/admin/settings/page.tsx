import { Card, CardTitle } from "@/components/dashboard-ui";
import { ButtonLink } from "@/components/ui";

export const metadata = { title: "Admin - Settings" };

const tools = [
  {
    href: "/admin/gallery",
    title: "Marketing gallery",
    body: "Manage before-and-after images shown on the public site.",
  },
  {
    href: "/admin/door-tags",
    title: "Door tag QR codes",
    body: "Generate outreach QR codes and landing links for field marketing.",
  },
  {
    href: "/admin/pricing",
    title: "Pricing config",
    body: "Legacy pricing knobs. Use this only if you intentionally bring formula pricing back.",
  },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <CardTitle>Settings</CardTitle>
        <p className="mt-1 max-w-2xl text-sm text-soil/60">
          Less-used admin tools live here. Daily support work should happen in
          Inbox, Clients, Jobs, and Payments.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.href}>
            <h2 className="font-display text-2xl text-oak">{tool.title}</h2>
            <p className="mt-2 min-h-12 text-sm text-soil/60">{tool.body}</p>
            <ButtonLink href={tool.href} size="sm" variant="outline" className="mt-5">
              Open
            </ButtonLink>
          </Card>
        ))}
      </section>

      <Card>
        <CardTitle>Staff access</CardTitle>
        <p className="mt-3 text-sm text-soil/65">
          New signups are customers by default. Grant staff access manually in
          Supabase by setting <code>public.profiles.role</code> to{" "}
          <code>staff</code> for a verified account.
        </p>
      </Card>
    </div>
  );
}
