import ImagePlaceholder from '@/components/ImagePlaceholder';

export const metadata = { title: 'Gallery — IPHYGLAMOUR' };

const spots = [
  { label: 'Full-length dress', tall: true },
  { label: 'Showroom', tall: false },
  { label: 'Two-piece set', tall: false },
  { label: 'Fabric detail', tall: true },
  { label: 'Statement piece', tall: false },
  { label: 'Fitting session', tall: true },
  { label: 'Occasion wear', tall: false },
  { label: 'Behind the scenes', tall: false }
];

export default function GalleryPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <h1 className="font-display text-3xl text-ink mb-2">Gallery</h1>
      <p className="text-ink/60 text-sm mb-8">Finished garments, fittings, and the studio — replace with real photos any time.</p>
      <div className="columns-2 md:columns-3 gap-5">
        {spots.map((s, i) => (
          <div key={i} className={`mb-5 rounded-sm overflow-hidden break-inside-avoid ${s.tall ? 'aspect-[3/4]' : 'aspect-square'}`}>
            <ImagePlaceholder label={s.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
