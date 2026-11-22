# 🎥 Video Demonstration Script & Recording Guide

**Goal:** Create a 2–3 minute polished video walkthrough showcasing the Mini Checkout and Browser Test Suite for the SDET Intern Hackathon.

---

## 🎬 Video Recording Outline (2–3 Minutes)

### ⏱️ Timestamp Breakdown

| Timestamp | Segment | Action / Screen View |
| :--- | :--- | :--- |
| **0:00 – 0:30** | **Introduction & Problem Scope** | Show project README or intro slide & application homepage. |
| **0:30 – 1:15** | **Live Checkout Feature Walkthrough** | Interact with the UI: show products, quantity change, real-time totals, and happy path order placement. |
| **1:15 – 1:50** | **Negative Testing & Edge Cases** | Demonstrate missing name validation, empty cart validation, and double-click protection. |
| **1:50 – 2:30** | **Automated Playwright Suite Run** | Run `npm test` or `npm run test:headed` in the terminal; show all 5 checks passing and open HTML report. |
| **2:30 – 3:00** | **SDET Mindset & Wrap Up** | Briefly highlight the `TEST_PLAN.md` risk matrix and conclusion. |

---

## 🗣️ Word-for-Word Voiceover Script

### Segment 1: Introduction (0:00 – 0:30)
> *"Hello! My name is [Your Name], and this is my submission for the SDET Intern Mini Checkout and Browser Test Suite hackathon.*
> 
> *The objective of this challenge is to build a reliable single-page checkout flow with dynamic synthetic products, handle common checkout failure modes like empty carts and double clicks, and automate browser validation checks using modern SDET testing standards.*
> 
> *Let's take a look at the application and the test suite."*

---

### Segment 2: Live Checkout & Happy Path (0:30 – 1:15)
*(Action: Open `http://localhost:3000` in browser)*
> *"Here is our single-page checkout. We have two synthetic products: the Aura Pro Wireless Headphones at $120, and the Keyforge Mechanical Keyboard at $85.*
> 
> *Notice that as I increase the quantity of headphones to 2, the line total updates instantly to $240, and the order grand total recalculates to $325 with complete mathematical accuracy.*
> 
> *Now, let's complete a happy path order. I'll enter 'Alex Morgan' as the full name and 'alex@example.com' as the email. Clicking 'Place Order' transitions us seamlessly into our Order Confirmation screen, showing a unique order reference number, order breakdown, and confirmed total."*

---

### Segment 3: Negative Scenarios & Edge Cases (1:15 – 1:50)
*(Action: Click 'Start New Checkout')*
> *"Next, let's explore edge cases and error prevention.*
> 
> *First, what happens if a required field is missing? If I leave the customer name blank and enter an email, clicking 'Place Order' blocks checkout and displays a clear, accessible validation alert. Crucially, the email the user typed is preserved so they don't have to retype it.*
> 
> *Second, what happens if the cart is empty? If I remove both products from the cart, the application displays an empty cart state, and clicking Place Order blocks submission with a friendly alert.*
> 
> *Third, double-click protection: if a user rapidly double-clicks 'Place Order', our synchronous event lock and immediate button disabling ensure only a single confirmation is ever generated, preventing duplicate charges."*

---

### Segment 4: Automated Test Execution (1:50 – 2:30)
*(Action: Switch to Terminal and run `npm run test:headed` or `npm test`)*
> *"To ensure long-term regression safety, I built a comprehensive browser automation test suite using Playwright.*
> 
> *Let's run the tests headed so you can see them interact with the browser in real time:*
> `npm run test:headed`
> 
> *(Wait 3-5 seconds as Playwright runs)*
> 
> *As you can see, all 5 automated checks passed:*
> - *Check 1 verifies happy path order placement and regex reference matching.*
> - *Check 2 verifies required field validation and form data preservation.*
> - *Check 3 verifies dynamic math calculations on quantity changes.*
> - *Check 4 verifies empty cart blockage.*
> - *And Check 5 verifies rapid multi-click concurrency safety.*
> 
> *All tests start from a clean state and use web-first, customer-visible assertions rather than fragile fixed timeouts."*

---

### Segment 5: Test Plan & Closing (2:30 – 3:00)
*(Action: Quickly show `TEST_PLAN.md`)*
> *"Finally, I documented a complete Test Plan including a Risk Prioritization Matrix (ranking double submit and math errors as P0 critical risks), manual testing logs, and defect logs.*
> 
> *The entire project is packaged with clear documentation, ready for CI/CD. Thank you for your time and consideration!"*

---

## 🛠️ Tips for Recording
- **Screen Recording Tool:** Loom, OBS Studio, or QuickTime Player (on Mac: `Cmd + Shift + 5`).
- **Resolution:** 1080p full screen.
- **Audio:** Use a headset or external mic in a quiet room.
