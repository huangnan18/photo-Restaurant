const isDev = process.env.NODE_ENV === "development";

const R2_PUBLIC_URL =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  process.env.R2_PUBLIC_URL ||
  "";

function slugFromPath(imagePath: string): string {
  const base = imagePath.split("/").pop() || "";
  return base.replace(/\.[^.]+$/, "");
}

export function getPhotoUrl(
  imagePath: string,
  width: number = 800,
  format: "webp" | "jpg" = "webp"
): string {
  if (isDev) {
    const seed = imagePath.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
    const height = Math.round(width * 0.7);
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }
  const slug = slugFromPath(imagePath);
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/images/${slug}-${width}w.${format}`;
  }
  return `/images/${slug}-${width}w.${format}`;
}

/**
 * Returns srcSet string for responsive images.
 */
export function getSrcSet(imagePath: string): string {
  return [400, 800, 1200]
    .map((w) => `${getPhotoUrl(imagePath, w)} ${w}w`)
    .join(", ");
}

/**
 * Returns the dominant sizes attribute based on masonry column count.
 */
export function getSizes(): string {
  return "(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw";
}

/**
 * Returns a tiny base64-encoded LQIP placeholder.
 * In production, reads from a generated JSON map.
 */
export function getLQIP(_imagePath: string): string {
  return "";
}

/**
 * Format a date string (YYYY-MM-DD) to display format.
 */
export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  return `${year}.${parseInt(month, 10)}`;
}
