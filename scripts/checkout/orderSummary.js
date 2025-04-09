import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import {products} from '../../data/products.js'; 
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';


const today = dayjs();

export function renderOrderSummary() {
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

  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

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

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    if (!deliveryOption) {
      console.error(`Delivery option with ID ${deliveryOptionId} not found.`);
      return;
    }

    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

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
              <span class="update-quantity-link link-primary">
                Update
              </span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                Delete
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

  const orderSummaryElement = document.querySelector('.js-order-summary');
  if (!orderSummaryElement) {
    console.error('Order summary element not found.');
    return;
  }
  orderSummaryElement.innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        
          container.remove();
          renderPaymentSummary();
      });
    });

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}

function deliveryOptionsHTML(matchingProduct, cartItem) {
  if (!deliveryOptions || deliveryOptions.length === 0) {
    console.error('No delivery options available.');
    return '<div class="delivery-options-error">No delivery options available.</div>';
  }

  let html = '';

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