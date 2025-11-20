"use client"

import { useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Allow access to login page without authentication
    if (pathname === "/login") {
      return
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && pathname === "/login") {
      router.push("/")
      return
    }
  }, [isAuthenticated, router, pathname])

  // Show loading or nothing while redirecting
  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(49,105,78)]"></div>
      </div>
    )
  }

  return <>{children}</>
}