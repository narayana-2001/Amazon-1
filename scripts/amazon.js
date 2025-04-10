// data structure for the amazon page products and their details.

import {cart, addToCart} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {

  let productsHTML = '';
  products.forEach((product) => {
    
    productsHTML += `
      <div class="product-container">
            <div class="product-image-container"> 
              <img class="product-image"
                src="${product.image}">
            </div>
      
            <div class="product-name limit-text-to-2-lines">
            ${product.name}
            </div>
  
            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <select> 
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>

              </select>
            </div>
            
            ${product.extraInfoHTML()}

            <div class="product-spacer"></div> 

            <div class="added-to-cart"> 
              <img src="images/icons/checkmark.png">
              Added
            </div>    

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>
    `;
  });

  // Insert the generated HTML for the products into the element with the class 'js-products-grid'
  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  // Function to update the cart quantity displayed in the UI
  function updateCartQuantity() {
    let cartQuantity = 0;

    // Iterate through each item in the cart and sum up their quantities
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

    // Update the cart quantity element in the UI with the total quantity
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  // Add click event listeners to all 'Add to Cart' buttons
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      // Get the product ID from the button's data attribute
      const productId = button.dataset.productId;

      // Add the product to the cart using the addToCart function
      addToCart(productId);

      // Update the cart quantity displayed in the UI
      updateCartQuantity();
    });
  });

  

}