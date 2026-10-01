'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    const { data } = await supabase.from('collections').select('*').order('name');
    setCollections(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addCollection(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    const { error } = await supabase.from('collections').insert({ name: name.trim(), slug: slugify(name) });
    setSaving(false);
    if (error) {
      setError('Could not add that collection — it may already exist.');
      return;
    }
    setName('');
    load();
  }

  async function remove(c) {
    if (!confirm(`Delete "${c.name}"? Products already using it will keep the name as free text.`)) return;
    await supabase.from('collections').delete().eq('id', c.id);
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-2">Collections</h1>
      <p className="text-sm text-ink/60 mb-6">
        These show up as suggestions on the product form, and as filter tabs on the shop page once
        products use them.
      </p>

      <form onSubmit={addCollection} className="flex gap-3 mb-8 max-w-sm">
        <input
          placeholder="New collection name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-sand px-3 py-2 text-sm flex-1"
        />
        <button
          disabled={saving}
          className="bg-ink text-porcelain px-4 py-2 text-sm hover:bg-magenta transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && <p className="text-xs text-magenta -mt-6 mb-6">{error}</p>}

      {collections === null && <p className="text-sm text-ink/50">Loading…</p>}
      {collections && collections.length === 0 && (
        <p className="text-sm text-ink/50">No collections yet — categories typed on products will still work as free text.</p>
      )}

      <div className="grid gap-2 max-w-sm">
        {collections?.map((c) => (
          <div key={c.id} className="flex items-center justify-between border border-sand px-4 py-2 text-sm">
            <span className="text-ink">{c.name}</span>
            <button onClick={() => remove(c)} className="text-ink/50 hover:text-magenta text-xs">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
