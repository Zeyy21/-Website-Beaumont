"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Suggestion {
  label: string;
  lat: number;
  lon: number;
}

interface GeocodeResponse {
  results?: Suggestion[];
  result?: Suggestion;
  error?: string;
}

/** Address autocomplete, explicit search, and browser geolocation. */
export function AddressSearch({
  onSelect,
  onInputChange,
  initialValue = "",
}: {
  onSelect: (s: Suggestion) => void;
  onInputChange?: (value: string) => void;
  initialValue?: string;
}) {
  const [q, setQ] = useState(initialValue);
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [active, setActive] = useState(-1);
  const [message, setMessage] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (term: string, signal?: AbortSignal) => {
    const clean = term.trim();
    if (clean.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(clean)}`, {
        signal,
        headers: { Accept: "application/json" },
      });
      const data = (await res.json()) as GeocodeResponse;
      if (!res.ok) throw new Error(data.error || "Address search is unavailable.");

      const next = data.results ?? [];
      setResults(next);
      setOpen(true);
      setActive(next.length ? 0 : -1);
      if (!next.length) setMessage("No matching address found. Try adding the city or postal code.");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setResults([]);
        setOpen(false);
        setMessage(error instanceof Error ? error.message : "Address search failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Search as the user pauses, while keeping the explicit search button useful.
  useEffect(() => {
    if (q.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    const ctrl = new AbortController();
    const id = window.setTimeout(() => search(q, ctrl.signal), 300);
    return () => {
      window.clearTimeout(id);
      ctrl.abort();
    };
  }, [q, search]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (suggestion: Suggestion) => {
    setQ(suggestion.label);
    setResults([]);
    setOpen(false);
    setMessage(null);
    onSelect(suggestion);
  };

  const locateByNetwork = async () => {
    try {
      setMessage("Using your network to estimate the nearest city…");
      const response = await fetch("https://ipapi.co/json/", {
        headers: { Accept: "application/json" },
      });
      const data = (await response.json()) as { latitude?: number; longitude?: number; city?: string; region?: string; country_code?: string };
      if (!response.ok || !Number.isFinite(data.latitude) || !Number.isFinite(data.longitude)) throw new Error("Network location unavailable");
      const fallback: Suggestion = {
        label: [data.city, data.region, data.country_code].filter(Boolean).join(", ") || "Your approximate area",
        lat: Number(data.latitude),
        lon: Number(data.longitude),
      };
      const reverse = await fetch(`/api/geocode?lat=${fallback.lat}&lon=${fallback.lon}`, { headers: { Accept: "application/json" } });
      const reverseData = (await reverse.json()) as GeocodeResponse;
      choose(reverse.ok && reverseData.result ? reverseData.result : fallback);
    } catch {
      setMessage("Location is blocked in this browser. Allow location for this site, or enter a Canadian postal code above.");
    } finally {
      setLocating(false);
    }
  };

  const locateMe = async () => {
    if (!("geolocation" in navigator)) {
      setLocating(true);
      await locateByNetwork();
      return;
    }

    setLocating(true);
    setMessage("Requesting location permission…");

    try {
      const permission = await navigator.permissions?.query({ name: "geolocation" });
      if (permission?.state === "denied") {
        await locateByNetwork();
        return;
      }
    } catch {
      // Some browsers do not expose geolocation through Permissions API.
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const fallback: Suggestion = {
          label: "Your approximate location",
          lat: coords.latitude,
          lon: coords.longitude,
        };
        try {
          const res = await fetch(
            `/api/geocode?lat=${encodeURIComponent(coords.latitude)}&lon=${encodeURIComponent(coords.longitude)}`,
            { headers: { Accept: "application/json" } },
          );
          const data = (await res.json()) as GeocodeResponse;
          choose(res.ok && data.result ? data.result : fallback);
        } catch {
          choose(fallback);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) void locateByNetwork();
        else {
          setLocating(false);
          setMessage("We could not determine your location. Enter a Canadian address or postal code instead.");
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <div ref={boxRef} className="relative">
      <label htmlFor="address" className="mb-2.5 block text-sm font-semibold text-oak">
        Home address
      </label>
      <div className="flex items-center gap-2 rounded-[1.15rem] border border-oak/20 bg-white/85 p-2 shadow-[0_12px_35px_-28px_rgba(29,23,15,.75)] transition focus-within:border-cinnamon focus-within:bg-white focus-within:ring-4 focus-within:ring-cinnamon/10">
        <svg viewBox="0 0 24 24" className="ml-2 h-5 w-5 shrink-0 text-cinnamon" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <input
          id="address"
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setMessage(null);
            onInputChange?.(event.target.value);
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((current) => Math.min(results.length - 1, current + 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((current) => Math.max(0, current - 1));
            }
            if (event.key === "Enter") {
              event.preventDefault();
              if (results.length) choose(results[Math.max(active, 0)]);
              else void search(q);
            }
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder="Street address or postal code"
          autoComplete="street-address"
          role="combobox"
          aria-expanded={open}
          aria-controls="address-results"
          className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base font-medium text-soil outline-none placeholder:font-normal placeholder:text-soil/35"
        />
        <button
          type="button"
          onClick={() => void search(q)}
          disabled={loading || q.trim().length < 3}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-[.85rem] bg-cinnamon px-4 text-sm font-semibold text-ivory shadow-[0_10px_25px_-15px_rgba(64,38,26,.9)] transition hover:bg-oak disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
        >
          {loading ? "Searching…" : <><span className="sm:hidden">Find</span><span className="hidden sm:inline">Find address</span></>}
        </button>
      </div>

      <button
        type="button"
        onClick={locateMe}
        disabled={locating}
        className="mt-3 inline-flex items-center gap-2 rounded-full px-1 py-2 text-xs font-semibold text-soil/60 transition hover:text-cinnamon disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
        </svg>
        {locating ? "Finding your area…" : "Use my current location"}
      </button>

      {message && (
        <p className="mt-3 text-sm font-medium text-soil/65" role="status">
          {message}
        </p>
      )}

      {open && results.length > 0 && (
        <ul id="address-results" className="absolute z-[500] mt-2 max-h-72 w-full overflow-auto rounded-[1.15rem] border border-oak/15 bg-white p-2 shadow-lift" role="listbox">
          {results.map((result, index) => (
            <li key={`${result.lat}-${result.lon}-${index}`} role="option" aria-selected={active === index}>
              <button
                type="button"
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(result)}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-soil transition-colors ${
                  active === index ? "bg-sand/55" : "hover:bg-sand/35"
                }`}
              >
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-cinnamon" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                  <path d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" />
                </svg>
                <span>{result.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
