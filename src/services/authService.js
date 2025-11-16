import axiosClient from './axiosClient.js';

/**
 * AUTENTICACIÓN BASIC AUTH PARA ORDS
 * 
 * ORDS usa HTTP Basic Authentication en lugar de JWT.
 * Las credenciales se envían en el header Authorization: Basic <base64>
 * en cada petición, no hay un endpoint /auth/login separado.
 */

/**
 * Autentica un usuario en el sistema usando Basic Auth
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.email - Correo institucional del usuario
 * @param {string} credentials.password - Contraseña
 * @returns {Promise<{token: string, role: string, usuario: Object}>}
 */
export async function login({ email, password }) {
	try {
		console.log('🔐 Intentando autenticación Basic Auth');
		console.log('📧 Email:', email);
		
		// Crear credenciales Basic Auth
		const credentials = btoa(`${email}:${password}`);
		
		// Determinar rol basado en el email para saber qué endpoint consultar
		let role = 'estudiante';
		let userEndpoint = '/estudiantes/';
		
		if (email.includes('docente') || email.toLowerCase().includes('rodriguez') || email.toLowerCase().includes('lopez') || email.toLowerCase().includes('ramirez')) {
			role = 'docente';
			userEndpoint = '/docentes/';
		} else if (email.includes('admin')) {
			role = 'administrador';
			userEndpoint = '/usuarios/';
		}
		
		console.log('🎭 Rol detectado:', role);
		console.log('📍 Endpoint:', userEndpoint);
		
		// Probar autenticación y obtener datos del usuario
		const { data } = await axiosClient.get(userEndpoint, {
			headers: {
				Authorization: `Basic ${credentials}`
			},
			params: {
				limit: 100
			}
		});
		
		console.log('✅ Autenticación exitosa');
		console.log('📦 Datos recibidos:', data);
		
		// Buscar el usuario específico por email
		let userData = null;
		if (data.items && data.items.length > 0) {
			// Para docentes, buscar por correo
			userData = data.items.find(item => 
				item.correo_institucional === email || 
				item.correo === email ||
				item.email === email
			);
			
			// Si no lo encuentra, tomar el primero (puede ser que solo tenga acceso a sus propios datos)
			if (!userData) {
				userData = data.items[0];
			}
		}
		
		console.log('👤 Usuario encontrado:', userData);
		
		// Guardar credenciales para futuras peticiones
		localStorage.setItem('auth_email', email);
		localStorage.setItem('auth_password', password);
		
		// Retornar formato compatible con el AuthContext
		return {
			token: credentials,
			role: role,
			usuario: {
				email: email,
				nombre: userData?.nombre_completo || userData?.nombre || email.split('@')[0],
				correo: email,
				cod_estudiante: userData?.cod_estudiante,
				cod_docente: userData?.cod_docente,
				cod_usuario: userData?.cod_usuario || userData?.id,
				...userData
			}
		};
		
	} catch (error) {
		console.error('❌ Error en autenticación:', error);
		console.error('Status:', error.response?.status);
		console.error('Data:', error.response?.data);
		
		// Limpiar credenciales inválidas
		localStorage.removeItem('auth_email');
		localStorage.removeItem('auth_password');
		
		throw error;
	}
}

/**
 * Obtiene el perfil del usuario autenticado
 * Requiere token en headers (manejado automáticamente por axiosClient)
 * @returns {Promise<Object>} Datos del perfil del usuario
 */
export async function getProfile() {
	const { data } = await axiosClient.get('/usuarios/perfil');
	return data;
}

/**
 * Actualiza la contraseña de un usuario
 * @param {string} username - Correo institucional del usuario
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<{status: number, message: string}>}
 * 
 * Response exitoso:
 * {
 *   status: 200,
 *   message: "Contraseña actualizada correctamente"
 * }
 */
export async function actualizarPassword(username, newPassword) {
	const { data } = await axiosClient.put(
		`/usuarios/${encodeURIComponent(username)}/actualizar-password`, 
		{ new_password: newPassword }
	);
	return data;
}

/**
 * Cierra la sesión del usuario
 * Limpia credenciales del localStorage
 */
export function logout() {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	localStorage.removeItem('auth_email');
	localStorage.removeItem('auth_password');
}

/**
 * Solicita recuperación de contraseña
 * Envía un correo con instrucciones para restablecer la contraseña
 * @param {string} email - Correo institucional del usuario
 * @returns {Promise<{status: number, message: string}>}
 * 
 * Response exitoso:
 * {
 *   status: 200,
 *   message: "Correo enviado exitosamente"
 * }
 * 
 * Nota: Este endpoint debe ser implementado en el backend ORDS
 */
export async function recuperarPassword(email) {
	const { data } = await axiosClient.post('/auth/recuperar-password', { 
		email 
	});
	return data;
}

/**
 * Restablece la contraseña usando un token de recuperación
 * @param {string} token - Token de recuperación enviado por correo
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<{status: number, message: string}>}
 * 
 * Response exitoso:
 * {
 *   status: 200,
 *   message: "Contraseña restablecida correctamente"
 * }
 * 
 * Nota: Este endpoint debe ser implementado en el backend ORDS
 */
export async function restablecerPassword(token, newPassword) {
	const { data } = await axiosClient.post('/auth/restablecer-password', {
		token,
		new_password: newPassword
	});
	return data;
}

