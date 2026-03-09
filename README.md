# 🌸 Rosallie Baby — Premium Newborn E-Commerce Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern e-commerce platform for premium newborn hospital outfits, toys, and baby essentials**

**🌐 [rosalliebaby.com](https://rosalliebaby.com)**

[Features](#-features) • [Tech Stack](#️-technology-stack) • [Installation](#-installation) • [API](#-api-endpoints) • [Database](#️-database-schema) • [Deployment](#-deployment)

</div>

---

## 📋 About the Project

**Rosallie Baby** is a full-stack e-commerce platform specializing in premium newborn products — hospital discharge outfits, organic muslin sets, plush toys, and matching baby accessories. The platform is built to celebrate the most precious moments for families, offering a curated catalog of safe, beautifully designed products with fast delivery.

The platform handles the complete shopping journey from product discovery to order completion, featuring iyzico payment integration, admin content management, SEO-optimized product and blog pages, Meta Pixel & Google Analytics tracking, and a secure multi-role authentication system.

---

## ✨ Features

### 🛍️ Customer Features

- **Product Catalog** — Browse by category: Hospital Outfit Sets, Hospital Outfit Special Sets, Blankets, and Toys
- **Product Detail Pages** — Image galleries with zoom, variant selection, stock status, and customer reviews
- **Advanced Search** — Full-text product search with instant results
- **Shopping Cart** — Persistent cart with quantity management and real-time totals
- **Wishlist / Favorites** — Save products for later with one click
- **Multi-Step Checkout** — Address selection → Cargo step → Payment, all in a guided stepper
- **Secure Payment** — iyzico payment gateway with installment options (Turkish bank cards)
- **Order Tracking** — Order history and status tracking from user profile
- **User Profile** — Manage personal info and saved delivery addresses
- **Newsletter Subscription** — Subscribe for campaigns and new arrivals
- **Blog** — Parenting tips, product guides, and SEO-optimized articles
- **Legal Pages** — Distance selling agreement, cancellation policy, and privacy policy
- **Contact Page** — Direct inquiry form with email delivery
- **Cookie Consent** — KVKK/GDPR-compliant cookie management
- **Responsive Design** — Mobile-first layout optimized for all screen sizes
- **SEO & Analytics** — Sitemap, robots.txt, Google Analytics, Meta Pixel, and structured data (JSON-LD)

### 🔧 Admin Features

- **Admin Dashboard** — Sales analytics with Chart.js/Recharts graphs, order volume, and revenue overview
- **Product Management** — Add, edit, and delete products with image upload, category assignment, and custom name support
- **Order Management** — View all orders with detailed dialog, filter by status, and update fulfillment state
- **User Management** — List all registered users, view roles, and manage accounts
- **Blog Management** — Create, edit (rich text), and delete blog posts with slug-based routing
- **Subscriber Management** — Export and manage newsletter subscribers
- **Settings Management** — Site-wide configuration (contact info, announcements, etc.)
- **Protected Routes** — Admin panel locked behind session-based auth

### ⚙️ Technical Features

- **Next.js 15 with Turbopack** — Blazing-fast development builds and optimized production output
- **Prisma ORM + MySQL** — Type-safe relational data access with migration history
- **NextAuth.js + Iron Session** — Dual session strategy for admin and user flows
- **Meta CAPI Integration** — Server-side Meta Conversions API event tracking
- **SEO Infrastructure** — Dynamic `sitemap.js`, `robots.js`, Open Graph tags, and JSON-LD schemas
- **Cloudinary + next-cloudinary** — Optimized image delivery and admin upload
- **Nodemailer** — Transactional emails for contact form and order notifications

---

## 🛠️ Technology Stack

### Frontend

| Technology                 | Version  | Description                                |
| -------------------------- | -------- | ------------------------------------------ |
| Next.js                    | 15.5.9   | App Router, SSR/SSG, API Routes, Turbopack |
| React                      | 19.2.1   | Component-based UI                         |
| Tailwind CSS               | 4        | Utility-first styling                      |
| Radix UI                   | 1.x      | Accessible UI primitives (20+ components)  |
| Motion                     | 12.23.25 | Page and component animations              |
| Lucide React               | 0.544.0  | Icon library                               |
| Embla Carousel             | 8.6.0    | Product image carousel                     |
| React Hook Form            | 7.62.0   | Form state management                      |
| Zod                        | 4.1.8    | Schema validation                          |
| react-fast-marquee         | 1.6.5    | Scrolling hero strip                       |
| Recharts                   | 2.15.4   | Admin analytics charts                     |
| Chart.js + react-chartjs-2 | 4.5.0    | Admin dashboard charts                     |
| Sonner                     | 2.0.7    | Toast notifications                        |
| date-fns                   | 4.1.0    | Date formatting                            |
| next-themes                | 0.4.6    | Theme management                           |

### Backend & Database

| Technology      | Version | Description                    |
| --------------- | ------- | ------------------------------ |
| Prisma          | 6.19.0  | ORM & database migrations      |
| MySQL           | 8.0     | Relational database            |
| NextAuth.js     | 4.24.11 | User authentication            |
| Iron Session    | 8.0.4   | Admin session management       |
| bcrypt          | 6.0.0   | Password hashing               |
| Nodemailer      | 6.10.1  | Email delivery                 |
| Cloudinary      | 2.8.0   | Image upload & CDN             |
| next-cloudinary | 6.17.5  | Next.js Cloudinary integration |
| iyzipay         | 2.0.64  | iyzico payment gateway SDK     |

### Analytics & Marketing

| Technology                  | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| Google Analytics            | Page view and conversion tracking                    |
| Meta Pixel                  | Client-side ad event tracking                        |
| Meta Conversions API (CAPI) | Server-side event tracking via `/api/meta-capi`      |
| JSON-LD Schemas             | ProductSchema and BlogSchema for SEO structured data |

### Infrastructure

| Technology    | Description                                  |
| ------------- | -------------------------------------------- |
| Vercel        | Frontend deployment (recommended)            |
| Cloudinary    | CDN & image optimization                     |
| MySQL (cloud) | Managed DB (PlanetScale / Railway / AWS RDS) |

---

## 🏗️ Architecture Overview

```
Browser / Client
       │
       ▼
  Next.js 15 (Turbopack)
  ┌──────────────────────────────────────────────┐
  │  App Router (SSR / SSG / ISR / API Routes)   │
  │                                              │
  │  Public Pages                                │
  │  ├── / (Homepage)                            │
  │  ├── /all_products/[category]/[id]           │
  │  ├── /blog & /blog/[slug]                    │
  │  ├── /cart, /checkout, /favorites            │
  │  ├── /profile (orders, addresses)            │
  │  └── /search                                 │
  │                                              │
  │  Admin Pages (/admin/*)                      │
  │  ├── dashboard, products, orders             │
  │  ├── blog, users, subscribers, settings      │
  │                                              │
  │  API Routes (/api/*)                         │
  │  ├── auth, products, cart, order             │
  │  ├── blog, review, favorites, address        │
  │  ├── payment, subscribe, upload              │
  │  └── meta-capi, send-mail, setting           │
  │                                              │
  │  SEO: sitemap.js, robots.js, JSON-LD         │
  │  Analytics: GA + Meta Pixel + CAPI           │
  └──────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
       MySQL              Cloudinary
    (via Prisma)          (Images/CDN)
         │
      iyzico           Nodemailer
    (Payments)           (Email)
         │
   Meta CAPI
  (Server-side tracking)
```

---

## 📁 Project Structure

```
rosallie-baby/
├── app/
│   ├── page.jsx                          # Homepage
│   ├── layout.js                         # Root layout (providers, analytics)
│   ├── providers.js                      # NextAuth + context providers
│   ├── sitemap.js                        # Dynamic XML sitemap
│   ├── robots.js                         # Search engine crawl rules
│   ├── not-found.jsx                     # 404 page
│   │
│   ├── about/page.jsx                    # About page
│   ├── blog/
│   │   ├── page.jsx                      # Blog listing
│   │   └── [slug]/page.jsx               # Blog detail (SEO slug routing)
│   ├── search/page.jsx                   # Search results
│   ├── cart/page.jsx                     # Shopping cart
│   ├── favorites/page.jsx                # Wishlist
│   ├── contact/page.jsx                  # Contact form
│   ├── example-product/page.jsx          # Product preview / demo
│   │
│   ├── all_products/                     # Product category pages
│   │   ├── blanket/
│   │   │   ├── page.jsx                  # Blanket listing
│   │   │   └── [id]/page.jsx             # Blanket detail
│   │   ├── hospital_outfit_set/
│   │   │   ├── page.jsx
│   │   │   └── [id]/page.jsx
│   │   ├── hospital_outfit_special_set/
│   │   │   ├── page.jsx
│   │   │   └── [id]/page.jsx
│   │   └── toy/
│   │       ├── page.jsx
│   │       └── [id]/page.jsx
│   │
│   ├── account/
│   │   ├── login/page.jsx
│   │   └── register/page.jsx
│   │
│   ├── checkout/
│   │   ├── page.jsx                      # Multi-step checkout
│   │   ├── success/page.jsx              # Payment success
│   │   └── unsuccess/page.jsx            # Payment failure
│   │
│   ├── profile/
│   │   ├── page.jsx                      # Profile overview
│   │   ├── orders/page.jsx               # Order history
│   │   └── addresses/page.jsx            # Saved addresses
│   │
│   ├── contract/
│   │   ├── cancellation/page.jsx
│   │   ├── distance_selling/page.jsx
│   │   └── privacy_policy/page.jsx
│   │
│   ├── admin/
│   │   ├── page.jsx                      # Admin login
│   │   ├── dashboard/page.jsx            # Analytics dashboard
│   │   ├── products/page.jsx             # Product management
│   │   ├── orders/page.jsx               # Order management
│   │   ├── users/page.jsx                # User management
│   │   ├── blog/
│   │   │   ├── page.jsx                  # Blog list
│   │   │   ├── new/page.jsx              # New post editor
│   │   │   └── [id]/edit/page.jsx        # Edit post
│   │   ├── subscribers/page.jsx
│   │   └── settings/page.jsx
│   │
│   └── api/
│       ├── auth/[...nextauth]/           # NextAuth handler
│       ├── auth/logout/                  # Session destroy
│       ├── account/check/               # Email existence check
│       ├── account/register/            # User registration
│       ├── products/                     # Product CRUD
│       ├── products/[id]/               # Single product
│       ├── products/category/[category]/ # Category filter
│       ├── cart/                         # Cart management
│       ├── cart/[id]/                    # Cart item operations
│       ├── order/                        # Order creation
│       ├── order/user/                   # User order list
│       ├── favorites/                    # Wishlist
│       ├── favorites/[id]/
│       ├── review/                       # Product reviews
│       ├── review/[id]/
│       ├── blog/                         # Public blog API
│       ├── blog/[slug]/                  # Blog by slug
│       ├── blog/admin/                   # Admin blog CRUD
│       ├── blog/admin/[id]/
│       ├── address/                      # User addresses
│       ├── address/[id]/
│       ├── user/                         # Current user profile
│       ├── user/all/                     # Admin user list
│       ├── user/all/[id]/
│       ├── payment/                      # iyzico payment
│       ├── subscribe/                    # Newsletter
│       ├── subscribe/[id]/
│       ├── upload/                       # Cloudinary upload
│       ├── send-mail/                    # Contact email
│       ├── setting/                      # Site settings
│       └── meta-capi/                    # Meta Conversions API
│
├── components/
│   ├── account/
│   │   ├── login.jsx
│   │   └── register.jsx
│   ├── admin/
│   │   ├── login/login.jsx
│   │   ├── sideBar.jsx
│   │   ├── dashboard/dashboard.jsx
│   │   ├── products/                     # Add, update, list products
│   │   ├── orders/                       # Orders table + detail dialog
│   │   ├── blog/                         # Blog list, new, edit
│   │   ├── users/users.jsx
│   │   ├── subscribers/subscribers.jsx
│   │   └── settings/settings.jsx
│   ├── cart/
│   │   ├── cart.jsx
│   │   ├── cartItem.jsx
│   │   └── cartSummary.jsx
│   ├── checkout/
│   │   ├── checkout.jsx                  # Stepper controller
│   │   ├── paymentStepper.jsx            # Step indicator
│   │   ├── stepAddress.jsx               # Address selection step
│   │   ├── stepCargo.jsx                 # Cargo info step
│   │   ├── stepPayment.jsx               # iyzico payment step
│   │   ├── cartSummary.jsx               # Order summary sidebar
│   │   ├── checkoutSkeleton.jsx          # Loading skeleton
│   │   ├── success.jsx                   # Success page content
│   │   └── unsuccess.jsx                 # Failure page content
│   ├── favorites/favorites.jsx
│   ├── home/
│   │   ├── heroes.jsx                    # Hero slider
│   │   ├── hereosBar.jsx                 # Hero text bar
│   │   ├── categories.jsx                # Category grid
│   │   ├── categoryCard.jsx              # Single category card
│   │   ├── productSection.jsx            # Featured product row
│   │   ├── muslinSets.jsx                # Muslin sets section
│   │   ├── sleepingFriends.jsx           # Toy section
│   │   ├── mostVisited.jsx               # Most visited products
│   │   └── subscribe.jsx                 # Newsletter signup
│   ├── layout/
│   │   ├── navbar.jsx
│   │   ├── footer.jsx
│   │   ├── topbar.jsx
│   │   ├── breadcrumb.jsx
│   │   ├── pagination.jsx
│   │   ├── imageZoom.jsx
│   │   ├── loading.jsx
│   │   ├── unauthorized.jsx
│   │   ├── userMegaMenu.jsx
│   │   ├── cart.jsx                      # Navbar cart dropdown
│   │   ├── cartItem.jsx
│   │   ├── cartSummary.jsx
│   │   └── completePurchase.jsx
│   ├── products/
│   │   ├── productCard.jsx
│   │   ├── productDetail.jsx
│   │   ├── productToolBar.jsx
│   │   ├── bestseller.jsx
│   │   ├── review.jsx
│   │   ├── completePurchase.jsx
│   │   ├── allProducts/
│   │   │   ├── allProducts.jsx
│   │   │   └── productToolBar.jsx
│   │   ├── blanket/blanket.jsx
│   │   ├── hospitalOutfitSet/hospitalOutfitSet.jsx
│   │   ├── hospitalOutfitSpecialSet/hospitalOutfitSpecialSet.jsx
│   │   └── toy/toy.jsx
│   ├── profile/
│   │   ├── sideBar.jsx
│   │   ├── myPersonalInformation.jsx
│   │   ├── orders.jsx
│   │   ├── addresses.jsx
│   │   └── addressForm.jsx
│   ├── search/
│   │   ├── search.jsx
│   │   └── productCard.jsx
│   ├── seo/
│   │   ├── ProductSchema.jsx             # JSON-LD product structured data
│   │   ├── BlogSchema.jsx                # JSON-LD blog structured data
│   │   ├── GoogleAnalytics.jsx           # GA4 script injection
│   │   └── MetaPixel.jsx                 # Meta Pixel script injection
│   └── ui/                              # 40+ Radix-based UI primitives
│
├── contexts/
│   ├── cartContext.jsx                   # Global cart state
│   └── favoriteContext.jsx               # Global favorites state
│
├── hooks/
│   └── use-mobile.js                     # Mobile breakpoint hook
│
├── lib/
│   ├── db.js                             # Prisma client singleton
│   ├── prisma.js                         # Prisma instance export
│   ├── session.js                        # Iron session configuration
│   └── utils.js                          # General utilities (cn, etc.)
│
├── prisma/
│   ├── schema.prisma                     # Database schema
│   ├── seed.js                           # Initial data seed
│   └── migrations/                       # Migration history
│       ├── 20251016123601_init/
│       ├── 20251205122404_add_custom_name_to_order_item/
│       ├── 20251205122858_add_tcno_to_order_address/
│       └── 20251210081216_add_custom_name_to_product/
│
├── utils/
│   ├── cart.js                           # Cart calculation helpers
│   └── metaTracking.js                   # Meta CAPI event builders
│
└── public/
    ├── allProducts/                      # Product images (WebP, hospital + toy)
    ├── categories/                       # Category cover images
    ├── categoryBanners/                  # Category hero banners
    ├── heroes/hero.webp                  # Homepage hero image
    ├── iyzico/                           # Payment branding assets
    ├── logo/                             # Site logos (3 variants)
    ├── login/                            # Auth page images
    ├── subscribe/                        # Newsletter section image
    ├── examples/                         # Product demo images
    ├── countries.json                    # Country list data
    └── og-image.jpg                      # Open Graph image
```

---

## 🗄️ Database Schema

All models are managed with Prisma and stored in MySQL.

### Core Tables

```
User              → Customer accounts (name, email, hashed password, role, phone)
Admin             → Admin accounts (username, hashed password)

Product           → Product catalog (name, customName, price, description, images, category, stock)
Category          → Product categories (blanket, hospital_outfit_set, hospital_outfit_special_set, toy)

CartItem          → Items in user's active cart (userId, productId, quantity, variant)
Favorite          → User wishlist (userId, productId)
Review            → Product reviews (rating, comment, userId, productId)

Order             → Customer orders (status, total, cargo tracking, timestamps)
OrderItem         → Line items within an order (productId, quantity, price, customName)
OrderAddress      → Delivery address snapshot at order time (including TC identity number)

Address           → Saved user delivery addresses
Blog              → Blog posts (title, content, slug, image, tags, publishedAt)
Subscribe         → Newsletter subscribers (email, createdAt)
Setting           → Key-value site settings (contactEmail, announcement, etc.)
```

### Key Relationships

- `Product` has many `CartItem`, `Favorite`, `Review`, `OrderItem`
- `Order` belongs to `User` and has one `OrderAddress` and many `OrderItem`
- `OrderAddress` stores a complete address snapshot independently of the user's saved `Address` records, including the Turkish identity number (`tcNo`) for legal compliance
- `OrderItem` stores a `customName` field to support personalized product labeling at time of purchase
- `Blog` uses a unique `slug` for SEO-friendly URL routing

---

## 🚀 Installation

### Prerequisites

- Node.js **18+**
- MySQL **8.0+**
- npm or yarn
- Cloudinary account
- iyzico account _(for payment processing)_

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/rosallie-baby.git
cd rosallie-baby
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/rosallie_baby"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# iyzico Payment Gateway
IYZICO_API_KEY="your-iyzico-api-key"
IYZICO_SECRET_KEY="your-iyzico-secret-key"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"   # Use production URL for live

# Email (Gmail SMTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-gmail-app-password"

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_META_PIXEL_ID="your-meta-pixel-id"

# Meta Conversions API (server-side)
META_ACCESS_TOKEN="your-meta-capi-access-token"
META_PIXEL_ID="your-meta-pixel-id"
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords to generate a dedicated SMTP password.

> **iyzico Sandbox:** Use `https://sandbox-api.iyzipay.com` during development. Switch to `https://api.iyzipay.com` for production.

---

### 4. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (or run migrations)
npx prisma db push

# Seed initial data
npm run seed
```

---

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The dev server uses **Turbopack** for fast refresh and faster builds.

---

### Production Build

```bash
npm run build
npm start
```

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### 🔐 Authentication

| Method | Endpoint                  | Description                  |
| ------ | ------------------------- | ---------------------------- |
| POST   | `/api/auth/[...nextauth]` | NextAuth sign-in handler     |
| POST   | `/api/auth/logout`        | Destroy session and sign out |
| GET    | `/api/account/check`      | Check if email is registered |
| POST   | `/api/account/register`   | Register new user            |

### 📦 Products

| Method | Endpoint                            | Description            |
| ------ | ----------------------------------- | ---------------------- |
| GET    | `/api/products`                     | List all products      |
| POST   | `/api/products`                     | Create product (Admin) |
| GET    | `/api/products/[id]`                | Get product by ID      |
| PUT    | `/api/products/[id]`                | Update product (Admin) |
| DELETE | `/api/products/[id]`                | Delete product (Admin) |
| GET    | `/api/products/category/[category]` | Products by category   |

### 🛒 Cart

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| GET    | `/api/cart`      | Get user's active cart    |
| POST   | `/api/cart`      | Add item to cart          |
| PUT    | `/api/cart/[id]` | Update cart item quantity |
| DELETE | `/api/cart/[id]` | Remove item from cart     |

### 📋 Orders

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| POST   | `/api/order`      | Create new order          |
| GET    | `/api/order/user` | Get current user's orders |

### 💳 Payment

| Method | Endpoint       | Description                     |
| ------ | -------------- | ------------------------------- |
| POST   | `/api/payment` | Initiate iyzico payment session |

### ❤️ Favorites

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| GET    | `/api/favorites`      | Get user's wishlist      |
| POST   | `/api/favorites`      | Add product to favorites |
| DELETE | `/api/favorites/[id]` | Remove from favorites    |

### ⭐ Reviews

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/api/review`      | List reviews                |
| POST   | `/api/review`      | Submit a review             |
| DELETE | `/api/review/[id]` | Delete review (Admin/Owner) |

### 📝 Blog

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| GET    | `/api/blog`            | List all published posts |
| GET    | `/api/blog/[slug]`     | Get post by slug         |
| GET    | `/api/blog/admin`      | List all posts (Admin)   |
| POST   | `/api/blog/admin`      | Create blog post (Admin) |
| PUT    | `/api/blog/admin/[id]` | Update blog post (Admin) |
| DELETE | `/api/blog/admin/[id]` | Delete blog post (Admin) |

### 📍 Addresses

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| GET    | `/api/address`      | Get user's saved addresses |
| POST   | `/api/address`      | Add new address            |
| PUT    | `/api/address/[id]` | Update address             |
| DELETE | `/api/address/[id]` | Delete address             |

### 👤 Users

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/api/user`          | Get current user profile |
| PUT    | `/api/user`          | Update user profile      |
| GET    | `/api/user/all`      | List all users (Admin)   |
| PUT    | `/api/user/all/[id]` | Update user (Admin)      |
| DELETE | `/api/user/all/[id]` | Delete user (Admin)      |

### 📬 Utilities

| Method  | Endpoint              | Description                     |
| ------- | --------------------- | ------------------------------- |
| POST    | `/api/subscribe`      | Subscribe to newsletter         |
| DELETE  | `/api/subscribe/[id]` | Unsubscribe (Admin)             |
| POST    | `/api/send-mail`      | Send contact form email         |
| POST    | `/api/upload`         | Upload image to Cloudinary      |
| GET/PUT | `/api/setting`        | Get/update site settings        |
| POST    | `/api/meta-capi`      | Server-side Meta event tracking |

---

## 💳 Payment Integration — iyzico

Rosallie Baby uses [iyzico](https://iyzico.com) for secure payment processing with support for major Turkish bank card installment programs.

### Checkout Flow

1. User completes cart and navigates to `/checkout`
2. **Step 1 — Address**: Select or add a delivery address
3. **Step 2 — Cargo**: Review shipping info
4. **Step 3 — Payment**: Card details entered via iyzico secure form
5. iyzico processes the payment server-side via `/api/payment`
6. On success → order is created in DB → user redirected to `/checkout/success`
7. On failure → user redirected to `/checkout/unsuccess`

### Supported Cards

Axess, Bonus, Maximum, World, Paraf, BankKart Combo

> **Sandbox:** Set `IYZICO_BASE_URL=https://sandbox-api.iyzipay.com` and use iyzico's [test card numbers](https://dev.iyzipay.com/en/test-cards) during development.

---

## 📊 Analytics & Tracking

### Google Analytics (GA4)

Injected via `<GoogleAnalytics />` component in the root layout. Tracks page views, conversions, and custom events.

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

### Meta Pixel (Client-Side)

Injected via `<MetaPixel />` component. Tracks `PageView`, `AddToCart`, `InitiateCheckout`, and `Purchase` events on the client.

```env
NEXT_PUBLIC_META_PIXEL_ID="your-pixel-id"
```

### Meta Conversions API (Server-Side)

Server-to-server event delivery via `/api/meta-capi` using the `metaTracking.js` utility. Enables reliable purchase event tracking even with ad blockers active.

```env
META_ACCESS_TOKEN="your-meta-system-user-access-token"
META_PIXEL_ID="your-pixel-id"
```

### SEO

- **Dynamic sitemap** — `/sitemap.xml` generated from `app/sitemap.js`
- **robots.txt** — Generated from `app/robots.js`
- **JSON-LD structured data** — `ProductSchema` and `BlogSchema` components inject schema markup per page
- **Open Graph** — `og-image.jpg` and per-page meta tags

---

## 🔐 Security

- **NextAuth.js** — User sessions with encrypted JWT in HttpOnly cookies
- **Iron Session** — Admin session management with signed, encrypted cookies
- **bcrypt** — Password hashing (salt rounds: 12)
- **Zod** — Schema validation on all API route inputs
- **Role-based access** — API routes check session role before processing admin operations
- **TC Identity Number storage** — `tcNo` stored on `OrderAddress` for legal compliance in Turkish e-commerce (Distance Selling Law)
- **Cloudinary signed uploads** — All uploads use server-generated signatures
- **Environment variable isolation** — No secrets exposed to the client bundle
- **KVKK compliance** — Privacy policy, cancellation policy, and distance selling agreement pages included

---

## 🧪 Development Tools

### Database Management

```bash
# Open Prisma Studio (visual DB editor)
npx prisma studio

# Create a new migration
npx prisma migrate dev --name describe-your-change

# Reset and re-seed (destructive)
npx prisma migrate reset && npm run seed
```

### Build & Lint

```bash
# Development (Turbopack)
npm run dev

# Production build (Turbopack)
npm run build

# Start production server
npm start
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy — Vercel detects Next.js and handles the build automatically

```bash
# CLI deployment
npx vercel --prod
```

### Docker

```bash
# Build the image
docker build -t rosallie-baby .

# Run the container
docker run -p 3000:3000 --env-file .env rosallie-baby
```

### Production Checklist

- Set `NODE_ENV=production`
- Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL` to your production domain
- Switch `IYZICO_BASE_URL` to `https://api.iyzipay.com`
- Use a managed MySQL instance (PlanetScale, Railway, AWS RDS)
- Configure Cloudinary for the production environment
- Enable HTTPS (automatic on Vercel; use Let's Encrypt for VPS)
- Verify `robots.js` allows the correct crawl paths
- Add real GA4 and Meta Pixel IDs

---

## 🤝 Contributing

1. **Fork** this repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: add AmazingFeature'
   ```
4. Push your branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**

### Code Standards

- Keep components modular and single-responsibility
- Validate all API inputs with Zod
- Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- Run `npm run build` before submitting PRs

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📞 Contact

- 🌐 Website: [rosalliebaby.com](https://rosalliebaby.com)
- 📧 Email: support@rosalliebaby.com
- 📸 Instagram: [@rosalliebaby](https://www.instagram.com/rosalliebaby)
- 👍 Facebook: [Rosallie Baby](https://www.facebook.com/rosalliebaby)

---

<div align="center">

_Rosallie Baby — Celebrating your baby's happiest day._ 🌸

</div>
