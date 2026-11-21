
import { getCartItems } from './utils.mjs';

function renderCartContents() {
  const cartItems = getCartItems();
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  const itemCount = cartItems.length;
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.FinalPrice) || 0),
    0
  );
  document.querySelector('#cart-item-count').textContent = String(itemCount);
  document.querySelector('#cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.querySelector('#empty-cart-message').hidden = itemCount > 0;
  document.querySelector('#cart-checkout').hidden = itemCount === 0;
}

function cartItemTemplate(item) {
  const productUrl = `../product_pages/index.html?product=${item.Id}`;

  const newItem = `<li class="cart-card divider">
  <a href="${productUrl}" class="cart-card__image">
    <img
      src="${item.Images.PrimaryMedium}"
      alt="${item.Name}"
    />
  </a>
  <a href="${productUrl}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ''}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${Number(item.FinalPrice).toFixed(2)}</p>
</li>`;

  return newItem;
}

renderCartContents();
