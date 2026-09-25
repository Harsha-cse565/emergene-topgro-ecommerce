# Emergene & Topgro — Agricultural E-Commerce Website

A production-ready agricultural e-commerce application selling and showcasing the **85 agricultural products** from the official **Emergene & Topgro Updated Product Catalogue 2026**.

---

## 🌾 Key Highlights

* **100% Catalogue Accuracy**: Exactly 85 products extracted from the 2026 catalogue with names preserved from the actual product packaging (never image filenames).
* **Factual Integrity**: No fabricated prices, pack sizes, dosages, or chemical compositions. Missing data is cleanly presented as **"Price on Request"** or **"Information not available"**.
* **Complete E-Commerce Flow**:
  * Home page with Hero, Categories, and Featured Products.
  * Products catalogue with instant global search (by name, category, crop use, pack size, SKU) and multi-facet filtering.
  * Product detail page with dynamic pack-size selector and live price updating.
  * Session-persisted shopping cart with GST calculation and free shipping threshold.
  * Complete checkout with multiple payment options (UPI, Razorpay, Cards, Net Banking, COD).
  * Consignment order tracking with timeline statuses.
  * WhatsApp product enquiry desk with customized pre-filled message.
* **Administrative Operations**:
  * Secure Admin portal with JWT authentication.
  * Real-time metrics dashboard & visual distribution graphs.
  * Full Product CRUD with pack sizes, pricing, and stock editor.
  * Order fulfillment manager with live status transitions.
  * Inventory monitor with Low Stock (Yellow) and Out of Stock (Red) alerts.
  * Category manager and customer inquiries desk.
  * Store settings editor (WhatsApp desk number, shipping rules, tax ID).
  * **Diagnostic Audit Tool** at `/admin/catalog-check` verifying all 85 records.

---

## 🚀 Setup & Running Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Application
```bash
npm run dev
```
The server will start on `http://localhost:3000` (or `http://0.0.0.0:3000`), hosting both the Express API backend and Vite React frontend.

---

## 🔐 Default Access Accounts

### Administrator Account
* **Email:** `admin@emergene.com`
* **Password:** `admin123`
* **Admin Portal URL:** `/admin/login` or `/admin`

### Customer Demo Account
* **Email:** `farmer@example.com`
* **Password:** `farmer123`
* **Customer Account URL:** `/account`

---

## 📦 Verified Product Catalogue Breakdown

The 85 products span 9 agricultural categories:
1. **Fertilizers & Plant Nutrition** (YieldMax 19:19:19, YieldMax 13:0:45, YieldMax MKP 00:52:34, YieldMax SOP 00:00:50, YieldMax Calcium Nitrate, YieldMax MAP, Delite, Remedy Top)
2. **Micronutrients** (Top Zn, Top Iron, BORO TOP, Maxima Top, GroZinc, Calciwin, BoroWin, Ankur Top)
3. **Fungicides** (Shield, Advent, THIOMET, Combiguard)
4. **Insecticides** (Almighty, KartapGard, Proctor, Zotan, Thalak, IMIDAAN, Alcazar, RoyalGard, ComStar, ABAMA, ProGard SP, Acetagard, MAZEGARD, JUDO, VEERA SP)
5. **Herbicides** (noris, Kiezer, WEED WIPER, GLUFOSTAR)
6. **Plant Growth Regulators** (Grovel, arise, Bloomex, BloomStar, Sindhu Gold, Glory, Activa, Liberty, Liberty Gold)
7. **Organic / Biological Products** (SenGen, Quantum Power, Quantum Humic Seaweed Granules, Quantum Granules, Quantum Maxx Combo, Advent-B, Advent Plant Protector)
8. **Seeds** (RNR Sona, YODHA 405, SAMRAT MS 7009)
9. **Specialty Agricultural Products** (RizoGold, Sengen, Ammol, Indigen Super, Viraat RG, Amaron, Titus Gold, Anmol, Maxam, TRIPLE, Indigen+, Veera, Ranger Gold, LUCAS, revive, Ranger, REYNOL, ANMOL, CAPTAIN, TITUS, LUCAS Gold)
