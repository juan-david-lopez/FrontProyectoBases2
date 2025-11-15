import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

/**
 * Componente para proteger rutas según roles
 * Roles válidos del sistema:
 * - "estudiante": Acceso a matrícula, notas, historial
 * - "docente": Acceso a calificaciones, grupos asignados
 * - "administrador": Acceso completo al sistema
 */
export default function RoleGuard({ roles, children }) {
	const { user, isAuthenticated } = useAuth();
	
	// Si no está autenticado, redirigir a login
	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}
	
	// Obtener el rol del usuario (normalizado a minúsculas)
	const userRole = (user?.role || user?.rol || '').toLowerCase();
	
	// Si no tiene rol, redirigir a login
	if (!userRole) {
		return <Navigate to="/login" replace />;
	}
	
	// Si se especificaron roles permitidos, validar
	if (roles && Array.isArray(roles) && roles.length > 0) {
		// Normalizar roles permitidos a minúsculas
		const normalizedAllowedRoles = roles.map(r => r.toLowerCase());
		
		// Verificar si el usuario tiene uno de los roles permitidos
		if (!normalizedAllowedRoles.includes(userRole)) {
			// Redirigir al dashboard según su rol
			return <Navigate to={`/${userRole}/dashboard`} replace />;
		}
	}

	return children;
}

