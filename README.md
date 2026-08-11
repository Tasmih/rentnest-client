# RentNest Frontend

## Overview

**RentNest** is a state-of-the-art, modern real estate rental marketplace frontend web application built with **Next.js 15 App Router**, **TypeScript**, and **Tailwind CSS**. It is fully integrated with a production-ready Express.js & PostgreSQL backend REST API.

RentNest provides an intuitive, Airbnb-inspired marketplace experience for property discovery, offering:
- **Property Discovery**: Instant location, property type, and rent budget search with interactive filters and URL synchronization.
- **Authentication**: Local email/password registration, login, and Google OAuth 2.0 authentication.
- **Role-Based Dashboards**: Custom interfaces for **Tenants**, **Landlords**, and **Admins**.
- **Rental Request Workflow**: Interactive application submission, move-in date selection, and landlord request management.
- **Favorites & Wishlists**: One-click property saving with live state persistence.
- **Property Reviews**: Verified 1–5 star ratings and tenant feedback section.
- **Real-Time Notification System**: Unread counts, mark-as-read, and notification management.

---

## Features

### Authentication
- Email and password registration with client-side validation.
- Secure login generating JWT stored safely in client state.
- **Google OAuth 2.0 Login Integration** with role selection workflow.
- Stateless Bearer token transmission on all API calls via Axios interceptors.

### Property Marketplace
- Browse property cards with cover images, price badges, locations, and amenities.
- Dynamic property detail pages featuring landlord contact info and full descriptions.
- **Advanced Search & Filtering**: Filter by location, property type (`FLAT`, `ROOM`, `SEAT`, `SUBLET`, `HOSTEL`), rent budget presets, and custom min/max ranges.
- **URL Synchronization**: Shareable, refresh-safe filter URLs.
- **Offset Pagination**: Dynamic page navigation matching backend metadata.

### Tenant Features
- Browse verified properties across cities.
- Save and manage favorite properties wishlist.
- Submit rental requests with custom move-in dates and messages.
- Post 1–5 star reviews and comments on verified listings.
- In-app notification bell with unread badge counter.

### Landlord Features
- Dedicated landlord analytics dashboard (active properties, pending applications).
- Create new property listings (`/dashboard/add-property`).
- Edit existing property listings (`/dashboard/my-properties/[id]/edit`).
- Delete property listings with confirmation safeguards.
- Manage incoming rental applications (Accept/Reject with transactional updates).

### Admin Features
- System-wide administrative analytics dashboard.
- User management table: view all users, block/unblock, and delete accounts (`/dashboard/users`).
- Property management: monitor and delete platform property listings (`/dashboard/properties`).
- Category management: add, edit, and delete categories (`/dashboard/categories`).
- Analytical reports and stats breakdown (`/dashboard/reports`).

---

## Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15 (App Router)** | Modern React framework for SSR, static generation, and routing |
| **TypeScript** | End-to-end type safety and interface definitions |
| **Tailwind CSS** | Custom styling, glassmorphism, responsive grid layouts, and design system |
| **React Query (@tanstack/react-query)** | Server state management, caching, background refetching, and mutations |
| **Zustand** | Lightweight client-side state management for Auth and Search filters |
| **Axios** | HTTP client with automatic request/response Bearer token interceptors |
| **Framer Motion** | Micro-animations, page transitions, and drawer overlays |
| **React Hook Form & Zod** | High-performance form state management and schema validation |
| **Lucide React** | Consistent, modern vector iconography |

---

## Project Structure

```text
rentnest-client/
├── src/
│   ├── app/                    # Next.js 15 App Router pages & layouts
│   │   ├── (auth)/             # Login & Register routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── properties/         # Marketplace catalog & property details
│   │   │   ├── page.tsx        # Filterable property listing with sidebar
│   │   │   └── [id]/           # Property details page & SEO layout
│   │   ├── dashboard/          # Role-based dashboard pages
│   │   │   ├── users/          # Admin User Management
│   │   │   ├── properties/     # Admin Property Management
│   │   │   ├── categories/     # Admin Category Management
│   │   │   ├── reports/        # Admin Reports & Analytics
│   │   │   ├── my-properties/  # Landlord Property List & Edit
│   │   │   ├── add-property/   # Landlord Add Property Form
│   │   │   ├── rental-requests/# Landlord Application Manager
│   │   │   ├── my-requests/    # Tenant Submitted Applications
│   │   │   ├── favorites/      # Tenant Saved Properties
│   │   │   ├── reviews/        # Tenant/Landlord Review Manager
│   │   │   ├── notifications/  # Notification Inbox
│   │   │   ├── profile/        # Shared User Profile Page
│   │   │   └── settings/       # Shared Account Settings
│   │   ├── sitemap.ts          # Dynamic XML Sitemap generator
│   │   ├── robots.ts           # Search Engine Crawling configuration
│   │   └── layout.tsx          # Global Root Layout with SEO Metadata
│   ├── components/             # Reusable UI & Feature components
│   │   ├── navbar/             # Navigation header & User dropdown
│   │   ├── search/             # SearchBar & AdvancedFilterSidebar
│   │   ├── review/             # RatingStars & ReviewForm
│   │   ├── rental/             # RentalRequestModal
│   │   ├── dashboard/          # NotificationBell & Dashboard Cards
│   │   └── ui/                 # PropertyCard, Badge, SafeImage, Toast
│   ├── services/               # Axios API service layer (auth, property, user, etc.)
│   ├── store/                  # Zustand stores (useAuthStore, useFilterStore)
│   ├── hooks/                  # Custom React hooks (useAuth)
│   ├── types/                  # TypeScript interface definitions
│   ├── utils/                  # Utility functions & data adapters
│   └── constants/              # App config, color palette, route constants
├── public/                     # Static assets and images
├── README.md                   # Frontend documentation
└── package.json
```

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Tasmih/rentnest-client.git
   cd rentnest-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

