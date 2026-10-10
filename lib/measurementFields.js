// Measurement sets, exactly as IPHYGLAMOUR takes them. All values are in inches.

export const GOWN_FIELDS = [
  { key: 'waist', label: 'Waist' },
  { key: 'bust', label: 'Bust' },
  { key: 'hips', label: 'Hip' },
  { key: 'dress_length', label: 'Full length / short length' },
  { key: 'half_cut', label: 'Half cut' },
  { key: 'sleeve_length', label: 'Short sleeve length / long sleeve length' },
  { key: 'round_sleeve', label: 'Round sleeve' },
  { key: 'nipple_to_nipple', label: 'Nipple to nipple' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'shoulder_to_underbust', label: 'Shoulder to underbust' },
  { key: 'shoulder_to_nipple', label: 'Shoulder to nipple' }
];

export const TOP_FIELDS = [
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'bust', label: 'Bust' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hip' },
  { key: 'top_length', label: 'Top length' },
  { key: 'sleeve_length', label: 'Sleeve length' },
  { key: 'armhole', label: 'Armhole' },
  { key: 'upper_arm', label: 'Upper arm' }
];

export const TROUSER_FIELDS = [
  { key: 'trouser_waist', label: 'Trouser waist' },
  { key: 'trouser_hip', label: 'Hip' },
  { key: 'flap', label: 'Flap' },
  { key: 'laps', label: 'Laps' },
  { key: 'trouser_length', label: 'Short length / long length' },
  { key: 'ankle', label: 'Ankle' }
];

export const MEASUREMENT_TYPES = [
  {
    id: 'gown',
    name: 'Gown',
    sections: [{ title: 'Gown measurements', fields: GOWN_FIELDS }]
  },
  {
    id: 'two_piece',
    name: 'Two-piece',
    sections: [
      { title: 'Top measurements', fields: TOP_FIELDS },
      { title: 'Trouser measurements', fields: TROUSER_FIELDS }
    ]
  }
];

// Every key a type uses (this is what gets saved on the product)
export function keysForType(typeId) {
  const type = MEASUREMENT_TYPES.find((t) => t.id === typeId) || MEASUREMENT_TYPES[0];
  const keys = [];
  type.sections.forEach((s) => s.fields.forEach((f) => !keys.includes(f.key) && keys.push(f.key)));
  return keys;
}

// Used for brand-new products
export const DEFAULT_MEASUREMENT_KEYS = keysForType('gown');

// A product is "two_piece" if its saved measurement list contains trouser
// measurements. Everything else (including older products) is a gown.
export function typeIdForKeys(keys) {
  return Array.isArray(keys) && keys.includes('trouser_waist') ? 'two_piece' : 'gown';
}

export function sectionsForType(typeId) {
  const type = MEASUREMENT_TYPES.find((t) => t.id === typeId) || MEASUREMENT_TYPES[0];
  return { typeName: type.name, sections: type.sections };
}

// For a cart item: which measurement sections should the customer fill in?
export function sectionsForItem(item) {
  const typeId = typeIdForKeys(item?.measurement_fields);
  return { typeId, ...sectionsForType(typeId) };
}