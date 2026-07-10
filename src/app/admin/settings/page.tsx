import { Card, CardTitle } from "@/components/dashboard-ui";
import { ButtonLink } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata() {
  return { title: `${getDict().admin.settings.title}${getDict().common.brandSuffix}` };
}

export default function AdminSettingsPage() {
  const t = getDict().admin.settings;
  const tools = [
    { href: "/admin/gallery", title: t.galleryTitle, body: t.galleryDescription },
    { href: "/admin/door-tags", title: t.doorTagTitle, body: t.doorTagDescription },
    { href: "/admin/pricing", title: t.pricingTitle, body: t.pricingDescription },
  ];
  return (
    <div className="space-y-8">
      <div>
        <CardTitle>{t.title}</CardTitle>
        <p className="mt-1 max-w-2xl text-sm text-soil/60">
          {t.description}
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.href}>
            <h2 className="font-display text-2xl text-oak">{tool.title}</h2>
            <p className="mt-2 min-h-12 text-sm text-soil/60">{tool.body}</p>
            <ButtonLink href={tool.href} size="sm" variant="outline" className="mt-5">
              {t.open}
            </ButtonLink>
          </Card>
        ))}
      </section>

      <Card>
        <CardTitle>{t.staffAccess}</CardTitle>
        <p className="mt-3 text-sm text-soil/65">
          {t.staffAccessBody}
        </p>
      </Card>
    </div>
  );
}
