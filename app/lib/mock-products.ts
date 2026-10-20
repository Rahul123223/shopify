/**
 * Local sample catalog for the first storefront UI stage.
 * Keep this file separate from Storefront API queries so the UI can run
 * before a Shopify store or API credentials are available.
 */
export type MockProduct = {
  handle: string;
  title: string;
  category: string;
  price: string;
  image: string;
  imageAlt: string;
  badge?: string;
};

export const mockProducts: MockProduct[] = [
  {
    handle: 'arc-table-lamp',
    title: 'Arc table lamp',
    category: 'Lighting',
    price: '$148',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Sculptural table lamp on a warm neutral background',
    badge: 'Bestseller',
  },
  {
    handle: 'dune-ceramic-vase',
    title: 'Dune ceramic vase',
    category: 'Objects',
    price: '$64',
    image:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Handmade ceramic vessel with a soft, natural finish',
  },
  {
    handle: 'everyday-tote',
    title: 'Everyday canvas tote',
    category: 'Accessories',
    price: '$42',
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Minimal canvas carryall bag',
    badge: 'New',
  },
  {
    handle: 'stillwater-glass-set',
    title: 'Stillwater glass set',
    category: 'Tabletop',
    price: '$38',
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Clear glassware arranged on a simple tabletop',
  },
];
