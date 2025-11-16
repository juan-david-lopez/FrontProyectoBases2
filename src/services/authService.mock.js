import axiosClient from './axiosClient.js';

/**
 * ⚠️ AUTENTICACIÓN MOCK - SOLO PARA DESARROLLO
 * 
 * Este archivo simula la autenticación mientras el backend ORDS
 * no tiene implementado el endpoint /auth/login
 * 
 * Para usar: Importar este archivo en lugar de authService.js
 */

// Usuarios de prueba basados en tu tabla de docentes
const MOCK_USERS = {
	// Docentes
	'carlos.rodriguez@universidad.edu': {
		password: 'Docente123#',
		role: 'docente',
		cod_docente: 'D001',
		nombre: 'Carlos Rodríguez'
	},
	'maria.lopez@universidad.edu': {
		password: 'Docente123#',
		role: 'docente',
		cod_docente: 'D002',
		nombre: 'María López'
	},
	'jorge.ramirez@universidad.edu': {
		password: 'Docente123#',
		role: 'docente',
		cod_docente: 'D003',
		nombre: 'Jorge Ramírez'
	},
	
	// Estudiantes de prueba
	'juan.perez@universidad.edu': {
		password: '1234567890',
		role: 'estudiante',
		cod_estudiante: '202500001',
		nombre: 'Juan Pérez'
	},
	'maria.gonzalez@universidad.edu': {
		password: '9876543210',
		role: 'estudiante',
		cod_estudiante: '202500002',
		nombre: 'María González'
	},
	
	// Administrador
	'admin@universidad.edu': {
		password: 'admin123',
		role: 'administrador',
		cod_usuario: 'ADM001',
		nombre: 'Administrador'
	}
};

/**
 * Autentica un usuario (VERSION MOCK)
 */
export async function login({ email, password }) {
	console.warn('⚠️ Usando AUTENTICACIÓN MOCK - Solo para desarrollo');
	console.log('🔐 Intentando login con:', email);
	
	// Simular latencia de red
	await new Promise(resolve => setTimeout(resolve, 500));
	
	// Buscar usuario
	const user = MOCK_USERS[email];
	
	if (!user) {
		console.error('❌ Usuario no encontrado:', email);
		throw {
			response: {
				status: 401,
				data: {
					error: 'Usuario no encontrado'
				}
			},
			message: 'Usuario no encontrado'
		};
	}
	
	if (user.password !== password) {
		console.error('❌ Contraseña incorrecta');
		throw {
			response: {
				status: 401,
				data: {
					error: 'Contraseña incorrecta'
				}
			},
			message: 'Contraseña incorrecta'
		};
	}
	
	// Login exitoso
	const mockToken = 'mock-jwt-token-' + Date.now();
	const response = {
		token: mockToken,
		role: user.role,
		usuario: {
			id: Object.keys(MOCK_USERS).indexOf(email) + 1,
			nombre: user.nombre,
			email: email,
			...(user.cod_estudiante && { cod_estudiante: user.cod_estudiante }),
			...(user.cod_docente && { cod_docente: user.cod_docente }),
			...(user.cod_usuario && { cod_usuario: user.cod_usuario })
		}
	};
	
	console.log('✅ Login exitoso (MOCK):', response);
	return response;
}

/**
 * Obtiene el perfil del usuario (VERSION MOCK)
 */
export async function getProfile() {
	console.warn('⚠️ getProfile() MOCK - Retornando datos del localStorage');
	const user = JSON.parse(localStorage.getItem('user') || '{}');
	return user;
}

/**
 * Actualiza la contraseña (VERSION MOCK)
 */
export async function actualizarPassword(username, newPassword) {
	console.warn('⚠️ actualizarPassword() MOCK - Simulando actualización');
	await new Promise(resolve => setTimeout(resolve, 500));
	
	return {
		status: 200,
		message: 'Contraseña actualizada correctamente (simulado)'
	};
}

/**
 * Cierra la sesión del usuario
 */
export function logout() {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
}

/**
 * Recuperación de contraseña (VERSION MOCK)
 */
export async function recuperarPassword(email) {
	console.warn('⚠️ recuperarPassword() MOCK - Simulando envío de correo');
	await new Promise(resolve => setTimeout(resolve, 1000));
	
	if (!MOCK_USERS[email]) {
		throw {
			response: {
				status: 404,
				data: { error: 'Usuario no encontrado' }
			}
		};
	}
	
	return {
		status: 200,
		message: 'Correo de recuperación enviado (simulado)'
	};
}

/**
 * Restablecer contraseña (VERSION MOCK)
 */
export async function restablecerPassword(token, newPassword) {
	console.warn('⚠️ restablecerPassword() MOCK - Simulando restablecimiento');
	await new Promise(resolve => setTimeout(resolve, 500));
	
	return {
		status: 200,
		message: 'Contraseña restablecida correctamente (simulado)'
	};
}

// Exportar lista de usuarios mock para debugging
export const getMockUsers = () => {
	return Object.keys(MOCK_USERS).map(email => ({
		email,
		role: MOCK_USERS[email].role,
		nombre: MOCK_USERS[email].nombre
	}));
};
