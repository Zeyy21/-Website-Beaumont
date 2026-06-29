import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CardTitle } from "@/components/dashboard-ui";
import { GalleryAdminForm } from "@/components/gallery-admin-form";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata() {
  return { title: `${getDict().admin.settings.galleryTitle}${getDict().common.brandSuffix}` };
}

export default async function AdminGallery() {
  const t = getDict().admin.gallery;
  const supabase = createClient();
  if (!supabase) return null;

  const { data: items } = await supabase
    .from("gallery_items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(24);

  return (
    <div className="space-y-8">
      <GalleryAdminForm />

      <section>
        <CardTitle>{t.existingItems}</CardTitle>
        {!items?.length ? (
          <p className="mt-3 text-sm text-soil/50">{t.noItems}</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {items.map((g) => (
              <div
                key={g.id}
                className="overflow-hidden rounded-xl border border-oak/10 bg-white"
              >
                <div className="grid grid-cols-2">
                  <Image
                    src={g.before_url}
                    alt={t.before}
                    width={200}
                    height={150}
                    className="h-28 w-full object-cover"
                  />
                  <Image
                    src={g.after_url}
                    alt={t.after}
                    width={200}
                    height={150}
                    className="h-28 w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between p-3 text-sm">
                  <span className="truncate text-soil/70">
                    {g.caption ?? t.untitled}
                  </span>
                  {g.featured && (
                    <span className="rounded-full bg-cinnamon/10 px-2 py-0.5 text-xs text-cinnamon">
                      {t.featured}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
