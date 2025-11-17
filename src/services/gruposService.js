import axiosClient from './axiosClient.js';

/**
 * Servicio para gestión de grupos académicos
 * Un grupo representa una instancia específica de una asignatura en un periodo,
 * con un docente asignado, horario, cupo y estudiantes matriculados
 */

/**
 * Obtiene todos los grupos del sistema
 * @param {Object} params - Parámetros de filtrado
 * @param {string} params.periodo - Filtrar por periodo (ej: "2025-I")
 * @param {string} params.cod_asignatura - Filtrar por asignatura
 * @param {string} params.cod_docente - Filtrar por docente
 * @param {string} params.estado - Filtrar por estado (ACTIVO, CERRADO)
 * @returns {Promise<Object>}
 */
export const fetchGrupos = async (params = {}) => {
	const { data } = await axiosClient.get('/grupos/', { params });
	return data;
};

/**
 * Obtiene información detallada de un grupo específico
 * @param {number} codGrupo - Código del grupo
 * @returns {Promise<Object>}
 */
export const fetchGrupoById = async (codGrupo) => {
	const { data } = await axiosClient.get(`/grupos/${codGrupo}`);
	return data;
};

/**
 * Crea un nuevo grupo académico
 * @param {Object} payload - Datos del grupo
 * @param {string} payload.cod_asignatura - Código de la asignatura
 * @param {string} payload.cod_docente - Código del docente
 * @param {string} payload.cod_periodo - Código del periodo (ej: "2025-I")
 * @param {number} payload.cupo_maximo - Cupo máximo de estudiantes
 * @param {string} payload.horario - Horario (ej: "LUN-MIE 08:00-10:00")
 * @param {string} payload.salon - Salón asignado
 * @param {number} payload.cod_sede - Código de la sede
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   mensaje: "Grupo creado correctamente",
 *   cod_grupo: "G01",
 *   estudiantes_pre_asignados: 0
 * }
 */
export const crearGrupo = async (payload) => {
	const { data } = await axiosClient.post('/grupos/', payload);
	return data;
};

/**
 * Actualiza información de un grupo
 * @param {number} codGrupo - Código del grupo
 * @param {Object} payload - Datos a actualizar
 * @param {string} [payload.cod_docente] - Cambiar docente
 * @param {number} [payload.cupo_maximo] - Cambiar cupo
 * @param {string} [payload.horario] - Cambiar horario
 * @param {string} [payload.salon] - Cambiar salón
 * @param {string} [payload.estado] - Cambiar estado (ACTIVO, CERRADO)
 * @returns {Promise<Object>}
 */
export const actualizarGrupo = async (codGrupo, payload) => {
	const { data } = await axiosClient.put(`/grupos/${codGrupo}`, payload);
	return data;
};

/**
 * Elimina un grupo (solo si no tiene estudiantes matriculados)
 * @param {number} codGrupo - Código del grupo
 * @returns {Promise<Object>}
 */
export const eliminarGrupo = async (codGrupo) => {
	const { data } = await axiosClient.delete(`/grupos/${codGrupo}`);
	return data;
};

/**
 * Obtiene los estudiantes matriculados en un grupo
 * @param {number} codGrupo - Código del grupo
 * @returns {Promise<Object>}
 */
export const fetchEstudiantesGrupo = async (codGrupo) => {
	const { data } = await axiosClient.get(`/grupos/${codGrupo}/estudiantes`);
	return data;
};

/**
 * Asigna múltiples estudiantes a un grupo manualmente (admin)
 * @param {Object} payload - Datos de asignación
 * @param {number} payload.cod_grupo - Código del grupo
 * @param {Array<string>} payload.estudiantes - Array de códigos de estudiante
 * @returns {Promise<Object>}
 */
export const asignarEstudiantesGrupo = async (payload) => {
	const { data } = await axiosClient.post('/grupos/asignar-estudiantes', payload);
	return data;
};

/**
 * Desasigna un estudiante de un grupo
 * @param {number} codGrupo - Código del grupo
 * @param {string} codEstudiante - Código del estudiante
 * @returns {Promise<Object>}
 */
export const desasignarEstudianteGrupo = async (codGrupo, codEstudiante) => {
	const { data } = await axiosClient.delete(`/grupos/${codGrupo}/estudiantes/${codEstudiante}`);
	return data;
};

/**
 * Obtiene estadísticas de un grupo
 * @param {number} codGrupo - Código del grupo
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   cupo_maximo: 35,
 *   cupo_disponible: 12,
 *   estudiantes_matriculados: 23,
 *   porcentaje_ocupacion: 66,
 *   promedio_grupo: 4.2,
 *   aprobados: 18,
 *   reprobados: 2,
 *   en_riesgo: 3
 * }
 */
export const fetchEstadisticasGrupo = async (codGrupo) => {
	const { data } = await axiosClient.get(`/grupos/${codGrupo}/estadisticas`);
	return data;
};

/**
 * Obtiene los grupos de un docente
 * @param {string} codDocente - Código del docente
 * @param {Object} params - Parámetros opcionales
 * @returns {Promise<Object>}
 */
export const fetchGruposDocente = async (codDocente, params = {}) => {
	const { data } = await axiosClient.get(`/grupos/docente/${codDocente}`, { params });
	return data;
};

/**
 * Obtiene el detalle completo de un grupo (alias de fetchGrupoById)
 * @param {number} codGrupo - Código del grupo
 * @returns {Promise<Object>}
 */
export const fetchDetalleGrupo = async (codGrupo) => {
	return fetchGrupoById(codGrupo);
};

/**
 * Obtiene el horario de un grupo
 * @param {number} codGrupo - Código del grupo
 * @returns {Promise<Object>}
 */
export const fetchHorarioGrupo = async (codGrupo) => {
	const { data } = await axiosClient.get(`/grupos/${codGrupo}/horario`);
	return data;
};
