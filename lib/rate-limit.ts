interface RateLimitOptions {
  interval: number
  uniqueTokenPerInterval?: number
}

interface RateLimitResult {
  check: (token: string, limit: number) => Promise<boolean>
}

export function rateLimit(options: RateLimitOptions): RateLimitResult {
  // استخدام Map بدلاً من lru-cache لتجنب التبعيات
  const tokens = new Map<string, { count: number; resetTime: number }>()

  return {
    check: async (token: string, limit: number): Promise<boolean> => {
      const now = Date.now()
      const tokenData = tokens.get(token)

      if (!tokenData || now > tokenData.resetTime) {
        tokens.set(token, {
          count: 1,
          resetTime: now + options.interval
        })
        return true
      }

      if (tokenData.count >= limit) {
        return false
      }

      tokenData.count++
      return true
    }
  }
}