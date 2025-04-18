export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (!cart) {
    cart = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1',
    }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2',
    }];
  }

  updateCartQuantityUI(); // Update the UI when loading from storage
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartQuantityUI(); // Update the UI whenever the cart is saved
}

export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1',
    });
    console.log(`Added new product ${productId} to cart with quantity 1`);
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart;

  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}

// Function to update all elements with the class 'js-cart-quantity' in the UI
function updateCartQuantityUI() {
  let cartQuantity = 0;

  // Calculate the total quantity of items in the cart
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  // Update all elements with the class 'js-cart-quantity'
  const cartQuantityElements = document.querySelectorAll('.js-cart-quantity');
  cartQuantityElements.forEach((element) => {
    element.innerHTML = cartQuantity;
  });
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    fun();
  });
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

/* lcfer- enifen 
*/

