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
- Client-side state persisted across pages with Zustand + sessionStorage
- Form validation with react-hook-form + Zod schemas
- Accessible, reusable UI components built on Radix UI primitives

---

## Tech Stack & Decisions

### Next.js 14 with Pages Router
**Why:** The Pages Router provides `getServerSideProps` for SSR on the cart page, fetching product data server-side before rendering. This ensures the page is fully populated on first load (better SEO, no loading spinner for initial data). The Pages Router has a mature, stable API with wide community support.

### TypeScript
**Why:** Type safety across the entire codebase catches bugs at compile time rather than runtime. The shared `types/index.ts` file ensures `CartItem`, `CartData`, and `ShippingAddress` interfaces are consistent between the API, store, and UI components. TypeScript's IDE support also provides autocomplete and inline documentation.

### Tailwind CSS
**Why:** Utility-first approach enables rapid UI prototyping without leaving JSX. Responsive design (`lg:grid-cols-3`) and conditional styles (`cn()` helper) are applied directly to elements. No CSS-in-JS runtime overhead; styles are purged at build time for minimal bundle size. Tailwind's design tokens (spacing, colors, borderRadius) keep the UI consistent.

### shadcn/ui Components
**Why:** shadcn/ui provides copy-paste components (not a library import), giving full ownership of the code. Components are built on Radix UI primitives, which handle accessibility (keyboard navigation, ARIA attributes) out of the box. Each component (Button, Card, Input, Label, etc.) is fully customizable through Tailwind classes and CSS variables.

### Zustand with Persist Middleware
**Why:** Zustand offers a minimal API — no Provider wrappers, no boilerplate actions/reducers. The `persist` middleware with `sessionStorage` means cart data, shipping address, and order ID survive page navigation within the same browser tab, but are cleared when the tab closes (appropriate for checkout flows). Computed values (`getSubtotal`, `getGrandTotal`) are co-located with state.

**Trade-off:** Using sessionStorage means state is lost if the user opens a new tab. For a production app, you'd want server-side session management or localStorage.

### react-hook-form + Zod
**Why:** react-hook-form uses uncontrolled components, meaning inputs don't re-render the entire form on every keystroke — better performance than controlled components with useState. Zod provides a TypeScript-first schema validation library; the schema doubles as both validation logic and type inference (`z.infer<typeof shippingSchema>`). The `@hookform/resolvers/zod` bridge integrates them seamlessly.

### Next.js API Routes (Mock API)
**Why:** Keeps the entire project in a single repository without needing an external backend. The `/api/cart` route simulates a real API endpoint with a 100ms delay to mimic network latency. The SSR cart page fetches from this endpoint on the server, demonstrating a realistic data-fetching pattern.

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
│   │       ├── shipping.tsx     # Shipping address form page
│   │       └── payment.tsx      # Payment review & confirmation page
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx       # Page wrapper (Header + main + footer)
│   │   │   └── Header.tsx       # Sticky top navigation with logo
│   │   ├── cart/
│   │   │   ├── CartItem.tsx     # Individual cart item with qty controls
│   │   │   └── OrderSummary.tsx # Subtotal/shipping/discount/total display
│   │   ├── checkout/
│   │   │   ├── CheckoutSteps.tsx  # Progress indicator (Cart→Ship→Pay)
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
│   │   └── useCheckoutStore.ts  # Zustand store with persist middleware
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

## SSR Implementation

The **Cart page** (`pages/index.tsx`) uses `getServerSideProps` to fetch cart data on the server before sending HTML to the browser:

```typescript
export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/cart`);
    const cartData: CartData = await res.json();
    return { props: { initialCartData: cartData } };
  } catch {
    // Fallback to inline mock data if the API call fails
    const { mockCartData } = await import("@/data/mockData");
    return { props: { initialCartData: mockCartData } };
  }
};
```

**Benefits:**
- The page HTML includes populated cart items — no flash of empty content
- Search engines can index product names and prices
- Error handling falls back gracefully to mock data

After hydration, the `initialCartData` is loaded into the Zustand store via `useEffect`, enabling client-side quantity updates.

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
       ▼ Form submission
useCheckoutStore.setShippingAddress(formData)
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
useCheckoutStore.resetCheckout() → clears all state
```

**Zustand persist** stores `cartData`, `shippingAddress`, and `orderId` in `sessionStorage` under the key `"ecoyaan-checkout"`. This means navigating between pages doesn't lose state.

---

## Form Validation

The shipping form uses a Zod schema for declarative validation:

```typescript
const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit Indian mobile number"),
  pinCode: z.string().regex(/^\d{6}$/, "PIN code must be exactly 6 digits"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  state: z.string().min(2, "State name must be at least 2 characters"),
});
```

react-hook-form connects to this schema via `zodResolver`. Errors appear inline below each field only after the user attempts to submit, providing a clean UX. Previous values are pre-populated via `defaultValues: shippingAddress ?? undefined`, so users can go back and edit without re-entering data.

---

## Checkout Flow

| Step | URL | Description |
|------|-----|-------------|
| 1 | `/` | Cart page — view items, adjust quantities, see order summary |
| 2 | `/checkout/shipping` | Enter name, email, phone, PIN code, city, state |
| 3 | `/checkout/payment` | Review order + address, simulate payment |
| 4 | `/order-success` | Confirmation with order ID, items, address, delivery info |

**Guard logic:** Each checkout page checks Zustand state on mount and redirects to the appropriate earlier step if required data is missing (e.g., accessing `/checkout/payment` directly redirects to `/`).

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

# Start development server (uses cross-env to guarantee NODE_ENV=development)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on `cross-env`:** The dev script uses `cross-env NODE_ENV=development` to explicitly set the environment. This is required because some shells (particularly PowerShell on Windows) may not export `NODE_ENV` by default. React 19's JSX dev-runtime (`jsxDEV`) only exists in `development` mode — a missing `NODE_ENV` causes Turbopack to fail with `jsxDEV is not a function`.

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

### 2. Mock API vs. Hardcoded Data
The cart data is served through `/api/cart` rather than imported directly in `getServerSideProps`. This mirrors real-world patterns where SSR pages fetch from external APIs. The 100ms simulated delay demonstrates the async nature of real data fetching.

### 3. sessionStorage over localStorage
Cart state in sessionStorage clears when the browser tab closes, preventing stale checkout data from a previous session from appearing. For a persistent wishlist or saved cart, localStorage would be more appropriate.

### 4. No Toast Notifications
The `@radix-ui/react-toast` package is installed (as specified) but toast components are not actively used — form errors appear inline for better accessibility. The toast infrastructure is available for future use (e.g., "Item removed from cart" notifications).

### 5. Simulated Payment
The payment page uses a `setTimeout` to simulate a 2-second processing delay. In production, this would be replaced by a real payment gateway (Razorpay, Stripe, etc.) with proper error handling and webhook verification.

### 6. Image Optimization
Product images use Next.js `<Image>` with `unoptimized={true}` since `via.placeholder.com` is an external placeholder service. In production, images would be served from a CDN and benefit from Next.js automatic WebP conversion and lazy loading.


