"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Plus, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/inventory", label: "View Inventory", icon: Package },
    { href: "/add-inventory", label: "Add Item", icon: Plus },
  ]

  return (
    <nav className="bg-white border-b-2 border-[rgb(187,200,99)] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 text-base font-medium transition-all relative group",
                  isActive ? "text-[rgb(49,105,78)]" : "text-[rgb(101,140,88)] hover:text-[rgb(49,105,78)]",
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "scale-110")} />
                <span>{link.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[rgb(49,105,78)] rounded-t-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
