
const configuredBaseURL =
  import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend.onrender.com/';
const baseURL = `${configuredBaseURL.replace(/\/+$/, '')}/`;

async function convertToJson(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export default class ProductData {
  async getData(category) {
    const response = await fetch(
      `${baseURL}products/search/${encodeURIComponent(category)}`
    );
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${encodeURIComponent(id)}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
