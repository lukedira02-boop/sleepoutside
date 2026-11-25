
import ExternalServices from './ExternalServices.mjs';
import { alertMessage, getCartItems, qs, setLocalStorage } from './utils.mjs';

const dataSource = new ExternalServices();

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

    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">
        Add to Cart
      </button>
    </div>
  `;

  qs('.product-detail').innerHTML = productHTML;
}

function addProductToCart(product) {
  const currentCart = getCartItems();
  currentCart.push(product);
  setLocalStorage('so-cart', currentCart);
}

async function addToCartHandler(e) {
  const button = e.currentTarget;
  button.disabled = true;

  try {
    const product = await dataSource.findProductById(button.dataset.id);
    addProductToCart(product);
    alertMessage(`${product.Name} was added to your cart.`, false);
  } catch (error) {
    console.error('Could not add product to cart:', error);
    alertMessage('This product could not be added. Please try again.', false);
  } finally {
    button.disabled = false;
  }
}

async function init() {
  const productId = new URLSearchParams(window.location.search).get('product');

  if (!productId) {
    console.error('No product ID provided in the URL.');
    alertMessage('This product could not be found. Return to the product list and try again.', false);
    return;
  }

  let product;
  try {
    product = await dataSource.findProductById(productId);
  } catch (error) {
    console.error('Could not load product details:', error);
    alertMessage('Product details are unavailable right now. Please try again later.', false);
    return;
  }

  if (!product) {
    console.error('Product not found.');
    alertMessage('This product could not be found. Return to the product list and try again.', false);
    return;
  }

  renderProductDetails(product);
  qs('#addToCart').addEventListener('click', addToCartHandler);
}

init();
