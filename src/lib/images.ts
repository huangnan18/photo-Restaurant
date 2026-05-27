function slugFromPath(imagePath: string): string {
  const base = imagePath.split("/").pop() || "";
  return base.replace(/\.[^.]+$/, "");
}

export function getPhotoUrl(
  imagePath: string,
  width: number = 800,
  format: "webp" | "jpg" = "webp"
): string {
  const slug = slugFromPath(imagePath);
  return `/images/${slug}-${width}w.${format}`;
}

export function getSrcSet(imagePath: string): string {
  return [400, 800, 1200]
    .map((w) => `${getPhotoUrl(imagePath, w)} ${w}w`)
    .join(", ");
}

export function getSizes(): string {
  return "(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw";
}

export function getLQIP(_imagePath: string): string {
  return "";
}

export function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  return `${year}.${parseInt(month, 10)}`;
}
