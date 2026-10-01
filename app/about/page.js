import Image from 'next/image';

export const metadata = { title: 'About — IPHYGLAMOUR' };

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-10 md:py-14 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
      <div className="aspect-[4/5] rounded-sm overflow-hidden relative">
        <Image src="/about.jpeg" alt="IPHYGLAMOUR" fill className="object-cover" />
      </div>
      <div>
        <h1 className="font-display text-3xl text-ink mb-4">About IPHYGLAMOUR</h1>
        <p className="text-ink/70 mb-4">
          IPHYGLAMOUR is a Nigerian women&apos;s fashion house built around one idea: clothing should
          be made for the person wearing it, not the other way around.
        </p>
        <p className="text-ink/70 mb-4">
          Every piece is cut to measure, from everyday staples to statement occasion wear —
          crafted with attention to fit, fabric, and finish.
        </p>
        <p className="text-ink/70">
          This page is a starting point — replace this copy with IPHYGLAMOUR&apos;s own story once it&apos;s ready.
        </p>
      </div>
    </div>
  );
}