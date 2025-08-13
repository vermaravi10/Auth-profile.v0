"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface PublicRouteProps {
  children: ReactNode
  redirectTo?: string
  redirectIfAuthenticated?: boolean
}

export function PublicRoute({ children, redirectTo = "/profile", redirectIfAuthenticated = false }: PublicRouteProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (redirectIfAuthenticated && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo, redirectIfAuthenticated])

  // If we should redirect authenticated users and user is authenticated, don't render
  if (redirectIfAuthenticated && isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
