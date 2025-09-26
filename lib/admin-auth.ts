interface AdminSession {
  userId: string
  username: string
  role: string
  loginTime: number
  expiresAt: number
}

class AdminAuth {
  private readonly SESSION_KEY = "admin_session"
  private readonly SESSION_DURATION = 2 * 60 * 60 * 1000 // 2 hours

  async login(username: string, password: string): Promise<boolean> {
    try {
   const response = await fetch("/api/admin/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ identifier: username, password }),
})

      if (response.ok) {
        const data = await response.json()
        const session: AdminSession = {
          userId: data.user.id,
          username: data.user.username,
          role: data.user.role,
          loginTime: Date.now(),
          expiresAt: Date.now() + this.SESSION_DURATION,
        }

        if (typeof window !== "undefined") {
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
        }
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.SESSION_KEY)
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false

    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY)
      if (!sessionData) return false

      const session: AdminSession = JSON.parse(sessionData)

      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        this.logout()
        return false
      }

      return true
    } catch {
      return false
    }
  }

  getSession(): AdminSession | null {
    if (typeof window === "undefined") return null

    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY)
      if (!sessionData) return null

      const session: AdminSession = JSON.parse(sessionData)

      if (Date.now() > session.expiresAt) {
        this.logout()
        return null
      }

      return session
    } catch {
      return null
    }
  }

  extendSession(): void {
    if (typeof window === "undefined") return

    const session = this.getSession()
    if (session) {
      session.expiresAt = Date.now() + this.SESSION_DURATION
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
    }
  }
}

export const adminAuth = new AdminAuth()
