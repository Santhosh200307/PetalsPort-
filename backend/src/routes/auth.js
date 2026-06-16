const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'petalsport_jwt_secret_key_2026';

// @route   POST /api/auth/register
// @desc    Register a new user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role specified')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role = 'user' } = req.body;

    try {
      const { data: existingUser, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert([{ email, password: hashedPassword, role }])
        .select('*')
        .single();

      if (insertError) throw insertError;

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Server error registering user' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user & return JWT token
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Provide a valid email address'),
    body('password').exists().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const { data: user, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error logging in' });
    }
  }
);

module.exports = router;
