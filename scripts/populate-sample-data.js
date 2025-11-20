// Script to populate Google Sheets with sample restaurant inventory data
// Run this with: node scripts/populate-sample-data.js

require("dotenv").config({ path: ".env.local" });
const { google } = require("googleapis");

const SPREADSHEET_ID =
  process.env.GOOGLE_SHEET_ID || "1Wnt-qEf1fz6TlrzV5xxmF53805_Yn2lGopKYNXYWKK8";
const SHEET_NAME = "Inventory";

// Sample data for restaurant inventory
const sampleData = [
  [
    "1763642299355",
    "Milk",
    "Dairy",
    "1000",
    "liters",
    "2000",
    "0.02",
    "Highland",
    "2025-11-20T14:00:23.846Z",
  ],
  [
    "1763642299356",
    "Coffee Beans (Arabica)",
    "Beverages",
    "45",
    "kg",
    "20",
    "2500",
    "Ceylon Coffee Co.",
    "2025-11-20T14:05:00.000Z",
  ],
  [
    "1763642299357",
    "All-Purpose Flour",
    "Baking",
    "12",
    "kg",
    "25",
    "150",
    "Prima Flour Mills",
    "2025-11-20T14:10:00.000Z",
  ],
  [
    "1763642299358",
    "Eggs",
    "Dairy",
    "120",
    "pieces",
    "100",
    "35",
    "Farm Fresh Kandy",
    "2025-11-20T14:15:00.000Z",
  ],
  [
    "1763642299359",
    "Sugar",
    "Baking",
    "30",
    "kg",
    "15",
    "180",
    "Local Supplier",
    "2025-11-20T14:20:00.000Z",
  ],
  [
    "1763642299360",
    "Rice (Basmati)",
    "Grains & Pasta",
    "100",
    "kg",
    "50",
    "250",
    "Premium Rice Co.",
    "2025-11-20T14:25:00.000Z",
  ],
  [
    "1763642299361",
    "Chicken Breast",
    "Meat & Poultry",
    "15",
    "kg",
    "20",
    "850",
    "Fresh Poultry Farm",
    "2025-11-20T14:30:00.000Z",
  ],
  [
    "1763642299362",
    "Tomatoes",
    "Vegetables",
    "25",
    "kg",
    "30",
    "120",
    "Local Farmer",
    "2025-11-20T14:35:00.000Z",
  ],
  [
    "1763642299363",
    "Olive Oil",
    "Spices & Condiments",
    "8",
    "liters",
    "10",
    "1200",
    "Mediterranean Imports",
    "2025-11-20T14:40:00.000Z",
  ],
  [
    "1763642299364",
    "Fresh Salmon",
    "Seafood",
    "5",
    "kg",
    "8",
    "2500",
    "Ocean Fresh Suppliers",
    "2025-11-20T14:45:00.000Z",
  ],
  [
    "1763642299365",
    "Butter",
    "Dairy",
    "20",
    "kg",
    "15",
    "650",
    "Highland Dairy",
    "2025-11-20T14:50:00.000Z",
  ],
  [
    "1763642299366",
    "Black Pepper",
    "Spices & Condiments",
    "2",
    "kg",
    "3",
    "3500",
    "Spice Traders",
    "2025-11-20T14:55:00.000Z",
  ],
  [
    "1763642299367",
    "Fresh Mushrooms",
    "Vegetables",
    "8",
    "kg",
    "10",
    "450",
    "Forest Farms",
    "2025-11-20T15:00:00.000Z",
  ],
  [
    "1763642299368",
    "Pasta (Spaghetti)",
    "Grains & Pasta",
    "30",
    "kg",
    "20",
    "280",
    "Italian Imports",
    "2025-11-20T15:05:00.000Z",
  ],
  [
    "1763642299369",
    "Cheddar Cheese",
    "Dairy",
    "10",
    "kg",
    "12",
    "1200",
    "Cheese Factory",
    "2025-11-20T15:10:00.000Z",
  ],
  [
    "1763642299370",
    "Fresh Lemons",
    "Fruits",
    "40",
    "pieces",
    "50",
    "25",
    "Citrus Growers",
    "2025-11-20T15:15:00.000Z",
  ],
  [
    "1763642299371",
    "Coconut Milk",
    "Beverages",
    "50",
    "cans",
    "40",
    "180",
    "Tropical Products",
    "2025-11-20T15:20:00.000Z",
  ],
  [
    "1763642299372",
    "Dish Soap",
    "Cleaning Supplies",
    "15",
    "bottles",
    "10",
    "250",
    "Clean Pro",
    "2025-11-20T15:25:00.000Z",
  ],
  [
    "1763642299373",
    "Paper Napkins",
    "Disposables",
    "100",
    "packets",
    "80",
    "45",
    "Paper Supplies Ltd",
    "2025-11-20T15:30:00.000Z",
  ],
  [
    "1763642299374",
    "Vanilla Extract",
    "Spices & Condiments",
    "5",
    "bottles",
    "6",
    "1800",
    "Flavor House",
    "2025-11-20T15:35:00.000Z",
  ],
];

async function populateData() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    console.log("Clearing existing data...");
    // Clear all data first (except we'll preserve row 1 if it has data)
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:I`,
    });

    console.log("Adding sample data...");
    // Add the sample data
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:I${sampleData.length}`,
      valueInputOption: "RAW",
      requestBody: {
        values: sampleData,
      },
    });

    console.log(
      `✅ Successfully added ${sampleData.length} items to the spreadsheet!`
    );
    console.log("\nSummary:");
    console.log(`- Total items: ${sampleData.length}`);
    console.log(
      "- Categories: Dairy, Beverages, Baking, Grains & Pasta, Meat & Poultry, Vegetables, Seafood, Spices & Condiments, Fruits, Cleaning Supplies, Disposables"
    );
    console.log("\nYou can now view these items in your dashboard!");
  } catch (error) {
    console.error("Error populating data:", error.message);
    process.exit(1);
  }
}

populateData();
