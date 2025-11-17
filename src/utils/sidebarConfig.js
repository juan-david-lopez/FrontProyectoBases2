/**
 * Configuración centralizada de items del Sidebar por rol
 */

export const getSidebarItems = (role, additionalData = {}) => {
	const { notificacionesCount = 0 } = additionalData;

	const items = {
		estudiante: [
			{ 
				to: '/estudiante/dashboard', 
				label: 'Dashboard',
				icon: '📊'
			},
			{ 
				to: '/estudiante/matricula-v2', 
				label: 'Matrícula',
				icon: '📚'
			},
			{ 
				to: '/estudiante/horario', 
				label: 'Mi Horario',
				icon: '📅'
			},
			{ 
				to: '/estudiante/notas-v2', 
				label: 'Mis Notas',
				icon: '🎓'
			},
			{ 
				to: '/estudiante/notificaciones', 
				label: 'Notificaciones',
				icon: '🔔',
				badge: notificacionesCount > 0 ? notificacionesCount : null
			},
			{ 
				to: '/estudiante/riesgo', 
				label: 'Riesgo Académico',
				icon: '⚠️'
			},
			{ 
				to: '/estudiante/perfil', 
				label: 'Mi Perfil',
				icon: '👤'
			},
		],

		docente: [
			{ 
				to: '/docente/dashboard', 
				label: 'Dashboard',
				icon: '📊'
			},
			{ 
				to: '/docente/grupos-v2', 
				label: 'Mis Grupos',
				icon: '👥'
			},
			{ 
				to: '/docente/calificaciones', 
				label: 'Calificaciones',
				icon: '📝'
			},
			{ 
				to: '/docente/examenes', 
				label: 'Exámenes',
				icon: '📋'
			},
			{ 
				to: '/docente/reportes', 
				label: 'Reportes',
				icon: '📊'
			},
		],

		administrador: [
			{ 
				to: '/administrador/dashboard', 
				label: 'Dashboard',
				icon: '📊'
			},
			{ 
				to: '/administrador/periodos', 
				label: 'Períodos',
				icon: '📅'
			},
			{ 
				to: '/administrador/programas', 
				label: 'Programas',
				icon: '🎓'
			},
			{ 
				to: '/administrador/asignaturas', 
				label: 'Asignaturas',
				icon: '📚'
			},
			{ 
				to: '/administrador/grupos', 
				label: 'Grupos',
				icon: '👥'
			},
			{ 
				to: '/administrador/docentes', 
				label: 'Docentes',
				icon: '👨‍🏫'
			},
			{ 
				to: '/administrador/estudiantes-v2', 
				label: 'Estudiantes',
				icon: '👨‍🎓'
			},
			{ 
				to: '/administrador/sedes', 
				label: 'Sedes',
				icon: '🏢'
			},
			{ 
				to: '/administrador/reportes', 
				label: 'Reportes',
				icon: '📊'
			},
			{ 
				to: '/administrador/configuracion', 
				label: 'Configuración',
				icon: '⚙️'
			},
			{ 
				to: '/administrador/logs', 
				label: 'Logs',
				icon: '📋'
			},
		],

		coordinador: [
			{ 
				to: '/coordinador/dashboard', 
				label: 'Dashboard',
				icon: '📊'
			},
			{ 
				to: '/coordinador/asignaturas', 
				label: 'Asignaturas',
				icon: '📚'
			},
			{ 
				to: '/coordinador/grupos', 
				label: 'Grupos',
				icon: '👥'
			},
			{ 
				to: '/coordinador/horarios', 
				label: 'Horarios',
				icon: '📅'
			},
			{ 
				to: '/coordinador/reportes', 
				label: 'Reportes',
				icon: '📊'
			},
		],

		registro: [
			{ 
				to: '/registro/dashboard', 
				label: 'Dashboard',
				icon: '📊'
			},
			{ 
				to: '/registro/matriculas', 
				label: 'Matrículas',
				icon: '📝'
			},
			{ 
				to: '/registro/reinscripciones', 
				label: 'Reinscripciones',
				icon: '🔄'
			},
			{ 
				to: '/registro/expedientes', 
				label: 'Expedientes',
				icon: '📁'
			},
			{ 
				to: '/registro/validaciones', 
				label: 'Validaciones',
				icon: '✅'
			},
		],

		analista: [
			{ 
				to: '/analista/dashboard', 
				label: 'Dashboard',
				icon: '📊'
			},
			{ 
				to: '/analista/reportes', 
				label: 'Reportes',
				icon: '📈'
			},
			{ 
				to: '/analista/estadisticas', 
				label: 'Estadísticas',
				icon: '📉'
			},
			{ 
				to: '/analista/tendencias', 
				label: 'Tendencias',
				icon: '📊'
			},
			{ 
				to: '/analista/exportar', 
				label: 'Exportar Datos',
				icon: '💾'
			},
		],
	};

	return items[role] || [];
};

/**
 * Versiones alternativas (V1) para compatibilidad
 */
export const getLegacySidebarItems = (role) => {
	const items = {
		estudiante: [
			{ to: '/estudiante/dashboard', label: 'Dashboard' },
			{ to: '/estudiante/matricula', label: 'Matrícula' },
			{ to: '/estudiante/historial-matricula', label: 'Historial' },
			{ to: '/estudiante/notas', label: 'Notas' },
			{ to: '/estudiante/riesgo', label: 'Riesgo Académico' },
			{ to: '/estudiante/perfil', label: 'Mi Perfil' },
		],

		docente: [
			{ to: '/docente/dashboard', label: 'Resumen' },
			{ to: '/docente/grupos', label: 'Grupos' },
			{ to: '/docente/calificaciones', label: 'Calificaciones' },
			{ to: '/docente/reportes', label: 'Reportes' },
		],

		administrador: [
			{ to: '/administrador/dashboard', label: 'Resumen' },
			{ to: '/administrador/programas', label: 'Programas' },
			{ to: '/administrador/asignaturas', label: 'Asignaturas' },
			{ to: '/administrador/docentes', label: 'Docentes' },
			{ to: '/administrador/estudiantes', label: 'Estudiantes' },
			{ to: '/administrador/sedes', label: 'Sedes' },
			{ to: '/administrador/reportes', label: 'Reportes' },
			{ to: '/administrador/configuracion', label: 'Configuración' },
		],
	};

	return items[role] || [];
};
