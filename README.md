# FarmConnect Frontend

FarmConnect Frontend is the React and Vite web application for farmers, buyers, and admins using the FarmConnect backend API. It includes public product browsing, authentication, protected dashboards, role-based routes, Axios API services, Bootstrap styling, and JWT storage in `localStorage`.

## Tech Stack

- ReactJS with Vite
- React Router
- Axios
- Bootstrap
- Plain JavaScript, not TypeScript

## Folder Structure

- `src/components/`: Shared UI such as the navbar, product cards, alerts, loading spinner, and route guards.
- `src/context/AuthContext.jsx`: Stores logged-in user state and handles login/logout.
- `src/layouts/`: Public and dashboard page shells.
- `src/pages/public/`: Home, about, browsing, product details, login, and register pages.
- `src/pages/farmer/`: Farmer dashboard, profile, product management, orders, and inquiries.
- `src/pages/buyer/`: Buyer dashboard, profile, order tracking, inquiries, and favorites.
- `src/pages/admin/`: Admin dashboard and management pages.
- `src/services/`: Axios API wrappers grouped by backend feature.
- `src/utils/`: Small formatting helpers.

## Prerequisites

- Node.js 18 or newer
- npm
- A running FarmConnect backend API

## Setup

1. Install packages:

```bash
npm install
```

2. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

3. Confirm `.env` points to the backend:

```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOADS_URL=http://localhost:5000
```

4. Start the backend from `../farmconnect-backend` if it is not already running:

```bash
cd ../farmconnect-backend
npm run dev
```

5. Start the frontend from this folder:

```bash
cd ../farmconnect-frontend
npm run dev
```

Vite prints the local app URL, usually `http://localhost:5173`.

## Environment Variables

- `VITE_API_URL`: Backend API base URL, usually `http://localhost:5000/api`.
- `VITE_UPLOADS_URL`: Backend file server URL, usually `http://localhost:5000`.

## Run Commands

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run preview
```

## Verify the Frontend

1. Open the Vite URL printed in the terminal, usually `http://localhost:5173`.
2. Confirm the backend is running at `http://localhost:5000`.
3. Log in with one of the seeded accounts below.
4. Browse products to confirm the frontend can load API data.

## Troubleshooting

- If the product list does not load, check that the backend is running and `VITE_API_URL` ends with `/api`.
- If image uploads do not display, check that `VITE_UPLOADS_URL` points to the backend root, not `/api`.
- If login succeeds but dashboard requests fail, clear the browser's `farmconnect_token` and `farmconnect_user` values from `localStorage`, then log in again.
- If the backend reports a CORS error, add the frontend origin printed by Vite to the backend `.env` `CLIENT_URLS` value and restart the backend.

## Page and Route Guide

### Public Routes

- `/`: Home page with calls to browse and register.
- `/about`: Project and marketplace overview.
- `/products`: Product browser with search and filters.
- `/products/:id`: Product details with buyer inquiry and order forms.
- `/login`: Login form.
- `/register`: Farmer or buyer registration form.

### Farmer Routes

All farmer routes require login as a farmer.

- `/farmer`: Farmer dashboard statistics.
- `/farmer/profile`: Create or update farm profile.
- `/farmer/products`: View, edit, or remove own products.
- `/farmer/products/new`: Add produce listing with optional image upload.
- `/farmer/products/:id/edit`: Edit own produce listing.
- `/farmer/orders`: Accept or reject buyer orders.
- `/farmer/inquiries`: View and mark buyer inquiries as answered.

### Buyer Routes

All buyer routes require login as a buyer.

- `/buyer`: Buyer dashboard statistics.
- `/buyer/profile`: Create or update buyer profile.
- `/buyer/orders`: Track order status.
- `/buyer/inquiries`: Track sent inquiries.
- `/buyer/favorites`: View locally saved favorite product links.

### Admin Routes

All admin routes require login as an admin.

- `/admin`: System statistics.
- `/admin/users`: Activate or deactivate users.
- `/admin/products`: Review and remove product listings.
- `/admin/orders`: Review and update order status.
- `/admin/categories`: Add or deactivate produce categories.

## Authentication Flow

`AuthContext` calls the backend login endpoint and stores the JWT in `localStorage` as `farmconnect_token`. The Axios interceptor in `src/services/api.js` attaches that token to each API request. `ProtectedRoute` checks whether a user is logged in, while `RoleBasedRoute` checks whether the logged-in user has the required role.

## Default Login Accounts

Use these after loading the backend seed data. All use `password123`.

- Admin: `admin@farmconnect.test`
- Farmer: `farmer1@farmconnect.test`
- Buyer: `buyer1@farmconnect.test`

## New Features (assignment extension)

Added on top of the original commit `03456156bb6ff0a98588589ef1e898025b945608`. They need the matching backend branch and its updated database (see the backend README).

- **Favorites (database-backed):** "Save favorite" on a product page now calls the API instead of `localStorage`; `/buyer/favorites` lists and removes favorites, and they follow the buyer to any browser.
- **Product reviews:** star rating and comment on the product page. The form appears only for buyers with a completed order for that product.
- **Inquiry conversations:** buyers (`/buyer/inquiries`) and farmers (`/farmer/inquiries`) can exchange replies on each inquiry.

Setup: `npm install`, `cp .env.example .env`, then `npm run dev` (http://localhost:5173) with the backend running on port 5000.