---

## Running Project

### Development Server
Start Next.js in development mode with hot-reloading:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
Create an optimized production build:
```bash
npm run build
```

### Start Production
Start the built production server:
```bash
npm start
```

---

## Backend Integration

The RentNest frontend communicates with the Express.js REST API:
- **Axios Service Layer**: Modular services (`propertyService`, `userService`, `rentalService`, `favoriteService`, `reviewService`, `notificationService`).
- **JWT Authorization**: Interceptors automatically append `Authorization: Bearer <token>` from LocalStorage.
- **React Query Cache**: Out-of-the-box query caching, optimistic UI updates, and mutation refetching.
- **Error Handling**: Graceful network error handling with toast notifications.
- **Live Backend API Base**: [https://rentnest-server.onrender.com/api](https://rentnest-server.onrender.com/api)

---

## Design System

The application strictly adheres to the curated RentNest SaaS color palette:

- **Primary**: `#E91E63` (Vibrant Rose / Accent buttons & badges)
- **Secondary**: `#1F2937` (Dark Charcoal / Headings & contrast elements)
- **Accent**: `#0EA5A4` (Deep Teal / Features & highlights)
- **Background**: `#FAFAFA` (Clean Off-White / Content surface)

### Key Design Highlights:
- **Airbnb-inspired marketplace design**: High contrast typography, clean whitespace, and rounded cards (`rounded-2xl`).
- **Fully Responsive**: Fluid grid layouts adapting seamlessly from mobile devices to desktop monitors.
- **Reusable Component Architecture**: Pre-styled badges, dynamic buttons, modal dialogs, and skeleton loaders.

---

## Live Application

[https://rentnest-client-three.vercel.app](https://rentnest-client-three.vercel.app)


## Backend API

[https://rentnest-server-fz6q.onrender.com/api](https://rentnest-server-fz6q.onrender.com/api)

The RentNest frontend web application communicates seamlessly with the production Express.js REST API hosted on Render for property queries, user authentication, application tracking, reviews, and real-time notifications.

---

## Frontend Deployment

### Platform
- **Hosting Service**: Vercel
- **Frontend Live URL**: [https://rentnest-client-three.vercel.app](https://rentnest-client-three.vercel.app)
- **Backend API**: [https://rentnest-server-fz6q.onrender.com/api](https://rentnest-server-fz6q.onrender.com/api)

### Environment Variables for Vercel

When deploying to Vercel, configure the following environment variables in **Project Settings > Environment Variables**:

| Variable Name | Description | Production Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Express Backend API Root Endpoint | `https://rentnest-server-fz6q.onrender.com/api` |
| `NEXT_PUBLIC_SITE_URL` | Production Frontend Domain | `https://rentnest-client-three.vercel.app` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `your_google_client_id_here` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `your_google_client_secret_here` |
| `NEXT_PUBLIC_APP_NAME` | Application Name | `RentNest` |

---

## Available Routes

| Route | Access | Purpose |
| :--- | :--- | :--- |
| `/` | Public | Landing page & featured listings |
| `/login` | Public | User authentication login page |
| `/register` | Public | Account registration page |
| `/properties` | Public | Searchable marketplace with advanced filters |
| `/properties/[id]` | Public | Property detail view with booking & review submission |
| `/dashboard` | Protected | Main role-customized dashboard overview |
| `/dashboard/profile` | Protected | User profile management (all roles) |
| `/dashboard/settings` | Protected | User account settings (all roles) |
| `/dashboard/notifications` | Protected | System notifications inbox (all roles) |
| `/dashboard/my-requests` | Protected (`TENANT`) | Submitted rental applications status tracker |
| `/dashboard/favorites` | Protected (`TENANT`) | Saved property wishlist manager |
| `/dashboard/reviews` | Protected (`TENANT`/`LANDLORD`) | Tenant submitted reviews / Landlord received ratings |
| `/dashboard/my-properties` | Protected (`LANDLORD`) | Landlord property management table |
| `/dashboard/add-property` | Protected (`LANDLORD`) | Add new property listing form |
| `/dashboard/my-properties/[id]/edit` | Protected (`LANDLORD`) | Edit property listing page |
| `/dashboard/rental-requests` | Protected (`LANDLORD`) | Landlord application review & accept/reject workflow |
| `/dashboard/users` | Protected (`ADMIN`) | System user administration table |
| `/dashboard/properties` | Protected (`ADMIN`) | System property administration table |
| `/dashboard/categories` | Protected (`ADMIN`) | Category management table |
| `/dashboard/reports` | Protected (`ADMIN`) | Analytics & platform metrics reports |

---

## GitHub  Information

- **Frontend Repository**: [https://github.com/Tasmih/rentnest-client](https://github.com/Tasmih/rentnest-client)
- **Backend Repository**: [https://github.com/Tasmih/rentnest-server](https://github.com/Tasmih/rentnest-server)
- **API Documentation**: [API_DOCUMENTATION.md](https://github.com/Tasmih/rentnest-server/blob/main/API_DOCUMENTATION.md)
