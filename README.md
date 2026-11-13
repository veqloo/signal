# Signal by Veqlo

Customer feedback platform — listen beyond the rating.

Signal helps businesses collect direct customer feedback, understand recurring patterns and improve the customer experience.

## Current MVP

- Email/password account creation and sign-in with Supabase Auth.
- Business workspace with owner-scoped access (Postgres Row Level Security).
- Dashboard with response count, average rating, positive feedback and attention-needed counts.
- Feedback inbox with rating/category filters and CSV export.
- Public feedback form, shareable link and downloadable QR code.
- Optional Google review invitation shown equally to every customer, regardless of rating.
- Public submissions handled by a Supabase Edge Function; no service-role key is shipped to the browser.

## Stack

- Static HTML/CSS/JavaScript frontend, deployed on Vercel.
- Supabase Auth and Postgres.
- Supabase Edge Function: `signal-feedback`.
- Lucide icons and QRCode.js.

## Supabase project

- Project ref: `hdwptihsatasnhazldmk`
- Region: `eu-west-3`
- API URL: `https://hdwptihsatasnhazldmk.supabase.co`
- Public publishable key is configured in `index.html`. This key is designed for browser use; database access is restricted by RLS.
- Never put the Supabase service-role key in frontend code.

The database schema is managed by migrations in `supabase/migrations/`. The feedback Edge Function is deployed to the project and uses Supabase's server-side environment variables.

## Run locally

Serve the repository root with any static web server, for example:

```bash
python -m http.server 3000
```

Open `http://localhost:3000`. Add the local origin to the Edge Function's CORS allow-list if you use a different local host or port.

## Public feedback link

Each business receives a unique slug. Its public form is available at:

```
https://<your-signal-domain>/?business=<business-slug>
```

## Data and privacy

- Business records are restricted to their authenticated owner through RLS.
- Feedback reads are restricted to the owner of the related business.
- Anonymous customers submit feedback through the Edge Function. Direct anonymous INSERT access to the feedback table is not granted.
- The review invitation is never conditioned on rating or sentiment.

## Deployment

The `main` branch is connected to the Vercel production project. GitHub Actions runs a lightweight syntax and configuration check on each push and pull request.


## Authentication URL configuration

In Supabase Dashboard → Authentication → URL Configuration, set:

- Site URL: `https://signal.veqlo.me`
- Redirect URL: `https://signal.veqlo.me/**`
- Optional preview URL: `https://signal-two-blue.vercel.app/**`

The frontend passes its current origin as the email-confirmation redirect. Keep the production custom domain in the allow-list so email confirmation returns to Signal.


Security follow-up: Supabase's security advisor currently reports that leaked-password protection is disabled. Enable it under Supabase Dashboard → Authentication → Password Security. The connected Supabase tools do not expose this Auth setting.
