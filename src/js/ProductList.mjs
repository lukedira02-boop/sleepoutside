
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
      this.renderList(list);
    } catch (error) {
      console.error('Could not load products:', error);
      this.listElement.innerHTML =
        '<li class="error-message">Products could not be loaded. Please try again.</li>';
    }
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
