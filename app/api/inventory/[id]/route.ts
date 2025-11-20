import { NextResponse } from "next/server"
import { getItem, updateItem, deleteItem } from "@/lib/google-sheets"

// GET - Fetch a single inventory item by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const item = await getItem(id)
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error: any) {
    console.error("Error fetching item:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch item" },
      { status: 500 }
    )
  }
}

// PUT - Update an inventory item
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const updatedItem = await updateItem(id, body)
    
    if (!updatedItem) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updatedItem })
  } catch (error: any) {
    console.error("Error updating item:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update item" },
      { status: 500 }
    )
  }
}

// DELETE - Delete an inventory item
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await deleteItem(id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting item:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete item" },
      { status: 500 }
    )
  }
}
