import { NextResponse } from "next/server"
import { getAllItems, addItem, initializeSheet } from "@/lib/google-sheets"

// GET - Fetch all inventory items
export async function GET() {
  try {
    // Initialize sheet if needed (adds headers if missing)
    await initializeSheet()
    
    const items = await getAllItems()
    return NextResponse.json({ success: true, data: items })
  } catch (error: any) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch inventory" },
      { status: 500 }
    )
  }
}

// POST - Add a new inventory item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, category, quantity, unit, minStock, price } = body
    if (!name || !category || quantity === undefined || !unit || minStock === undefined || price === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newItem = await addItem({
      name,
      category,
      quantity: parseFloat(quantity),
      unit,
      minStock: parseFloat(minStock),
      price: parseFloat(price),
      supplier: body.supplier || "",
    })

    return NextResponse.json({ success: true, data: newItem }, { status: 201 })
  } catch (error: any) {
    console.error("Error adding inventory item:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add item" },
      { status: 500 }
    )
  }
}
