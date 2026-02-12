import galleries from "../../../content/galleries/galleries.json";
import GalleryClient from "./GalleryClient";

type GalleryIndexItem = {
  slug: string;
  title: string;
  visibility: "public" | "private";
};

export function generateStaticParams() {
  const list = galleries as GalleryIndexItem[];
  return list
    .filter((g) => g.visibility === "public")
    .map((g) => ({ slug: g.slug }));
}

// Needed for private galleries to exist (middleware will gate them later)
export const dynamicParams = true;

export default function GalleryPage() {
  return <GalleryClient />;
}
