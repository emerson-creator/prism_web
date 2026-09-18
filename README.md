<div align="center">

# Prism

### See technology, refracted clearly.

A polished e-commerce storefront for smart gadgets and everyday tech essentials, built with Next.js and designed around a calm, editorial shopping experience.

<p>
	<a href="#getting-started">Get started</a>
	&nbsp;&middot;&nbsp;
	<a href="#configuration">Configuration</a>
	&nbsp;&middot;&nbsp;
	<a href="#project-structure">Project structure</a>
</p>

</div>

![Prism storefront](public/hero__.jpg)

## What is Prism?

Prism is a full-featured commerce frontend for discovering, comparing, and purchasing thoughtfully selected technology products. It combines a visual storefront with the practical tools needed to operate a catalog and fulfill orders.

### Highlights

- **Editorial storefront** with a responsive hero, featured products, collections, trust messaging, and newsletter signup.
- **Product discovery** with search, category filters, product cards, pagination, loading states, and detailed product pages.
- **Authentication** with login, registration, persisted sessions, silent access-token refresh, profile management, and order history.
- **Cart and checkout** with quantity controls, shipping details, Stripe Elements payment, and order confirmation.
- **Customer account area** for profiles, password changes, and order details.
- **Admin workspace** for products, categories, users, orders, image uploads, and Stripe-powered refunds.
- **Responsive interaction details** with Framer Motion, accessible labels, keyboard-friendly controls, and clear disabled states.

## Tech stack

| Layer              | Technology                                            |
| ------------------ | ----------------------------------------------------- |
| Framework          | [Next.js](https://nextjs.org/) 16 with the App Router |
| UI                 | React 19, Tailwind CSS 4                              |
| Language           | TypeScript                                            |
| State              | Zustand                                               |
| Motion             | Framer Motion                                         |
| Icons              | Lucide React                                          |
| Payments           | Stripe Elements                                       |
| Images             | Cloudinary URLs served by the backend                 |
| Production runtime | Node.js 22 with Docker standalone output              |

## Getting started

### Prerequisites

- Node.js 22 or newer
- npm
- A running Prism API service
- Stripe publishable key for payment checkout

### Install

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` is not present in your checkout, create `.env.local` manually using the variables in [Configuration](#configuration).

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

The frontend communicates with the Prism API through a small centralized client in [`src/libs/api.ts`](src/libs/api.ts). Browser requests use `NEXT_PUBLIC_API_URL`; server-side requests can use `INTERNAL_API_URL` when the API is reachable through a private Docker or network address.

```dotenv
# Public API origin used by the browser
NEXT_PUBLIC_API_URL=http://localhost:4000

# Optional server-only API origin. Falls back to NEXT_PUBLIC_API_URL.
INTERNAL_API_URL=http://localhost:4000

# Stripe publishable key. This is intentionally public and is embedded at build time.
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Environment notes

- `NEXT_PUBLIC_API_URL` must point to the API origin without a trailing endpoint path.
- `INTERNAL_API_URL` is optional and is useful when the Next.js container reaches the API through an internal hostname.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is required by the payment page and must be available during `next build` when using Docker.
- Authentication tokens are persisted in browser `localStorage`; the API client retries a `401` once after refreshing the access token.

## Available scripts

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run start    # Serve the production build
```

## Product and checkout flow

1. Visitors browse featured products or open the catalog.
2. Search and category filters update the catalog URL without a full page navigation.
3. A product can be added from a product card or its detail page.
4. The cart leads to shipping details, followed by Stripe payment confirmation.
5. Successful payments create an order through the API and redirect to the success page.
6. Authenticated customers can review their orders and open individual order details.

The frontend does not process card data directly. Stripe Elements handles sensitive payment fields in the browser, while the API coordinates payment intents and order state.

## Routes

### Storefront

| Route            | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `/`              | Landing page                             |
| `/products`      | Catalog, search, filters, and pagination |
| `/products/[id]` | Product details and add-to-cart controls |
| `/collections`   | Product collections                      |
| `/about`         | About Prism                              |
| `/cart`          | Current shopping cart                    |

### Customer account

| Route               | Purpose                         |
| ------------------- | ------------------------------- |
| `/login`            | Sign in                         |
| `/register`         | Create an account               |
| `/profile`          | Profile and password management |
| `/orders`           | Order history                   |
| `/orders/[id]`      | Order details                   |
| `/checkout`         | Shipping and checkout review    |
| `/checkout/payment` | Stripe payment                  |
| `/checkout/success` | Completed order confirmation    |

### Admin

| Route                  | Purpose                      |
| ---------------------- | ---------------------------- |
| `/admin`               | Admin dashboard              |
| `/admin/products`      | Product management           |
| `/admin/products/new`  | Create a product             |
| `/admin/products/[id]` | Edit a product               |
| `/admin/categories`    | Category management          |
| `/admin/orders`        | Order management and refunds |
| `/admin/users`         | User management              |

## Project structure

```text
src/
├── app/                       # App Router pages and route-level loading/error UI
├── components/
│   ├── modules/               # Feature components grouped by domain
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── collections/
│   │   ├── landing/
│   │   ├── order/
│   │   ├── product/
│   │   └── profile/
│   └── ui/                    # Shared presentation primitives
├── libs/
│   ├── api.ts                 # Typed API client and token refresh handling
│   ├── analytics.ts           # Analytics helpers
│   ├── types.ts               # Shared domain types
│   └── validation.ts          # Client-side validation helpers
└── store/                     # Zustand stores for auth, cart, and checkout
```

## Docker

The project is configured with `output: "standalone"`, so the production image contains only the runtime files required by Next.js.

Build the image with the public build-time variables:

```bash
docker build \
	--build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
	--build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here \
	-t prism-web .
```

Run it on port 3000:

```bash
docker run --rm -p 3000:3000 prism-web
```

The Dockerfile uses a three-stage build, runs the final process as a non-root user, and exposes port `3000`.

## Quality checks

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

Keep feature-specific UI inside its domain module, use the typed API functions rather than calling `fetch` directly from components, and preserve the existing responsive and accessible interaction patterns.

## License

This project is private and intended for the Prism e-commerce application. No open-source license is currently declared.
