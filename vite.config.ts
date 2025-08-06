import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages'de doğru yolun bulunabilmesi için depo adınızı buraya ekleyin.
  // Örneğin, deponuzun adresi https://github.com/kullanici/proje ise, base: '/proje/' olmalıdır.
  base: '/mailtemp4/', 
  plugins: [react()],
});
