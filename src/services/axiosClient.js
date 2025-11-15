import axios from 'axios';

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/ords/academico',
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true, // Habilitar credenciales para CORS
	timeout: 10000, // Timeout de 10 segundos
});

// Interceptor para agregar el token de autenticación
axiosClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
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

			switch (status) {
				case 401:
					// Token inválido o expirado - Logout automático
					console.error('Sesión expirada o token inválido');
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					// Redirigir al login solo si no estamos ya en login
					if (!window.location.pathname.includes('/login')) {
						window.location.href = '/login';
					}
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

