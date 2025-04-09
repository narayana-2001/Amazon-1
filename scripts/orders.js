// Initialize orders array (load from localStorage if available)
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Function to render orders on the page
function renderOrders() {
  const ordersGrid = document.querySelector('.orders-grid');
  ordersGrid.innerHTML = ''; // Clear existing orders

  orders.forEach((order) => {
    const orderHTML = `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${order.total}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.orderId}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${order.products
            .map(
              (product) => `
            <div class="product-image-container">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details">
              <div class="product-name">${product.name}</div>
              <div class="product-delivery-date">Arriving on: ${product.deliveryDate}</div>
              <div class="product-quantity">Quantity: ${product.quantity}</div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>
            <div class="product-actions">
              <a href="tracking.html?orderId=${order.orderId}&productId=${product.productId}">
                <button class="track-package-button button-secondary">Track package</button>
              </a>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
    ordersGrid.innerHTML += orderHTML;
  });
}

// Function to add a new order
function addOrder(newOrder) {
  orders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(orders)); // Save to localStorage
  renderOrders(); // Re-render orders
}

// Example: Add a new order (this can be triggered dynamically)
document.querySelector('.add-order-button').addEventListener('click', () => {
  const newOrder = {
    orderId: 'new-order-id',
    orderDate: 'September 10',
    total: '49.99',
    products: [
      {
        productId: '789',
        name: 'Wireless Bluetooth Headphones',
        deliveryDate: 'September 15',
        quantity: 1,
        image: 'images/products/wireless-bluetooth-headphones.jpg',
      },
    ],
  };
  addOrder(newOrder);
});

// Initial render
renderOrders();