# EcommerceProject - Admin Frontend

A compact admin dashboard for the MERN ecommerce app. This client-side app provides the interfaces site operators need to manage products, orders, customers, promotions, and analytics.

Short tech overview
- Framework: React (Vite or Create React App) — TypeScript recommended
- State & data: Redux Toolkit or React Query (for server state)
- Networking: Axios (or fetch) for REST / GraphQL calls
- UI: Tailwind CSS, Material UI, or Chakra UI
- Charts & reports: Chart.js, Recharts, or ApexCharts
- Auth: JWT / session tokens handled against backend admin routes
- Testing: Jest + React Testing Library
- Build & deploy: npm / yarn / pnpm; host build on Vercel, Netlify, or static hosting

Admin users & roles
- Admin (full access): Manage products, orders, users, site settings, promotions, view analytics, and perform refunds.
- Manager (operational): CRUD products, update inventory, process orders, view most analytics but limited site settings.
- Support (customer service): View orders, update order status, manage refunds and customer notes; no product/site settings.
- Analyst (read-only): Access to dashboards and reports only.

Core functionalities
- Product management
  - Create / read / update / delete products and variants
  - Inventory levels, SKU and barcode management
  - Category and tag management
  - Bulk import / export (CSV)
- Order management
  - View & filter orders, change statuses (processing, shipped, delivered, refunded)
  - Order detail view: items, payments, shipping address, notes
  - Issue refunds and record shipments (integration points for carriers)
- Customer & user management
  - View and search customers, user profile / order history
  - Manage admin users and roles, lock/ban users
- Promotions & pricing
  - Create/edit coupons, discounts, sale prices, and scheduling
- Reviews & content moderation
  - Approve, edit, or remove product reviews and questions
- Analytics & reporting
  - Sales dashboards, top products, revenue by date, conversion metrics
  - Exportable reports (CSV/PDF)
- Settings & integrations
  - Payment gateways (Stripe), tax rules, shipping carriers, email providers
  - Store metadata (logo, contact info, legal pages)
- Notifications & logs
  - Admin notifications, activity / audit logs, error reporting
- Security & audit
  - Two-factor for admin accounts, role-based access controls, audit trail for critical actions

Quick start
1. Install
   - npm install
2. Run locally
   - npm run dev (or npm start)
3. Build
   - npm run build

Environment (example)
- REACT_APP_API_URL=https://your-api.example.com
- REACT_APP_ADMIN_PREFIX=/admin
- REACT_APP_STRIPE_KEY=pk_live_...
- REACT_APP_MAPS_KEY=...
- Add other keys required by integrations (Sentry DSN, mail provider keys)

Notes / best practices
- Keep admin APIs separate (or protected) from public client endpoints; ensure backend enforces role checks.
- Prefer TypeScript and strict linting for admin UIs — they modify critical data.
- Use server-side pagination & filtered endpoints for large lists (orders, customers).
- Secure secrets in CI/CD and do not expose them in the client; use short-lived tokens where possible.

Contributing & License
- Contributions welcome; open an issue or PR.
- Add your license here.
