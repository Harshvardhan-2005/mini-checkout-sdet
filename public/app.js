// Synthetic Product Catalog
const CATALOG = [
  { id: 1, name: "Aura Pro Wireless Headphones", price: 120.00, icon: "🎧" },
  { id: 2, name: "Keyforge Ergonomic Mechanical Keyboard", price: 85.00, icon: "⌨️" }
];

// Initial State
let cart = [
  { id: 1, quantity: 1 },
  { id: 2, quantity: 1 }
];

let isSubmitting = false;
let placedOrdersCount = 0; // Telemetry to prove double-click safety

// DOM Elements
const customerNameInput = document.getElementById("customerName");
const customerEmailInput = document.getElementById("customerEmail");
const cartItemsList = document.getElementById("cartItemsList");
const emptyCartNotice = document.getElementById("emptyCartNotice");
const catalogDrawer = document.getElementById("catalogDrawer");
const catalogList = document.getElementById("catalogList");
const summarySubtotal = document.getElementById("summarySubtotal");
const orderTotal = document.getElementById("orderTotal");
const validationAlert = document.getElementById("validationAlert");
const alertMessage = document.getElementById("alertMessage");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const resetCartBtn = document.getElementById("resetCartBtn");

const checkoutView = document.getElementById("checkoutView");
const confirmationView = document.getElementById("confirmationView");
const orderReference = document.getElementById("orderReference");
const confirmedCustomerName = document.getElementById("confirmedCustomerName");
const confirmedCustomerEmail = document.getElementById("confirmedCustomerEmail");
const confirmedEmailRow = document.getElementById("confirmedEmailRow");
const confirmedItemsCount = document.getElementById("confirmedItemsCount");
const confirmedOrderTotal = document.getElementById("confirmedOrderTotal");
const newOrderBtn = document.getElementById("newOrderBtn");

// Helper: Format Currency
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Calculate Line Total & Order Total
function calculateTotals() {
  let subtotal = 0;
  cart.forEach(item => {
    const product = CATALOG.find(p => p.id === item.id);
    if (product && item.quantity > 0) {
      subtotal += product.price * item.quantity;
    }
  });
  return {
    subtotal,
    total: subtotal // Shipping is free, tax is 0% for mock
  };
}

// Render Cart and Catalog
function renderCart() {
  cartItemsList.innerHTML = "";
  const activeItems = cart.filter(item => item.quantity > 0);

  if (activeItems.length === 0) {
    cartItemsList.style.display = "none";
    emptyCartNotice.style.display = "block";
  } else {
    cartItemsList.style.display = "flex";
    emptyCartNotice.style.display = "none";

    activeItems.forEach(item => {
      const product = CATALOG.find(p => p.id === item.id);
      const lineTotal = product.price * item.quantity;

      const itemCard = document.createElement("div");
      itemCard.className = "cart-item";
      itemCard.setAttribute("data-testid", `cart-item-${product.id}`);

      itemCard.innerHTML = `
        <div class="item-info">
          <div class="item-name" data-testid="item-name-${product.id}">${product.icon} ${product.name}</div>
          <div class="item-unit-price">${formatCurrency(product.price)} each</div>
        </div>
        <div class="item-controls">
          <div class="qty-control">
            <button 
              type="button" 
              class="qty-btn" 
              data-testid="decrease-qty-${product.id}" 
              aria-label="Decrease quantity of ${product.name}"
              onclick="updateQuantity(${product.id}, ${item.quantity - 1})"
            >−</button>
            <input 
              type="number" 
              class="qty-input" 
              data-testid="qty-input-${product.id}" 
              value="${item.quantity}" 
              min="0"
              max="99"
              aria-label="Quantity of ${product.name}"
              onchange="handleManualQuantityChange(${product.id}, this.value)"
            />
            <button 
              type="button" 
              class="qty-btn" 
              data-testid="increase-qty-${product.id}" 
              aria-label="Increase quantity of ${product.name}"
              onclick="updateQuantity(${product.id}, ${item.quantity + 1})"
            >+</button>
          </div>
          <div class="item-total-col">
            <span class="item-total" data-testid="line-total-${product.id}">${formatCurrency(lineTotal)}</span>
          </div>
          <button 
            type="button" 
            class="btn-remove" 
            data-testid="remove-item-${product.id}" 
            title="Remove ${product.name}"
            aria-label="Remove ${product.name}"
            onclick="removeItem(${product.id})"
          >✕</button>
        </div>
      `;
      cartItemsList.appendChild(itemCard);
    });
  }

  // Render Catalog drawer for products not currently in cart or with qty 0
  renderCatalogDrawer();

  // Update Summary Totals
  const totals = calculateTotals();
  summarySubtotal.textContent = formatCurrency(totals.subtotal);
  orderTotal.textContent = formatCurrency(totals.total);
}

