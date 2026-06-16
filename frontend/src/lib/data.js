// Seed product data for PetalsPort. Rendered client-side; backend exposes the same
// shape via /api/products for future scaling.

export const CATEGORIES = [
  {
    slug: "wedding",
    name: "Wedding",
    tagline: "Sacred vows, in bloom.",
    description:
      "Mandap florals, mehndi backdrops, varmalas, bridal bouquets and aisle installations crafted for once-in-a-lifetime ceremonies.",
    image:
      "https://images.unsplash.com/photo-1710587384835-0f3de33d8042?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHxlbGVnYW50JTIwd2VkZGluZyUyMGZsb3JhbCUyMGFycmFuZ2VtZW50fGVufDB8fHx8MTc4MTU4NzUxM3ww&ixlib=rb-4.1.0&q=85",
  },
  {
    slug: "birthday",
    name: "Birthday",
    tagline: "A year wrapped in petals.",
    description:
      "Custom bouquets, cake-side arrangements, photo-corner walls and themed pastel bundles for milestone celebrations.",
    image:
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBib3VxdWV0JTIwcm9zZXN8ZW58MHx8fHwxNzgxNTg3NTEzfDA&ixlib=rb-4.1.0&q=85",
  },
  {
    slug: "corporate",
    name: "Corporate",
    tagline: "Refined ambience, on schedule.",
    description:
      "Conference stage florals, lobby installations, gifting bouquets and recurring office subscriptions — invoiced and reliable.",
    image:
      "https://images.unsplash.com/photo-1600104197373-c07cc35e4f61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwzfHx3aG9sZXNhbGUlMjBmcmVzaCUyMGZsb3dlcnMlMjBtYXJrZXR8ZW58MHx8fHwxNzgxNTg3NTEzfDA&ixlib=rb-4.1.0&q=85",
  },
];

export const PRODUCTS = [
  {
    id: "rose-red-dutch",
    name: "Dutch Red Roses",
    category: "wedding",
    color: "Crimson",
    season: "All year",
    unit: "bunch of 20 stems",
    retailPrice: 480,
    wholesalePrice: 320,
    minWholesale: 50,
    image:
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?crop=entropy&cs=srgb&fm=jpg&q=85",
    description:
      "Velvet-petal Dutch crimsons with long 60cm stems. Imported A-grade, vase-life 7–10 days.",
  },
  {
    id: "marigold-genda",
    name: "Marigold Genda",
    category: "wedding",
    color: "Saffron",
    season: "Oct – Feb",
    unit: "kilogram",
    retailPrice: 180,
    wholesalePrice: 90,
    minWholesale: 20,
    image:
      "https://images.unsplash.com/photo-1599733589046-8a35aae04b9a?crop=entropy&cs=srgb&fm=jpg&q=85",
    description:
      "Farm-fresh Karnataka genda, perfect for mandap garlands, toran and traditional draping.",
  },
  {
    id: "lily-oriental-white",
    name: "Oriental White Lilies",
    category: "corporate",
    color: "Ivory",
    season: "All year",
    unit: "bunch of 10 stems",
    retailPrice: 720,
    wholesalePrice: 520,
    minWholesale: 30,
    image:
      "https://images.unsplash.com/photo-1561848355-890d054dc55a?crop=entropy&cs=srgb&fm=jpg&q=85",
    description:
      "Heavily fragrant oriental lilies, 4–6 buds per stem. A favourite for lobby installations.",
  },
  {
    id: "carnation-blush",
    name: "Carnation — Soft Blush",
    category: "birthday",
    color: "Blush",
    season: "All year",
    unit: "bunch of 25 stems",
    retailPrice: 360,
    wholesalePrice: 220,
    minWholesale: 40,
    image:
      "https://images.unsplash.com/photo-1493224170335-7f4eea21d486?crop=entropy&cs=srgb&fm=jpg&q=85",
    description:
      "Frilly blush carnations with sturdy stems — versatile filler for bouquets and centrepieces.",
  },
  {
    id: "orchid-cymbidium",
    name: "Cymbidium Orchids",
    category: "wedding",
    color: "Champagne",
    season: "Nov – Mar",
    unit: "spike",
    retailPrice: 850,
    wholesalePrice: 610,
    minWholesale: 25,
    image:
      "https://images.unsplash.com/photo-1567696911980-2eed69a46042?crop=entropy&cs=srgb&fm=jpg&q=85",
    description:
      "Show-stopping champagne cymbidiums — 8–12 blooms per spike, the centrepiece of luxury décor.",
  },
  {
    id: "gerbera-mixed",
    name: "Mixed Gerberas",
    category: "birthday",
    color: "Mixed",
    season: "All year",
    unit: "bunch of 20 stems",
    retailPrice: 280,
    wholesalePrice: 170,
    minWholesale: 30,
    image:
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?crop=entropy&cs=srgb&fm=jpg&q=85",
    description:
      "Bright, cheerful gerberas in sunset hues — birthdays, baby showers, casual brunch tables.",
  },
  {
    id: "tuberose-rajnigandha",
    name: "Tuberose Rajnigandha",
    category: "wedding",
    color: "Snow",
    season: "Apr – Oct",
    unit: "kilogram",
    retailPrice: 240,
    wholesalePrice: 140,
    minWholesale: 20,
    image:
      "https://images.unsplash.com/photo-1469259943454-aa100abba749?crop=entropy&cs=srgb&fm=jpg&q=85",
    description:
      "Intensely fragrant Bengaluru-grown tuberose, ideal for jaimala, hair garlands and incense décor.",
  },
  {
    id: "hydrangea-antique",
    name: "Antique Hydrangea",
    category: "corporate",
    color: "Sage Green",
    season: "Jun – Oct",
    unit: "stem",
    retailPrice: 320,
    wholesalePrice: 220,
    minWholesale: 40,
    image:
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?crop=entropy&cs=srgb&fm=jpg&q=85",
    description:
      "Antique sage hydrangea heads — voluminous, editorial, perfect for boardroom and gala centres.",
  },
  {
    id: "tulip-pastel",
    name: "Pastel Tulips",
    category: "birthday",
    color: "Pastel mix",
    season: "Dec – Mar",
    unit: "bunch of 10 stems",
    retailPrice: 540,
    wholesalePrice: 380,
    minWholesale: 25,
    image:
      "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?crop=entropy&cs=srgb&fm=jpg&q=85",
    description:
      "Holland-imported pastel tulips. A graceful, soft palette for spring-themed celebrations.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "PetalsPort handled three back-to-back weddings for our studio last December. Flowers arrived chilled, on time, every time.",
    name: "Aanya Mehra",
    role: "Founder, Saffron & Sage Events",
  },
  {
    quote:
      "We've replaced three vendors with PetalsPort. Their wholesale grade lilies are show-floor ready, no sorting required.",
    name: "Karthik Iyer",
    role: "Procurement, Lemon Tree Hotels",
  },
  {
    quote:
      "From mandap to mehndi, the team co-designed the entire floral story. Honestly couldn't have asked for warmer service.",
    name: "Ritika & Arjun",
    role: "Married in Udaipur, 2025",
  },
];

export const getProductById = (id) => PRODUCTS.find((p) => p.id === id);
export const getProductsByCategory = (slug) => PRODUCTS.filter((p) => p.category === slug);
export const getCategoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);
