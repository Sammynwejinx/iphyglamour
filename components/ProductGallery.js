'use client';

import { useState } from 'react';
import ImagePlaceholder from './ImagePlaceholder';

export default function ProductGallery({ images, label }) {
  const gallery = images && images.length > 0 ? images : [null];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="aspect-[3/4] rounded-sm overflow-hidden">
        <ImagePlaceholder label={label} imageUrl={gallery[active]} alt={label} />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2 mt-3">
          {gallery.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-14 h-14 rounded-sm overflow-hidden border ${
                active === i ? 'border-magenta' : 'border-sand'
              }`}
              aria-label={`View photo ${i + 1}`}
            >
              <ImagePlaceholder label="" imageUrl={url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
