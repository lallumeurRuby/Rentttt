const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

// api.yml ErrorEnvelope：{ success: false, error: { violation_type } }
interface ApiError {
  violation_type: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

/**
 * Shared HTTP client for all API calls.
 * Worker should NOT create separate fetch logic — use this client.
 *
 * Auth: reads `rentttt-auth-token` from document.cookie（避免與 localhost 其他專案的 auth-token 衝突） and sends as Bearer token.
 * This is production-safe — no mock-specific logic here.
 */
export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Read auth token from cookie (set by login page)
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)rentttt-auth-token=([^;]*)/)
    if (match) {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${match[1]}`
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  const json: ApiResponse<T> = await res.json()

  if (!res.ok || !json.success) {
    const violationType = json.error?.violation_type ?? res.statusText
    throw new ApiClientError(violationType, violationType, res.status)
  }

  return json.data as T
}

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}
