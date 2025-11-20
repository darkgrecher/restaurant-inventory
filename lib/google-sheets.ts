import { google } from "googleapis"
import type { InventoryItem } from "./inventory-store"

// Initialize Google Sheets API
const getGoogleSheetsClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  return google.sheets({ version: "v4", auth })
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID
const SHEET_NAME = "Inventory" // The name of the sheet tab in your Google Spreadsheet

// Helper function to convert row data to InventoryItem
const rowToItem = (row: any[]): InventoryItem => {
  return {
    id: row[0] || "",
    name: row[1] || "",
    category: row[2] || "",
    quantity: parseFloat(row[3]) || 0,
    unit: row[4] || "",
    minStock: parseFloat(row[5]) || 0,
    price: parseFloat(row[6]) || 0,
    supplier: row[7] || "",
    lastUpdated: row[8] || new Date().toISOString(),
  }
}

// Helper function to convert InventoryItem to row data
const itemToRow = (item: InventoryItem): any[] => {
  return [
    item.id,
    item.name,
    item.category,
    item.quantity,
    item.unit,
    item.minStock,
    item.price,
    item.supplier || "",
    item.lastUpdated,
  ]
}

// Initialize the spreadsheet with headers if empty
export async function initializeSheet() {
  try {
    const sheets = getGoogleSheetsClient()

    // Check if sheet exists and has headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:I1`,
    })

    // If no headers, add them
    if (!response.data.values || response.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:I1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              "ID",
              "Name",
              "Category",
              "Quantity",
              "Unit",
              "Min Stock",
              "Price",
              "Supplier",
              "Last Updated",
            ],
          ],
        },
      })
    }
  } catch (error) {
    console.error("Error initializing sheet:", error)
    throw error
  }
}

// Get all inventory items
export async function getAllItems(): Promise<InventoryItem[]> {
  try {
    const sheets = getGoogleSheetsClient()

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:I`, // Read from row 1 (no headers)
    })

    const rows = response.data.values || []
    return rows.map(rowToItem)
  } catch (error) {
    console.error("Error getting items:", error)
    throw error
  }
}

// Add a new inventory item
export async function addItem(item: Omit<InventoryItem, "id" | "lastUpdated">): Promise<InventoryItem> {
  try {
    const sheets = getGoogleSheetsClient()

    // Generate a unique ID
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    }

    // Append to the sheet as a new row
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:I`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS", // This ensures data is added as new rows, not columns
      requestBody: {
        values: [itemToRow(newItem)],
      },
    })

    return newItem
  } catch (error) {
    console.error("Error adding item:", error)
    throw error
  }
}

// Update an existing inventory item
export async function updateItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> {
  try {
    const sheets = getGoogleSheetsClient()

    // Get all rows to find the item
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:I`, // Read from row 1 (no headers)
    })

    const rows = response.data.values || []
    const rowIndex = rows.findIndex((row) => row[0] === id)

    if (rowIndex === -1) {
      return null // Item not found
    }

    // Merge existing item with updates
    const existingItem = rowToItem(rows[rowIndex])
    const updatedItem: InventoryItem = {
      ...existingItem,
      ...updates,
      id, // Keep the same ID
      lastUpdated: new Date().toISOString(),
    }

    // Update the row (row index + 1 because sheets are 1-indexed, no header row)
    const sheetRow = rowIndex + 1
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${sheetRow}:I${sheetRow}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [itemToRow(updatedItem)],
      },
    })

    return updatedItem
  } catch (error) {
    console.error("Error updating item:", error)
    throw error
  }
}

// Delete an inventory item
export async function deleteItem(id: string): Promise<boolean> {
  try {
    const sheets = getGoogleSheetsClient()

    // Get all rows to find the item
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:I`, // Read from row 1 (no headers)
    })

    const rows = response.data.values || []
    const rowIndex = rows.findIndex((row) => row[0] === id)

    if (rowIndex === -1) {
      return false // Item not found
    }

    // Delete the row (row index + 1 because sheets are 1-indexed, no header row)
    const sheetRow = rowIndex + 1
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // First sheet (you may need to adjust this if using a different sheet)
                dimension: "ROWS",
                startIndex: sheetRow - 1, // 0-indexed for this API
                endIndex: sheetRow,
              },
            },
          },
        ],
      },
    })

    return true
  } catch (error) {
    console.error("Error deleting item:", error)
    throw error
  }
}

// Get a single item by ID
export async function getItem(id: string): Promise<InventoryItem | null> {
  try {
    const items = await getAllItems()
    return items.find((item) => item.id === id) || null
  } catch (error) {
    console.error("Error getting item:", error)
    throw error
  }
}
