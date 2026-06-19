import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CardTitle } from "@/components/dashboard-ui";
import { GalleryAdminForm } from "@/components/gallery-admin-form";

export const metadata = { title: "Admin · Gallery" };

export default async function AdminGallery() {
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
        <CardTitle>Existing items</CardTitle>
        {!items?.length ? (
          <p className="mt-3 text-sm text-soil/50">No gallery items yet.</p>
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
                    alt="Before"
                    width={200}
                    height={150}
                    className="h-28 w-full object-cover"
                  />
                  <Image
                    src={g.after_url}
                    alt="After"
                    width={200}
                    height={150}
                    className="h-28 w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between p-3 text-sm">
                  <span className="truncate text-soil/70">
                    {g.caption ?? "Untitled"}
                  </span>
                  {g.featured && (
                    <span className="rounded-full bg-cinnamon/10 px-2 py-0.5 text-xs text-cinnamon">
                      Featured
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
