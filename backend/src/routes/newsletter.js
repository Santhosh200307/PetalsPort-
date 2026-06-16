const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../config/supabase');
const crypto = require('crypto');

const validateNewsletter = [
  body('email').isEmail().withMessage('A valid email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ detail: errors.array() });
    }
    next();
  }
];

let inMemoryNewsletter = new Map();

// @route   POST /api/newsletter
// @desc    Subscribe to newsletter (upsert by email)
router.post('/', validateNewsletter, async (req, res) => {
  const { email } = req.body;
  
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  
  const doc = {
    id,
    email,
    created_at
  };
  
  try {
    const { error } = await supabaseAdmin
      .from('newsletter')
      .upsert({ email, id, created_at }, { onConflict: 'email' });
      
    if (error) {
      console.warn('Supabase upsert into newsletter failed, falling back to memory:', error.message);
      inMemoryNewsletter.set(email, doc);
      return res.json({ ok: true });
    }
    
    res.json({ ok: true });
  } catch (err) {
    console.error('Error in newsletter subscription, falling back to memory:', err);
    inMemoryNewsletter.set(email, doc);
    res.json({ ok: true });
  }
});

module.exports = router;
