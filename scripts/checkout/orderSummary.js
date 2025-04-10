// Import necessary modules and functions
import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import {products} from '../../data/products.js'; 
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

// Event listener for handling clicks on the page
document.addEventListener('click', (event) => {
  // Handle "Add to Cart" button click
  if (event.target.classList.contains('js-add-to-cart')) {
    const productId = event.target.getAttribute('data-product-id');
    addToCart(productId); // Add the product to the cart
    renderPaymentSummary(); // Re-render the payment summary
  }

  // Handle "Delete from Cart" button click
  if (event.target.classList.contains('js-delete-from-cart')) {
    const productId = event.target.getAttribute('data-product-id');
    removeFromCart(productId); // Remove the product from the cart
    renderPaymentSummary(); // Re-render the payment summary
  }
});

// Initialize the current date using the dayjs library
const today = dayjs();

// Function to render the order summary
export function renderOrderSummary() {
  // Check if the cart is empty or undefined
  if (!cart || cart.length === 0) {
    console.error('Cart is empty or undefined.');
    const orderSummaryElement = document.querySelector('.js-order-summary');
    if (!orderSummaryElement) {
      console.error('Order summary element not found.');
      return;
    }
    orderSummaryElement.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let cartSummaryHTML = ''; // Initialize HTML for the cart summary

  // Iterate over each item in the cart
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    // Find the matching product in the products array
    products.forEach((product) => {  
      if (product.id === productId) {        
        matchingProduct = product;
      }
    });

    if (!matchingProduct) {
      console.error(`Product with ID ${productId} not found in products array.`);
      return;
    }

    const deliveryOptionId = cartItem.deliveryOptionId;

    // Get the delivery option for the cart item
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    if (!deliveryOption) {
      console.error(`Delivery option with ID ${deliveryOptionId} not found.`);
      return;
    }

    // Calculate the delivery date
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    // Build the HTML for the cart item
    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>  
            <div class="product-price">
               ${matchingProduct.getPrice()}
            </div>  
            <div class="product-quantity js-product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>
              
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                Delete
              </span>
              <span class="add-to-cart-button link-primary js-add-to-cart" data-product-id="123" data-product-id="${matchingProduct.id}">
                Add
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>`;
  });

  // Get the order summary element and update its content
  const orderSummaryElement = document.querySelector('.js-order-summary');
  if (!orderSummaryElement) {
    console.error('Order summary element not found.');
    return;
  }
  orderSummaryElement.innerHTML = cartSummaryHTML;

  // Add event listeners for "Delete" links
  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId); // Remove the product from the cart

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove(); // Remove the product's container
        renderPaymentSummary(); // Re-render the payment summary
      });
    });

  // Add event listeners for delivery option selection
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId); // Update the delivery option
        renderOrderSummary(); // Re-render the order summary
        renderPaymentSummary(); // Re-render the payment summary
      });
    });

  // Add event listeners for "Add to Cart" buttons
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const product = products.find((p) => p.id === productId);

      if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
      }

      // Add the product to the cart
      const existingCartItem = cart.find((item) => item.productId === productId);
      if (existingCartItem) {
        existingCartItem.quantity += 1;
      } else {
        cart.push({ productId, quantity: 1, deliveryOptionId: null });
      }

      // Re-render the order summary and payment summary
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // Add event listeners to increment cart quantity
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const cartQuantityElement = document.querySelector('.js-cart-quantity');
      const currentQuantity = parseInt(cartQuantityElement.textContent, 10);
      cartQuantityElement.textContent = currentQuantity + 1;
    });
  });

  // Add event listeners for adding items to the cart
  document.querySelectorAll('.js-add-item').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;

      const cartItem = cart.find((item) => item.productId === productId);
      if (cartItem) {
        cartItem.quantity += 1; // Increment quantity
      } else {
        cart.push({ productId, quantity: 1, deliveryOptionId: 'default' });
      }

      renderPaymentSummary(); // Re-render the payment summary
    });
  });

  // Add event listeners for removing items from the cart
  document.querySelectorAll('.js-remove-item').forEach((button) => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;

      const cartItemIndex = cart.findIndex((item) => item.productId === productId);
      if (cartItemIndex !== -1) {
        if (cart[cartItemIndex].quantity > 1) {
          cart[cartItemIndex].quantity -= 1; // Decrement quantity
        } else {
          cart.splice(cartItemIndex, 1); // Remove item if quantity is 0
        }
      }

      renderPaymentSummary(); // Re-render the payment summary
    });
  });
}

// Function to generate HTML for delivery options
function deliveryOptionsHTML(matchingProduct, cartItem) {
  if (!deliveryOptions || deliveryOptions.length === 0) {
    console.error('No delivery options available.');
    return '<div class="delivery-options-error">No delivery options available.</div>';
  }

  let html = '';

  // Iterate over each delivery option and build the HTML
  deliveryOptions.forEach((deliveryOption) => {
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceStrings = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId ? 'checked' : '';

    html += `
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceStrings} Shipping
          </div>
        </div>
      </div>`;
  });

  return html;
}