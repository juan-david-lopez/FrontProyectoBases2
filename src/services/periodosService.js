import axiosClient from './axiosClient.js';

/**
 * Servicio para gestión de períodos académicos
 * Un período representa un semestre o año académico (ej: "2025-1", "2025-2")
 */

/**
 * Obtiene todos los períodos académicos
 * @param {Object} params - Parámetros de filtrado
 * @param {string} params.estado - Filtrar por estado (ACTIVO, CERRADO, PROXIMO)
 * @param {number} params.anio - Filtrar por año
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       cod_periodo: "2025-1",
 *       nombre_periodo: "Primer Semestre 2025",
 *       anio: 2025,
 *       periodo: 1,
 *       fecha_inicio: "2025-01-15T00:00:00Z",
 *       fecha_fin: "2025-06-30T00:00:00Z",
 *       estado: "ACTIVO"
 *     }
 *   ],
 *   hasMore: false,
 *   count: 10
 * }
 */
export const fetchPeriodos = async (params = {}) => {
	const { data } = await axiosClient.get('/periodos/', { params });
	return data;
};

/**
 * Obtiene el período académico activo actual
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   cod_periodo: "2025-1",
 *   nombre_periodo: "Primer Semestre 2025",
 *   anio: 2025,
 *   periodo: 1,
 *   fecha_inicio: "2025-01-15T00:00:00Z",
 *   fecha_fin: "2025-06-30T00:00:00Z",
 *   estado: "ACTIVO",
 *   ventanas_activas: [
 *     {
 *       tipo: "MATRICULA",
 *       nombre: "Matrícula Ordinaria",
 *       fecha_fin: "2025-01-20T17:00:00Z",
 *       dias_restantes: 3
 *     }
 *   ]
 * }
 */
export const fetchPeriodoActivo = async () => {
	const { data } = await axiosClient.get('/periodos/activo');
	return data;
};

/**
 * Obtiene información detallada de un período específico
 * @param {string} codPeriodo - Código del período (ej: "2025-1")
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   cod_periodo: "2025-1",
 *   nombre_periodo: "Primer Semestre 2025",
 *   anio: 2025,
 *   periodo: 1,
 *   fecha_inicio: "2025-01-15T00:00:00Z",
 *   fecha_fin: "2025-06-30T00:00:00Z",
 *   estado: "ACTIVO",
 *   descripcion: "Primer período académico del año 2025",
 *   total_estudiantes_matriculados: 1250,
 *   total_grupos_activos: 85,
 *   ventanas: [
 *     {
 *       tipo: "MATRICULA",
 *       nombre: "Matrícula Ordinaria",
 *       fecha_inicio: "2025-01-10T08:00:00Z",
 *       fecha_fin: "2025-01-20T17:00:00Z",
 *       estado: "ACTIVA"
 *     }
 *   ]
 * }
 */
export const fetchPeriodoById = async (codPeriodo) => {
	const { data } = await axiosClient.get(`/periodos/${codPeriodo}`);
	return data;
};

/**
 * Crea un nuevo período académico (solo admin)
 * @param {Object} payload - Datos del período
 * @param {string} payload.cod_periodo - Código único (ej: "2025-2")
 * @param {string} payload.nombre_periodo - Nombre descriptivo
 * @param {number} payload.anio - Año académico
 * @param {number} payload.periodo - Número de período (1 o 2)
 * @param {string} payload.fecha_inicio - Fecha de inicio (ISO 8601)
 * @param {string} payload.fecha_fin - Fecha de fin (ISO 8601)
 * @param {string} [payload.descripcion] - Descripción opcional
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   success: true,
 *   message: "Período creado exitosamente",
 *   cod_periodo: "2025-2"
 * }
 */
export const crearPeriodo = async (payload) => {
	const { data } = await axiosClient.post('/periodos/', payload);
	return data;
};

