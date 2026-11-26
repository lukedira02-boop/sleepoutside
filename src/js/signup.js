import ExternalServices from './ExternalServices.mjs';

const form = document.querySelector('#signup-form');
const password = form.elements.password;
const confirmation = form.elements.passwordConfirm;
const avatarInput = form.elements.avatar;
const avatarPreview = document.querySelector('#avatar-preview');
const avatarPlaceholder = document.querySelector('#avatar-placeholder');
const removeAvatarButton = document.querySelector('#avatar-remove');
const status = document.querySelector('#signup-status');
const submitButton = document.querySelector('#signup-submit');
const services = new ExternalServices();
const maxAvatarBytes = 2 * 1024 * 1024;
const acceptedAvatarTypes = ['image/jpeg', 'image/png', 'image/webp'];
let avatarData = '';

function clearAvatar(clearSelectedFile = true) {
  avatarData = '';
  if (clearSelectedFile) avatarInput.value = '';
  avatarInput.setCustomValidity('');
  avatarPreview.hidden = true;
  avatarPreview.removeAttribute('src');
  avatarPlaceholder.hidden = false;
  removeAvatarButton.hidden = true;
}

function setStatus(message, kind = '') {
  status.textContent = message;
  status.className = `signup-status${kind ? ` signup-status--${kind}` : ''}`;
}

function updatePasswordValidity() {
  confirmation.setCustomValidity(
    confirmation.value && confirmation.value !== password.value
      ? 'Passwords do not match.'
      : ''
  );
}

password.addEventListener('input', updatePasswordValidity);
confirmation.addEventListener('input', updatePasswordValidity);

avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  clearAvatar(false);
  if (!file) return;

  if (!acceptedAvatarTypes.includes(file.type)) {
    avatarInput.setCustomValidity('Choose a JPG, PNG, or WebP image.');
    setStatus('Choose a JPG, PNG, or WebP image.', 'error');
    avatarInput.value = '';
    return;
  }
  if (file.size > maxAvatarBytes) {
    avatarInput.setCustomValidity('The image must be 2 MB or smaller.');
    setStatus('The image must be 2 MB or smaller.', 'error');
    avatarInput.value = '';
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    avatarData = reader.result;
    avatarPreview.src = avatarData;
    avatarPreview.hidden = false;
    avatarPlaceholder.hidden = true;
    removeAvatarButton.hidden = false;
    setStatus('');
  });
  reader.addEventListener('error', () => setStatus('We could not read that image. Please choose it again.', 'error'));
  reader.readAsDataURL(file);
});

removeAvatarButton.addEventListener('click', () => {
  clearAvatar();
  setStatus('Profile photo removed. You can choose another image or continue without one.');
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  updatePasswordValidity();
  setStatus('');

  if (!form.checkValidity()) {
    form.reportValidity();
    setStatus('Please check the highlighted fields and try again.', 'error');
    return;
  }
  if (avatarInput.files.length && !avatarData) {
    setStatus('Your photo is still loading. Please wait a moment and submit again.', 'pending');
    return;
  }

  const user = {
    name: form.elements.name.value.trim(),
    address: {
      street: form.elements.street.value.trim(),
      city: form.elements.city.value.trim(),
      state: form.elements.state.value.trim(),
      zip: form.elements.zip.value.trim(),
    },
    email: form.elements.email.value.trim(),
    password: password.value,
  };
  if (avatarData) user.avatar = avatarData;

  submitButton.disabled = true;
  submitButton.textContent = 'Creating account…';
  setStatus('Creating your account…', 'pending');

  try {
    await services.createUser(user);
    form.reset();
    clearAvatar();
    setStatus('Your account is ready. You can continue shopping.', 'success');
    document.querySelector('.signup-submit').hidden = true;
  } catch (error) {
    console.error('Account creation failed:', error);
    const details = error?.name === 'servicesError' ? error.message : error?.message;
    const serverMessage = typeof details === 'string'
      ? details
      : details?.message || details?.error || (Array.isArray(details?.errors) ? details.errors.join(' ') : '');
    const avatarRejected = avatarData && /avatar|photo|profile.?image|image.?field/i.test(serverMessage || '');
    const avatarNote = avatarRejected
      ? ' Remove the photo with the button above, then submit again.'
      : '';
    setStatus(`${serverMessage || 'We could not create your account. Check your details and try again.'}${avatarNote}`, 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Create account';
  }
});
