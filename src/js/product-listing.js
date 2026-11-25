import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { getParam, qs } from './utils.mjs';

const categoryLabels = {
  tents: 'Tents',
  backpacks: 'Backpacks',
  'sleeping-bags': 'Sleeping Bags',
  hammocks: 'Hammocks',
};

const category = getParam('category');
const searchTerm = getParam('search')?.trim();
const title = qs('#product-list-title');
const listElement = qs('.product-list');
const searchInput = qs('#product-search-input');

if (searchInput && searchTerm) searchInput.value = searchTerm;

if (searchTerm) {
  title.textContent = `Search results for "${searchTerm}"`;
  listElement.innerHTML = '<li class="loading-message">Searching products...</li>';
  const productList = new ProductList(null, new ExternalServices(), listElement);
  productList.initSearch(searchTerm);
} else if (!categoryLabels[category]) {
  title.textContent = 'Product category not found';
  listElement.innerHTML =
    '<li class="error-message">Choose a category from the home page.</li>';
} else {
  title.textContent = `Top Products: ${categoryLabels[category]}`;
  listElement.innerHTML = '<li class="loading-message">Loading products...</li>';

  const productList = new ProductList(category, new ExternalServices(), listElement);
  productList.init();
}
