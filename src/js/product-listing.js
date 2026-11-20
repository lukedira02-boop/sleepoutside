import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam, qs } from './utils.mjs';

const categoryLabels = {
  tents: 'Tents',
  backpacks: 'Backpacks',
  'sleeping-bags': 'Sleeping Bags',
  hammocks: 'Hammocks',
};

const category = getParam('category');
const title = qs('#product-list-title');
const listElement = qs('.product-list');

if (!categoryLabels[category]) {
  title.textContent = 'Product category not found';
  listElement.innerHTML =
    '<li class="error-message">Choose a category from the home page.</li>';
} else {
  title.textContent = `Top Products: ${categoryLabels[category]}`;
  listElement.innerHTML = '<li class="loading-message">Loading products...</li>';

  const productList = new ProductList(category, new ProductData(), listElement);
  productList.init();
}
