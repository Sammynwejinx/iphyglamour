import Link from 'next/link';
import Image from 'next/image';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';

export default async function HomePage() {
  const products = await getAllProducts();
  const featured = products.filter((p) => (p.tags || []).includes('Featured')).slice(0, 4);
  const shown = featured.length ? featured : products.slice(0, 4);

  return (
    <div>
      <section className="grid md:grid-cols-2 items-center max-w-6xl mx-auto px-5 pt-10 md:pt-16 gap-10">
        <div>
          <p className="font-display text-3xl md:text-5xl leading-tight text-ink">
            Style made to stand out
          </p>
          <p className="mt-5 text-ink/70 max-w-md">
            Beautifully crafted women&apos;s fashion, made to express your individuality — cut to your
            exact measurements, not a rack size.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop" className="bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors">
              Shop the collection
            </Link>
            <Link href="/measurements" className="border border-ink px-6 py-3 text-sm hover:border-magenta hover:text-magenta transition-colors">
              Book a measurement
            </Link>
          </div>
        </div>
        <div className="aspect-[4/5] rounded-sm overflow-hidden relative">
          <Image src="/hero.jpeg" alt="IPHYGLAMOUR hero look" fill className="object-cover" priority />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 mt-20 md:mt-28">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Featured collection</h2>
          <Link href="/shop" className="text-sm text-magenta hover:text-magentadeep">
            See more
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 mt-24 mb-10 grid md:grid-cols-2 gap-10 items-center">
        <div className="aspect-[4/3] rounded-sm overflow-hidden order-2 md:order-1 relative">
          <Image src="/hero2.jpeg" alt="Made-to-measure fitting" fill className="object-cover" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="font-display text-2xl text-ink mb-3">No sizes. Just your measurements.</h2>
          <p className="text-ink/70 max-w-sm">
            Every IPHYGLAMOUR piece is made to fit you, not the other way around. Send your
            measurements, book a fitting appointment, or talk to us directly on WhatsApp.
          </p>
        </div>
      </section>
    </div>
  );
}