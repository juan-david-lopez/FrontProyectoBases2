import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ['msw', 'msw/browser']
	},
	// Proxy desactivado: CORS está configurado en el backend ORDS
	// server: {
	// 	proxy: {
	// 		'/ords': {
	// 			target: 'http://localhost:8080',
	// 			changeOrigin: true,
	// 			secure: false,
	// 			rewrite: (path) => path
	// 		}
	// 	}
	// }
});
