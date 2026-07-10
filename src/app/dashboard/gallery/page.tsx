import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { EmptyState } from "@/components/dashboard-ui";
import { BeforeAfter } from "@/components/before-after";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata() {
  return { title: getDict().dashboard.nav.gallery };
}

export default async function GalleryPage() {
  const t = getDict().dashboard.gallery;
  const user = await getCurrentUser();
  const data = user ? await getDashboardData(user.id) : null;
  const items = data?.gallery ?? [];

  if (items.length === 0) {
    return (
      <EmptyState
        title={t.noPhotosTitle}
        body={t.noPhotosBody}
        ctaHref="/quote"
        ctaLabel={t.bookFirst}
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((g) => (
        <BeforeAfter
          key={g.id}
          beforeUrl={g.before_url}
          afterUrl={g.after_url}
          caption={g.caption ?? undefined}
        />
      ))}
    </div>
  );
}
