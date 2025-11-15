import axiosClient from './axiosClient.js';

/**
 * Autentica un usuario en el sistema
 * @param {Object} credentials - Credenciales de acceso
 * @param {string} credentials.email - Correo institucional del usuario
 * @param {string} credentials.password - Contraseña (documento de identidad por defecto)
 * @returns {Promise<{token: string, role: string, usuario: Object}>}
 * 
 * Response exitoso:
 * {
 *   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   role: "estudiante" | "docente" | "administrador",
 *   usuario: {
 *     id: 1,
 *     nombre: "Juan Pérez",
 *     email: "juan.perez@universidad.edu",
 *     cod_estudiante: "202500001" (solo para estudiantes)
 *   }
 * }
 */
export async function login({ email, password }) {
	const { data } = await axiosClient.post('/auth/login', { 
		email, 
		password 
	});
	return data;
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
 * Elimina el token y datos del usuario del localStorage
 */
export function logout() {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
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

