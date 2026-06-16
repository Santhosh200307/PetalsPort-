const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

async function fetchFromSerper(query) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    console.warn('Warning: SERPER_API_KEY environment variable is not defined.');
    return [];
  }

  try {
    const response = await fetch('https://google.serper.dev/images', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query || 'exotic wedding flowers india', num: 12 })
    });
    
    if (!response.ok) {
      const errMsg = await response.text();
      console.error('Serper API error response:', errMsg);
      return [];
    }
    
    const data = await response.json();
    if (data && data.images) {
      return data.images.map((img, index) => ({
        id: `serper-${index}-${Date.now()}`,
        title: img.title || 'Exotic Floral arrangement',
        imageUrl: img.imageUrl || img.thumbnailUrl,
        source: img.source || 'Google Images via Serper',
        link: img.link
      }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching from Serper API:', err);
    return [];
  }
}

// @route   GET /api/gallery
// @desc    Get gallery items (fetched from Serper API or Supabase database)
router.get('/', async (req, res) => {
  const { query } = req.query;
  
  try {
    if (query) {
      console.log(`Querying Serper API for gallery query: "${query}"`);
      const serperImages = await fetchFromSerper(query);
      return res.json(serperImages);
    }
    
    // Try to load custom gallery items from Supabase
    const { data: dbGallery, error } = await supabaseAdmin
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error || !dbGallery || dbGallery.length === 0) {
      console.log('No local gallery images found. Fetching default images via Serper API...');
      const defaultImages = await fetchFromSerper('luxury floral installations wedding');
      return res.json(defaultImages);
    }
    
    const formatted = dbGallery.map(item => ({
      id: item.id,
      title: item.title,
      imageUrl: item.image_url,
      createdAt: item.created_at
    }));
    
    res.json(formatted);
  } catch (err) {
    console.error('Error in GET /api/gallery:', err);
    // Hardcoded safety fallback images
    res.json([
      { id: 'fallback-1', title: 'Orchid Champagne Decor', imageUrl: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?crop=entropy&cs=srgb&fm=jpg&q=85' },
      { id: 'fallback-2', title: 'White Lily Lobby Vase', imageUrl: 'https://images.unsplash.com/photo-1561848355-890d054dc55a?crop=entropy&cs=srgb&fm=jpg&q=85' }
    ]);
  }
});

// @route   POST /api/gallery
// @desc    Add a new image to local gallery (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { title, imageUrl } = req.body;
  
  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }
  
  try {
    const newItem = {
      title: title || 'Unnamed Arrangement',
      image_url: imageUrl
    };
    
    const { data, error } = await supabaseAdmin
      .from('gallery')
      .insert([newItem])
      .select('*')
      .single();
      
    if (error) throw error;
    
    res.status(201).json({
      id: data.id,
      title: data.title,
      imageUrl: data.image_url,
      createdAt: data.created_at
    });
  } catch (err) {
    console.error('Error creating gallery item:', err);
    res.status(500).json({ error: 'Server error saving gallery item' });
  }
});

module.exports = router;
