// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f1011",
        color: "#e9e9e9",
      }}
    >
      <header
        style={{
          display: "flex",
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

      <section
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          padding: "18px 22px 28px 22px",
        }}
      >
        {/* Mat hugs image (no forced viewport height) */}
        <div
          style={{
            background: "#f0efea", // warm off-white mat
            padding: 5, // thin border
            width: "min(1500px, 100%)",
            margin: "0 auto",
          }}
        >
          <Image
            src="/landing/statement.jpg"
            alt=""
            width={6858}
            height={3064}
            priority
            sizes="(max-width: 1500px) 100vw, 1500px"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </section>
    </main>
  );
}
