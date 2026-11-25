// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  if (value === null) return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(`Could not read local storage item "${key}".`, error);
    return null;
  }
}

export function getCartItems() {
  const storedCart = getLocalStorage('so-cart');
  if (Array.isArray(storedCart)) return storedCart;
  if (storedCart && typeof storedCart === 'object' && storedCart.Id) {
    const migratedCart = [storedCart];
    setLocalStorage('so-cart', migratedCart);
    return migratedCart;
  }
  return [];
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
// Render a list of items using a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function alertMessage(message, scroll = true) {
  const main = document.querySelector('main');
  if (!main) return null;

  main.querySelectorAll('.alert').forEach((currentAlert) => currentAlert.remove());

  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.setAttribute('role', 'status');

  const text = document.createElement('p');
  text.className = 'alert__message';
  text.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.className = 'alert__dismiss';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Dismiss message');
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => alert.remove());

  alert.append(text, closeButton);
  main.prepend(alert);
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  return alert;
}
