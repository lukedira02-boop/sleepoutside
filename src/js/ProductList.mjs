
import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  const productUrl = `${import.meta.env.BASE_URL}product_pages/index.html?product=${product.Id}`;

  return `
    <li class="product-card">
      <a href="${productUrl}">
        <img
          src="${product.Images.PrimaryMedium}"
          alt="${product.Name}"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      const list = await this.dataSource.getData(this.category);
      this.renderListOrEmpty(list);
    } catch (error) {
      console.error('Could not load products:', error);
      this.listElement.innerHTML =
        '<li class="error-message">Products could not be loaded. Please try again.</li>';
    }
  }

  async initSearch(query) {
    try {
      const list = await this.dataSource.searchProducts(query);
      this.renderListOrEmpty(list, `No products matched "${query}".`);
    } catch (error) {
      console.error('Could not search products:', error);
      this.listElement.innerHTML =
        '<li class="error-message">Search is unavailable. Please try again.</li>';
    }
  }

  renderListOrEmpty(list, emptyMessage = 'No products are available in this category yet.') {
    if (!list.length) {
      const message = document.createElement('li');
      message.className = 'empty-results';
      message.textContent = emptyMessage;
      this.listElement.replaceChildren(message);
      return;
    }

    this.renderList(list);
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      'afterbegin',
      true
    );
  }
}
