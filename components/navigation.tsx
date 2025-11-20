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
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex gap-1 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 md:gap-3 px-3 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium transition-all relative group whitespace-nowrap",
                  isActive ? "text-[rgb(49,105,78)]" : "text-[rgb(101,140,88)] hover:text-[rgb(49,105,78)]",
                )}
              >
                <Icon className={cn("w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110", isActive && "scale-110")} />
                <span className="hidden sm:inline md:inline">{link.label}</span>
                <span className="sm:hidden text-xs">{link.label.split(' ')[0]}</span>
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
