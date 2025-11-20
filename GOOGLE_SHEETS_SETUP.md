# Google Sheets Integration Setup Guide

This guide will walk you through setting up Google Sheets as your database for the Restaurant Inventory Dashboard.

## 📋 Prerequisites

- A Google account
- Your Google Spreadsheet (already created): https://docs.google.com/spreadsheets/d/1Wnt-qEf1fz6TlrzV5xxmF53805_Yn2lGopKYNXYWKK8/edit

## 🚀 Step-by-Step Setup

### Step 1: Set Up Google Cloud Project (5 minutes)

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**

   - Click on the project dropdown at the top
   - Click "New Project"
   - Name it: `restaurant-inventory` (or any name you prefer)
   - Click "Create"
   - Wait for the project to be created, then select it

3. **Enable Google Sheets API**
   - In the search bar at the top, type "Google Sheets API"
   - Click on "Google Sheets API"
   - Click the blue "Enable" button
   - Wait for it to enable (takes a few seconds)

### Step 2: Create Service Account (3 minutes)

1. **Navigate to Service Accounts**

   - In the left sidebar, click "IAM & Admin" → "Service Accounts"
   - Or search for "Service Accounts" in the top search bar

2. **Create Service Account**

   - Click "+ CREATE SERVICE ACCOUNT" at the top
   - Fill in the details:
     - **Service account name**: `inventory-service`
     - **Service account ID**: Will auto-fill (like `inventory-service@...`)
     - **Description**: `Service account for restaurant inventory app`
   - Click "CREATE AND CONTINUE"

3. **Grant Permissions (Optional - Skip for now)**
   - Click "CONTINUE" (we don't need special roles)
   - Click "DONE"

### Step 3: Create and Download Credentials (2 minutes)

1. **Generate Key**

   - You should now see your service account in the list
   - Click on the email address of the service account you just created
   - Go to the "KEYS" tab
   - Click "ADD KEY" → "Create new key"
   - Select "JSON" format
   - Click "CREATE"
   - A JSON file will automatically download to your computer

2. **Important: Save This File!**
   - This file contains your private key
   - Keep it secure and never commit it to Git
   - You'll need information from this file in the next step

### Step 4: Share Your Google Sheet with Service Account (1 minute)

1. **Copy the Service Account Email**

   - Open the JSON file you just downloaded
   - Find the `"client_email"` field
   - Copy the entire email address (it looks like: `inventory-service@restaurant-inventory-xxxxx.iam.gserviceaccount.com`)

2. **Share Your Spreadsheet**

   - Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Wnt-qEf1fz6TlrzV5xxmF53805_Yn2lGopKYNXYWKK8/edit
   - Click the green "Share" button in the top right
   - Paste the service account email
   - Make sure it has "Editor" permissions
   - **IMPORTANT**: Uncheck "Notify people" (it's a service account, not a person)
   - Click "Share"

3. **Create the Sheet Tab**
   - In your Google Spreadsheet, make sure there's a sheet tab named **"Inventory"** (case-sensitive)
   - If it's named "Sheet1", right-click the tab and rename it to "Inventory"
   - Leave it blank - the app will automatically add headers and data

### Step 5: Configure Your Project (2 minutes)

1. **Create `.env.local` file**

   - In your project root folder (`C:\Users\hasha\OneDrive\Desktop\restaurant-inventory`), create a new file named `.env.local`
   - This file will store your credentials

2. **Add Your Credentials**
   - Open the JSON file you downloaded earlier
   - Copy the following information into `.env.local`:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=1Wnt-qEf1fz6TlrzV5xxmF53805_Yn2lGopKYNXYWKK8
GOOGLE_CLIENT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

**How to fill these in:**

- `GOOGLE_SHEET_ID`: Already filled in above (from your spreadsheet URL)
- `GOOGLE_CLIENT_EMAIL`: Copy from `client_email` field in the JSON file
- `GOOGLE_PRIVATE_KEY`: Copy the entire `private_key` field from the JSON file
  - **Important**: Keep the quotes around the private key
  - Make sure to include the `\n` characters as they appear in the JSON

**Example:**

```env
GOOGLE_SHEET_ID=1Wnt-qEf1fz6TlrzV5xxmF53805_Yn2lGopKYNXYWKK8
GOOGLE_CLIENT_EMAIL=inventory-service@restaurant-inventory-123456.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

3. **Save the File**
   - Save `.env.local` in your project root
   - Make sure it's named exactly `.env.local` (with the dot at the beginning)

### Step 6: Test Your Setup! 🎉

1. **Start the Development Server**

   ```powershell
   npm run dev
   ```

2. **Open Your App**

   - Go to: http://localhost:3000
   - Navigate to the "Inventory" page

3. **Test the Integration**
   - Try adding a new item from the "Add Inventory" page
   - Check your Google Spreadsheet - you should see the data appear!
   - Try editing and deleting items
   - All changes should sync to your spreadsheet in real-time

## 🔍 Troubleshooting

### Error: "Failed to fetch inventory"

- Check that your `.env.local` file is in the correct location
- Make sure the `GOOGLE_SHEET_ID` matches your spreadsheet
- Verify that you shared the spreadsheet with the service account email

### Error: "The caller does not have permission"

- Make sure you shared the spreadsheet with the service account email
- Verify the service account has "Editor" permissions

### Error: "Invalid credentials"

- Check that the `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` are copied correctly
- Make sure the private key includes the quotes and all the `\n` characters

### Sheet Not Found

- Make sure your sheet tab is named exactly "Inventory" (case-sensitive)
- The sheet should be the first tab, or update `SHEET_NAME` in `lib/google-sheets.ts`

### Private Key Format Issues

- The private key should be enclosed in double quotes
- All `\n` characters should be preserved (they represent line breaks)
- Don't remove any part of the key including the BEGIN and END markers

## 📝 Important Notes

- **Never commit `.env.local` to Git** - it contains sensitive credentials
- The `.env.local` file is already in `.gitignore` by default in Next.js
- If you share this project, others will need their own Google Cloud setup
- The spreadsheet will automatically initialize with headers when you first run the app

## 🎯 What Happens Next

Once setup is complete:

- All inventory data will be stored in your Google Spreadsheet
- Any CRUD operations (Create, Read, Update, Delete) will sync to the spreadsheet
- Multiple users can access the spreadsheet to view data
- You can use Google Sheets features like charts, filters, and formulas
- The dummy data from the old version is completely removed

## 🔒 Security Best Practices

1. Keep your service account JSON file secure
2. Never share your `.env.local` file
3. Never commit credentials to version control
4. Only share the spreadsheet with trusted service accounts/users
5. Regularly rotate service account keys if needed (through Google Cloud Console)

---

**Need Help?** If you encounter any issues, check the browser console for error messages and verify each step above.
