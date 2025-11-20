"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { useInventoryStore } from "@/lib/inventory-store"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Search, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { InventoryItem } from "@/lib/inventory-store"

// Common categories for restaurant inventory
const CATEGORIES = [
  "Beverages",
  "Dairy",
  "Baking",
  "Meat & Poultry",
  "Seafood",
  "Vegetables",
  "Fruits",
  "Grains & Pasta",
  "Spices & Condiments",
  "Frozen Foods",
  "Cleaning Supplies",
  "Disposables",
  "Other"
]

// Common units for inventory
const UNITS = [
  "kg",
  "g",
  "liters",
  "ml",
  "pieces",
  "boxes",
  "bottles",
  "cans",
  "packets",
  "bags",
  "dozen"
]

export default function InventoryPage() {
  const { items, updateItem, deleteItem, fetchItems, isLoading } = useInventoryStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"name" | "date" | "lowStock">("name")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Fetch items on component mount
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(items.map((item) => item.category))].filter(Boolean).sort()
  }, [items])

  // Filter, sort, and paginate items
  const { filteredItems, totalPages } = useMemo(() => {
    let filtered = items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case "lowStock":
          const aLowStock = a.quantity <= a.minStock ? 1 : 0
          const bLowStock = b.quantity <= b.minStock ? 1 : 0
          return bLowStock - aLowStock
        default:
          return 0
      }
    })

    // Pagination
    const total = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage)

    return { filteredItems: paginated, totalPages: total }
  }, [items, searchQuery, categoryFilter, sortBy, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, sortBy])

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editingItem) {
      try {
        await updateItem(editingItem.id, editingItem)
        setEditingItem(null)
      } catch (error) {
        console.error("Failed to update item:", error)
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id)
      setDeleteConfirm(null)
    } catch (error) {
      console.error("Failed to delete item:", error)
    }
  }

  const isLowStock = (item: InventoryItem) => item.quantity <= item.minStock

  return (
    <div className="min-h-screen">
      <Header />
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[rgb(49,105,78)] mb-2">Inventory Management</h2>
          <p className="text-muted-foreground">View, update, and manage all inventory items</p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, category, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[rgb(101,140,88)]"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-[rgb(101,140,88)]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="w-full md:w-48">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="border-[rgb(101,140,88)]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="lowStock">Low Stock First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, items.filter((item) => {
                const matchesSearch =
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
                const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
                return matchesSearch && matchesCategory
              }).length)} of{" "}
              {items.filter((item) => {
                const matchesSearch =
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.supplier?.toLowerCase().includes(searchQuery.toLowerCase())
                const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
                return matchesSearch && matchesCategory
              }).length}{" "}
              items
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(49,105,78)]"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {filteredItems.map((item: InventoryItem) => (
            <Card
              key={item.id}
              className={`border-2 transition-colors ${
                isLowStock(item) ? "border-red-500 bg-red-50" : "border-[rgb(101,140,88)]"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Item Name</p>
                      <p className="font-semibold text-[rgb(49,105,78)]">{item.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <p className="text-sm">{item.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${isLowStock(item) ? "text-red-700" : ""}`}>
                          {item.quantity} {item.unit}
                        </p>
                        {isLowStock(item) && <AlertCircle className="w-4 h-4 text-red-600" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: {item.minStock} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price</p>
                      <p className="text-sm">LKR {item.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Supplier</p>
                      <p className="text-sm">{item.supplier || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingItem(item)}
                      className="border-[rgb(101,140,88)] text-[rgb(49,105,78)] hover:bg-[rgb(240,228,145)]/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteConfirm(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {isLowStock(item) && (
                  <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    <p className="text-sm text-red-700 font-medium">
                      Low Stock Alert: This item needs restocking soon!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

              {filteredItems.length === 0 && (
                <Card className="border-[rgb(101,140,88)]">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No items found matching your search.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-[rgb(101,140,88)] text-[rgb(49,105,78)] hover:bg-[rgb(240,228,145)]/20"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-[rgb(101,140,88)] text-[rgb(49,105,78)] hover:bg-[rgb(240,228,145)]/20"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[rgb(49,105,78)]">Edit Inventory Item</DialogTitle>
            <DialogDescription>Update the details for {editingItem?.name}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={editingItem?.name || ""}
                  onChange={(e) => setEditingItem(editingItem ? { ...editingItem, name: e.target.value } : null)}
                  required
                  className="border-[rgb(101,140,88)]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingItem?.category || ""}
                  onValueChange={(value) => setEditingItem(editingItem ? { ...editingItem, category: value } : null)}
                >
                  <SelectTrigger className="border-[rgb(101,140,88)]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={editingItem?.quantity || 0}
                    onChange={(e) =>
                      setEditingItem(
                        editingItem ? { ...editingItem, quantity: Number.parseFloat(e.target.value) } : null,
                      )
                    }
                    required
                    className="border-[rgb(101,140,88)]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={editingItem?.unit || ""}
                    onValueChange={(value) => setEditingItem(editingItem ? { ...editingItem, unit: value } : null)}
                  >
                    <SelectTrigger className="border-[rgb(101,140,88)]">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={editingItem?.minStock || 0}
                    onChange={(e) =>
                      setEditingItem(
                        editingItem ? { ...editingItem, minStock: Number.parseFloat(e.target.value) } : null,
                      )
                    }
                    required
                    className="border-[rgb(101,140,88)]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (LKR)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingItem?.price || 0}
                    onChange={(e) =>
                      setEditingItem(editingItem ? { ...editingItem, price: Number.parseFloat(e.target.value) } : null)
                    }
                    required
                    className="border-[rgb(101,140,88)]"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={editingItem?.supplier || ""}
                  onChange={(e) => setEditingItem(editingItem ? { ...editingItem, supplier: e.target.value } : null)}
                  className="border-[rgb(101,140,88)]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingItem(null)}
                className="border-[rgb(101,140,88)]"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[rgb(49,105,78)] hover:bg-[rgb(101,140,88)] text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
