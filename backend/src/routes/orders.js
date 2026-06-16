const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../config/supabase');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
router.post('/', async (req, res) => {
  const { customerName, customerEmail, items, totalPrice } = req.body;
  
  if (!customerName || !customerEmail || !items || totalPrice === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const newOrder = {
      customer_name: customerName,
      customer_email: customerEmail,
      items: typeof items === 'string' ? JSON.parse(items) : items,
      total_price: totalPrice,
      status: 'pending'
    };
    
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([newOrder])
      .select('*')
      .single();
      
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Server error creating order' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ error: 'Server error fetching order' });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status / details (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, totalPrice } = req.body;
  
  try {
    const updates = {};
    if (status !== undefined) updates.status = status;
    if (totalPrice !== undefined) updates.total_price = totalPrice;
    
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Server error updating order' });
  }
});

module.exports = router;
