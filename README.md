# Investments Monitoring — EasyEquities (ZAR & USD Intelligence)

A futuristic, dark-mode intelligence dashboard designed to monitor, analyze, and compare premier Exchange Traded Funds (ETFs) on **EasyEquities** across both **JSE (ZAR + Tax-Free Savings Account / TFSA)** and **EasyEquities USD (Direct Offshore)** accounts.

Engineered with a high-craft **Cyber-Fintech** visual aesthetic (deep obsidian `#07090e`, neon cyan `#00f2fe`, and emerald glow `#05ffa1`), tailored for cross-border family sharing and institutional-grade portfolio oversight.

---

## ⚡ Key Highlights & Core Capabilities

1. **Dual-Account Coverage:**
   * **EasyEquities ZAR (JSE):** Flagship rand-hedge, local market, and TFSA-compliant ETFs from Satrix, Sygnia Itrix, and 10X Investments.
   * **EasyEquities USD (DriveWealth):** Direct US Dollar accounts holding Vanguard and Invesco titans (VOO, QQQ, VT) with razor-thin expense ratios (0.03% – 0.20%).
2. **Command KPI Overview:** Instant high-priority badges identifying lowest Total Expense Ratio (TER), top 3-year and 5-year annualized performers, top dividend yield, and the #1 TFSA core pick.
3. **Interactive Comparison Matrix:** Sort and filter across currencies (ZAR vs USD), TFSA eligibility, asset categories, and custom max-TER sliders.
4. **Side-by-Side Fund Comparator:** Select 2 or 3 ETFs to visualize:
   * **10-Year Compound Fee Drag Simulator:** Calculates true lost wealth to fees over 5, 10, and 20 years on a lump sum + monthly contribution plan.
   * **Trailing Annualized Returns (1Y, 3Y, 5Y).**
   * **Underlying Top 10 Holdings Overlap Analysis.**
5. **Deep-Dive Fund Drawer:** Slide-over modal displaying:
   * Official Minimum Disclosure Document (MDD) data & risk rating
   * Interactive Top 10 Holdings bar breakdown
   * Sector & Geographic allocation graphs
   * Exact Total Investment Charge (TIC) breakdown (TER + TC)
6. **Live Currency Toggle (ZAR / USD):** Instant toggle converting all monetary projections and returns between South African Rand (R) and US Dollar ($) for effortless international viewing.

---

## 📂 Project Architecture

```
Projects/Investments-Monitoring-EasyEquities/
├── data/
│   ├── etfs.json               # Verified MDD fund intelligence & holdings data
│   └── exchange_rates.json     # USD/ZAR conversion reference
├── public/
│   ├── favicon.svg             # Cyber-fintech glowing pulse icon
│   └── og-preview.png          # Social preview image
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top brand bar with status indicator & currency toggle
│   │   ├── CommandOverview.jsx # High-impact KPI pulse cards
│   │   ├── FilterToolbar.jsx   # Currency, TFSA, category, and TER filters
│   │   ├── ETFCard.jsx         # Glassmorphic card display
│   │   ├── ETFMatrix.jsx       # Sortable multi-column institutional table
│   │   ├── FundComparator.jsx  # Side-by-side 2-3 fund comparator & fee drag chart
│   │   ├── FundModal.jsx       # Full fact-sheet deep-dive slideover drawer
│   │   └── FeeSimulator.jsx    # Interactive compound interest & fee erosion engine
│   ├── data/
│   │   └── etfService.js       # Filtering, conversion, and calculation logic
│   ├── styles/
│   │   └── index.css           # Tailwind CSS directives & cyber glow utilities
│   ├── App.jsx                 # Master application shell
│   └── main.jsx                # React DOM entry
├── package.json                # Dependencies and build scripts
├── vite.config.js              # Vite bundler configuration
└── vercel.json                 # Zero-configuration Vercel deployment spec
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## 🌐 Deploying Online (Shareable Live Link for Family)

### Option A: 1-Click Vercel Deployment (Recommended)
1. Push this folder to a GitHub repository.
2. Visit [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository. Vercel automatically detects the Vite config and pre-configured `vercel.json`.
4. Click **Deploy**. In under 60 seconds you will receive a secure, live URL (e.g. `https://investments-monitoring.vercel.app`) to share via WhatsApp or email.

### Option B: GitHub Pages
A pre-configured GitHub Actions workflow can deploy the compiled `dist/` directory directly to GitHub Pages on every push to `main`.
