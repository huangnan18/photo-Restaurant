import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SIZES = [400, 800, 1200, 2400];
const PHOTOS_PATH = path.join(ROOT, "content", "photos.json");
const ORIGINALS_DIR = path.join(ROOT, "originals");
const LQIP_MAP_PATH = path.join(ROOT, "src", "lib", "lqip.json");

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.warn("[WARN] R2 credentials not set. To enable R2 upload, set:");
  console.warn("  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME");
  console.warn("[INFO] Continuing without R2 upload — images will not be uploaded.\n");
}

const r2 = R2_ACCOUNT_ID
  ? new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

async function uploadToR2(key, body, contentType) {
  if (!r2) return;
  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );
  } catch (err) {
    console.error(`[ERROR] R2 upload failed for ${key}:`, err.message);
  }
}

async function main() {
  const photos = JSON.parse(fs.readFileSync(PHOTOS_PATH, "utf-8"));
  const lqipMap = {};

  for (const photo of photos) {
    const srcPath = path.join(ORIGINALS_DIR, photo.image);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[WARN] Original not found: ${srcPath}, skipping`);
      continue;
    }

    const slug = photo.slug;
    const image = sharp(srcPath);

    // Generate LQIP
    const lqipBuffer = await image
      .clone()
      .resize(20)
      .jpeg({ quality: 20 })
      .toBuffer();
    lqipMap[photo.image] = `data:image/jpeg;base64,${lqipBuffer.toString("base64")}`;

    // Generate multi-size WebP + JPEG and upload to R2
    for (const width of SIZES) {
      const webpBuf = await image.clone().resize(width).webp({ quality: 80 }).toBuffer();
      const jpgBuf = await image.clone().resize(width).jpeg({ quality: 82, progressive: true }).toBuffer();

      await uploadToR2(`images/${slug}-${width}w.webp`, webpBuf, "image/webp");
      await uploadToR2(`images/${slug}-${width}w.jpg`, jpgBuf, "image/jpeg");
    }

    console.log(`[OK] ${slug}`);
  }

  fs.writeFileSync(LQIP_MAP_PATH, JSON.stringify(lqipMap, null, 2));
  console.log(`[DONE] Processed ${photos.length} photos, LQIP map written`);
}

main().catch(console.error);
