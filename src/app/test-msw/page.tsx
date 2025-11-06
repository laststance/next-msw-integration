import TestMSWClient from './test-msw-client'

// Force dynamic rendering to ensure MSW is active at runtime
export const dynamic = 'force-dynamic'

export default function TestMSWPage() {
  return <TestMSWClient />
}
