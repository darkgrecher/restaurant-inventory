"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"

export function Header() {
  const { logout, username } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="border-b border-[rgb(101,140,88)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 md:gap-4">
            <Image 
              src="/logo.png" 
              alt="Café Awsh Click Kandy Logo" 
              width={50} 
              height={50} 
              className="md:w-[60px] md:h-[60px] object-contain" 
            />
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-[rgb(49,105,78)]">
                Café Awsh Click Kandy
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">Inventory Management</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Contact Info - Hidden on mobile */}
            <div className="text-right hidden lg:block">
              <div className="text-sm text-muted-foreground">
                <p>49, William Gopallawa Mawatha, Kandy</p>
                <p>077 4540 715 / 076 3039 728</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-[rgb(49,105,78)]" />
                <span className="text-[rgb(49,105,78)] font-medium hidden sm:inline">
                  {username}
                </span>
              </div>
              
              <Button
                onClick={handleLogout}
                size="sm"
                variant="outline"
                className="border-[rgb(101,140,88)] text-[rgb(49,105,78)] hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
