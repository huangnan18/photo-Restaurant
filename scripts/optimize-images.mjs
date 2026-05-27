import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SIZES = [400, 800, 1200, 2400];
const PHOTOS_PATH = path.join(ROOT, "content", "photos.json");
const ORIGINALS_DIR = path.join(ROOT, "originals");
const OUTPUT_DIR = path.join(ROOT, "public", "images");
const LQIP_MAP_PATH = path.join(ROOT, "src", "lib", "lqip.json");

async function main() {
  const photos = JSON.parse(fs.readFileSync(PHOTOS_PATH, "utf-8"));
  const lqipMap = {};

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  let processed = 0;

  for (const photo of photos) {
    const srcPath = path.join(ORIGINALS_DIR, photo.image);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[WARN] Original not found: ${srcPath}, skipping`);
      continue;
    }

    const slug = photo.slug;
    const image = sharp(srcPath);

    // LQIP placeholder
    const lqipBuffer = await image
      .clone()
      .resize(20)
      .jpeg({ quality: 20 })
      .toBuffer();
    lqipMap[photo.image] = `data:image/jpeg;base64,${lqipBuffer.toString("base64")}`;

    // Multi-size WebP + JPEG
    for (const width of SIZES) {
      await image.clone().resize(width).webp({ quality: 80 })
        .toFile(path.join(OUTPUT_DIR, `${slug}-${width}w.webp`));
      await image.clone().resize(width).jpeg({ quality: 82, progressive: true })
        .toFile(path.join(OUTPUT_DIR, `${slug}-${width}w.jpg`));
    }

    processed++;
    console.log(`[OK] ${slug}`);
  }

  fs.writeFileSync(LQIP_MAP_PATH, JSON.stringify(lqipMap, null, 2));
  console.log(`[DONE] Processed ${processed} photos, LQIP map written`);
}

main().catch(console.error);
