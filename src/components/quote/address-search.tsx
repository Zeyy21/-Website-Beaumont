"use client";

import { useEffect, useRef, useState } from "react";

interface Suggestion {
  label: string;
  lat: number;
  lon: number;
}

/**
 * Debounced address autocomplete backed by /api/geocode (Photon → Nominatim).
 * Selecting a result reports the address + coordinates up to the parent.
 */
export function AddressSearch({
  onSelect,
  initialValue = "",
}: {
  onSelect: (s: Suggestion) => void;
  initialValue?: string;
}) {
  const [q, setQ] = useState(initialValue);
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // debounce queries
  useEffect(() => {
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const data = (await res.json()) as { results: Suggestion[] };
        setResults(data.results ?? []);
        setOpen(true);
        setActive(-1);
      } catch {
        /* aborted or offline */
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      clearTimeout(id);
      ctrl.abort();
    };
  }, [q]);

  // close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (s: Suggestion) => {
    setQ(s.label);
    setOpen(false);
    onSelect(s);
  };

  return (
    <div ref={boxRef} className="relative">
      <label htmlFor="address" className="sr-only">
        Property address
      </label>
      <div className="flex items-center gap-3 rounded-full border border-oak/20 bg-white px-5 py-3 focus-within:border-ochre">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ochre" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <input
          id="address"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown")
              setActive((a) => Math.min(results.length - 1, a + 1));
            if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
            if (e.key === "Enter" && active >= 0) {
              e.preventDefault();
              choose(results[active]);
            }
          }}
          placeholder="Enter your address…"
          autoComplete="off"
          className="w-full bg-transparent text-soil outline-none placeholder:text-soil/40"
        />
        {loading && (
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-ochre border-t-transparent" />
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-oak/15 bg-white p-2 shadow-lift">
          {results.map((r, i) => (
            <li key={`${r.lat}-${r.lon}-${i}`}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(r)}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  active === i ? "bg-sand/40" : "hover:bg-sand/30"
                }`}
              >
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-ochre" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" />
                </svg>
                <span className="text-soil/80">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
