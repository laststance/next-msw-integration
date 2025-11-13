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
| **Unit Testing**   | Vitest 4.0               |
| **E2E Testing**    | Playwright 1.56          |
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

# Run unit tests in UI mode
pnpm test:unit:ui

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
│   │   ├── page.tsx                   # Home page (MSW demo with user data)
│   │   └── globals.css                # Global styles
│   ├── env.ts                         # Environment variable schema (Zod)
│   └── utils/
│       ├── isMSWEnabled.ts            # MSW activation logic
│       └── isMSWEnabled.test.ts       # Unit tests
├── mocks/
│   ├── handlers.ts                    # MSW handlers (shared, comprehensive docs)
│   ├── browser.ts                     # Browser worker setup
│   └── server.ts                      # Server worker setup
├── public/
│   └── mockServiceWorker.js           # MSW worker file (auto-generated)
├── e2e/
│   └── homepage.spec.ts               # Playwright E2E tests (4 scenarios)
├── playwright.config.ts               # Playwright configuration
├── tsconfig.json                      # TypeScript configuration
├── tailwind.config.ts                 # Tailwind configuration
├── postcss.config.mjs                 # PostCSS configuration
├── eslint.config.mjs                  # ESLint configuration
├── vitest.config.ts                   # Vitest configuration
├── .env.example                       # Environment variables template
├── .prettierrc                        # Prettier configuration
├── .husky/                            # Git hooks
├── CLAUDE.md                          # Claude Code guidance
└── package.json                       # Project configuration & scripts
```

> **Note:** All components include comprehensive JSDoc documentation explaining implementation rationale and React StrictMode considerations.

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

### Unit Tests (Vitest)

**Framework:** Vitest 4.0 - Fast, modern test runner with native ESM support

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:unit:watch

# UI mode (interactive browser-based testing)
pnpm test:unit:ui

# Generate coverage
pnpm test:unit:coverage
```

**Configuration:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/.next/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'text-summary'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Example Test:** `src/utils/isMSWEnabled.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('isMSWEnabled', () => {
  let isMSWEnabled: () => boolean
  const originalEnv = process.env

  beforeEach(async () => {
    vi.resetModules()

    // Mock env module with getters for dynamic access
    vi.doMock('@/env', () => ({
      env: {
        get NEXT_PUBLIC_ENABLE_MSW_MOCK() {
          return process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK as 'true' | 'false'
        },
        get APP_ENV() {
          return process.env.APP_ENV as 'test' | 'development'
        },
      },
    }))

    const module = await import('./isMSWEnabled')
    isMSWEnabled = module.isMSWEnabled
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.unmock('@/env')
  })

  it('returns true when both vars set (server-side)', () => {
    process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK = 'true'
    process.env.APP_ENV = 'test'
    expect(isMSWEnabled()).toBe(true)
  })
})
```

**Key Features:**

- ⚡ **10-15x faster** than Jest
- 🔄 **Native ESM** support without transpilation
- 🎨 **Interactive UI mode** for visual test exploration
- 📊 **Built-in coverage** with v8 provider
- 🔥 **Hot reload** for instant feedback

### E2E Tests with Playwright

```bash
# Run E2E tests (production build required)
pnpm test:e2e

# UI mode (interactive browser testing)
pnpm test:e2e:ui

# Debug mode
pnpm test:e2e:debug
```

**File:** `e2e/homepage.spec.ts`

**Test Coverage (4 scenarios across Chrome, Firefox, Safari):**

1. **Mocked Data Display** — Verifies MSW returns and displays user data (John Doe)
2. **API Interception** — Confirms `/api/user` requests are intercepted with 200 OK
3. **Error State Handling** — Ensures no error messages appear during normal operation
4. **Loading Transitions** — Validates proper state transitions from loading to data display

Playwright's `webServer` option automatically builds and starts Next.js.

**Configuration:**

- `fullyParallel: false` — Avoid MSW conflicts
- Environment variables: `NODE_ENV=test`, `NEXT_PUBLIC_ENABLE_MSW_MOCK=true`, `APP_ENV=test`
- Tests run across all major browsers (Chromium, Firefox, WebKit)

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

Navigate to http://localhost:3000 and check:

1. **Browser Console:**

   ```
   [MSW] Mocking enabled
   ```

2. **Page Content:**
   - "MSW Test Page" heading should appear
   - User data should display:
     - **ID:** 1
     - **Name:** John Doe
     - **Email:** john.doe@example.com

3. **Network Tab:**
   - `/api/user` request should show a 200 OK response
   - Response should contain the mocked user data

### Server-side Verification

Build and start in test environment:

```bash
pnpm build:e2e
pnpm start
```

SSR pages will use mocked APIs. The home page will display the same mocked data as client-side.

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

### React StrictMode & State Management

React StrictMode (enabled by default in Next.js) **intentionally double-renders** components in development to catch side effects. This can cause issues with MSW and async operations.

**Solution: isMounted Pattern**

```typescript
useEffect(() => {
  let isMounted = true

  const fetchData = async () => {
    const data = await fetch('/api/user')
    // Only update state if component is still mounted
    if (isMounted) {
      setUser(data)
    }
  }

  fetchData()

  // Cleanup: prevent state updates after unmount
  return () => {
    isMounted = false
  }
}, [])
```

