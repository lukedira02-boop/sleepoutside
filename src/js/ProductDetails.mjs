
import ProductData from './ProductData.mjs';
import { qs, setLocalStorage } from './utils.mjs';

const dataSource = new ProductData();

function renderProductDetails(product) {
  document.title = `Sleep Outside | ${product.Name}`;

  const productHTML = `
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>

    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.Name}"
    />

    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>

    <p class="product__description">
      ${product.DescriptionHtmlSimple}
    </p>

    <p id="product-status" class="product-status" role="status" aria-live="polite"></p>

    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">
        Add to Cart
      </button>
    </div>
  `;

  qs('.product-detail').innerHTML = productHTML;
}

function addProductToCart(product) {
  const currentCart = JSON.parse(localStorage.getItem('so-cart')) || [];
  currentCart.push(product);
  setLocalStorage('so-cart', currentCart);
}

async function addToCartHandler(e) {
  const button = e.currentTarget;
  const status = qs('#product-status');
  button.disabled = true;

  try {
    const product = await dataSource.findProductById(button.dataset.id);
    addProductToCart(product);
    status.textContent = `${product.Name} was added to your cart.`;
  } catch (error) {
    console.error('Could not add product to cart:', error);
    status.textContent = 'This product could not be added. Please try again.';
  } finally {
    button.disabled = false;
  }
}

async function init() {
  const productId = new URLSearchParams(window.location.search).get('product');

  if (!productId) {
    console.error('No product ID provided in the URL.');
    return;
  }

  const product = await dataSource.findProductById(productId);

  if (!product) {
    console.error('Product not found.');
    return;
  }

  renderProductDetails(product);
  qs('#addToCart').addEventListener('click', addToCartHandler);
}

init();
