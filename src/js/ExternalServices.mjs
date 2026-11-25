
const configuredBaseURL =
  import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend-osp8.onrender.com/';
const baseURL = `${configuredBaseURL.replace(/\/+$/, '')}/`;

async function convertToJson(response) {
  const jsonResponse = await response.json();
  if (!response.ok) {
    throw { name: 'servicesError', message: jsonResponse };
  }
  return jsonResponse;
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(
      `${baseURL}products/search/${encodeURIComponent(category)}`
    );
    const data = await convertToJson(response);
    return data.Result;
  }

  async searchProducts(query) {
    const term = query.trim().toLocaleLowerCase();
    if (!term) return [];

    const categories = ['tents', 'backpacks', 'sleeping-bags', 'hammocks'];
    const results = await Promise.all(categories.map((category) => this.getData(category)));
    const products = new Map(results.flat().map((product) => [product.Id, product]));

    return [...products.values()].filter((product) => {
      const searchableText = [
        product.Name,
        product.NameWithoutBrand,
        product.Brand?.Name,
        product.DescriptionHtmlSimple,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase();

      return searchableText.includes(term);
    });
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${encodeURIComponent(id)}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(order) {
    const response = await fetch(`${baseURL}checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return convertToJson(response);
  }
}
