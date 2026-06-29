import { CardTitle } from "@/components/dashboard-ui";
import { DoorTagGenerator } from "@/components/door-tag-generator";
import { getDict } from "@/lib/i18n/server";

export function generateMetadata() {
  return { title: `${getDict().admin.settings.doorTagTitle}${getDict().common.brandSuffix}` };
}

export default function AdminDoorTags() {
  const t = getDict().admin.doorTags;
  return (
    <div className="space-y-6">
      <div>
        <CardTitle>{t.title}</CardTitle>
        <p className="mt-1 max-w-2xl text-sm text-soil/60">
          {t.description}
        </p>
      </div>
      <DoorTagGenerator />
    </div>
  );
}
