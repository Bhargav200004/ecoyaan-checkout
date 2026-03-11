# Ecoyaan Checkout

A multi-step checkout flow application for eco-friendly sustainable products — built with Next.js, TypeScript, Tailwind CSS, and Zustand.

---

## Project Overview

**Ecoyaan Checkout** simulates a real-world e-commerce checkout experience with four sequential steps:

```
Cart → Shipping Address → Payment → Order Success
```

The app showcases:
- Server-Side Rendering (SSR) for the cart page via `getServerSideProps`
- Client-side state **persisted across sessions** with Zustand + `localStorage`
- **Address Book** — save, select, and manage multiple delivery addresses
- Form validation with react-hook-form + Zod schemas
- Accessible, reusable UI components built on Radix UI primitives
- **Sticky action bar** — Back and Proceed buttons always visible while scrolling
- Eco-themed green UI with responsive layout optimised for both mobile and desktop

---

## Tech Stack & Decisions

### Next.js 14 with Pages Router
**Why:** The Pages Router provides `getServerSideProps` for SSR on the cart page, fetching product data server-side before rendering. This ensures the page is fully populated on first load (better SEO, no loading spinner for initial data). The Pages Router has a mature, stable API with wide community support.

### TypeScript
**Why:** Type safety across the entire codebase catches bugs at compile time rather than runtime. The shared `types/index.ts` file ensures `CartItem`, `CartData`, `ShippingAddress`, and `SavedAddress` interfaces are consistent between the API, store, and UI components.

### Tailwind CSS
**Why:** Utility-first approach enables rapid UI prototyping without leaving JSX. Responsive design (`lg:grid-cols-3`) and conditional styles (`cn()` helper) are applied directly to elements. No CSS-in-JS runtime overhead; styles are purged at build time for minimal bundle size.

### shadcn/ui Components
**Why:** shadcn/ui provides copy-paste components (not a library import), giving full ownership of the code. Components are built on Radix UI primitives, which handle accessibility (keyboard navigation, ARIA attributes) out of the box.

### Zustand with Persist Middleware
**Why:** Zustand offers a minimal API — no Provider wrappers, no boilerplate actions/reducers. The `persist` middleware with **`localStorage`** means cart data, saved addresses, shipping address, and order ID survive page refreshes and browser restarts. Computed values (`getSubtotal`, `getGrandTotal`) are co-located with state.

**Storage key:** `"ecoyaan-checkout"` in `localStorage`.

### react-hook-form + Zod
**Why:** react-hook-form uses uncontrolled components — inputs don't re-render the entire form on every keystroke. Zod provides a TypeScript-first schema validation library; the schema doubles as both validation logic and type inference (`z.infer<typeof shippingSchema>`).

### Next.js API Routes (Mock API)
**Why:** Keeps the entire project in a single repository without needing an external backend. The `/api/cart` route simulates a real API endpoint with a 100ms delay to mimic network latency.

---

## Project Architecture

```
project-assignment/
├── src/
│   ├── pages/                    # Next.js Pages Router
│   │   ├── _app.tsx             # Global app wrapper (imports global CSS)
│   │   ├── _document.tsx        # Custom HTML document structure
│   │   ├── index.tsx            # Cart page — SSR via getServerSideProps
│   │   ├── order-success.tsx    # Order confirmation page
│   │   ├── api/
│   │   │   └── cart.ts          # Mock REST API endpoint for cart data
│   │   └── checkout/
│   │       ├── shipping.tsx     # Shipping address + Address Book page
│   │       └── payment.tsx      # Payment review & confirmation page
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx       # Page wrapper (Header + main + footer)
│   │   │   └── Header.tsx       # Sticky top nav with logo + cart count badge
│   │   ├── cart/
│   │   │   ├── CartItem.tsx     # Individual cart item with qty controls
│   │   │   └── OrderSummary.tsx # Subtotal/shipping/discount/total display
│   │   ├── checkout/
│   │   │   ├── CheckoutSteps.tsx  # Animated progress indicator (Cart→Ship→Pay)
│   │   │   └── AddressSummary.tsx # Read-only shipping address display
│   │   └── ui/                  # shadcn/ui components (fully owned)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── separator.tsx
│   │       └── badge.tsx
│   │
│   ├── store/
│   │   └── useCheckoutStore.ts  # Zustand store with localStorage persist
│   │
│   ├── types/
│   │   └── index.ts             # Shared TypeScript interfaces
│   │
│   ├── data/
│   │   └── mockData.ts          # Static mock product data
│   │
│   ├── lib/
│   │   └── utils.ts             # cn() helper + formatCurrency()
│   │
│   └── styles/
│       └── globals.css          # Tailwind directives + CSS variables
│
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind theme (colors, radius, animations)
├── next.config.ts               # Next.js config (image domains)
├── tsconfig.json                # TypeScript config (@/* → src/*)
└── postcss.config.mjs           # PostCSS with Tailwind + Autoprefixer
```

