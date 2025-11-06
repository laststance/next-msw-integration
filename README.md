# Next.js × MSW Integration Demo 🚀

A demonstration of integrating **Mock Service Worker (MSW)** with **Next.js 16 App Router** to mock APIs in both browser and server environments. Supports request interception across the entire application.

## About 📖

This project implements the pattern from [mswjs/examples PR #101](https://github.com/mswjs/examples/pull/101), a production-ready MSW integration example. It demonstrates how to mock both client-side and server-side API calls in a Next.js App Router environment.

**Reference:** [GitHub PR #101 - Add Next.js App Router Example](https://github.com/mswjs/examples/pull/101)

---

## ✨ Features

- ✅ **Client-side MSW Integration** — Wrap entire app with `MSWProvider`
- ✅ **Server-side MSW Integration** — Intercept RSC and API Route requests
- ✅ **Environment-based Control** — MSW disabled in dev, auto-enabled in tests
- ✅ **E2E Testing Support** — Playwright + MSW for reliable tests
- ✅ **Type-safe Configuration** — TypeScript + Zod for strict environment validation
- ✅ **Hot Reload Support** — Update handlers during development
- ✅ **Production Build Ready** — SSR and API Routes work with MSW enabled

---

## 🛠 Tech Stack

| Layer              | Technology               |
| ------------------ | ------------------------ |
| **Framework**      | Next.js 16 (App Router)  |
| **UI Library**     | React 19                 |
| **API Mocking**    | MSW 2.12                 |
| **Language**       | TypeScript 5.9           |
| **Styling**        | Tailwind CSS 4           |
| **Testing**        | Playwright 1.56          |
| **Env Validation** | Zod + @t3-oss/env-nextjs |
| **Code Quality**   | ESLint 9 + Prettier 3    |
| **Git Hooks**      | Husky + lint-staged      |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+
- pnpm 9.0+

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd next-msw-integration

# 2. Install dependencies
pnpm install

# 3. Install Playwright browsers
pnpm playwright:install

# 4. Set up environment variables
cp .env.example .env.development
```

### Start Development Server

```bash
# Start with MSW disabled (normal development)
pnpm dev
# 👉 http://localhost:3000

# Start with MSW enabled (use mocks)
NEXT_PUBLIC_ENABLE_MSW_MOCK=true pnpm dev
```

---

## 📋 Commands

### Development

```bash
# Start dev server with MSW disabled
pnpm dev

# Start dev server with MSW enabled
NEXT_PUBLIC_ENABLE_MSW_MOCK=true pnpm dev
```

### Build & Production

```bash
# Production build (normal)
pnpm build

# Production build with MSW enabled (for testing)
pnpm build:e2e

# Start production server
pnpm start
```

### Testing & Code Quality

```bash
# Run unit tests
pnpm test

# Run unit tests in watch mode
pnpm test:unit:watch

# Run unit tests with coverage
pnpm test:unit:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode
pnpm test:e2e:ui

# Run E2E tests in debug mode
pnpm test:e2e:debug

# Run ESLint
pnpm lint

# Format code with Prettier
pnpm prettier
```

---

## 📁 Project Structure

```
next-msw-integration/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (server-side MSW integration)
│   │   ├── msw-provider.tsx           # MSWProvider (client-side MSW integration)
│   │   ├── page.tsx                   # Home page
│   │   ├── test-msw/
│   │   │   └── page.tsx               # MSW verification page
│   │   └── globals.css                # Global styles
│   ├── env.ts                         # Environment variable schema (Zod)
│   └── utils/
│       ├── isMSWEnabled.ts            # MSW activation logic
│       └── isMSWEnabled.test.ts       # Unit tests
├── mocks/
│   ├── handlers.ts                    # MSW handlers (shared)
│   ├── browser.ts                     # Browser worker setup
│   └── server.ts                      # Server worker setup
├── public/
│   └── mockServiceWorker.js           # MSW worker file (auto-generated)
├── e2e/
│   └── msw-integration.spec.ts        # Playwright tests
├── playwright.config.ts               # Playwright configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind configuration
├── postcss.config.mjs                 # PostCSS configuration
├── eslint.config.mjs                  # ESLint configuration
├── jest.config.ts                     # Jest configuration
├── .env.example                       # Environment variables template
├── .prettierrc                        # Prettier configuration
├── .husky/                            # Git hooks
├── CLAUDE.md                          # Claude Code guidance
└── package.json                       # Project configuration & scripts
```

---

## 🔗 MSW Integration Pattern

### Client-side Integration

**Files:** `src/app/msw-provider.tsx` → `src/app/layout.tsx`

```typescript
// 1. MSWProvider wraps the entire app
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  )
}
```

**How it works:**

- Conditionally starts browser worker in `useLayoutEffect`
- Checks `isMSWEnabled()` before initializing
- Dynamically imports `mocks/browser.ts` to avoid server bundling

### Server-side Integration

**File:** `src/app/layout.tsx`

```typescript
// 2. Start server worker in server component
if (process.env.NEXT_RUNTIME === 'nodejs' && isMSWEnabled()) {
  const { server } = await import('@/mocks/server')
  server.listen()
}
```

**How it works:**

- Only executes on server with `process.env.NEXT_RUNTIME === 'nodejs'`
- Intercepts RSC and API Route requests
- Enabled when `NEXT_PUBLIC_ENABLE_MSW_MOCK=true` AND `APP_ENV=test`

### Shared Handlers

**File:** `mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ])
  }),
]
```

Handlers are automatically used by both browser and server workers.

---

## 🔧 Configuration

### Environment Variables

| Variable                      | Values                  | Description              |
| ----------------------------- | ----------------------- | ------------------------ |
| `NODE_ENV`                    | `development` \| `test` | Node environment         |
| `NEXT_PUBLIC_ENABLE_MSW_MOCK` | `true` \| `false`       | Enable MSW (client-side) |
| `APP_ENV`                     | `development` \| `test` | Application environment  |

**File Structure:**

- `.env.development` — MSW disabled (default for local development)
- `.env.test` — MSW enabled (for testing environments)
- `.env.local` — Local overrides (included in `.gitignore`)

### Activation Logic

**File:** `src/utils/isMSWEnabled.ts`

```typescript
export function isMSWEnabled(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: both conditions required
    return (
      process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK === 'true' &&
      process.env.APP_ENV === 'test'
    )
  }

  // Client-side: only check environment variable
  return process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK === 'true'
}
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:unit:watch

