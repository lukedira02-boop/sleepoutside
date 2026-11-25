
import { getCartItems, setLocalStorage } from './utils.mjs';

const productList = document.querySelector('.product-list');

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

function cartItemTemplate(item, index) {
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
  <button
    class="cart-card__remove"
    type="button"
    data-cart-index="${index}"
    aria-label="Remove ${item.Name} from cart"
  >Remove</button>
</li>`;

  return newItem;
}

function removeCartItem(event) {
  const removeButton = event.target.closest('.cart-card__remove');
  if (!removeButton) return;

  const index = Number(removeButton.dataset.cartIndex);
  const cartItems = getCartItems();
  if (!Number.isInteger(index) || index < 0 || index >= cartItems.length) return;

  cartItems.splice(index, 1);
  setLocalStorage('so-cart', cartItems);
  renderCartContents();

  const nextButton = productList.querySelector(
    `.cart-card__remove[data-cart-index="${Math.min(index, cartItems.length - 1)}"]`
  );
  if (nextButton) nextButton.focus();
  else document.querySelector('#empty-cart-message').focus();
}

productList.addEventListener('click', removeCartItem);
renderCartContents();
