import { getCurrentUser } from "@/lib/data";
import { getDashboardData } from "@/lib/dashboard";
import { EmptyState } from "@/components/dashboard-ui";
import { BeforeAfter } from "@/components/before-after";

export const metadata = { title: "My Gallery" };

export default async function GalleryPage() {
  const user = await getCurrentUser();
  const data = user ? await getDashboardData(user.id) : null;
  const items = data?.gallery ?? [];

  if (items.length === 0) {
    return (
      <EmptyState
        title="No photos yet"
        body="After your first clean, we'll post before & after photos of your home here."
        ctaHref="/quote"
        ctaLabel="Book your first clean"
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
