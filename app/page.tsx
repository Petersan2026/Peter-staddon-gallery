import Link from "next/link";
import Image from "next/image";

import galleries from "../content/galleries/galleries.json";

type GalleryIndexItem = {
  slug: string;
  title: string;
  visibility: "public" | "private";
};

export default function HomePage() {
  const list = (galleries as GalleryIndexItem[]).filter(
    (g) => g.visibility === "public"
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-10">
        <header className="text-left">
          <h1 className="text-2xl font-semibold tracking-tight">Peter Staddon</h1>

          <p className="mt-3 max-w-2xl text-sm text-neutral-400">
            A static exhibition of landscape and macro work. Prints available by request.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {list.map((g) => (
              <Link
                key={g.slug}
                href={`/galleries/${g.slug}`}
                className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 hover:bg-neutral-900"
              >
                {g.title}
              </Link>
            ))}
          </div>
        </header>

        <div className="mt-10 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
          <Image
            src="/landing/statement.jpg"
            alt="Statement"
            width={2000}
            height={1200}
            className="h-auto w-full object-cover"
            priority
            unoptimized
          />
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-10 text-xs text-neutral-500">
        © {new Date().getFullYear()} Peter Staddon
      </footer>
    </main>
  );
}

