// Placeholder catalogue shown until real IPHYGLAMOUR products (with photos)
// are added through the admin dashboard. Swap these out any time —
// the shop and product pages read from Supabase first and only fall
// back to this list when that table is empty or unreachable.

export const placeholderProducts = [
  {
    id: 'ph-1',
    slug: 'the-amara-gown',
    name: 'The Amara Gown',
    price: 145000,
    category: 'Long Dresses',
    description:
      'A floor-length gown cut for occasion wear, with a fitted bodice and a soft flare from the hip. Made to your exact measurements.',
    fabric: 'Silk-blend crepe',
    tags: ['Featured', 'New Arrival'],
    measurement_fields: ['bust', 'waist', 'hips', 'shoulder', 'dress_length']
  },
  {
    id: 'ph-2',
    slug: 'the-yemisi-two-piece',
    name: 'The Yemisi Two-Piece',
    price: 98000,
    category: 'Two-Piece Sets',
    description:
      'A tailored top and matching skirt set, sharp through the shoulder and easy to move in. Designed for the woman who runs her own day.',
    fabric: 'Structured cotton twill',
    tags: ['Featured'],
    measurement_fields: ['bust', 'waist', 'hips', 'shoulder', 'sleeve_length']
  },
  {
    id: 'ph-3',
    slug: 'the-adaeze-wrap',
    name: 'The Adaeze Wrap Dress',
    price: 87000,
    category: 'Short Dresses',
    description: 'A wrap-front dress that sits just above the knee, finished with hand-stitched edging.',
    fabric: 'Ankara cotton',
    tags: ['New Arrival']
  },
  {
    id: 'ph-4',
    slug: 'the-obioma-statement',
    name: 'The Obioma Statement Set',
    price: 168000,
    category: 'Statement Pieces',
    description:
      'A dramatic cape-sleeve top paired with a straight-leg trouser, built for the room you want to command.',
    fabric: 'Duchess satin',
    tags: ['Featured']
  },
  {
    id: 'ph-5',
    slug: 'the-chioma-slip',
    name: 'The Chioma Slip Dress',
    price: 79000,
    category: 'Short Dresses',
    description: 'A bias-cut slip dress, quietly confident, cut close to the body.',
    fabric: 'Satin-back crepe',
    tags: []
  },
  {
    id: 'ph-6',
    slug: 'the-folake-column',
    name: 'The Folake Column Gown',
    price: 175000,
    category: 'Long Dresses',
    description: 'A column silhouette with a fitted waist and a long train, made for bridal parties and galas.',
    fabric: 'Mikado silk',
    tags: ['New Arrival']
  }
];

export function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}
