import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPhotoBySlug, getAdjacentPhotos, getAllPhotos } from "@/lib/photos";
import { getPhotoUrl, getSrcSet, getSizes, formatDate } from "@/lib/images";
import LetterLayout from "@/components/LetterLayout";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPhotos().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);
  if (!photo) return { title: "未找到" };
  return {
    title: photo.title,
    description: photo.story?.slice(0, 160) || photo.title,
  };
}

export default async function PhotoDetailPage({ params }: Props) {
  const { slug } = await params;
  const photo = getPhotoBySlug(slug);
  if (!photo) notFound();

  const all = getAllPhotos();
  const frameIndex = all.findIndex((p) => p.slug === slug);
  const frameNo = String(frameIndex + 1).padStart(2, "0");
  const frameTotal = String(all.length).padStart(2, "0");
  const { prev, next } = getAdjacentPhotos(slug);

  return (
    <article>
      {/* Large photo with Polaroid frame — static (no rotation/hover) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-4">
        <div className="polaroid-static">
          <img
            src={getPhotoUrl(photo.image, 1200)}
            srcSet={getSrcSet(photo.image)}
            sizes="(max-width: 900px) 100vw, 1200px"
            alt={photo.title}
            width={1200}
            height={800}
          />
          <div className="caption">
            <div className="title">{photo.title}</div>
            <div className="meta">
              {photo.location && `${photo.location} · `}
              {formatDate(photo.date)}
            </div>
            {photo.camera && (
              <div className="exif">
                {photo.camera}
                {photo.lens ? ` · ${photo.lens}` : ""}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story in letter format */}
      {photo.story && (
        <LetterLayout
          greeting="见信好，"
          closing={
            <>
              {photo.location && (
                <>
                  摄于 {photo.location}
                  <br />
                </>
              )}
              {photo.camera && (
                <>
                  {photo.camera}
                  {photo.lens ? ` + ${photo.lens}` : ""}
                  <br />
                </>
              )}
              {photo.date}
            </>
          }
        >
          <p>{photo.story}</p>
        </LetterLayout>
      )}

      {/* Prev / Next navigation — frame counter */}
      <nav className="photo-nav">
        {prev ? (
          <Link href={`/photo/${prev.slug}`} className="nav-btn">
            &larr; {prev.title}
          </Link>
        ) : (
          <span className="nav-btn empty">&larr;</span>
        )}
        <span className="frame-counter">
          {frameNo} <span className="total">/ {frameTotal}</span>
        </span>
        {next ? (
          <Link href={`/photo/${next.slug}`} className="nav-btn">
            {next.title} &rarr;
          </Link>
        ) : (
          <span className="nav-btn empty">&rarr;</span>
        )}
      </nav>
    </article>
  );
}
