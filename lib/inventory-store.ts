"use client"

import { create } from "zustand"

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  minStock: number
  price: number
  supplier?: string
  lastUpdated: string
}

interface InventoryStore {
  items: InventoryItem[]
  isLoading: boolean
  error: string | null
  fetchItems: () => Promise<void>
  addItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => Promise<void>
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  getItem: (id: string) => InventoryItem | undefined
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  // Fetch all items from API
  fetchItems: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/inventory")
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch items")
      }

      set({ items: result.data, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error fetching items:", error)
    }
  },

  // Add a new item
  addItem: async (item) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to add item")
      }

      // Refresh the items list
      await get().fetchItems()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error adding item:", error)
      throw error
    }
  },

  // Update an existing item
  updateItem: async (id, updatedItem) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to update item")
      }

      // Refresh the items list
      await get().fetchItems()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error updating item:", error)
      throw error
    }
  },

  // Delete an item
  deleteItem: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to delete item")
      }

      // Refresh the items list
      await get().fetchItems()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      console.error("Error deleting item:", error)
      throw error
    }
  },

  // Get a single item by ID (from local state)
  getItem: (id) => get().items.find((item) => item.id === id),
}))
