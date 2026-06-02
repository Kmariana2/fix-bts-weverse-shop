# BTS Weverse Shop — ARIRANG World Tour Merch

A mobile-first Next.js e-commerce storefront for official BTS Weverse Shop merchandise, deployed on **Cloudflare Workers** via the OpenNext adapter.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TailwindCSS v4, Radix UI / shadcn |
| State | React Context (Cart + Wishlist) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Deployment | Cloudflare Workers via `@opennextjs/cloudflare` |

## Features

- **Product catalog** with 17 official BTS merch items across 3 categories
- **Real Weverse Shop prices** — synced with official USD prices
- **Search** — full-text search across product names, descriptions, and categories
- **Sorting** — sort by Featured, Price (Low→High / High→Low), or Name (A–Z)
- **Wishlist** — save items with a heart button; persists across navigation
- **Cart** — slide-out cart drawer with quantity controls and checkout
- **Checkout** — multi-step form (Cart → Shipping → Payment) with Web3Forms
- **Order Confirmation** — dedicated confirmation page after successful order
- **Product detail pages** — image gallery with front/back flip, size selector, member variant picker

## Local Development

```bash
pnpm install
pnpm dev
```

## Preview on Cloudflare Workers Runtime

```bash
pnpm preview
```

## Deploy to Cloudflare Workers

### Prerequisites

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up)
2. A Cloudflare API token with **Edit Workers** permission
3. Your Cloudflare Account ID

### Manual Deploy

```bash
npx wrangler login
pnpm deploy
```

### CI/CD via GitHub Actions

Add these secrets to your GitHub repository (**Settings → Secrets → Actions**):

| Secret | Description |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Edit Workers permission |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID |

Every push to `main` will automatically build and deploy.

### Get your Cloudflare Account ID

```bash
npx wrangler whoami
```

## Pricing

All prices are sourced from the official [Weverse Shop](https://shop.weverse.io/en/shop/USD/artists/2/categories/2) in USD.

| Category | Item | Price |
|---|---|---|
| ARIRANG | S/S Tour T-Shirt (Black) | $46.50 |
| ARIRANG | Photo S/S T-Shirt (Black) | $42.21 |
| ARIRANG | S/S T-Shirt (Charcoal) | $42.21 |
| ARIRANG | S/S Crop T-Shirt (White) | $35.05 |
| ARIRANG | Zip-up Hoodie (Charcoal) | $120.91 |
| ARIRANG | Hoodie & Pants Set-up (Gray) | $178.15 |
| ARIRANG | Wind Jacket (Gray) | $92.29 |
| ARIRANG | Knit Cardigan (Beige) | $135.22 |
| ARIRANG | S/S Jersey | $60.81 |
| RUNSEOKJIN | S/S T-Shirt (Encore Ver.) | $35.05 |
| RUNSEOKJIN | L/S T-Shirt (Encore Ver.) | $42.21 |
| RUNSEOKJIN | Coach Jacket | $85.14 |
| RUNSEOKJIN | Denim Jacket | $96.58 |
| HOPE ON THE STAGE | Stripe PK T-Shirt (Multi) | $35.05 |
| HOPE ON THE STAGE | Hoodie (Black) | $75.12 |
| HOPE ON THE STAGE | S/S T-Shirt (White) | $35.05 |
| HOPE ON THE STAGE | Tour T-Shirt (Brown) | $35.05 |

## Project Structure

```
├── app/
│   ├── page.tsx                    # Home with search & sort
│   ├── layout.tsx                  # Root layout
│   ├── checkout/page.tsx           # Multi-step checkout
│   ├── order-confirmation/page.tsx # Post-order page
│   ├── wishlist/page.tsx           # Wishlist page
│   └── product/[id]/               # Product detail
├── components/
│   ├── Header.tsx                  # Sticky header
│   ├── CartDrawer.tsx              # Cart slide-out
│   ├── ProductCard.tsx             # Card with wishlist + flip
│   ├── ProductGrid.tsx             # Responsive grid
│   └── FilterPills.tsx             # Category filters
├── lib/
│   ├── data.ts                     # Product data
│   ├── cart-context.tsx            # Cart state
│   └── wishlist-context.tsx        # Wishlist state
├── wrangler.jsonc                  # Cloudflare Workers config
├── open-next.config.ts             # OpenNext adapter config
└── .github/workflows/deploy.yml   # GitHub Actions CI/CD
```
