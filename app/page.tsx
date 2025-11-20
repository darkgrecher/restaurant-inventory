"use client"

import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Package, TrendingUp, AlertTriangle, Boxes, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useInventoryStore } from "@/lib/inventory-store"
import { useEffect, useMemo, useState } from "react"

export default function DashboardPage() {
  const { items, fetchItems, isLoading } = useInventoryStore()
  const [lowStockPage, setLowStockPage] = useState(1)
  const itemsPerPage = 3

  // Fetch items on component mount
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = items.length
    const lowStockItems = items.filter((item) => item.quantity <= item.minStock)
    const categories = [...new Set(items.map((item) => item.category))].filter(Boolean)
    const totalValue = items.reduce((sum, item) => sum + item.quantity * item.price, 0)

    // Pagination for low stock items
    const startIndex = (lowStockPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedLowStock = lowStockItems.slice(startIndex, endIndex)
    const totalLowStockPages = Math.ceil(lowStockItems.length / itemsPerPage)

    return {
      totalItems,
      lowStockCount: lowStockItems.length,
      lowStockItems: paginatedLowStock,
      totalLowStockPages,
      categoriesCount: categories.length,
      categoriesList: categories.slice(0, 3).join(", ") + (categories.length > 3 ? "..." : ""),
      totalValue,
    }
  }, [items, lowStockPage])

  return (
    <div className="min-h-screen">
      <Header />
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[rgb(49,105,78)] mb-2">Inventory Dashboard</h2>
          <p className="text-muted-foreground">Manage and monitor your restaurant inventory efficiently</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(49,105,78)]"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="border-[rgb(101,140,88)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                  <Boxes className="w-4 h-4 text-[rgb(101,140,88)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[rgb(49,105,78)]">{stats.totalItems}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active inventory items</p>
                </CardContent>
              </Card>

              <Card className="border-[rgb(101,140,88)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.lowStockCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">Need immediate attention</p>
                </CardContent>
              </Card>

              <Card className="border-[rgb(101,140,88)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
                  <Package className="w-4 h-4 text-[rgb(101,140,88)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[rgb(49,105,78)]">{stats.categoriesCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stats.categoriesList || "No categories yet"}</p>
                </CardContent>
              </Card>

              <Card className="border-[rgb(101,140,88)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
                  <TrendingUp className="w-4 h-4 text-[rgb(101,140,88)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[rgb(49,105,78)]">
                    LKR {stats.totalValue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Estimated total value</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-[rgb(101,140,88)]">
            <CardHeader>
              <CardTitle className="text-[rgb(49,105,78)]">Quick Actions</CardTitle>
              <CardDescription>Common inventory management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              <Link href="/add-inventory" className="block">
                <Button className="w-full h-14 bg-[rgb(49,105,78)] hover:bg-[rgb(101,140,88)] text-white text-base font-semibold shadow-md hover:shadow-lg transition-all">
                  <Plus className="w-5 h-5 mr-3" />
                  Add New Inventory Item
                </Button>
              </Link>
              <Link href="/inventory" className="block">
                <Button
                  variant="outline"
                  className="w-full h-14 border-2 border-[rgb(101,140,88)] text-[rgb(49,105,78)] hover:bg-[rgb(240,228,145)]/30 bg-white text-base font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <Package className="w-5 h-5 mr-3" />
                  View All Inventory
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-[rgb(101,140,88)]">
            <CardHeader>
              <CardTitle className="text-[rgb(49,105,78)]">Low Stock Alert</CardTitle>
              <CardDescription>Items that need restocking soon</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.lowStockCount === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No low stock items! Everything is well stocked.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {stats.lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm text-red-900">{item.name}</p>
                          <p className="text-xs text-red-700">
                            {item.quantity} / {item.minStock} {item.unit}
                          </p>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                    ))}
                  </div>
                  {stats.totalLowStockPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLowStockPage((prev) => Math.max(prev - 1, 1))}
                        disabled={lowStockPage === 1}
                        className="border-[rgb(101,140,88)]"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {lowStockPage} of {stats.totalLowStockPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLowStockPage((prev) => Math.min(prev + 1, stats.totalLowStockPages))}
                        disabled={lowStockPage === stats.totalLowStockPages}
                        className="border-[rgb(101,140,88)]"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
