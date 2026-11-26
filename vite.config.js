import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',
  base: process.env.VITE_BASE_PATH || '/',

  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
    allowedHosts: [
      'sleepoutside-1-kpgy.onrender.com',
      'sleepoutside-u879.onrender.com',
      'sleepoutside-dc0i.onrender.com',
    ],
  },

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        cart: resolve(__dirname, 'src/cart/index.html'),
        checkout: resolve(__dirname, 'src/checkout/index.html'),
        checkoutSuccess: resolve(__dirname, 'src/checkout/success.html'),
        signup: resolve(__dirname, 'src/signup/index.html'),
        countdown: resolve(__dirname, 'src/countdown.html'),
        product: resolve(__dirname, 'src/product_pages/index.html'),
        productListing: resolve(__dirname, 'src/product_listing/index.html'),
      },
    },
  },
});