/**
 * Actualiza un período académico existente (solo admin)
 * @param {string} codPeriodo - Código del período
 * @param {Object} payload - Datos a actualizar
 * @param {string} [payload.nombre_periodo] - Nuevo nombre
 * @param {string} [payload.fecha_inicio] - Nueva fecha de inicio
 * @param {string} [payload.fecha_fin] - Nueva fecha de fin
 * @param {string} [payload.estado] - Nuevo estado (ACTIVO, CERRADO, PROXIMO)
 * @param {string} [payload.descripcion] - Nueva descripción
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   success: true,
 *   message: "Período actualizado exitosamente"
 * }
 */
export const actualizarPeriodo = async (codPeriodo, payload) => {
	const { data } = await axiosClient.put(`/periodos/${codPeriodo}`, payload);
	return data;
};

/**
 * Elimina un período académico (solo admin)
 * Solo se puede eliminar si no tiene matrículas asociadas
 * @param {string} codPeriodo - Código del período
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   success: true,
 *   message: "Período eliminado exitosamente"
 * }
 */
export const eliminarPeriodo = async (codPeriodo) => {
	const { data } = await axiosClient.delete(`/periodos/${codPeriodo}`);
	return data;
};

/**
 * Obtiene estadísticas del período
 * @param {string} codPeriodo - Código del período
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   cod_periodo: "2025-1",
 *   total_estudiantes_matriculados: 1250,
 *   total_grupos_activos: 85,
 *   total_asignaturas_ofertadas: 45,
 *   total_creditos_matriculados: 22500,
 *   promedio_creditos_estudiante: 18,
 *   tasa_ocupacion_grupos: 85.5,
 *   estudiantes_por_programa: [
 *     {
 *       cod_programa: "IS",
 *       nombre_programa: "Ingeniería de Sistemas",
 *       total_estudiantes: 450
 *     }
 *   ]
 * }
 */
export const fetchEstadisticasPeriodo = async (codPeriodo) => {
	const { data } = await axiosClient.get(`/periodos/${codPeriodo}/estadisticas`);
	return data;
};

/**
 * Activa un período académico (solo admin)
 * Cierra el período activo actual y activa el nuevo
 * @param {string} codPeriodo - Código del período a activar
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   success: true,
 *   message: "Período activado exitosamente",
 *   periodo_anterior_cerrado: "2024-2"
 * }
 */
export const activarPeriodo = async (codPeriodo) => {
	const { data } = await axiosClient.post(`/periodos/${codPeriodo}/activar`);
	return data;
};

/**
 * Cierra un período académico (solo admin)
 * @param {string} codPeriodo - Código del período a cerrar
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   success: true,
 *   message: "Período cerrado exitosamente"
 * }
 */
export const cerrarPeriodo = async (codPeriodo) => {
	const { data } = await axiosClient.post(`/periodos/${codPeriodo}/cerrar`);
	return data;
};

/**
 * Verifica si un período está activo
 * Helper function para facilitar validaciones
 * @param {string} codPeriodo - Código del período
 * @returns {Promise<boolean>}
 */
export const isPeriodoActivo = async (codPeriodo) => {
	try {
		const periodo = await fetchPeriodoById(codPeriodo);
		return periodo.estado === 'ACTIVO';
	} catch (error) {
		console.error('Error verificando período activo:', error);
		return false;
	}
};

/**
 * Obtiene el código del período activo actual
 * Helper function para obtener rápidamente el código del período
 * @returns {Promise<string|null>}
 */
export const getCodigoPeriodoActivo = async () => {
	try {
		const periodo = await fetchPeriodoActivo();
		return periodo.cod_periodo || null;
	} catch (error) {
		console.error('Error obteniendo código de período activo:', error);
		return null;
	}
};

/**
 * Obtiene períodos por año
 * Helper function para filtrar períodos de un año específico
 * @param {number} anio - Año a consultar
 * @returns {Promise<Array>}
 */
export const fetchPeriodosPorAnio = async (anio) => {
	const response = await fetchPeriodos({ anio });
	return response.items || [];
};

/**
 * Obtiene el siguiente período académico
 * Útil para planificación y pre-matrícula
 * @returns {Promise<Object|null>}
 */
export const fetchPeriodoProximo = async () => {
	try {
		const response = await fetchPeriodos({ estado: 'PROXIMO' });
		return response.items?.[0] || null;
	} catch (error) {
		console.error('Error obteniendo período próximo:', error);
		return null;
	}
};
