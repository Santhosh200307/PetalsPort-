# PetalsPort — Product Requirements

## Original Problem Statement
> "Consider that I'm having a decorative wholesale flowers shop, which has all types of flowers needed for events/functions, so I wanna make an ecommerce website to the shop and make it market reachable. So from the scratch help me in building the website and make a flow/plan of building the website and for its maintenance. So make a frontend design of the website named PetalsPort. Include the high class animation scrolls."

## User Choices
- Scope: Full-stack ecommerce + frontend showcase quality
- Audience: Everyone (wholesale buyers + retail customers)
- Pages: Home, Catalog, Categories (Wedding/Birthday/Corporate), Bulk Quote, About, Contact, Cart/Checkout
- Visual: Designer's call (Editorial luxury + Organic Earthy hybrid chosen)
- Payment: Razorpay (UI wired; sandbox keys required to go live)

## Architecture
- **Frontend**: React 19, react-router-dom 7, framer-motion + lenis (smooth scrolling), react-fast-marquee, Shadcn UI components, Tailwind, sonner for toasts
- **Backend**: FastAPI, Motor (async Mongo) with seed catalog endpoints
- **Persistence**: MongoDB (quote_requests, contact_messages, newsletter)

## User Personas
1. **Event Planner / Decorator** — needs bulk quotes, wholesale pricing, designer brief
2. **Retail Customer** — buying birthday bouquets, single occasions
3. **Corporate Procurement** — recurring lobby/boardroom florals, GST invoicing

## Implemented (Feb 2026 — initial release)
- ✅ Hero with parallax (framer-motion useScroll) + Lenis smooth scrolling globally
- ✅ Marquee, bento-grid categories, featured products, parallax mid-banner, testimonials, footer
- ✅ Catalog with category filter, search, sort
- ✅ Product Detail with Retail / Wholesale toggle, min-order validation, qty stepper
- ✅ Category showcase pages (Wedding / Birthday / Corporate)
- ✅ Bulk Quote form → POST /api/quote-request → MongoDB
- ✅ Contact form → POST /api/contact → MongoDB
- ✅ Cart (localStorage), summary with GST + shipping rules, Razorpay checkout UI
- ✅ Newsletter capture in footer
- ✅ Responsive nav with mobile drawer
- ✅ Backend endpoints: /api/products, /api/categories, /api/quote-request, /api/contact, /api/newsletter

## Mocked / Pending
- ⚠️ **Razorpay payment** — UI is fully wired. Sandbox keys required to complete real charges. Currently shows a toast on "Pay".
- No real auth (trade account is brief-based, no JWT)
- Quote/Contact go to DB but no email notification

## Prioritized Backlog
### P0
- Connect Razorpay sandbox keys + verify payment flow end-to-end
- Email notification on quote/contact submit (Resend or SMTP)
- Admin dashboard for viewing quote/contact submissions

### P1
- Trade-account login (JWT) for net-30 billing
- Order history & order tracking page
- Wishlist
- Image gallery for product detail (multi-image carousel)

### P2
- Subscriptions (weekly office bouquet)
- Lookbook PDF download
- Florist designer chat widget
- Reviews & ratings
- Localization (Hindi / Kannada)
- SEO meta and sitemap

## Maintenance Plan
- **Daily**: Update PRODUCTS seed in `backend/server.py` AND `frontend/src/lib/data.js` (later move to admin CMS)
- **Weekly**: Drop seasonal blooms section refresh
- **Monthly**: Lookbook/marquee creative refresh
- **Quarterly**: Razorpay reconciliation, GST filing exports
