export interface User {
  id: string
  email: string
  displayName: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const AUTH_STORAGE_KEY = "pagepilot_auth"
const USERS_STORAGE_KEY = "pagepilot_users"

export class AuthService {
  static getStoredUsers(): User[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static saveUser(user: User): void {
    const users = this.getStoredUsers()
    const existingIndex = users.findIndex((u) => u.email === user.email)

    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }

  static findUserByEmail(email: string): User | null {
    const users = this.getStoredUsers()
    return users.find((u) => u.email === email) || null
  }

  static getAuthState(): AuthState {
    if (typeof window === "undefined") {
      return { user: null, isAuthenticated: false }
    }

    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) {
      return { user: null, isAuthenticated: false }
    }

    try {
      const authData = JSON.parse(stored)
      return {
        user: authData.user,
        isAuthenticated: !!authData.user,
      }
    } catch {
      return { user: null, isAuthenticated: false }
    }
  }

  static setAuthState(user: User | null): void {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  static signup(
    email: string,
    password: string,
    displayName: string,
  ): { success: boolean; error?: string; user?: User } {
    const existingUser = this.findUserByEmail(email)
    if (existingUser) {
      return { success: false, error: "User already exists" }
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      displayName,
    }

    this.saveUser(user)
    this.setAuthState(user)

    return { success: true, user }
  }

  static login(email: string, password: string): { success: boolean; error?: string; user?: User } {
    const user = this.findUserByEmail(email)
    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    this.setAuthState(user)
    return { success: true, user }
  }

  static logout(): void {
    this.setAuthState(null)
  }

  static updateProfile(updates: Partial<Pick<User, "displayName">>): { success: boolean; user?: User } {
    const authState = this.getAuthState()
    if (!authState.user) {
      return { success: false }
    }

    const updatedUser = { ...authState.user, ...updates }
    this.saveUser(updatedUser)
    this.setAuthState(updatedUser)

    return { success: true, user: updatedUser }
  }
}
