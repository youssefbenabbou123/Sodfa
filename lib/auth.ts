"use client"

export interface User {
  id: string
  username: string
  role: "admin" | "user"
}

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin123"

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const user: User = {
      id: "1",
      username: ADMIN_USERNAME,
      role: "admin"
    }
    localStorage.setItem("admin_user", JSON.stringify(user))
    localStorage.setItem("admin_token", "admin_token_" + Date.now())
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem("admin_user")
  localStorage.removeItem("admin_token")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("admin_user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null && localStorage.getItem("admin_token") !== null
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}


