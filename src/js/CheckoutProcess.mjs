import ExternalServices from './ExternalServices.mjs';
import { alertMessage, getCartItems, setLocalStorage } from './utils.mjs';

function formDataToJSON(form) {
  const convertedJSON = {};
  new FormData(form).forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: Number(item.FinalPrice),
    quantity: 1,
  }));
}

function getErrorMessage(error) {
  const details = error?.name === 'servicesError' ? error.message : error?.message;
  if (typeof details === 'string') return details;
  if (details && typeof details === 'object') {
    if (typeof details.message === 'string') return details.message;
    if (typeof details.error === 'string') return details.error;
    return JSON.stringify(details);
  }
  return 'Please check your information and try again.';
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = null;
    this.tax = null;
    this.orderTotal = null;
    this.dataSource = new ExternalServices();
  }

  init() {
    this.list = getCartItems();
    this.calculateItemSubTotal();
    this.resetOrderTotals();

    const form = document.querySelector('#checkout-form');
    const zipInput = form.elements.zip;
    zipInput.addEventListener('input', () => {
      if (zipInput.checkValidity()) {
        this.calculateOrderTotal();
        document.querySelector('#zip-hint').hidden = true;
      } else {
        this.resetOrderTotals();
        document.querySelector('#zip-hint').hidden = false;
      }
    });

    const expirationInput = form.elements.expiration;
    expirationInput.addEventListener('input', () => this.validateExpiration(expirationInput));

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.validateExpiration(expirationInput);
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (!this.list.length) {
        alertMessage('Your cart is empty. Add an item before placing an order.');
        return;
      }

      this.calculateOrderTotal();
      await this.checkout(form);
    });

    if (!this.list.length) {
      document.querySelector('#checkoutSubmit').disabled = true;
      alertMessage('Your cart is empty. Add an item before placing an order.', false);
    }
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + (Number(item.FinalPrice) || 0),
      0
    );
    document.querySelector(`${this.outputSelector} #item-count`).textContent =
      String(this.list.length);
    document.querySelector(`${this.outputSelector} #subtotal`).textContent =
      `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = this.list.length ? 10 + 2 * (this.list.length - 1) : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  resetOrderTotals() {
    this.tax = null;
    this.shipping = null;
    this.orderTotal = null;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const money = (value) => Number.isFinite(value) ? `$${value.toFixed(2)}` : '—';
    document.querySelector(`${this.outputSelector} #tax`).textContent = money(this.tax);
    document.querySelector(`${this.outputSelector} #shipping`).textContent =
      money(this.shipping);
    document.querySelector(`${this.outputSelector} #order-total`).textContent =
      money(this.orderTotal);
  }

  validateExpiration(input) {
    const match = input.value.match(/^(0?[1-9]|1[0-2])\/(\d{2})$/);
    if (!match) {
      input.setCustomValidity('Enter the expiration date as MM/YY.');
      return;
    }

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    const now = new Date();
    const isFuture = year > now.getFullYear() ||
      (year === now.getFullYear() && month >= now.getMonth() + 1);
    input.setCustomValidity(isFuture ? '' : 'Enter a future expiration date.');
  }

  async checkout(form) {
    const order = {
      ...formDataToJSON(form),
      orderDate: new Date().toISOString(),
      items: packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    try {
      await this.dataSource.checkout(order);
      setLocalStorage(this.key, []);
      window.location.href = `${import.meta.env.BASE_URL}checkout/success.html`;
    } catch (error) {
      console.error('Checkout failed:', error);
      alertMessage(`We couldn't place your order. ${getErrorMessage(error)}`);
    }
  }
}