# Generate coverage
pnpm test:unit:coverage
```

**Example:** `src/utils/isMSWEnabled.test.ts`

### E2E Tests with Playwright

```bash
# Run E2E tests (production build required)
pnpm test:e2e

# UI mode (interactive browser testing)
pnpm test:e2e:ui

# Debug mode
pnpm test:e2e:debug
```

**File:** `e2e/msw-integration.spec.ts`

Playwright's `webServer` option automatically builds and starts Next.js.

**Configuration:**

- `fullyParallel: false` — Avoid MSW conflicts
- Environment variables: `NODE_ENV=test`, `NEXT_PUBLIC_ENABLE_MSW_MOCK=true`, `APP_ENV=test`

---

## 📝 Adding New API Mocks

### 1. Add Handlers

**File:** `mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Existing handlers...

  // Add new handler
  http.get('/api/products/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'Product Name',
      price: 99.99,
    })
  }),

  http.post('/api/orders', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ orderId: '12345', ...body }, { status: 201 })
  }),
]
```

### 2. Use in Components

Once handlers are added, they're automatically available in both browser and server workers:

```typescript
'use client'

import { useEffect, useState } from 'react'

export function ProductFetcher() {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    fetch('/api/products/1')
      .then(res => res.json())
      .then(setProduct)
  }, [])

  return <div>{product?.name}</div>
}
```

---

## ✅ Verify MSW Integration

### Client-side Verification

```bash
# Start dev server with MSW enabled
NEXT_PUBLIC_ENABLE_MSW_MOCK=true pnpm dev
```

Check browser console for:

```
[MSW] Mocking enabled
```

### Test Page Verification

Navigate to:

```
http://localhost:3000/test-msw
```

Mocked API responses should be displayed.

### Server-side Verification

Build and start in test environment:

```bash
pnpm build:e2e
pnpm start
```

SSR pages will use mocked APIs.

---

## 🤔 Key Implementation Details

### Why Dynamic Import?

```typescript
// ❌ Wrong: bundled at build time
import { worker } from '../mocks/browser'

// ✅ Correct: imported only in browser
const { worker } = await import('../mocks/browser')
```

`mocks/browser.ts` uses browser-specific APIs. Dynamic import prevents bundling on the server.

### MSW Worker File

```
public/mockServiceWorker.js
```

This file is auto-generated and runs as a Service Worker in the browser. **Do not edit manually.**

### Playwright Configuration for MSW

```typescript
// playwright.config.ts
const config: PlaywrightTestConfig = {
  fullyParallel: false, // Avoid MSW conflicts
  webServer: {
    command: 'pnpm start',
    port: 3000,
    env: {
      NODE_ENV: 'test',
      NEXT_PUBLIC_ENABLE_MSW_MOCK: 'true',
      APP_ENV: 'test',
    },
  },
}
```

---

## 📚 References

- **[MSW Official Documentation](https://mswjs.io/docs)**
- **[GitHub PR #101 - mswjs/examples](https://github.com/mswjs/examples/pull/101)** — Reference implementation for this project
- **[Next.js App Router](https://nextjs.org/docs/app)**
- **[Playwright Documentation](https://playwright.dev/docs/intro)**
- **[TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)**

---

## 💡 Tips

- **Disable MSW in local development** for better performance
- **Enable MSW in test environments** for reliability
- **Check `isMSWEnabled()`** to prevent hydration mismatches
- **Use Playwright `--ui` mode** for interactive test development

---

## 📄 License

MIT

---

**Made with ❤️ for API mocking best practices in Next.js App Router**
