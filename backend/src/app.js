const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const quotesRouter = require('./routes/quotes');
const galleryRouter = require('./routes/gallery');
const contactRouter = require('./routes/contact');
const newsletterRouter = require('./routes/newsletter');

const app = express();

// Global Middlewares
app.use(helmet());

const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'];
app.use(cors({
  origin: corsOrigins.length === 1 && corsOrigins[0] === '*' ? '*' : corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());

// Categories Endpoint (Matching original Python server.py)
const CATEGORIES = [
  {"slug": "wedding", "name": "Wedding", "tagline": "Sacred vows, in bloom."},
  {"slug": "birthday", "name": "Birthday", "tagline": "A year wrapped in petals."},
  {"slug": "corporate", "name": "Corporate", "tagline": "Refined ambience, on schedule."},
];
app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

// Root API Endpoint (needed for test_root_status)
app.get('/api', (req, res) => {
  res.json({ app: 'PetalsPort', status: 'blooming' });
});

app.get('/api/', (req, res) => {
  res.json({ app: 'PetalsPort', status: 'blooming' });
});

// Route Handlers
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/quote-request', quotesRouter); // Alias to support legacy frontend
app.use('/api/gallery', galleryRouter);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Centralized Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