This pattern prevents:

- Memory leaks from state updates on unmounted components
- React warnings about state updates after unmount
- Race conditions from StrictMode's double rendering

### MSW Initialization Sequencing

The `MSWProvider` uses `useState` to track MSW readiness:

```typescript
const [isMSWReady, setIsMSWReady] = useState(false)

// Show loading UI until MSW is ready
if (isMSWEnabled() && !isMSWReady) {
  return <div>Initializing MSW...</div>
}

// Render children only after MSW is initialized
return <>{children}</>
```

This prevents components from fetching data before MSW intercepts are registered.

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

## 🐛 Troubleshooting

### Issue: "Loading..." displays indefinitely

**Symptoms:**

- Page shows "Loading..." or "Initializing MSW..." forever
- Mocked data never appears
- Console shows MSW initialized successfully

**Root Cause:**
React StrictMode double-renders components in development, causing race conditions in state updates.

**Solution:**
Implement the `isMounted` pattern in your data-fetching components:

```typescript
useEffect(() => {
  let isMounted = true

  const fetchData = async () => {
    try {
      const res = await fetch('/api/endpoint')
      const data = await res.json()
      if (isMounted) {
        // ← Check before state update
        setData(data)
      }
    } finally {
      if (isMounted) {
        // ← Check before state update
        setLoading(false)
      }
    }
  }

  fetchData()

  return () => {
    isMounted = false // ← Cleanup
  }
}, [])
```

### Issue: Hydration mismatch errors

**Symptoms:**

```
Hydration failed because the server rendered HTML didn't match the client
```

**Root Cause:**
Client and server have different MSW activation logic (`isMSWEnabled()` returns different values).

**Solution:**
Ensure your environment variables are consistent:

- Client: Only checks `NEXT_PUBLIC_ENABLE_MSW_MOCK`
- Server: Checks both `NEXT_PUBLIC_ENABLE_MSW_MOCK` AND `APP_ENV=test`

### Issue: MSW not intercepting requests

**Symptoms:**

- Requests go to real endpoints instead of MSW
- 404 errors for `/api/*` routes
- Console shows no MSW messages

**Checklist:**

1. ✅ MSW enabled: `NEXT_PUBLIC_ENABLE_MSW_MOCK=true`
2. ✅ Worker file exists: `public/mockServiceWorker.js`
3. ✅ Handler registered: Check `mocks/handlers.ts`
4. ✅ MSW initialized: Check console for "[MSW] Mocking enabled"

**Quick Fix:**

```bash
# Regenerate MSW worker file
npx msw init public/ --save
```

### Issue: E2E tests fail intermittently

**Symptoms:**

- Tests pass locally but fail in CI
- Timeout errors waiting for elements
- Network request timing issues

**Solutions:**

1. **Increase timeout for flaky operations:**

```typescript
await expect(page.getByText('Data')).toBeVisible({ timeout: 10000 })
```

2. **Ensure production build is fresh:**

```bash
pnpm build:e2e  # Always rebuild before testing
```

3. **Check parallel execution:**

```typescript
// playwright.config.ts
export default {
  fullyParallel: false, // Required for MSW
  workers: process.env.CI ? 1 : undefined,
}
```

### Issue: Port already in use

**Symptoms:**

```
Error: Port 3000 is already in use
```

**Solution:**

```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 pnpm dev
```

### Issue: Vitest import errors

**Symptoms:**

```
Cannot find module 'vitest' or its corresponding type declarations
Error: Module vitest not found
```

**Root Cause:**
Vitest dependencies not installed or outdated configuration files present.

**Solution:**

```bash
# Ensure Vitest dependencies are installed
pnpm add -D vitest @vitest/ui @vitest/coverage-v8

# Remove old Jest configuration if present
rm jest.config.js jest.setup.js

# Verify vitest.config.ts exists
ls vitest.config.ts
```

### Issue: Tests run in Playwright that should be unit tests

**Symptoms:**

- Playwright picks up `*.test.ts` files in `src/`
- Unit test files run as E2E tests
- Vitest shows no tests found

**Root Cause:**
Test file patterns overlap between Vitest and Playwright.

**Solution:**

Ensure `vitest.config.ts` excludes E2E directory and `playwright.config.ts` only targets `e2e/`:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/e2e/**', // ← Critical: exclude Playwright tests
    ],
  },
})

// playwright.config.ts
export default defineConfig({
  testDir: './e2e', // ← Only target E2E directory
})
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

- **Disable MSW in local development** for better performance (connect to real APIs)
- **Enable MSW in test environments** for reliable, isolated testing
- **Use the `isMounted` pattern** in all components with async data fetching to prevent StrictMode issues
- **Always wait for MSW initialization** before rendering components that make API calls
- **Check `isMSWEnabled()`** to prevent hydration mismatches between client and server
- **Use Playwright `--ui` mode** (`pnpm test:e2e:ui`) for interactive test development
- **Read JSDoc comments** in the codebase for implementation rationale and best practices
- **Run `pnpm build:e2e` before E2E tests** to ensure production build includes MSW

---

## 📄 License

MIT

---

**Made with ❤️ for API mocking best practices in Next.js App Router**
