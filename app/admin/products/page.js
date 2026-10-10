'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { MEASUREMENT_TYPES, DEFAULT_MEASUREMENT_KEYS, keysForType, typeIdForKeys } from '@/lib/measurementFields';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductForm({ initialProduct }) {
  const router = useRouter();
  const isEdit = Boolean(initialProduct);
  const [form, setForm] = useState(
    initialProduct || {
      name: '',
      slug: '',
      price: '',
      category: '',
      description: '',
      fabric: '',
      available: true,
      image_url: '',
      image_urls: [],
      measurement_fields: DEFAULT_MEASUREMENT_KEYS
    }
  );
  const [collections, setCollections] = useState([]);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase
      .from('collections')
      .select('name')
      .order('name')
      .then(({ data }) => setCollections(data || []));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value, ...(field === 'name' && !isEdit ? { slug: slugify(value) } : {}) }));
  }

  const measurementType = typeIdForKeys(form.measurement_fields);

  function chooseMeasurementType(typeId) {
    setForm((f) => ({ ...f, measurement_fields: keysForType(typeId) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    let imageUrls = form.image_urls || [];
    try {
      if (files.length > 0) {
        const uploaded = [];
        for (const f of files) {
          const path = `${Date.now()}-${slugify(f.name)}`;
          const { error: uploadError } = await supabase.storage.from('products').upload(path, f);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('products').getPublicUrl(path);
          uploaded.push(data.publicUrl);
        }
        imageUrls = uploaded; // new uploads replace the old set for this save
      }

      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        price: Number(form.price),
        category: form.category,
        description: form.description,
        fabric: form.fabric,
        available: form.available,
        image_url: imageUrls[0] || form.image_url || null,
        image_urls: imageUrls,
        measurement_fields: form.measurement_fields || []
      };

      if (isEdit) {
        const { error: updateError } = await supabase.from('products').update(payload).eq('id', initialProduct.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('products').insert(payload);
        if (insertError) throw insertError;
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Could not save product.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 max-w-lg">
      <input
        required
        placeholder="Product name"
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
        className="border border-sand px-3 py-2 text-sm"
      />
      <input
        required
        placeholder="Slug (URL)"
        value={form.slug}
        onChange={(e) => update('slug', e.target.value)}
        className="border border-sand px-3 py-2 text-sm"
      />
      <input
        required
        type="number"
        placeholder="Price (₦)"
        value={form.price}
        onChange={(e) => update('price', e.target.value)}
        className="border border-sand px-3 py-2 text-sm"
      />

      <div>
        <label className="text-xs text-ink/60 block mb-1">Category / collection</label>
        <input
          list="collection-options"
          placeholder="e.g. Long Dresses"
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
          className="border border-sand px-3 py-2 text-sm w-full"
        />
        <datalist id="collection-options">
          {collections.map((c) => (
            <option key={c.name} value={c.name} />
          ))}
        </datalist>
        <p className="text-xs text-ink/40 mt-1">
          Pick an existing collection or type a new one. Manage the full list under{' '}
          <a href="/admin/collections" className="underline hover:text-magenta">
            Collections
          </a>
          .
        </p>
      </div>

      <input
        placeholder="Fabric"
        value={form.fabric}
        onChange={(e) => update('fabric', e.target.value)}
        className="border border-sand px-3 py-2 text-sm"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => update('description', e.target.value)}
        className="border border-sand px-3 py-2 text-sm"
        rows={4}
      />

      <div>
        <label className="text-xs text-ink/60 block mb-1">Product photos (first one becomes the main image)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="text-sm"
        />
        {form.image_urls?.length > 0 && files.length === 0 && (
          <p className="text-xs text-ink/40 mt-1">{form.image_urls.length} current photo(s) will be kept unless you choose new ones.</p>
        )}
      </div>

      <div>
        <label className="text-xs text-ink/60 block mb-2">
          What type of piece is this? The customer fills in the measurements for this type at checkout.
        </label>
        <div className="grid gap-2">
          {MEASUREMENT_TYPES.map((t) => (
            <label key={t.id} className="flex items-start gap-3 border border-sand p-3 text-sm cursor-pointer">
              <input
                type="radio"
                name="measurement_type"
                className="mt-1"
                checked={measurementType === t.id}
                onChange={() => chooseMeasurementType(t.id)}
              />
              <span>
                <span className="block text-ink">{t.name}</span>
                {t.sections.map((s) => (
                  <span key={s.title} className="block text-xs text-ink/50 mt-1">
                    {s.title}: {s.fields.map((f) => f.label).join(', ')}
                  </span>
                ))}
              </span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.available} onChange={(e) => update('available', e.target.checked)} />
        Available on the site
      </label>

      {error && <p className="text-xs text-magenta">{error}</p>}

      <button
        disabled={saving}
        className="bg-ink text-porcelain px-6 py-3 text-sm hover:bg-magenta transition-colors disabled:opacity-50 w-fit"
      >
        {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add product'}
      </button>
    </form>
  );
}