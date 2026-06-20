"use client";

import { useState, useTransition } from "react";
import { addGalleryItem } from "@/app/admin/actions";
import { Button } from "@/components/ui";
import { Card } from "@/components/dashboard-ui";
import { BeforeAfter } from "@/components/before-after";

/** Add a before/after gallery item by URL, with a live preview. */
export function GalleryAdminForm() {
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [caption, setCaption] = useState("");
  const [featured, setFeatured] = useState(true);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const submit = () =>
    start(async () => {
      const res = await addGalleryItem({
        before_url: before,
        after_url: after,
        caption,
        featured,
      });
      if (res.ok) {
        setMsg("Added ✓");
        setBefore("");
        setAfter("");
        setCaption("");
      } else setMsg(res.error ?? "Failed");
    });

  return (
    <Card>
      <h3 className="text-lg text-oak">Add before / after</h3>
      <p className="mt-1 text-sm text-soil/60">
        Paste image URLs (from Supabase Storage <code>gallery</code> bucket or
        elsewhere). Featured items show on the public site.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Input label="Before URL" value={before} onChange={setBefore} />
        <Input label="After URL" value={after} onChange={setAfter} />
      </div>
      <Input label="Caption" value={caption} onChange={setCaption} />
      <label className="mt-3 flex items-center gap-2 text-sm text-soil/70">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 accent-cinnamon"
        />
        Feature on public site
      </label>

      {(before || after) && (
        <div className="mt-5">
          <BeforeAfter beforeUrl={before} afterUrl={after} caption={caption} />
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <Button size="sm" onClick={submit} disabled={pending || !before || !after}>
          {pending ? "Adding…" : "Add item"}
        </Button>
        {msg && <span className="text-sm text-green-700">{msg}</span>}
      </div>
    </Card>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="mt-3 block">
      <span className="mb-1 block text-sm text-soil/60">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://…"
        className="w-full rounded-xl border border-oak/20 bg-white px-3 py-2 text-soil outline-none focus:border-ochre"
      />
    </label>
  );
}
