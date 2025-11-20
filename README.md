# 🍽️ Restaurant Inventory Management Dashboard

A modern, real-time inventory management system for restaurants, powered by Google Sheets as the database backend.

## ✨ Features

- **Real-time Sync**: All inventory data is stored in Google Sheets and syncs in real-time
- **Full CRUD Operations**: Create, Read, Update, and Delete inventory items
- **Low Stock Alerts**: Visual warnings when items fall below minimum stock levels
- **Search & Filter**: Quickly find items by name or category
- **Modern UI**: Built with Next.js 16, React 19, and Tailwind CSS
- **No Database Required**: Uses Google Sheets API - no SQL database setup needed!

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
npm install --legacy-peer-deps
```

### 2. Set Up Google Sheets Integration

Follow the detailed guide in **[GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)** to:

- Create a Google Cloud project
- Enable Google Sheets API
- Create service account credentials
- Share your spreadsheet with the service account
- Configure environment variables

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```powershell
cp .env.local.example .env.local
```

Then edit `.env.local` with your Google Cloud credentials.

### 4. Run the Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
restaurant-inventory/
├── app/
│   ├── api/
│   │   └── inventory/          # API routes for CRUD operations
│   ├── inventory/              # Inventory list page
│   ├── add-inventory/          # Add new item page
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── header.tsx              # App header
│   └── navigation.tsx          # Navigation menu
├── lib/
│   ├── google-sheets.ts        # Google Sheets API integration
│   ├── inventory-store.ts      # State management
│   └── utils.ts                # Utility functions
├── .env.local.example          # Environment variables template
├── GOOGLE_SHEETS_SETUP.md      # Detailed setup guide
└── README.md                   # This file
```

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Google Sheets API
- **UI Components**: Radix UI
- **Icons**: Lucide React

## 📊 Google Sheets Structure

Your spreadsheet will automatically be initialized with these columns:

| ID  | Name | Category | Quantity | Unit | Min Stock | Price | Supplier | Last Updated |
| --- | ---- | -------- | -------- | ---- | --------- | ----- | -------- | ------------ |

The app automatically manages this structure - you just need a blank spreadsheet with a tab named "Inventory".

## 🔐 Security

- Environment variables are stored in `.env.local` (never committed to Git)
- Service account credentials are kept secure
- Google Sheets access is controlled via service account permissions
- All sensitive files are included in `.gitignore`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

If you encounter issues:

1. Check the browser console for error messages
2. Verify your `.env.local` file is configured correctly
3. Ensure the spreadsheet is shared with the service account email
4. Make sure the sheet tab is named "Inventory" (case-sensitive)
5. See [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) for detailed troubleshooting

## 📄 License

This project is private and for personal/business use.

## 🤝 Support

For issues or questions, refer to the setup guide or check the browser console for error messages.

---

**Built with ❤️ for efficient restaurant inventory management**
