# 🧅 Basla Egypt — Premium Cloud Digital Menu System v3.1

Welcome to **Basla Egypt**, a premium cloud-driven digital menu catalog and table ordering system powered entirely by Google Sheets and React (Vite). It is designed to be highly responsive, visually stunning, and cost-free to host.

---

## ✨ Key Features

1. **Fully Cloud-Managed ☁️**:
   * Fetch menu items, categories, pricing, and sizing variations directly from Google Sheets in real-time.
   * Hide items, configure discount rates, and update active categories on-the-fly.

2. **Flexible Product Image Support 📸**:
   * **Fast Local Images**: Place images inside the `public/assets/` directory and reference them by filename (e.g., `assets/burger.jpg`) in the sheet.
   * **Direct Web Links**: Upload images to free hosting sites (e.g., Postimages, Imgur) and paste the direct link.
   * **Smart Fallback Icon**: If an image is missing or fails to load, the system seamlessly displays the duotone category icon to preserve UI aesthetics.

3. **Instant Kitchen Orders & KPI Dashboard 📦**:
   * A dedicated sheet automatically receives client orders.
   * A live kitchen monitor lists active orders and tracks today's revenue, averages, and statuses automatically.

4. **Read-Only / General Menu Mode 🔍**:
   * When accessed without a table parameter (ideal for street flyers and QR code promotions), the system automatically locks ordering and hides the cart bar.
   * When opened with a table parameter (e.g., `?table=5`), ordering capabilities are instantly enabled.

5. **Premium Look & Smooth Micro-Animations 🎨**:
   * Utilizes elegant Cairo typography, tailored brand colors, beautiful pulse loading animations, and delightful touch physics.

---

## 🛠️ Installation & Setup Guide

### 1. Google Sheets Configuration
1. Create a new Google Sheet.
2. Navigate to **Extensions > Apps Script**.
3. Replace the default code with the contents of the `google-apps-script.js` file found in the root directory.
4. Save the project, select the `setupDatabase` function, and click **Run** to generate the styled sheets and dashboards automatically.
5. **Row Deletion Utility**: A custom menu named `🧅 Basla Egypt` will appear on the top menu bar in Google Sheets. It contains a `🗑️ Delete Selected Row` action to securely delete any selected row (item or order) at once.

### 2. Deploying the Apps Script as a Web App
1. Inside Apps Script, click **Deploy > New Deployment**.
2. Select **Web App** as the deployment type.
3. Configure the following:
   * **Execute as**: `Me`
   * **Who has access**: `Anyone`
4. Click **Deploy** and authorize the script.
5. Copy the generated **Web App URL**.

### 3. Connecting the Frontend to Your Sheet
1. Open the file `src/config.js` in the project directory.
2. Replace the `apiUrl` property with the Web App URL you copied.
3. Set `demoMode` to `false` to fetch the menu data dynamically from Google Sheets.

---

## 📸 Product Images Guide
In Google Sheets, fill in the 13th column named **`الصورة (اختياري)`** (Image - Optional):

* **Using Postimages (Recommended)**: Upload your image to [Postimages](https://postimages.org/), copy the **Direct Link** (the URL ending in `.jpg` or `.png`), and paste it in the sheet.
* **Using Local Files**: Put your image in the project's `public/assets/` directory and write the path in the sheet (e.g., `assets/dish.jpg`).
* **Fallback Icon**: Leave the cell empty to automatically display the category-specific duotone icon.

---

## 🚀 Running and Building

### Development Server:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```
This generates the optimized `dist/` folder, ready to be hosted on free platforms like Netlify, Vercel, or GitHub Pages.
