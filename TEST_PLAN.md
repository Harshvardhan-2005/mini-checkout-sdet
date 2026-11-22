# Mini Checkout — Quality Assurance & Test Plan

**Author:** SDET Intern Candidate  
**Project:** Mini Checkout and Browser Test Suite  
**Target Application:** Single-Page eCommerce Checkout Interface  
**Automation Framework:** Playwright (Chromium, Headless & Headed)  

---

## 1. Executive Summary & Objective

The objective of this test plan is to establish a rigorous, reproducible quality strategy for the **Mini Checkout** web application. In an eCommerce checkout pipeline, defects directly impact business revenue, customer trust, and financial reconciliation. 

This document defines:
- **Key Checkout Risks** and their priority classification.
- **Automated Test Suite** architecture and customer-visible assertion strategy.
- **Manual Test Execution Log** for high-risk boundary cases (Empty Cart & Rapid Double-Click).
- **Defect Reporting & Defect Resolution Log**.

---

## 2. Checkout Risk Analysis & Prioritization Matrix

In checkout flows, failures must be prioritized based on severity to revenue, transactional consistency, and customer experience.

| Priority | Risk Description | Business Impact | Mitigation & Testing Strategy |
| :--- | :--- | :--- | :--- |
| **P0 (Critical)** | **Double Order Placement (Double Submit):** User clicks "Place Order" multiple times in quick succession (network lag, impatience), creating duplicate orders or duplicate charges. | Duplicate financial transactions, inventory corruption, customer dispute. | Concurrency guard (`isSubmitting` lock + immediate button disable) verified through automated stress-click test and manual rapid-fire testing. |
| **P0 (Critical)** | **Incorrect Order & Line Total Calculations:** Total price does not match sum of item unit prices $\times$ quantities. | Undercharging (financial loss) or overcharging (legal/trust issues). | Automated precision testing of dynamic cart calculations across addition, direct numeric typing, and removal. |
| **P0 (Critical)** | **Missing Customer Identity / Shipping Data:** Order submitted without required customer name. | Inability to fulfill, ship, or verify order legality. | Strict client-side validation blocking submission, highlighting field, and preserving user inputs. |
| **P1 (High)** | **Checkout with Empty Cart:** Allowing checkout when item count is 0. | Zero-dollar ghost orders polluting inventory and fulfillment pipeline. | Cart state verification preventing order placement when items count is zero. |
| **P1 (High)** | **Input Wipe on Validation Failure:** Clearing customer inputs when validation fails. | Extreme user frustration and checkout abandonment. | Form state preservation verification: ensure non-erroneous fields (e.g. email) remain intact during errors. |
| **P2 (Medium)** | **Ambiguous Error Feedback:** Generic or missing error notifications. | User confusion, repeated failed attempts. | Prominent, accessible alert messages placed near checkout button and field-level highlighting. |

---

## 3. Test Cases Specification

### TC-01: Successful Order Placement (Happy Path)
* **Priority:** P0  
* **Type:** Automated (Check 1)  
* **Pre-conditions:** Page loaded at `/` with default cart items (Headphones: $120.00, Keyboard: $85.00, Total: $205.00).  
* **Test Steps:**
  1. Fill "Full Name" with `Jane Doe`.
  2. Fill "Email Address" with `jane.doe@example.com`.
  3. Click "Place Order" button.
* **Expected Result:**
  - Checkout form view is hidden.
  - Order confirmation screen is displayed.
  - A unique order reference matching `ORD-[A-Z0-9]+-\d{4}` is shown.
  - Customer name, item count (2 items), and total ($205.00) match the placed order.

---

### TC-02: Missing Required Field Validation & Form State Retention
* **Priority:** P0  
* **Type:** Automated (Check 2)  
* **Pre-conditions:** Page loaded at `/`.  
* **Test Steps:**
  1. Leave "Full Name" field empty.
  2. Fill "Email Address" with `incomplete.customer@example.com`.
  3. Click "Place Order" button.
* **Expected Result:**
  - Checkout is blocked; confirmation view is NOT displayed.
  - A prominent validation alert appears stating: `"Customer Name is required to place an order."`.
  - The "Full Name" input is highlighted with an error border.
  - **Crucial:** The entered email address (`incomplete.customer@example.com`) is **preserved** and not cleared.

---

### TC-03: Real-Time Dynamic Cart Quantity & Total Calculation
* **Priority:** P0  
* **Type:** Automated (Check 3)  
* **Pre-conditions:** Page loaded at `/` with 1x Headphones ($120.00) and 1x Keyboard ($85.00).  
* **Test Steps:**
  1. Verify initial line totals ($120.00, $85.00) and Order Total ($205.00).
  2. Click `+` on Headphones (Quantity becomes 2).
  3. Verify Headphones line total updates to `$240.00` and Order Total to `$325.00`.
  4. Type `3` into Keyboard quantity input.
  5. Verify Keyboard line total updates to `$255.00` and Order Total to `$495.00`.
  6. Click `-` on Headphones (Quantity becomes 1).
  7. Verify Headphones line total updates to `$120.00` and Order Total to `$375.00`.
