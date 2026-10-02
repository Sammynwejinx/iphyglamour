import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';
import AddToCartForm from '@/components/AddToCartForm';
import { getProductBySlug } from '@/lib/products';
export const dynamic = 'force-dynamic';
import { formatNaira } from '@/lib/placeholderProducts';

export default async function ProductPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();
  const images = product.image_urls?.length ? product.image_urls : product.image_url ? [product.image_url] : [];

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-ink/70 hover:text-magenta transition-colors mb-6">
        ← Back to Shop
      </Link>
      <div className="grid md:grid-cols-2 gap-10 md:gap-14">
        <ProductGallery images={images} label={product.name} />
        <div>
          <p className="text-xs uppercase tracking-wide text-magenta mb-2">{product.category}</p>
          <h1 className="font-display text-3xl text-ink mb-3">{product.name}</h1>
          <p className="text-lg text-ink/80 mb-4">{formatNaira(product.price)}</p>
          <p className="text-ink/70 max-w-md mb-2">{product.description}</p>
          {product.fabric && <p className="text-sm text-ink/50">Fabric: {product.fabric}</p>}

          <div className="mt-4 inline-block bg-blush text-magentadeep text-xs px-3 py-1.5 rounded-full">
            Made to measure — no standard sizing needed
          </div>

          <AddToCartForm product={product} />
        </div>
      </div>
    </div>
  );
}