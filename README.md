# 🛒 Mini Checkout & Playwright Browser Test Suite

> **Role:** SDET Intern Assessment &bull; **Hackathon:** Mini Checkout and Browser Test Suite  
> **Tech Stack:** Vanilla JavaScript (ES6+), Semantic HTML5, CSS3, Playwright, Node.js

A production-grade, single-page eCommerce checkout flow paired with an automated Playwright browser test suite. Built to demonstrate software testability, deterministic customer-visible assertions, defensive input validation, and race-condition prevention.

---

## 🌟 Features & Highlights

- **Synthetic Product Catalog:**
  - 🎧 *Aura Pro Wireless Headphones* ($120.00)
  - ⌨️ *Keyforge Ergonomic Mechanical Keyboard* ($85.00)
- **Dynamic Cart Calculations:** Real-time line item updates and grand total computation for additions, subtractions, quantity typing, and item removals.
- **Defensive Form Validation:** Strict checks for missing customer name and empty cart scenarios, with full preservation of existing customer inputs on error.
- **Double-Submit Prevention:** Dual-layer race-condition guard (synchronous in-memory lock + immediate DOM button disable) preventing multiple orders or duplicate confirmations from rapid clicks.
- **Automated Browser Test Suite:** Built with **Playwright**, featuring web-first assertions, deterministic waiting, clean-state test isolation, and HTML reporting.

---

## 📋 Test Matrix Overview

| Test ID | Test Scenario | Type | Description |
| :--- | :--- | :--- | :--- |
| **Check 1** | **Happy Path Checkout** | Automated (P0) | Customer fills name and email, places order, receives confirmation with unique reference `ORD-XXXXXX-YYYY` and exact breakdown. |
| **Check 2** | **Missing Required Field** | Automated (P0) | Missing required customer name blocks submission, shows clear validation alert, and preserves entered email. |
| **Check 3** | **Dynamic Quantity & Totals** | Automated (P0) | Adjusting quantities via `+`/`-` buttons and direct numeric typing updates line totals and grand total with 100% mathematical accuracy. |
| **Check 4** | **Empty Cart Guard** | Automated (P1) | Empty cart blocks order placement, shows human-friendly alert, and prevents ghost orders. |
| **Check 5** | **Double-Click Protection** | Automated (P0) | Rapid consecutive clicks on "Place Order" produce exactly one confirmation view and one order reference. |

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Installation

Clone this repository and install dependencies:

```bash
git clone https://github.com/<your-username>/mini-checkout-sdet.git
cd mini-checkout-sdet
npm install
```

Install the Playwright browser:

```bash
npx playwright install chromium
```

---

### 2. Run the Web Application Locally

Start the local static server:

```bash
npm start
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

### 3. Run Automated Browser Tests

Playwright automatically manages the local web server during test execution.

#### Run all tests headlessly (Standard CI / CLI mode):
```bash
npm test
```

#### Run tests in headed browser mode (Watch tests run visually in real-time):
```bash
npm run test:headed
```

#### Run tests with Playwright Interactive UI Mode:
```bash
npm run test:ui
```

#### View HTML Test Report:
```bash
npm run test:report
```

---

## 📁 Repository Structure

```
mini-checkout-sdet/
├── public/                     # Frontend Application
│   ├── index.html              # Accessible single-page checkout markup
│   ├── styles.css              # Modern responsive styling & UI states
│   └── app.js                  # Cart logic, calculations, & concurrency guard
├── tests/                      # Automated Test Suite
│   └── checkout.spec.js        # Playwright test specifications (Checks 1-5)
├── playwright.config.js        # Playwright runner configuration & webServer
├── TEST_PLAN.md                # Comprehensive SDET Test Plan & Defect Log
├── VIDEO_WALKTHROUGH.md        # Video demonstration script & submission guide
├── package.json                # Project dependencies and test scripts
└── README.md                   # Documentation & quickstart
```

---

## 🧪 Testing Strategy & Best Practices

1. **Customer-Visible Assertions:**  
   Tests avoid arbitrary fixed waits (`sleep`, `page.waitForTimeout`). Instead, they assert what the user actually sees on screen using web-first locators:
   ```javascript
   await expect(page.getByTestId('confirmation-card')).toBeVisible();
   await expect(page.getByTestId('order-total')).toHaveText('$325.00');
   ```
2. **Hermetic Test Isolation:**  
   Every test runs through `test.beforeEach()` to reload a fresh page state, preventing test pollution.
3. **Resilient Locators:**  
   Uses dedicated `data-testid` attributes (e.g., `data-testid="place-order-btn"`, `data-testid="order-reference"`) rather than fragile CSS hierarchies.

---

## 🌐 Deploy to GitHub Pages (Live Demo)

This application is a 100% client-side static application. To host a free live demo on GitHub Pages:
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, select **Source:** `Deploy from a branch`.
4. Choose `main` branch and `/public` or `/root` (if root, move `public/` files or use GitHub Pages action).
5. Your live demo URL will be `https://<your-username>.github.io/mini-checkout-sdet/`.

---

## 📄 Documentation Links

- [Test Plan & Defect Log](file:///TEST_PLAN.md)
- [Video Recording Walkthrough Script](file:///VIDEO_WALKTHROUGH.md)
