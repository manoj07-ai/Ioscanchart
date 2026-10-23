import { notFound } from "next/navigation";
import { DesignGallery } from "./DesignGallery";

/**
 * Dev-only design system gallery.
 * In production builds, this route returns 404.
 */
export default function DevDesignPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <DesignGallery />;
}
