import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getProfile, login as loginApi } from '../services/authService.js';
import { AuthContext } from './AuthContextContext.js';

/**
 * Roles del sistema según backend ORDS:
 * - "estudiante": Acceso a matrícula, notas, historial (solo lectura)
 * - "docente": Acceso a calificaciones, grupos asignados, carga académica
 * - "administrador": Acceso completo al sistema, gestión de todos los módulos
 * - "coordinador": Programación académica, asignación de horarios y grupos
 * - "registro": Gestión de matrículas, expedientes, procesos de inscripción
 * - "analista": Acceso a reportes estadísticos anonimizados, análisis institucional
 */
export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('token'));
	const [user, setUser] = useState(() => {
		const stored = localStorage.getItem('user');
		return stored ? JSON.parse(stored) : null;
	});
	const [loading, setLoading] = useState(false);

	const isAuthenticated = !!token;

	/**
	 * Inicia sesión en el sistema
	 * Credenciales iniciales:
	 * - Username: Correo institucional
	 * - Password: Número de documento (por defecto)
	 */
	const login = useCallback(async (email, password) => {
		setLoading(true);
		try {
			const response = await loginApi({ email, password });
			
			// Debug: ver qué responde el backend
			console.log('🔍 Respuesta completa del backend:', response);
			
			const { token: jwt, role, usuario } = response;
			
			if (!jwt) {
				return { 
					success: false, 
					error: { message: 'Error en la respuesta del servidor' } 
				};
			}

			// Intentar obtener el rol de diferentes ubicaciones posibles
			let userRole = role || usuario?.tipo_usuario || usuario?.role;
			
			console.log('🔍 Rol detectado:', userRole);
			
			// Normalizar el rol a minúsculas para consistencia
			const normalizedRole = userRole?.toLowerCase();
			
			// Validar que el rol sea uno de los permitidos
			const validRoles = ['estudiante', 'docente', 'administrador', 'coordinador', 'registro', 'analista'];
			if (!validRoles.includes(normalizedRole)) {
				console.warn(`Rol desconocido: ${userRole} (normalizado: ${normalizedRole})`);
			}

			// Guardar token
			localStorage.setItem('token', jwt);
			
			// Guardar datos del usuario con rol normalizado
			const userData = { 
				...usuario, 
				role: normalizedRole,
				// Para compatibilidad con código existente
				rol: normalizedRole 
			};
			localStorage.setItem('user', JSON.stringify(userData));
			
			setToken(jwt);
			setUser(userData);
			
			return { success: true, user: userData };
		} catch (error) {
			// Manejo de errores específicos del backend
			const message = error?.response?.data?.error 
				|| error?.message 
				|| 'Usuario o contraseña incorrectos';
			
			return { 
				success: false, 
				error: { 
					...error, 
					message,
					status: error?.response?.status 
				} 
			};
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Cierra la sesión del usuario
	 * Limpia token, credenciales y datos del localStorage
	 */
	const logout = useCallback(() => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('auth_email');
		localStorage.removeItem('auth_password');
		setToken(null);
		setUser(null);
	}, []);

	/**
	 * Actualiza el perfil del usuario desde el backend
	 */
	const refreshProfile = useCallback(async () => {
		if (!token) return;
		try {
			const perfil = await getProfile();
			const merged = { ...user, ...perfil };
			localStorage.setItem('user', JSON.stringify(merged));
			setUser(merged);
		} catch (error) {
			// Si el token es inválido, hacer logout
			if (error?.response?.status === 401) {
				logout();
			}
		}
	}, [token, user, logout]);

	/**
	 * Verifica si el usuario tiene un rol específico
	 * @param {string} role - Rol a verificar (estudiante, docente, administrador)
	 * @returns {boolean}
	 */
	const hasRole = useCallback((role) => {
		if (!user?.role) return false;
		return user.role.toLowerCase() === role.toLowerCase();
	}, [user]);

	/**
	 * Verifica si el usuario tiene alguno de los roles especificados
	 * @param {string[]} roles - Array de roles permitidos
	 * @returns {boolean}
	 */
	const hasAnyRole = useCallback((roles) => {
		if (!user?.role || !Array.isArray(roles)) return false;
		return roles.some(role => user.role.toLowerCase() === role.toLowerCase());
	}, [user]);

	// Cargar perfil si hay token pero no hay usuario
	useEffect(() => {
		if (token && !user) {
			refreshProfile();
		}
	}, [token, user, refreshProfile]);

	const value = useMemo(
		() => ({ 
			token, 
			user, 
			isAuthenticated, 
			login, 
			logout, 
			loading, 
			refreshProfile,
			hasRole,
			hasAnyRole
		}), 
		[token, user, isAuthenticated, login, logout, loading, refreshProfile, hasRole, hasAnyRole]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