---

## Features

### 🛒 Cart Page (`/`)
- SSR-populated cart items via `getServerSideProps`
- Increase / decrease quantity; removing the last unit deletes the item
- Live order summary (subtotal, shipping, discounts, grand total)
- Sticky bottom bar with **Proceed to Checkout** button aligned to the order summary column

### 📦 Shipping Page (`/checkout/shipping`)

#### Address Book
- Saved addresses are displayed as selectable cards labelled **Home**, **Work**, or **Other**
- Each card shows a trash icon (top) and selection indicator (bottom) in a stacked column — no overlap
- Click any card to select it and proceed; delete any saved address independently
- **Add New Address** button opens the form below the address list

#### New Address Form
- Fields: Full Name, Email, Phone, Address Line (optional), PIN Code, City, State
- **Save As** label picker (Home / Work / Other) with a toggle to save the address for future orders
- Sticky bottom bar with **Back** + **Continue to Payment** — buttons occupy the left 2/3 of the bar on desktop (matching the page grid), right 1/3 shows a trust label

### 💳 Payment Page (`/checkout/payment`)
- Review order items, delivery address (with inline **Change** link), and simulated card
- 256-bit SSL trust badge
- Sticky bottom bar mirrors the page grid: Back + Pay Securely in the left 2/3, security note in the right 1/3
- 2-second simulated payment processing with a spinner

### ✅ Order Success (`/order-success`)
- Animated success badge with gradient and 🎉 emoji
- Itemised order recap, total paid, delivery address, and eco-delivery note
- **Continue Shopping** resets all checkout state

---

## State Management Flow

```
getServerSideProps
       │
       ▼
CartPage receives initialCartData (prop)
       │
       ▼ useEffect on mount
useCheckoutStore.setCartData(initialCartData)
       │
       ├── CartItem components read/update store
       │   └── updateItemQuantity() modifies cartData.cartItems
       │
       ▼ User clicks "Proceed to Checkout"
/checkout/shipping
       │
       ├── savedAddresses[] shown as selectable cards
       │   └── Select → setShippingAddress() from saved address
       │
       ├── New address form
       │   └── onSubmit → setShippingAddress() + optionally addSavedAddress()
       │
       ▼
/checkout/payment
       │
       ▼ User clicks "Pay Securely" (2s simulated delay)
useCheckoutStore.placeOrder() → generates ECO-XXXXXXXX orderId
       │
       ▼
/order-success
       │
       ▼ User clicks "Continue Shopping"
useCheckoutStore.resetCheckout() → clears cartData, shippingAddress, orderId
                                   (savedAddresses are kept in localStorage)
```

### Store Shape

```typescript
interface CheckoutState {
  cartData: CartData | null;
  shippingAddress: ShippingAddress | null;
  savedAddresses: SavedAddress[];        // persisted across sessions
  orderId: string | null;

  setCartData(data: CartData): void;
  setShippingAddress(address: ShippingAddress): void;
  addSavedAddress(address: ShippingAddress, label: string): SavedAddress;
  updateSavedAddress(id: string, patch: Partial<SavedAddress>): void;
  removeSavedAddress(id: string): void;
  updateItemQuantity(productId: number, quantity: number): void;
  placeOrder(): void;
  resetCheckout(): void;
  getSubtotal(): number;
  getGrandTotal(): number;
}
```

