const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Static fallback data matching original FastAPI server
const STATIC_PRODUCTS = [
  {"id": "rose-red-dutch", "name": "Dutch Red Roses", "category": "wedding", "color": "Crimson", "season": "All year", "unit": "bunch of 20 stems", "retailPrice": 480, "wholesalePrice": 320, "minWholesale": 50, "image": "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Velvet-petal Dutch crimsons with long 60cm stems. Imported A-grade, vase-life 7–10 days."},
  {"id": "marigold-genda", "name": "Marigold Genda", "category": "wedding", "color": "Saffron", "season": "Oct – Feb", "unit": "kilogram", "retailPrice": 180, "wholesalePrice": 90, "minWholesale": 20, "image": "https://images.unsplash.com/photo-1599733589046-8a35aae04b9a?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Farm-fresh Karnataka genda, perfect for mandap garlands, toran and traditional draping."},
  {"id": "lily-oriental-white", "name": "Oriental White Lilies", "category": "corporate", "color": "Ivory", "season": "All year", "unit": "bunch of 10 stems", "retailPrice": 720, "wholesalePrice": 520, "minWholesale": 30, "image": "https://images.unsplash.com/photo-1561848355-890d054dc55a?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Heavily fragrant oriental lilies, 4–6 buds per stem. A favourite for lobby installations."},
  {"id": "carnation-blush", "name": "Carnation — Soft Blush", "category": "birthday", "color": "Blush", "season": "All year", "unit": "bunch of 25 stems", "retailPrice": 360, "wholesalePrice": 220, "minWholesale": 40, "image": "https://images.unsplash.com/photo-1493224170335-7f4eea21d486?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Frilly blush carnations with sturdy stems — versatile filler for bouquets and centrepieces."},
  {"id": "orchid-cymbidium", "name": "Cymbidium Orchids", "category": "wedding", "color": "Champagne", "season": "Nov – Mar", "unit": "spike", "retailPrice": 850, "wholesalePrice": 610, "minWholesale": 25, "image": "https://images.unsplash.com/photo-1567696911980-2eed69a46042?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Show-stopping champagne cymbidiums — 8–12 blooms per spike, the centrepiece of luxury décor."},
  {"id": "gerbera-mixed", "name": "Mixed Gerberas", "category": "birthday", "color": "Mixed", "season": "All year", "unit": "bunch of 20 stems", "retailPrice": 280, "wholesalePrice": 170, "minWholesale": 30, "image": "https://images.unsplash.com/photo-1508610048659-a06b669e3321?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Bright, cheerful gerberas in sunset hues — birthdays, baby showers, casual brunch tables."},
  {"id": "tuberose-rajnigandha", "name": "Tuberose Rajnigandha", "category": "wedding", "color": "Snow", "season": "Apr – Oct", "unit": "kilogram", "retailPrice": 240, "wholesalePrice": 140, "minWholesale": 20, "image": "https://images.unsplash.com/photo-1469259943454-aa100abba749?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Intensely fragrant Bengaluru-grown tuberose, ideal for jaimala, hair garlands and incense décor."},
  {"id": "hydrangea-antique", "name": "Antique Hydrangea", "category": "corporate", "color": "Sage Green", "season": "Jun – Oct", "unit": "stem", "retailPrice": 320, "wholesalePrice": 220, "minWholesale": 40, "image": "https://images.unsplash.com/photo-1455659817273-f96807779a8a?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Antique sage hydrangea heads — voluminous, editorial, perfect for boardroom and gala centres."},
  {"id": "tulip-pastel", "name": "Pastel Tulips", "category": "birthday", "color": "Pastel mix", "season": "Dec – Mar", "unit": "bunch of 10 stems", "retailPrice": 540, "wholesalePrice": 380, "minWholesale": 25, "image": "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Holland-imported pastel tulips. A graceful, soft palette for spring-themed celebrations."}
];

