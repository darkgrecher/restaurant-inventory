import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-[rgb(101,140,88)] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image src="/logo.png" alt="Café Awsh Click Kandy Logo" width={60} height={60} className="object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-[rgb(49,105,78)]">Café Awsh Click Kandy</h1>
              <p className="text-sm text-muted-foreground">Inventory Management</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="text-right hidden md:block">
              <p>49, William Gopallawa Mawatha, Kandy</p>
              <p>077 4540 715 / 076 3039 728</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
