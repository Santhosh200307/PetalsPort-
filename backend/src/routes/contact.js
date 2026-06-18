const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../config/supabase');
const crypto = require('crypto');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const validateContact = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('message').notEmpty().withMessage('Message is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ detail: errors.array() });
    }
    next();
  }
];

let inMemoryContacts = [];

// @route   POST /api/contact
// @desc    Submit a contact message
router.post('/', validateContact, async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  
  const contactRecord = {
    id,
    name,
    email,
    subject: subject || '',
    message,
    created_at
  };
  
  try {
    const { data, error } = await supabaseAdmin
      .from('contact_messages')
      .insert([contactRecord])
      .select('*')
      .single();
      
    if (error) {
      console.warn('Supabase insert into contact_messages failed, falling back to memory:', error.message);
      inMemoryContacts.push(contactRecord);
      return res.json({ ok: true, id });
    }
    
    res.json({ ok: true, id: data.id });
  } catch (err) {
    console.error('Error inserting contact message, falling back to memory:', err);
    inMemoryContacts.push(contactRecord);
    res.json({ ok: true, id });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data: contacts, error } = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error || !contacts) {
      console.warn('Supabase fetch from contact_messages failed, returning memory list:', error ? error.message : 'no data');
      return res.json(inMemoryContacts);
    }
    
    res.json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.json(inMemoryContacts);
  }
});

module.exports = router;
