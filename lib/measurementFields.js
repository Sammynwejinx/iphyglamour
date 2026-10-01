export const MEASUREMENT_FIELDS = [
  { key: 'bust', label: 'Bust (inches)' },
  { key: 'waist', label: 'Waist (inches)' },
  { key: 'hips', label: 'Hips (inches)' },
  { key: 'shoulder', label: 'Shoulder (inches)' },
  { key: 'sleeve_length', label: 'Sleeve length (inches)' },
  { key: 'dress_length', label: 'Dress length (inches)' },
  { key: 'armhole', label: 'Armhole (inches)' },
  { key: 'thigh', label: 'Thigh (inches)' }
];

export const DEFAULT_MEASUREMENT_KEYS = MEASUREMENT_FIELDS.map((f) => f.key);

// Given cart items (each optionally carrying a measurement_fields array of
// keys set by the admin for that product), work out which fields to show on
// the measurement form: the union of everything relevant to what's in the
// cart. Falls back to the full standard set when items don't specify one
// (e.g. placeholder products), so the form never comes back empty.
export function fieldsForCartItems(items) {
  const keys = new Set();
  items.forEach((i) => {
    const itemKeys = Array.isArray(i.measurement_fields) && i.measurement_fields.length > 0 ? i.measurement_fields : DEFAULT_MEASUREMENT_KEYS;
    itemKeys.forEach((k) => keys.add(k));
  });
  return MEASUREMENT_FIELDS.filter((f) => keys.has(f.key));
}
