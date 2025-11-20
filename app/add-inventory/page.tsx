"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { useInventoryStore } from "@/lib/inventory-store"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

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

export default function AddInventoryPage() {
  const { addItem } = useInventoryStore()
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    minStock: 0,
    price: 0,
    supplier: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      await addItem(formData)
      setShowSuccess(true)

      // Reset form
      setFormData({
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        minStock: 0,
        price: 0,
        supplier: "",
      })

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to add item:", error)
      // You could add error handling UI here
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(240,228,145)]/10 via-white to-[rgb(187,200,99)]/10">
      <Header />
      <Navigation />

      <main className="container mx-auto px-4 py-6 md:py-12 flex items-center justify-center min-h-[calc(100vh-180px)]">
        <div className="w-full max-w-3xl">
          <div className="mb-6 md:mb-8 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-[rgb(49,105,78)] mb-2 md:mb-3">Add New Inventory Item</h2>
            <p className="text-[rgb(49,105,78)]/70 text-base md:text-lg">Enter the details of the new inventory item below</p>
          </div>

          {showSuccess && (
            <Card className="mb-6 border-green-500 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">Item added successfully to inventory!</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-[rgb(101,140,88)]/30 shadow-lg">
            <CardHeader className="bg-white border-b border-[rgb(101,140,88)]/20">
              <CardTitle className="text-[rgb(49,105,78)] text-lg md:text-xl">Item Information</CardTitle>
              <CardDescription className="text-[rgb(49,105,78)]/60">
                Fill in all required fields marked with *
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8 bg-white">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid gap-4 md:gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-[rgb(49,105,78)] font-semibold text-sm md:text-base">
                      Item Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Coffee Beans, Fresh Milk"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-[rgb(101,140,88)]/30 focus:border-[rgb(49,105,78)] h-10 md:h-11"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-[rgb(49,105,78)] font-semibold text-sm md:text-base">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                      required
                    >
                      <SelectTrigger className="border-[rgb(101,140,88)]/30 focus:border-[rgb(49,105,78)] h-10 md:h-11">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity" className="text-[rgb(49,105,78)] font-semibold text-sm md:text-base">
                        Quantity *
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.quantity || ""}
                        onChange={handleChange}
                        required
                        className="border-[rgb(101,140,88)]/30 focus:border-[rgb(49,105,78)] h-10 md:h-11"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="unit" className="text-[rgb(49,105,78)] font-semibold text-sm md:text-base">
                        Unit *
                      </Label>
                      <Select
                        value={formData.unit}
                        onValueChange={(value) => handleSelectChange("unit", value)}
                        required
                      >
                        <SelectTrigger className="border-[rgb(101,140,88)]/30 focus:border-[rgb(49,105,78)] h-10 md:h-11">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="minStock" className="text-[rgb(49,105,78)] font-semibold text-sm md:text-base">
                        Minimum Stock Level *
                      </Label>
                      <Input
                        id="minStock"
                        name="minStock"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.minStock || ""}
                        onChange={handleChange}
                        required
                        className="border-[rgb(101,140,88)]/30 focus:border-[rgb(49,105,78)] h-10 md:h-11"
                      />
                      <p className="text-xs text-[rgb(49,105,78)]/60">Alert when stock falls below this level</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="price" className="text-[rgb(49,105,78)] font-semibold text-sm md:text-base">
                        Price per Unit (LKR) *
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price || ""}
                        onChange={handleChange}
                        required
                        className="border-[rgb(101,140,88)]/30 focus:border-[rgb(49,105,78)] h-10 md:h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="supplier" className="text-[rgb(49,105,78)] font-semibold text-sm md:text-base">
                      Supplier
                    </Label>
                    <Input
                      id="supplier"
                      name="supplier"
                      placeholder="Supplier name (optional)"
                      value={formData.supplier}
                      onChange={handleChange}
                      className="border-[rgb(101,140,88)]/30 focus:border-[rgb(49,105,78)] h-10 md:h-11"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-[rgb(101,140,88)]/20">
                  <Button
                    type="submit"
                    className="flex-1 bg-[rgb(49,105,78)] hover:bg-[rgb(101,140,88)] text-white h-11 md:h-12 text-sm md:text-base font-semibold"
                  >
                    Add Item to Inventory
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/inventory")}
                    className="border-[rgb(101,140,88)]/40 text-[rgb(49,105,78)] hover:bg-[rgb(240,228,145)]/20 h-11 md:h-12 md:px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
