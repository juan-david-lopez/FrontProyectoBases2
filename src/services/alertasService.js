import axiosClient from './axiosClient.js';

/**
 * Obtiene alertas de estudiantes con asistencia baja (< 70%)
 * Endpoint: GET /alertas/asistencia-baja/:cod
 * 
 * @param {string} codigo - Código del estudiante, docente o grupo
 * @returns {Promise<Object>}
 */
export const fetchAlertasAsistenciaBaja = async (codigo) => {
	const { data } = await axiosClient.get(`/alertas/asistencia-baja/${codigo}`);
	return data;
};

/**
 * Obtiene el reporte general consolidado de todas las alertas del sistema
 * Endpoint: GET /alertas/reporte-general
 * 
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       tipo_alerta: "RIESGO_ACADEMICO",
 *       cantidad: 45,
 *       nivel_criticidad: "ALTO"
 *     },
 *     {
 *       tipo_alerta: "ASISTENCIA_BAJA",
 *       cantidad: 23,
 *       nivel_criticidad: "MEDIO"
 *     }
 *   ]
 * }
 */
export const fetchReporteGeneralAlertas = async () => {
	const { data } = await axiosClient.get('/alertas/reporte-general');
	return data;
};

/**
 * Obtiene todas las ventanas de calendario académico
 * Endpoint: GET /alertas/ventanas-calendario
 * 
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       tipo_ventana: "MATRICULA",
 *       fecha_inicio: "2025-01-15T00:00:00Z",
 *       fecha_fin: "2025-01-25T23:59:59Z",
 *       estado: "ACTIVA",
 *       dias_restantes: 3
 *     },
 *     {
 *       tipo_ventana: "CANCELACION",
 *       fecha_inicio: "2025-02-01T00:00:00Z",
 *       fecha_fin: "2025-02-10T23:59:59Z",
 *       estado: "PROXIMA",
 *       dias_restantes: 20
 *     }
 *   ]
 * }
 * 
 * Tipos de Ventana:
 * - MATRICULA: Inscripción de asignaturas
 * - CANCELACION: Cancelación de materias
 * - MODIFICACION: Cambio de grupos
 * - CIERRE_NOTAS: Cierre de calificaciones
 * 
 * Estados:
 * - ACTIVA: Dentro del rango de fechas
 * - PROXIMA: Próxima a iniciar (< 7 días)
 * - CERRADA: Ya finalizó
 */
export const fetchVentanasCalendario = async () => {
	const { data } = await axiosClient.get('/alertas/ventanas-calendario');
	return data;
};

/**
 * Obtiene la ventana activa de un tipo específico
 * Endpoint: GET /alertas/ventana-activa/:tipo
 * 
 * @param {string} tipo - Tipo de ventana: "MATRICULA" | "CANCELACION" | "MODIFICACION" | "CIERRE_NOTAS"
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       tipo_ventana: "MATRICULA",
 *       fecha_inicio: "2025-01-15T00:00:00Z",
 *       fecha_fin: "2025-01-25T23:59:59Z",
 *       activa: "SÍ",
 *       mensaje: "Ventana de matrícula activa hasta el 25 de enero",
 *       dias_restantes: 3,
 *       horas_restantes: 72
 *     }
 *   ]
 * }
 * 
 * Casos de Uso Frontend:
 * - Banner informativo en homepage
 * - Bloqueo de funciones fuera de ventana
 * - Contador regresivo visual
 * - Notificaciones push cuando se abre/cierra ventana
 */
export const fetchVentanaActiva = async (tipo) => {
	const { data } = await axiosClient.get(`/alertas/ventana-activa/${tipo}`);
	return data;
};

/**
 * Verifica si una ventana específica está activa
 * Helper function que retorna booleano
 * 
 * @param {string} tipo - Tipo de ventana
 * @returns {Promise<boolean>}
 */
export const isVentanaActiva = async (tipo) => {
	try {
		const response = await fetchVentanaActiva(tipo);
		return response.items?.[0]?.activa === 'SÍ';
	} catch (error) {
		console.error(`Error verificando ventana ${tipo}:`, error);
		return false;
	}
};

/**
 * Obtiene información detallada de una ventana incluyendo tiempo restante
 * 
 * @param {string} tipo - Tipo de ventana
 * @returns {Promise<Object|null>}
 */
export const getDetalleVentana = async (tipo) => {
	try {
		const response = await fetchVentanaActiva(tipo);
		return response.items?.[0] || null;
	} catch (error) {
		console.error(`Error obteniendo detalle de ventana ${tipo}:`, error);
		return null;
	}
};