// Render Available Products Drawer
function renderCatalogDrawer() {
  catalogList.innerHTML = "";
  let unaddedCount = 0;

  CATALOG.forEach(product => {
    const inCart = cart.find(i => i.id === product.id && i.quantity > 0);
    if (!inCart) {
      unaddedCount++;
      const row = document.createElement("div");
      row.className = "catalog-item-row";
      row.innerHTML = `
        <div>
          <span class="catalog-item-title">${product.icon} ${product.name}</span>
          <span class="catalog-item-price">${formatCurrency(product.price)}</span>
        </div>
        <button 
          type="button" 
          class="btn-secondary" 
          data-testid="add-product-${product.id}"
          onclick="addProduct(${product.id})"
        >+ Add to Cart</button>
      `;
      catalogList.appendChild(row);
    }
  });

  catalogDrawer.style.display = unaddedCount > 0 ? "block" : "none";
}

// Update item quantity
window.updateQuantity = function(productId, newQty) {
  const qty = Math.max(0, parseInt(newQty, 10) || 0);
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity = qty;
  } else if (qty > 0) {
    cart.push({ id: productId, quantity: qty });
  }
  clearValidation();
  renderCart();
};

window.handleManualQuantityChange = function(productId, value) {
  let qty = parseInt(value, 10);
  if (isNaN(qty) || qty < 0) qty = 0;
  window.updateQuantity(productId, qty);
};

// Remove item entirely
window.removeItem = function(productId) {
  window.updateQuantity(productId, 0);
};

// Add product to cart
window.addProduct = function(productId) {
  window.updateQuantity(productId, 1);
};

// Show / Clear Validation Alerts
function showValidation(message, fieldToHighlight = null) {
  validationAlert.style.display = "flex";
  alertMessage.textContent = message;
  
  if (fieldToHighlight) {
    fieldToHighlight.classList.add("input-error");
    fieldToHighlight.focus();
  }
}

function clearValidation() {
  validationAlert.style.display = "none";
  alertMessage.textContent = "";
  customerNameInput.classList.remove("input-error");
}

// Reset cart to initial 2 items
resetCartBtn.addEventListener("click", () => {
  cart = [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 1 }
  ];
  clearValidation();
  renderCart();
});

// Clear validation error on input without destroying form state
customerNameInput.addEventListener("input", () => {
  if (customerNameInput.value.trim().length > 0) {
    clearValidation();
  }
});

// Handle Place Order
placeOrderBtn.addEventListener("click", () => {
  // CRITICAL: Double-click / Re-entrancy Guard
  if (isSubmitting) {
    console.warn("[SDET Guard] Duplicate click detected and safely dropped.");
    return;
  }

  const nameValue = customerNameInput.value.trim();
  const emailValue = customerEmailInput.value.trim();
  const activeItems = cart.filter(item => item.quantity > 0);

  // 1. Check if Cart is empty
  if (activeItems.length === 0) {
    showValidation("Your cart is empty. Please add at least one product before placing an order.");
    return;
  }

  // 2. Check if Required Field (Customer Name) is blank
  if (!nameValue) {
    showValidation("Customer Name is required to place an order.", customerNameInput);
    return;
  }

  // Order is valid: Lock state immediately to prevent race conditions & double-submit
  isSubmitting = true;
  placeOrderBtn.disabled = true;
  placeOrderBtn.querySelector(".btn-text-content").textContent = "Placing Order...";
  placeOrderBtn.querySelector(".spinner").style.display = "inline-block";

  // Simulate minimal async server/network transition (150ms) to model real-world latency
  setTimeout(() => {
    placedOrdersCount++;
    const totals = calculateTotals();
    const totalItemsCount = activeItems.reduce((acc, curr) => acc + curr.quantity, 0);

    // Generate unique order reference (e.g. ORD-M7X9K2-4819)
    const timestampCode = Date.now().toString(36).toUpperCase().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `ORD-${timestampCode}-${randomSuffix}`;

    // Populate Confirmation View
    orderReference.textContent = reference;
    confirmedCustomerName.textContent = nameValue;
    
    if (emailValue) {
      confirmedEmailRow.style.display = "flex";
      confirmedCustomerEmail.textContent = emailValue;
    } else {
      confirmedEmailRow.style.display = "none";
    }

    confirmedItemsCount.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'}`;
    confirmedOrderTotal.textContent = formatCurrency(totals.total);

    // Hide checkout, show confirmation
    checkoutView.style.display = "none";
    confirmationView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset submission state
    isSubmitting = false;
    placeOrderBtn.disabled = false;
    placeOrderBtn.querySelector(".btn-text-content").textContent = "Place Order";
    placeOrderBtn.querySelector(".spinner").style.display = "none";
  }, 150);
});

// Start New Checkout (Reset Everything cleanly)
newOrderBtn.addEventListener("click", () => {
  // Reset Form
  customerNameInput.value = "";
  customerEmailInput.value = "";
  clearValidation();

  // Reset Cart
  cart = [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 1 }
  ];
  renderCart();

  // Toggle views
  confirmationView.style.display = "none";
  checkoutView.style.display = "grid";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Initialize on page load
renderCart();
