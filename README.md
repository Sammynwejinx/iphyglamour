# IPHYGLAMOUR

A made-to-measure women's fashion storefront, built with Next.js (App Router),
Tailwind CSS, and Supabase (database, auth, storage).

See **SETUP.md** for how to connect Supabase, create an admin login, and
deploy to Vercel.

## What's included

- **Storefront:** home, shop (with category filters), product pages, cart,
  the measurement/appointment/WhatsApp ordering flow, order confirmation,
  about, gallery, and contact pages.
- **Admin dashboard** (`/admin`): login-protected overview, product
  management (add/edit/hide/delete with multi-photo upload and per-product
  measurement fields), a collections manager, order tracking with status
  updates, and appointment management.
- **Quick View** on product cards, and a multi-photo gallery on product pages.
- **Mobile bottom nav** (Home / Shop / Cart / WhatsApp) on small screens.
- **Configurable measurements:** each product can specify which measurements
  it needs; the checkout form only asks for what's relevant to what's in
  the cart.
- **Placeholder content:** until real product photos and copy are added, the
  site shows a designed placeholder catalogue so it looks complete out of
  the box.

## Tech

- Next.js 14 (App Router, JavaScript)
- Tailwind CSS
- Supabase (Postgres + Auth + Storage)
- Plain `wa.me` links for WhatsApp ordering — no WhatsApp Business API needed

## Local development

```
npm install
npm run dev
```
