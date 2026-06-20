import { CardTitle } from "@/components/dashboard-ui";
import { DoorTagGenerator } from "@/components/door-tag-generator";

export const metadata = { title: "Admin · Door Tags" };

export default function AdminDoorTags() {
  return (
    <div className="space-y-6">
      <div>
        <CardTitle>Door-tag program</CardTitle>
        <p className="mt-1 max-w-2xl text-sm text-soil/60">
          Generate premium QR door hangers per neighbourhood. Each tag deep-links
          into the instant-quote tool pre-tuned for that zone and is tracked, so
          you can measure the scan → quote → booking funnel. Generate, then print
          on heavyweight stock and die-cut the top notch.
        </p>
      </div>
      <DoorTagGenerator />
    </div>
  );
}
