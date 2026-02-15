"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";

import galleries from "../../../content/galleries/galleries.json";
import landscapes from "../../../content/galleries/landscapes.json";
import private1 from "../../../content/galleries/private-1.json";

type GalleryIndexItem = {
  slug: string;
  title: string;
  visibility: "public" | "private";
};

type Work = {
  slug: string;
  location?: string;
};

type WorkResolved = {
  slug: string;
  location: string;
  displaySrc: string;
  inspectSrc: string;
};

const WORKS_BY_SLUG: Record<string, Work[]> = {
  landscapes: landscapes as Work[],
  "private-1": private1 as Work[],
};

function clampIndex(n: number, len: number) {
  if (len <= 0) return 0;
  if (n < 0) return 0;
  if (n > len - 1) return len - 1;
  return n;
}

export default function GalleryClient() {
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug ?? "");

  const gallery = useMemo(() => {
    const list = galleries as GalleryIndexItem[];
    return list.find((g) => g.slug === slug) ?? null;
  }, [slug]);

  if (!gallery) notFound();

  const worksResolved = useMemo<WorkResolved[]>(() => {
    const works = WORKS_BY_SLUG[slug];
    if (!works || works.length === 0) return [];

    return works.map((w) => {
      const workSlug = String(w.slug);
      const location = String(w.location ?? "");
      return {
        slug: workSlug,
        location,
        displaySrc: `/galleries/${slug}/${workSlug}/display.jpg`,
        inspectSrc: `/galleries/${slug}/${workSlug}/inspect.jpg`,
      };
    });
  }, [slug]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isInspectOpen, setIsInspectOpen] = useState(false);

  const active =
    worksResolved[clampIndex(activeIndex, worksResolved.length)] ?? null;

  useEffect(() => {
    setActiveIndex((prev) => clampIndex(prev, worksResolved.length));
  }, [worksResolved.length]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsInspectOpen(false);

      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => clampIndex(prev - 1, worksResolved.length));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => clampIndex(prev + 1, worksResolved.length));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [worksResolved.length]);

  function selectWork(nextIndex: number) {
    const idx = clampIndex(nextIndex, worksResolved.length);
    if (idx === activeIndex) return;

    setIsFading(true);
    window.setTimeout(() => {
      setActiveIndex(idx);
      window.setTimeout(() => setIsFading(false), 220);
    }, 220);
  }

  if (!active) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-200">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-2xl font-semibold">{gallery.title}</h1>
          <p className="mt-4 text-neutral-400">No works found for this gallery.</p>
        </div>
      </main>
    );
  }

  const labelText = active.location?.trim()
    ? active.location.trim()
    : gallery.title;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="mx-auto max-w-6xl px-6 pt-10 pb-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold tracking-tight">{gallery.title}</h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsInspectOpen(true)}
              className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-900"
            >
              Inspect
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-lg bg-neutral-900">
          <div className="relative flex items-center justify-center px-6 py-10 md:px-10 md:py-14">
            <div className="relative w-full" style={{ maxWidth: 1400 }}>
              <div
                className="relative w-full overflow-hidden rounded-md bg-neutral-950"
                style={{ aspectRatio: "3 / 2" }}
              >
                <Image
                  src={active.displaySrc}
                  alt={labelText}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-contain"
                  priority
                  unoptimized
                />

                <div
                  className="pointer-events-none absolute inset-0 bg-neutral-950 transition-opacity duration-200"
                  style={{ opacity: isFading ? 1 : 0 }}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0">
                  <div
                    className="h-20"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.00))",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-3 flex justify-center px-4">
                    <div
                      className="max-w-[90%] rounded-full px-3 py-1 text-center text-sm text-neutral-50"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(6px)",
                        WebkitBackdropFilter: "blur(6px)",
                        boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
                        textShadow: "0 1px 2px rgba(0,0,0,0.75)",
                      }}
                    >
                      {labelText}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 bg-neutral-950/60 px-4 py-4">
            <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 overflow-x-auto">
              {worksResolved.map((w, i) => {
                const isActiveThumb = i === activeIndex;
                return (
                  <button
                    key={w.slug}
                    type="button"
                    onClick={() => selectWork(i)}
                    className="relative shrink-0 rounded-md"
                    aria-label={`Select work ${i + 1}`}
                  >
                    <div
                      className="relative h-16 w-24 overflow-hidden rounded-md bg-neutral-900"
                      style={{
                        outline: isActiveThumb
                          ? "2px solid rgba(255,255,255,0.55)"
                          : "1px solid rgba(255,255,255,0.12)",
                        outlineOffset: 2,
                      }}
                    >
                      <Image
                        src={w.displaySrc}
                        alt={w.location || w.slug}
                        fill
                        sizes="96px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-neutral-500">
        Use arrow keys to navigate. ESC closes inspect.
      </footer>

      {isInspectOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close inspect"
            onClick={() => setIsInspectOpen(false)}
          />

          {/* Modal */}
          <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
            <div className="relative w-full overflow-hidden rounded-lg bg-neutral-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
                <div className="text-sm text-neutral-200">{labelText}</div>
                <button
                  type="button"
                  onClick={() => setIsInspectOpen(false)}
                  className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-900"
                >
                  Close
                </button>
              </div>

              <div className="relative w-full" style={{ aspectRatio: "3 / 2" }}>
                <Image
                  src={active.inspectSrc}
                  alt={`Inspect: ${labelText}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1400px"
                  className="object-contain"
                  unoptimized
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
