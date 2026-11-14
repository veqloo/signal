# Signal — Clerk Billing setup

Signal uses **Clerk Billing for B2C subscriptions**: each business owner subscribes through their own Clerk user account. Supabase remains the application database. Do not create Clerk Organizations solely for billing unless Signal later moves to team-owned subscriptions.

## Application routes

- Public checkout: `/pricing/subscribe` — Clerk `<PricingTable />`.
- Account and subscription management: `/dashboard/billing` — Clerk `<UserProfile />`.
- Marketing comparison: `/pricing`.

Clerk Billing must be enabled in the selected Clerk application before the PricingTable can show purchasable plans. Plan definitions and prices are configured in Clerk Dashboard; they are not created by the React component or synchronized from Stripe.

## Create these user plans in Clerk Dashboard

Use the following plan slugs because application authorization checks should refer to stable slugs/features, not display names.

| Plan | Slug | Monthly price | Annual monthly equivalent | Public |
|---|---|---:|---:|---|
| Starter | `starter` | Free | Free | Yes |
| Pro | `pro` | $29 | $24 ($288/year) | Yes |
| Enterprise | `enterprise` | $79 | $69 ($828/year) | Yes |

The amounts match the current Signal pricing page. Confirm currency, tax handling, trial length, and annual totals in Clerk before enabling live payments. The existing marketing page does not promise a trial until one is configured in Clerk.

## Feature slugs

Create these Features in Clerk and attach them to the plans:

| Feature slug | Starter | Pro | Enterprise |
|---|:---:|:---:|:---:|
| `standard_qr` | Yes | Yes | Yes |
| `basic_analytics` | Yes | Yes | Yes |
| `csv_export` | Yes | Yes | Yes |
| `unlimited_feedback` | — | Yes | Yes |
| `print_ready_qr` | — | Yes | Yes |
| `advanced_analytics` | — | Yes | Yes |
| `feedback_triage` | — | Yes | Yes |
| `email_alerts` | — | Yes | Yes |
| `multi_location_3` | — | Yes | Yes |
| `unlimited_locations` | — | — | Yes |
| `executive_reports` | — | — | Yes |
| `branch_benchmarking` | — | — | Yes |
| `team_access` | — | — | Yes |
| `custom_feedback_domain` | — | — | Yes |

The current app must still enforce quantitative limits (for example, 100 feedback submissions/month and location counts) in trusted server/database code. Hiding a button or rendering a different menu is not an authorization boundary. Add server-side `has({ feature: "..." })` checks and quota enforcement before treating these features as production-enforced.

## Enable and test

1. Open the existing Clerk application selected for Signal.
2. Open Billing and enable **User Billing**.
3. Use the Clerk development payment gateway first; do not connect a live Stripe account during development.
4. Create the plans and Features above. Mark the three plans publicly available so they appear in PricingTable.
5. Configure a production instance with Clerk's own Frontend API domain `accounts.signal.veqlo.me`; keep the application itself at `https://signal.veqlo.me`. Use the exact DNS target Clerk generates in its Dashboard/CLI. Do not point the Clerk CNAME at Vercel or reuse the app host for the Clerk Frontend API.
6. Configure the production payment gateway and legal/business details before accepting real payments.
7. Test subscribe, cancel, upgrade, downgrade, failed payment, renewal, and feature revocation with test payment methods.

## Cost and payment notes

Clerk Billing processes payments through Stripe. Clerk currently lists a 0.7% Billing fee in addition to Stripe's processing fees. Review current pricing and payment terms before enabling live checkout.

Production payment processing requires a Stripe account that satisfies Stripe's eligibility and legal requirements. Use an adult/legal business representative where required; do not use a minor's personal account to bypass provider requirements.

## Clerk webhook and identity synchronization

Configure a Clerk webhook endpoint at:

`https://signal.veqlo.me/api/webhooks/clerk-email`

Subscribe it to `user.created` and `user.updated`. The endpoint verifies Svix signatures, stores event IDs in `public.clerk_webhook_events` for durable idempotency, and synchronizes Clerk profiles into Supabase. It requires the Supabase service-role key as a server-only secret.

For each imported legacy user, set Clerk `public_metadata.legacy_auth_id` to that user's previous Supabase Auth UUID. The webhook then updates `businesses.owner_id` and `business_memberships.user_id` from the old UUID to the new Clerk user ID without deleting business data. Do not bulk-import accounts until this mapping has been verified on a test user.

If using Clerk custom email delivery through Resend, configure the supported Clerk email delivery event for this endpoint and subscribe to `email.created`. If using Clerk's native custom sending domain instead, leave custom Resend delivery disabled; Clerk will send authentication emails itself. Never configure both delivery paths for the same template.

## Required production environment

Set these in the Vercel project that actually serves Signal:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — production Clerk publishable key (public).
- `CLERK_SECRET_KEY` — production Clerk secret (secret).
- `CLERK_WEBHOOK_SIGNING_SECRET` — signing secret for the configured Clerk webhook (secret).
- `SUPABASE_URL` — Supabase project URL (server-side).
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role key for webhook profile/ownership sync (secret; server-side only).
- `RESEND_API_KEY` — only required if Clerk custom email delivery is routed through Resend (secret).
- `NEXT_PUBLIC_APP_URL=https://signal.veqlo.me` — canonical production URL.

Never commit keys or paste them into source files. The Vercel project currently has no Clerk production keys, so checkout and authentication cannot be verified until the selected Clerk app is linked and its production keys are provisioned.

## Supabase integration dependency

The app requests a Clerk session token when creating the Supabase client. The Clerk application must be enabled as a **Third-party Auth Provider** in the Supabase project, using Clerk's issuer/domain from the selected production instance. Confirm this in Supabase Dashboard, then test that authenticated Clerk JWTs receive the `authenticated` database role and that RLS isolates each business.

Do not remove legacy Supabase Auth users or the legacy callback until user import and account sign-in have been verified.
