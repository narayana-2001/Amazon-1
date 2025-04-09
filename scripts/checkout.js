import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { loadProductsFetch } from '../data/products.js';
import { loadCart } from '../data/cart.js';

async function loadPage() {
  try {
    await loadProductsFetch();

    await new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
  }

  renderOrderSummary();
  renderPaymentSummary();

  // Attach event listener to "Place Order" button
  document.querySelector('.js-place-order').addEventListener('click', () => {
    saveOrder();
  });
}

// Function to save the order
function saveOrder() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];

  // Generate order details
  const orderId = `order-${Date.now()}`;
  const orderDate = new Date().toLocaleDateString();
  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + product.priceCents * item.quantity;
  }, 0);

  const order = {
    orderId,
    orderDate,
    total: (total / 100).toFixed(2), // Convert cents to dollars
    products: cart.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        name: product.name,
        deliveryDate: 'Arriving soon', // Placeholder delivery date
        quantity: item.quantity,
        image: product.image,
      };
    }),
  };

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));

  // Clear the cart
  localStorage.removeItem('cart');

  // Redirect to the Orders page
  window.location.href = 'orders.html';
}

// Initialize the page
loadPage().then(() => {
  console.log('Checkout page loaded.');
});

