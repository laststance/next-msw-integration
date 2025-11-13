import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('isMSWEnabled', () => {
  let isMSWEnabled: () => boolean
  const originalEnv = process.env

  beforeEach(async () => {
    // Reset modules to clear cache
    vi.resetModules()

    // Mock the env module to return process.env values dynamically
    vi.doMock('@/env', () => ({
      env: {
        get NEXT_PUBLIC_ENABLE_MSW_MOCK() {
          return process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK
        },
        get APP_ENV() {
          return process.env.APP_ENV as 'development' | 'test' | undefined
        },
      },
    }))

    // Import the function fresh for each test
    const isMSWModule = await import('./isMSWEnabled')
    isMSWEnabled = isMSWModule.isMSWEnabled
  })

  afterEach(() => {
    // Restore original environment
    process.env = { ...originalEnv }
    vi.unmock('@/env')
  })

  it('returns true when both NEXT_PUBLIC_ENABLE_MSW_MOCK and APP_ENV are set correctly', () => {
    process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK = 'true'
    process.env.APP_ENV = 'test'
    ;(process.env as any).NODE_ENV = 'test'

    expect(isMSWEnabled()).toBe(true)
  })

  it("returns false when NEXT_PUBLIC_ENABLE_MSW_MOCK is not 'true'", () => {
    process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK = 'false'
    process.env.APP_ENV = 'test'
    ;(process.env as any).NODE_ENV = 'test'

    expect(isMSWEnabled()).toBe(false)
  })

  it("returns false when APP_ENV is not 'test'", () => {
    process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK = 'true'
    process.env.APP_ENV = 'development'
    ;(process.env as any).NODE_ENV = 'development'

    expect(isMSWEnabled()).toBe(false)
  })

  it('returns false when NEXT_PUBLIC_ENABLE_MSW_MOCK is undefined', () => {
    delete process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK
    process.env.APP_ENV = 'test'
    ;(process.env as any).NODE_ENV = 'test'

    expect(isMSWEnabled()).toBe(false)
  })

  it('returns false when APP_ENV is undefined', () => {
    process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK = 'true'
    delete process.env.APP_ENV
    ;(process.env as any).NODE_ENV = 'development'

    expect(isMSWEnabled()).toBe(false)
  })

  it('returns false when both environment variables are undefined', () => {
    delete process.env.NEXT_PUBLIC_ENABLE_MSW_MOCK
    delete process.env.APP_ENV
    ;(process.env as any).NODE_ENV = 'development'

    expect(isMSWEnabled()).toBe(false)
  })
})
