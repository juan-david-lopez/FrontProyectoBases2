import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';

// MSW (Mock Service Worker) desactivado temporalmente
// Para usar mocks, descomentar el siguiente bloque:
/*
if (import.meta.env.DEV) {
	import('./mocks/browser').then(({ worker }) => {
		worker.start();
	}).catch(err => {
		console.warn('MSW no pudo iniciarse:', err);
	});
}
*/

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