---

## Form Validation

The shipping form uses a Zod schema for declarative validation:

```typescript
const shippingSchema = z.object({
  fullName:    z.string().min(2, "Full name must be at least 2 characters"),
  email:       z.string().email("Please enter a valid email address"),
  phone:       z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit Indian mobile number"),
  addressLine: z.string().min(5).optional().or(z.literal("")),
  pinCode:     z.string().regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
  city:        z.string().min(2, "City name must be at least 2 characters"),
  state:       z.string().min(2, "State name must be at least 2 characters"),
});
```

Errors appear inline below each field only after the user attempts to submit.

---

## Checkout Flow

| Step | URL | Description |
|------|-----|-------------|
| 1 | `/` | Cart — view items, adjust quantities, see order summary |
| 2 | `/checkout/shipping` | Address Book (select saved) or add a new address |
| 3 | `/checkout/payment` | Review order + address, simulate payment |
| 4 | `/order-success` | Confirmation with order ID, items, address, delivery info |

**Guard logic:** Each checkout page checks Zustand state on mount and redirects to the appropriate earlier step if required data is missing.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Clone or navigate to the project directory
cd project-assignment

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on `cross-env`:** The dev script uses `cross-env NODE_ENV=development` to explicitly set the environment. This is required because some shells (particularly PowerShell on Windows) may not export `NODE_ENV` by default. React's JSX dev-runtime (`jsxDEV`) only exists in `development` mode — a missing `NODE_ENV` causes Turbopack to fail with `jsxDEV is not a function`.

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | Base URL for SSR API fetches |

For production, set `NEXT_PUBLIC_BASE_URL` to your deployed domain.

---

## Key Design Decisions & Trade-offs

### 1. Pages Router over App Router
The task specifies `getServerSideProps` which is a Pages Router API. The App Router uses `async` Server Components with `fetch` directly — a different paradigm. The Pages Router SSR approach is simpler to reason about and works reliably across all Next.js versions.

### 2. localStorage over sessionStorage
Cart state and saved addresses are stored in `localStorage` so they persist across browser restarts. `savedAddresses` intentionally survives `resetCheckout()` — users expect their address book to remain even after completing an order. `cartData`, `shippingAddress`, and `orderId` are cleared on reset so no stale checkout data bleeds into a new session.

### 3. Address Book Design
Addresses are stored as `SavedAddress[]` (extends `ShippingAddress` with `id` and `label`). The `id` is a `Date.now()`-based string (`addr-<timestamp>`), which is sufficient for a client-side address book. The label (Home / Work / Other) provides visual grouping without complex categorisation logic.

### 4. Sticky Action Bar Layout
On desktop the sticky bar mirrors the page's `lg:grid-cols-3` grid: navigation buttons occupy the left 2/3 column (aligned with the main content) and a trust/security note occupies the right 1/3 (aligned with the order summary sidebar). On mobile the bar collapses to a full-width button row.

### 5. Mock API vs. Hardcoded Data
The cart data is served through `/api/cart` rather than imported directly in `getServerSideProps`. This mirrors real-world patterns where SSR pages fetch from external APIs. The 100ms simulated delay demonstrates the async nature of real data fetching.

### 6. No Toast Notifications
Form errors appear inline for better accessibility. The `@radix-ui/react-toast` package is available for future use (e.g., "Address saved", "Item removed from cart").

### 7. Simulated Payment
The payment page uses a `setTimeout` to simulate a 2-second processing delay. In production, this would be replaced by a real payment gateway (Razorpay, Stripe, etc.) with proper error handling and webhook verification.

### 8. Image Optimisation
Product images use Next.js `<Image>` with `unoptimized={true}` since images are served from a local public folder. In production, images would be served from a CDN and benefit from Next.js automatic WebP conversion and lazy loading.

