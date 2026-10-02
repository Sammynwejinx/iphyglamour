import ShopGrid from '@/components/ShopGrid';
import { getAllProducts } from '@/lib/products';

export const metadata = { title: 'Shop — IPHYGLAMOUR' };
export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14">
      <h1 className="font-display text-3xl text-ink mb-2">Shop the collection</h1>
      <p className="text-ink/60 text-sm mb-8">Every piece is made to measure — no standard sizing required.</p>
      <ShopGrid products={products} />
    </div>
  );
}