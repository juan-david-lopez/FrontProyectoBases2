import axios from 'axios';

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/ords/academico',
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: false, // ORDS no requiere credenciales de cookie
	timeout: 10000, // Timeout de 10 segundos
});

// Interceptor para agregar autenticación Basic Auth
axiosClient.interceptors.request.use(
	(config) => {
		// Obtener credenciales almacenadas (en lugar de JWT token)
		const email = localStorage.getItem('auth_email');
		const password = localStorage.getItem('auth_password');
		
		if (email && password) {
			// Crear header Basic Auth: base64(email:password)
			const credentials = btoa(`${email}:${password}`);
			config.headers.Authorization = `Basic ${credentials}`;
		}
		
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor para manejo centralizado de errores
axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// Manejo de errores según código HTTP
		if (error.response) {
			const { status, data } = error.response;
			const requestUrl = error.config?.url || '';

			switch (status) {
				case 401:
					// Credenciales inválidas o expiradas
					console.error('❌ Autenticación inválida (401)');
					
					// Si no es login, limpiar y redirigir
					if (!requestUrl.includes('/auth/') && !window.location.pathname.includes('/login')) {
						localStorage.removeItem('token');
						localStorage.removeItem('user');
						localStorage.removeItem('auth_email');
						localStorage.removeItem('auth_password');
						window.location.href = '/login';
					}
					
					error.message = data?.error || data?.message || 'Usuario o contraseña incorrectos';
					break;

				case 403:
					// Sin permisos para esta operación
					console.error('No tiene permisos para realizar esta acción');
					error.message = data?.error || 'No tiene permisos para realizar esta acción';
					break;

				case 404:
					// Recurso no encontrado
					console.error('Recurso no encontrado');
					error.message = data?.error || 'Recurso no encontrado';
					break;

				case 400:
					// Error de validación
					console.error('Error de validación:', data?.error || data?.message);
					error.message = data?.error || data?.message || 'Datos inválidos';
					break;

				case 500:
					// Error interno del servidor
					console.error('Error interno del servidor');
					error.message = data?.error || 'Error interno del servidor. Intente nuevamente.';
					break;

				default:
					error.message = data?.error || data?.message || 'Error al procesar la solicitud';
			}
		} else if (error.request) {
			// La petición fue hecha pero no hubo respuesta
			console.error('❌ No hay respuesta del servidor ORDS');
			console.error('📍 Verifica que el backend esté corriendo en:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
			console.error('💡 Para iniciar ORDS, ejecuta el servidor backend');
			error.message = 'No se pudo conectar con el servidor. Verifique que el backend ORDS esté corriendo.';
		} else {
			// Algo pasó al configurar la petición
			console.error('Error al configurar la petición:', error.message);
		}

		return Promise.reject(error);
	}
);

export default axiosClient;

