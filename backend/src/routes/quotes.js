const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../config/supabase');
const crypto = require('crypto');

const validateQuote = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('event_type').notEmpty().withMessage('Event type is required'),
  body('event_date').notEmpty().withMessage('Event date is required'),
  body('location').notEmpty().withMessage('Location is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ detail: errors.array() });
    }
    next();
  }
];

// In-memory fallback if database table is not created yet
let inMemoryQuotes = [];

// @route   POST /api/quotes (also maps to /api/quote-request)
// @desc    Submit a quote request
router.post('/', validateQuote, async (req, res) => {
  const { name, email, phone, company, event_type, event_date, location, guest_count, budget, notes } = req.body;
  
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  
  const quoteRecord = {
    id,
    name,
    email,
    phone,
    company: company || '',
    event_type,
    event_date,
    location,
    guest_count: guest_count || '',
    budget: budget || '',
    notes: notes || '',
    created_at
  };
  
  try {
    const { data, error } = await supabaseAdmin
      .from('quotes')
      .insert([quoteRecord])
      .select('*')
      .single();
      
    if (error) {
      console.warn('Supabase insert into quotes failed, falling back to memory:', error.message);
      inMemoryQuotes.push(quoteRecord);
      return res.json({ ok: true, id });
    }
    
    res.json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Error inserting quote, falling back to memory:', err);
    inMemoryQuotes.push(quoteRecord);
    res.json({ ok: true, id });
  }
});

// @route   GET /api/quotes (also maps to /api/quote-request)
// @desc    Get all quote requests
router.get('/', async (req, res) => {
  try {
    const { data: quotes, error } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error || !quotes) {
      console.warn('Supabase fetch from quotes failed, returning memory fallback:', error ? error.message : 'no data');
      return res.json(inMemoryQuotes);
    }
    
    res.json(quotes);
  } catch (err) {
    console.error('Error fetching quotes:', err);
    res.json(inMemoryQuotes);
  }
});

module.exports = router;
