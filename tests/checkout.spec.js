const { test, expect } = require('@playwright/test');

test.describe('Mini Checkout Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Start each test from a clean state
    await page.goto('/');
    // Verify initial clean state is loaded
    await expect(page.getByTestId('cart-items-list')).toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('$205.00');
  });

  /**
   * CHECK 1: Happy Path
   * Requirement: Verify a successful checkout produces a confirmation with an order reference.
   */
  test('Check 1: should successfully place an order and show confirmation with order reference', async ({ page }) => {
    const customerName = 'Jane Doe';
    const customerEmail = 'jane.doe@example.com';

    // 1. Fill customer details
    await page.getByTestId('customer-name').fill(customerName);
    await page.getByTestId('customer-email').fill(customerEmail);

    // 2. Click Place Order
    await page.getByTestId('place-order-btn').click();

    // 3. Customer-visible assertions
    const confirmationCard = page.getByTestId('confirmation-card');
    await expect(confirmationCard).toBeVisible();

    // Verify order reference format (ORD-XXXXXX-YYYY)
    const orderRefLocator = page.getByTestId('order-reference');
    await expect(orderRefLocator).toBeVisible();
    await expect(orderRefLocator).toHaveText(/^ORD-[A-Z0-9]+-\d{4}$/);

    // Verify customer confirmation details
    await expect(page.getByTestId('confirmed-customer-name')).toHaveText(customerName);
    await expect(page.getByTestId('confirmed-customer-email')).toHaveText(customerEmail);
    await expect(page.getByTestId('confirmed-items-count')).toHaveText('2 items');
    await expect(page.getByTestId('confirmed-order-total')).toHaveText('$205.00');

    // Verify checkout form is hidden to prevent post-order confusion
    await expect(page.locator('#checkoutView')).toBeHidden();
  });

  /**
   * CHECK 2: Missing Required Field
   * Requirement: Verify a missing field blocks checkout, shows clear validation message,
   * and preserves what the customer entered.
   */
  test('Check 2: should block checkout when required name is missing and preserve entered email', async ({ page }) => {
    const customerEmail = 'incomplete.customer@example.com';

    // Leave customer-name blank, but provide email
    await page.getByTestId('customer-email').fill(customerEmail);

    // Click Place Order
    await page.getByTestId('place-order-btn').click();

    // Assert: Validation alert is visible with human-friendly message
    const alertBox = page.getByTestId('validation-alert');
    await expect(alertBox).toBeVisible();
    await expect(page.getByTestId('alert-message')).toContainText('Customer Name is required');

    // Assert: Checkout view remains open, NOT confirmation view
    await expect(page.locator('#checkoutView')).toBeVisible();
    await expect(page.getByTestId('confirmation-card')).toBeHidden();

    // Assert: Preserves what the customer previously entered (critical usability check)
    await expect(page.getByTestId('customer-email')).toHaveValue(customerEmail);
    await expect(page.getByTestId('customer-name')).toHaveValue('');
  });

  /**
   * CHECK 3: Dynamic Quantity and Exact Calculation
   * Requirement: Verify quantity change updates the line total and exact order total.
   */
  test('Check 3: should update line totals and order total accurately when quantities change', async ({ page }) => {
    // Initial totals:
    // Product 1 (Headphones @ $120.00 x 1) = $120.00
    // Product 2 (Keyboard @ $85.00 x 1) = $85.00
    // Order Total: $205.00
    await expect(page.getByTestId('line-total-1')).toHaveText('$120.00');
    await expect(page.getByTestId('line-total-2')).toHaveText('$85.00');
    await expect(page.getByTestId('order-total')).toHaveText('$205.00');

    // Step A: Increase Headphones quantity to 2 using "+" button
    await page.getByTestId('increase-qty-1').click();

    // Customer-visible assertions for update A
    await expect(page.getByTestId('qty-input-1')).toHaveValue('2');
    await expect(page.getByTestId('line-total-1')).toHaveText('$240.00'); // 2 * $120.00
    await expect(page.getByTestId('order-total')).toHaveText('$325.00'); // $240.00 + $85.00

    // Step B: Set Keyboard quantity to 3 directly via input
    const keyboardQtyInput = page.getByTestId('qty-input-2');
    await keyboardQtyInput.fill('3');
    await keyboardQtyInput.dispatchEvent('change');

    // Customer-visible assertions for update B
    await expect(page.getByTestId('line-total-2')).toHaveText('$255.00'); // 3 * $85.00
    await expect(page.getByTestId('order-total')).toHaveText('$495.00'); // $240.00 + $255.00

    // Step C: Decrease Headphones back to 1 using "-" button
    await page.getByTestId('decrease-qty-1').click();
    await expect(page.getByTestId('qty-input-1')).toHaveValue('1');
    await expect(page.getByTestId('line-total-1')).toHaveText('$120.00');
    await expect(page.getByTestId('order-total')).toHaveText('$375.00'); // $120.00 + $255.00
  });

  /**
   * BONUS CHECK 4: Empty Cart Prevention
   * Requirement: Block checkout when the cart is empty.
   */
  test('Check 4: should block checkout when cart is empty and show clear validation', async ({ page }) => {
    // Enter customer name
    await page.getByTestId('customer-name').fill('Bob Smith');

    // Remove both products from cart
    await page.getByTestId('remove-item-1').click();
    await page.getByTestId('remove-item-2').click();

    // Verify empty state is displayed
    await expect(page.getByTestId('empty-cart-state')).toBeVisible();
    await expect(page.getByTestId('order-total')).toHaveText('$0.00');

    // Attempt to place order
    await page.getByTestId('place-order-btn').click();

    // Assert: Validation alert displayed
    await expect(page.getByTestId('validation-alert')).toBeVisible();
    await expect(page.getByTestId('alert-message')).toContainText('Your cart is empty');

    // Assert: Order confirmation was NOT created
    await expect(page.getByTestId('confirmation-card')).toBeHidden();
    // Customer name remains preserved
    await expect(page.getByTestId('customer-name')).toHaveValue('Bob Smith');
  });

  /**
   * BONUS CHECK 5: Rapid Double-Click Protection
   * Requirement: Once an order is placed, clicking Place Order twice must not produce two confirmations.
   */
  test('Check 5: rapid multiple clicks on Place Order should not produce duplicate confirmations', async ({ page }) => {
    await page.getByTestId('customer-name').fill('Alice Johnson');

    const placeOrderBtn = page.getByTestId('place-order-btn');

    // Trigger rapid double-click
    await placeOrderBtn.dblclick();

    // Assert: Only ONE confirmation card exists and is visible
    const confirmationCard = page.getByTestId('confirmation-card');
    await expect(confirmationCard).toBeVisible();

    // Assert: Single order reference displayed
    const references = page.getByTestId('order-reference');
    await expect(references).toHaveCount(1);
    await expect(references).toHaveText(/^ORD-[A-Z0-9]+-\d{4}$/);
    await expect(page.getByTestId('confirmed-customer-name')).toHaveText('Alice Johnson');
  });
});