function formatProduct(dbProduct) {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.category,
    color: dbProduct.color,
    season: dbProduct.season,
    unit: dbProduct.unit,
    retailPrice: Number(dbProduct.retail_price),
    wholesalePrice: Number(dbProduct.wholesale_price),
    minWholesale: Number(dbProduct.min_wholesale),
    image: dbProduct.image,
    description: dbProduct.description,
    inStock: dbProduct.in_stock !== undefined ? Boolean(dbProduct.in_stock) : true,
    createdAt: dbProduct.created_at
  };
}

function toDbProduct(jsProduct) {
  return {
    id: jsProduct.id,
    name: jsProduct.name,
    category: jsProduct.category,
    color: jsProduct.color,
    season: jsProduct.season,
    unit: jsProduct.unit,
    retail_price: jsProduct.retailPrice,
    wholesale_price: jsProduct.wholesalePrice,
    min_wholesale: jsProduct.minWholesale,
    image: jsProduct.image,
    description: jsProduct.description,
    in_stock: jsProduct.inStock !== undefined ? Boolean(jsProduct.inStock) : true
  };
}

async function seedProductsIfEmpty() {
  try {
    const { count, error } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (error) return;
    
    if (count === 0) {
      console.log('Seeding products table...');
      const dbProducts = STATIC_PRODUCTS.map(p => toDbProduct(p));
      await supabaseAdmin.from('products').insert(dbProducts);
    }
  } catch (err) {
    console.warn('Auto-seeding products failed (table may not exist yet):', err.message);
  }
}

// @route   GET /api/products
// @desc    Get all products (with optional category filter)
router.get('/', async (req, res) => {
  const { category } = req.query;
  
  try {
    await seedProductsIfEmpty();
    
    let queryBuilder = supabaseAdmin.from('products').select('*');
    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category', category);
    }
    
    const { data: dbProducts, error } = await queryBuilder;
    
    if (error || !dbProducts || dbProducts.length === 0) {
      let filtered = STATIC_PRODUCTS;
      if (category && category !== 'all') {
        filtered = STATIC_PRODUCTS.filter(p => p.category === category);
      }
      return res.json(filtered.map(p => ({ ...p, inStock: p.inStock !== undefined ? p.inStock : true })));
    }
    
    res.json(dbProducts.map(p => formatProduct(p)));
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data: dbProduct, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error || !dbProduct) {
      const staticProd = STATIC_PRODUCTS.find(p => p.id === id);
      if (staticProd) {
        return res.json({ ...staticProd, inStock: staticProd.inStock !== undefined ? staticProd.inStock : true });
      }
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(formatProduct(dbProduct));
  } catch (err) {
    console.error('Error fetching product details:', err);
    res.status(500).json({ error: 'Server error fetching product' });
  }
});

// @route   POST /api/products
// @desc    Create a product (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { id, name, category, color, season, unit, retailPrice, wholesalePrice, minWholesale, image, description, inStock = true } = req.body;
  
  if (!id || !name || !category || retailPrice === undefined || wholesalePrice === undefined || minWholesale === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const newProduct = {
      id,
      name,
      category,
      color,
      season,
      unit,
      retail_price: retailPrice,
      wholesale_price: wholesalePrice,
      min_wholesale: minWholesale,
      image,
      description,
      in_stock: Boolean(inStock)
    };
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([newProduct])
      .select('*')
      .single();
      
    if (error) throw error;
    
    res.status(201).json(formatProduct(data));
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Server error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  try {
    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.season !== undefined) dbUpdates.season = updates.season;
    if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
    if (updates.retailPrice !== undefined) dbUpdates.retail_price = updates.retailPrice;
    if (updates.wholesalePrice !== undefined) dbUpdates.wholesale_price = updates.wholesalePrice;
    if (updates.minWholesale !== undefined) dbUpdates.min_wholesale = updates.minWholesale;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.inStock !== undefined) dbUpdates.in_stock = Boolean(updates.inStock);
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) throw error;
    
    res.json(formatProduct(data));
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Server error updating product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    res.json({ ok: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Server error deleting product' });
  }
});

module.exports = router;
