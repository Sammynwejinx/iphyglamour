# IPHYGLAMOUR — setup guide

This is a Next.js site with a Supabase backend (database + auth + image storage).
Follow these steps in order.

## 1. Run it locally first

```
npm install
npm run dev
```

The site will run at http://localhost:3000 using placeholder products — this
works immediately, with no Supabase setup, so you can see the design right away.

## 2. Create a Supabase project

1. Go to https://supabase.com and create a free account/project.
2. In the project, open **SQL Editor > New query**, paste the contents of
   `supabase/schema.sql`, and run it. This creates the products, orders,
   measurements, and appointments tables with the right permissions.
3. Go to **Storage**, create a new bucket named `products`, and turn on
   **Public bucket**. This is where product photos uploaded from the admin
   dashboard are stored.
4. Go to **Settings > API** and copy your **Project URL** and **anon public key**.

## 3. Connect the site to Supabase

1. Copy `.env.local.example` to `.env.local`.
2. Paste in your Supabase URL and anon key.
3. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to IPHYGLAMOUR's real WhatsApp number
   (international format, digits only — e.g. `2348012345678`).
4. Restart `npm run dev`. The site now reads/writes real data.

## 4. Create your admin login

The admin dashboard at `/admin` uses Supabase's own login — there's no
sign-up page on the site itself (so random visitors can't create admin
accounts). To create your admin user:

1. In Supabase, go to **Authentication > Users > Add user**.
2. Enter the email and password IPHYGLAMOUR's owner will use to log in.
3. Go to `yoursite.com/admin/login` and sign in with those details.

You can add more admin users the same way later.

## 5. Add real products

Once logged in to `/admin`, go to **Products > Add product** to upload real
photos and replace the placeholder catalogue. Placeholder products
automatically disappear from the shop once you add real ones.

## 6. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to https://vercel.com, click **New Project**, and import the repo.
3. In the Vercel project's **Environment Variables** settings, add the same
   three variables from your `.env.local` (Supabase URL, Supabase anon key,
   WhatsApp number).
4. Deploy. Vercel will give you a live URL, and you can attach a custom
   domain afterwards from the project's **Domains** tab.

## Notes

- The public shop pages always work, even before Supabase is connected —
  they fall back to the placeholder catalogue in `lib/placeholderProducts.js`.
- The admin dashboard requires Supabase to be connected and an admin user
  to exist — it will show a login screen otherwise.
- Cart contents are stored in each visitor's own browser (not shared between
  devices), which is standard for a site without customer accounts.
