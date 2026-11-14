# Signal by Veqlo

> **Listen beyond the rating.**  
> Customer feedback and real-time satisfaction intelligence platform for cafés, restaurants, retail shops, and service businesses.

Signal helps businesses understand what their customers really think. Customers scan a clean QR code, rate their experience from 1 to 5 stars, select a category, and optionally leave a direct written comment in 10 seconds. No apps, downloads, or registration required.

Businesses access a private, real-time dashboard to monitor customer satisfaction trends, triage operational issues, compare multiple branches, and download executive reports.

Live Product: **[signal.veqlo.me](https://signal.veqlo.me)**  
Parent Studio: **[veqlo.me](https://veqlo.me)**

---

## Key Features

### 1. Frictionless Customer Experience
- **Zero Registration**: Customers scan and submit feedback in under 10 seconds.
- **Mobile-First Interface**: Designed with minimalist typography, high contrast, and tactile micro-interactions.
- **Categorized Feedback**: Patrons tag specific areas (e.g. *Service, Quality, Speed, Cleanliness, Atmosphere, Value*).
- **Multi-Location Routing**: Automatic branch attribution via location-specific QR codes (`/f/[slug]?loc=[location]`).
- **Unbiased Google Reviews**: Every customer receives an equal, voluntary opportunity to leave a public Google review. Signal strictly complies with Google and FTC guidelines by never gating, hiding, or redirecting negative feedback.

### 2. Multi-Branch & Location Intelligence
- Support for multiple physical branches, cafés, table sections, or retail counters.
- Benchmark locations side-by-side on average score, response volume, and detractor risk.
- Independent QR codes and shareable links per location.

### 3. Executive Intelligence Dashboard
- **Key KPIs**: Real-time average rating, total volume, positive sentiment percentage (4–5 stars), attention needed count (1–2 stars), and estimated Net Promoter Score (NPS).
- **Date Range Filters**: Filter instantly by Today, Last 7 Days, Last 30 Days, Last 90 Days, or All Time.
- **Interactive Visualizations**:
  - Daily response volume timeline.
  - Satisfaction score trend curve over time.
  - 5-to-1 star rating distribution with interactive click-to-filter.
  - Category performance breakdown highlighting operational pain points.

### 4. Feedback Inbox & Triage Workflow
- Full feedback stream with real-time search across comments and categories.
- Multi-dimensional filters (rating, category, status, location).
- Triage statuses: `New`, `Read`, `Flagged Alert`, and `Resolved`.
- Internal team collaboration notes attached directly to customer responses.
- RFC-compliant CSV export for spreadsheet analysis.

### 5. Downloadable Executive PDF Reports
- Built-in vector PDF generator (`jspdf`) creating executive monthly summaries.
- Formatted with KPIs, rating distribution, category benchmarks, and highlighted customer feedback for leadership or team syncs.

### 6. QR Studio & Printable Stand Templates
- High-resolution vector QR code generator for main business and individual branches.
- Ready-to-print formats formatted for cardstock:
  - Foldable Table Tent stand.
  - Counter Display sticker.
  - Compact counter badge.
- Instant high-res PNG download and vector print support.

### 7. Critical Notification System
- In-app notification center for urgent alerts.
- Automatic alert generation when a 1 or 2-star rating is received.
- Severity levels (`critical`, `warning`, `info`) with one-click status updates.

### 8. Interactive Demo Mode
- Integrated demo workspace with realistic sample feedback for a specialty coffee roaster chain.
- Enables instant evaluation of all features, filters, and reports without requiring initial customer scans.

---

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict type checking)
- **Styling**: Tailwind CSS (custom minimalist enterprise palette)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Edge Backend**: Supabase Edge Functions (`signal-feedback`) with SHA-256 IP rate limiting
- **Document Generation**: jsPDF (clean vector PDF reports) & QRCode
- **Icons**: Lucide Icons (no emojis, professional typography)
- **Deployment**: Vercel (Edge Network) & Cloudflare (DNS, SSL, security)

---

## Architecture & Security

- **Row Level Security (RLS)**: Authenticated business owners can only view and manage their own businesses, locations, feedback, and notifications.
- **Zero Client Secret Exposure**: Neither service-role keys nor administrative secrets are shipped to browser bundles.
- **Anti-Spam & Rate Limiting**: The public feedback endpoint enforces per-IP sliding-window quotas with SHA-256 hashing to protect customer anonymity while defending against spam.
- **Data Isolation**: Multi-tenant data isolation strictly enforced at the PostgreSQL database level.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open application
http://localhost:3000
```

### Build & Validate

```bash
# Run Next.js production build and type checking
npm run build

# Run frontend configuration checks
npm run check
```

---

## Database Migrations

Database migrations are located in `supabase/migrations/`:
- `0001_initial_schema.sql`: Core businesses and feedback tables with initial RLS.
- `20261113180919_optimize_rls_owner_indexes.sql`: Owner index and subquery performance optimizations.
- `20261113185400_add_feedback_rate_limit.sql`: Rate limit tracking table.
- `20261113185600_restrict_rate_limit_table.sql`: Security policy restricting client access.
- `20261114200000_add_locations_and_features.sql`: Multi-location support, feedback statuses, team notes, and notification tables.

To apply migrations to your Supabase project, execute the SQL files in the Supabase SQL Editor.

---

## Veqlo Ecosystem

Signal is an independent product developed by **[Veqlo](https://veqlo.me)**.
- **Signal**: Customer feedback intelligence platform.
- **Veqlo Quick**: Native Windows Explorer utility for rapid image conversion.
- **OpenInbox**: Free, unlimited business email on Cloudflare Workers.
- **Guardian**: Privacy and digital safety research.

---

© 2026 Veqlo. Built with intention.
