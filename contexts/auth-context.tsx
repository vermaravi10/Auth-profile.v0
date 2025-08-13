"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { AuthService, type User, type AuthState } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<Pick<User, "displayName">>) => Promise<{ success: boolean }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state from localStorage
    const storedAuth = AuthService.getAuthState()
    setAuthState(storedAuth)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const result = AuthService.login(email, password)
    if (result.success && result.user) {
      setAuthState({ user: result.user, isAuthenticated: true })
    }
    return result
  }

  const signup = async (email: string, password: string, displayName: string) => {
    const result = AuthService.signup(email, password, displayName)
    if (result.success && result.user) {
      setAuthState({ user: result.user, isAuthenticated: true })
    }
    return result
  }

  const logout = () => {
    AuthService.logout()
    setAuthState({ user: null, isAuthenticated: false })
  }

  const updateProfile = async (updates: Partial<Pick<User, "displayName">>) => {
    const result = AuthService.updateProfile(updates)
    if (result.success && result.user) {
      setAuthState({ user: result.user, isAuthenticated: true })
    }
    return result
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