* **Expected Result:**
  - All line totals and the grand total update synchronously with exact mathematical precision.

---

### TC-04: Empty Cart Checkout Prevention
* **Priority:** P1  
* **Type:** Automated (Check 4) & Manual  
* **Pre-conditions:** Page loaded at `/`.  
* **Test Steps:**
  1. Enter customer name `Bob Smith`.
  2. Remove Headphones by clicking `✕`.
  3. Remove Keyboard by clicking `✕`.
  4. Observe cart display.
  5. Click "Place Order" button.
* **Expected Result:**
  - Empty cart state notice is displayed (`"Your cart is currently empty."`).
  - Total shows `$0.00`.
  - Clicking "Place Order" is blocked and displays alert: `"Your cart is empty. Please add at least one product before placing an order."`.
  - Confirmation screen is NOT shown; customer name `Bob Smith` remains preserved.

---

### TC-05: Rapid Double-Click Concurrency Defense
* **Priority:** P0  
* **Type:** Automated (Check 5) & Manual  
* **Pre-conditions:** Page loaded at `/`, name filled.  
* **Test Steps:**
  1. Fill "Full Name" with `Alice Johnson`.
  2. Trigger two or three rapid consecutive clicks on "Place Order" within < 100ms.
* **Expected Result:**
  - Place Order button is immediately disabled upon the first click with a loading indicator.
  - Exactly **one** order confirmation is generated and displayed.
  - Exactly **one** order reference is produced.
  - No duplicate orders or flickering screens.

---

## 4. Manual Testing Execution Log

| Test Case | Scenario | Environment | Execution Details & Observations | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MAN-01** | **Empty Cart Checkout** | Chrome / macOS Desktop | 1. Navigated to checkout page.<br>2. Removed both items via the `✕` button.<br>3. Verified empty cart illustration and zero subtotal.<br>4. Entered customer name "Alex Manual".<br>5. Clicked "Place Order".<br>**Observation:** Checkout was strictly blocked. An alert box rendered with text: *"Your cart is empty. Please add at least one product before placing an order."* Customer name was preserved. | **PASS** |
| **MAN-02** | **Rapid Double-Click** | Chrome / macOS Desktop | 1. Populated "Full Name" as "Dave Rapid".<br>2. Spammed the "Place Order" button 4 times within ~150ms.<br>**Observation:** Button disabled on the very first mousedown/click. Button label updated to "Placing Order..." with a spinner. Exactly one confirmation screen appeared with a single reference `ORD-XXXXXX-YYYY`. Console logged duplicate click drops. | **PASS** |

---

## 5. Defect Investigation & Resolution Log

During the test-driven development and exploratory testing cycle, real edge cases were evaluated and addressed:

### Defect Report DEF-001 (Resolved during development)
* **Severity:** High (P1)
* **Title:** Native form submission caused page reload and wiped entered data on validation failure
* **Pre-conditions:** User fills optional email, leaves required name empty.
* **Steps to Reproduce:**
  1. Open checkout.
  2. Leave name blank, fill email.
  3. Click Place Order.
* **Expected Result:** Application blocks submission, displays inline error, and preserves email field for easy correction.
* **Actual Result (Initial Build):** If wrapped in a standard HTML form without `event.preventDefault()` or when using `<form method="GET">`, browser triggered a page reload, resetting all inputs.
* **Root Cause:** Default form submit event triggering navigation.
* **Fix Applied:** Used explicit JavaScript event handlers with type="button" and non-destructive state rendering to preserve all input fields during validation errors.
* **Verification:** Verified via Automated Check 2 in Playwright.

### Defect Report DEF-002 (Resolved during development)
* **Severity:** Critical (P0)
* **Title:** Race condition allowed multiple confirmation generations if double-clicked during async latency window
* **Pre-conditions:** Network simulation latency set to 150ms.
* **Steps to Reproduce:**
  1. Rapidly click "Place Order" twice before the 150ms timeout finishes.
* **Expected Result:** Second click ignored; single confirmation screen.
* **Actual Result (Initial Build):** Without an in-memory `isSubmitting` flag, both click events scheduled timeouts, executing two state updates.
* **Root Cause:** Relying solely on DOM `disabled` attribute can have a microtask delay before the browser registers disabled state.
* **Fix Applied:** Implemented synchronous dual-layer locking: in-memory boolean flag `isSubmitting = true` evaluated synchronously at the very first line of the click handler, combined with immediate DOM `button.disabled = true`.
* **Verification:** Verified via Automated Check 5 in Playwright and manual stress testing.

---

## 6. Assertion Strategy (SDET Best Practices)

Following modern test engineering principles:
1. **User-Visible Locators:** Prioritized `getByTestId()`, `getByRole()`, and semantic attributes over fragile CSS selector paths or DOM index assumptions.
2. **Deterministic Waiting:** Utilized Playwright's web-first assertions (`expect(locator).toBeVisible()`, `expect(locator).toHaveText()`) with auto-retrying locators instead of arbitrary `page.waitForTimeout()` sleeps.
3. **Hermetic Test Isolation:** `test.beforeEach()` navigates to fresh state ensuring no state pollution between tests.
