import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Import JSON directly (works in middleware/edge)
import galleriesIndex from "./content/galleries/galleries.json";

type GalleryIndexEntry = {
  slug: string;
  title: string;
  visibility: "public" | "private";
};

const COOKIE_NAME = "psg_unlocked"; // simple: "all" or comma-separated slugs

function getGalleryVisibility(slug: string): "public" | "private" | "unknown" {
  const list = galleriesIndex as GalleryIndexEntry[];
  const entry = list.find((g) => g.slug === slug);
  return entry?.visibility ?? "unknown";
}

function isUnlocked(req: NextRequest, slug: string): boolean {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;

  if (cookie === "all") return true;

  // comma-separated slugs
  const unlocked = cookie
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return unlocked.includes(slug);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate /galleries/<slug> (and deeper paths, if any)
  // Match: /galleries/foo   or  /galleries/foo/anything
  const match = pathname.match(/^\/galleries\/([^\/]+)(\/.*)?$/);
  if (!match) return NextResponse.next();

  const slug = match[1];

  const visibility = getGalleryVisibility(slug);

  // Unknown slugs: let your normal route handling decide (likely 404 anyway)
  if (visibility === "unknown") return NextResponse.next();

  // Public: never block
  if (visibility === "public") return NextResponse.next();

  // Private: require unlock cookie
  if (isUnlocked(req, slug)) return NextResponse.next();

  // HARD 404 (not a redirect, not a rewrite). This is what you asked for.
  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: ["/galleries/:path*"],
};
