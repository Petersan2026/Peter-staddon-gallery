// app/landscapes/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import worksRaw from "../../content/galleries/landscapes.json";

type Work = {
  slug: string;
  location?: string;
};

const BG = "#121314"; // dark charcoal
const MAT = "#f3f2ee"; // warm off-white (same as landing)
const MAT_PAD = 5; // keep subtle, you already preferred this

export default function LandscapesPage() {
  const works = (worksRaw as Work[]).filter((w) => typeof w?.slug === "string" && w.slug.length > 0);

  const [activeIndex, setActiveIndex] = useState(0);

  // Transition: fade out -> brief pause -> fade in
  const [phase, setPhase] = useState<"showing" | "fadeOut" | "pause" | "fadeIn">("showing");
  const [displayIndex, setDisplayIndex] = useState(0);

  const [inspectOpen, setInspectOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const timers = useRef<number[]>([]);

  const display = works[displayIndex];

  const labelText = useMemo(() => {
    const location = (display?.location ?? "").trim();
    return ["Archival pigment print", "47 × 21 inches", "Edition of 12", location || " "].join("\n");
  }, [display?.location]);

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function goTo(index: number) {
    if (!works.length) return;
    if (inspectOpen) return; // stable; no changes while inspecting
    if (index === activeIndex) return;
    setActiveIndex(index);
  }

  // Transition on activeIndex change
  useEffect(() => {
    if (activeIndex === displayIndex) return;

    clearTimers();
    setPhase("fadeOut");

    timers.current.push(
      window.setTimeout(() => {
        setPhase("pause");

        timers.current.push(
          window.setTimeout(() => {
            setDisplayIndex(activeIndex);
            setPhase("fadeIn");

            timers.current.push(
              window.setTimeout(() => {
                setPhase("showing");
              }, 260)
            );
          }, 120)
        );
      }, 260)
    );

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // ESC closes overlays
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setInspectOpen(false);
        setDetailsOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!works.length) {
    return (
      <main style={{ minHeight: "100vh", background: BG, color: "#e9e9e9", padding: 24 }}>
        No works found. Check content/galleries/landscapes.json
      </main>
    );
  }

  const displaySrc = `/galleries/landscapes/${display.slug}/display.jpg`;
  const inspectSrc = `/galleries/landscapes/${display.slug}/inspect.jpg`;

  const opacity = phase === "fadeOut" || phase === "pause" ? 0 : 1;

  return (
    <main style={{ minHeight: "100vh", background: BG, color: "#e9e9e9" }}>
      {/* Header / Nav (hidden during inspection mode) */}
      <header
        style={{
          display: inspectOpen ? "none" : "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "18px 22px 8px 22px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div style={{ fontSize: 14, letterSpacing: 0.6 }}>Peter Staddon</div>

        <nav style={{ display: "flex", gap: 18, fontSize: 13 }}>
          <Link href="/landscapes" style={{ color: "inherit", textDecoration: "none" }}>
            Landscapes
          </Link>
          <Link href="/macro" style={{ color: "inherit", textDecoration: "none" }}>
            Macro
          </Link>
          <Link href="/about" style={{ color: "inherit", textDecoration: "none" }}>
            About
          </Link>
          <Link href="/contact" style={{ color: "inherit", textDecoration: "none" }}>
            Contact
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1600, margin: "0 auto", padding: "18px 22px 8px 22px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {/* Mat hugs image */}
          <div
            style={{
              position: "relative",
              background: MAT,
              padding: MAT_PAD,
              width: "min(1500px, 100%)",
              cursor: "zoom-in",
            }}
            onClick={() => setInspectOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Open inspection mode"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setInspectOpen(true);
            }}
          >
            <div
              style={{
                opacity,
                transition: "opacity 260ms linear",
              }}
            >
              {/* Use intrinsic sizing so the mat hugs the image height */}
              <img
                src={displaySrc}
                alt=""
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                }}
              />
            </div>

            {/* Always visible label, bottom-centered, inside image area */}
            <div
              style={{
                position: "absolute",
                left: MAT_PAD,
                right: MAT_PAD,
                bottom: MAT_PAD + 10,
                textAlign: "center",
                fontSize: 12,
                lineHeight: 1.35,
                letterSpacing: 0.2,
                color: "rgba(245,245,240,0.92)",
                mixBlendMode: "difference",
                pointerEvents: "none",
                userSelect: "none",
                whiteSpace: "pre-line",
                padding: "0 18px",
              }}
            >
              {labelText}
            </div>

            {/* Print details link (separate from inspection; no layout shift) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDetailsOpen(true);
              }}
              style={{
                position: "absolute",
                right: MAT_PAD + 10,
                bottom: MAT_PAD + 10,
                background: "transparent",
                border: "none",
                color: "rgba(20,20,20,0.55)",
                fontSize: 12,
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
              aria-label="Open print details"
            >
              Print details
            </button>
          </div>
        </div>

        {/* Thumbnail strip (centered row, wraps, no scroll, no borders) */}
        {!inspectOpen && (
          <div
            style={{
              maxWidth: 1400,
              margin: "18px auto 22px auto",
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {works.map((w, i) => {
              const thumbSrc = `/galleries/landscapes/${w.slug}/display.jpg`;
              const isActive = i === activeIndex;

              return (
                <button
                  key={w.slug}
                  type="button"
                  onClick={() => goTo(i)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    opacity: isActive ? 1 : 0.65,
                  }}
                  aria-label={`View ${w.slug}`}
                >
                  <img
                    src={thumbSrc}
                    alt=""
                    style={{
                      display: "block",
                      height: 64,
                      width: 96,
                      objectFit: "contain",
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Inspection mode overlay (no header/nav/label) */}
      {inspectOpen && (
        <div
          onClick={() => setInspectOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Exit inspection mode"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setInspectOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: BG,
            zIndex: 50,
            cursor: "zoom-out",
          }}
        >
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src={inspectSrc}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </div>
        </div>
      )}

      {/* Print details modal */}
      {detailsOpen && (
        <div
          onClick={() => setDetailsOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close print details"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setDetailsOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 22,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              width: "min(560px, 100%)",
              background: "#151617",
              borderRadius: 10,
              padding: "18px 18px 16px 18px",
              color: "rgba(233,233,233,0.9)",
            }}
          >
            <div style={{ fontSize: 13, letterSpacing: 0.4, marginBottom: 10 }}>
              Print details
            </div>

            <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(233,233,233,0.8)" }}>
              <div>Archival pigment print</div>
              <div>47 × 21 inches</div>
              <div>Edition of 12</div>
              <div style={{ marginTop: 10, color: "rgba(233,233,233,0.7)" }}>
                For print options, contact via the Contact page.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDetailsOpen(false)}
              style={{
                marginTop: 14,
                background: "transparent",
                border: "1px solid rgba(233,233,233,0.25)",
                color: "rgba(233,233,233,0.85)",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
