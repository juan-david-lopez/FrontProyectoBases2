import axiosClient from './axiosClient.js';

/**
 * Lista todos los docentes con su carga académica
 * @param {Object} params - Parámetros de filtrado
 * @param {string} [params.estado] - Filtrar por estado (ACTIVO, INACTIVO)
 * @returns {Promise<Array>}
 * 
 * Response estructura:
 * [
 *   {
 *     cod_docente: 1,
 *     tipo_documento: "CC",
 *     num_documento: "1234567890",
 *     primer_nombre: "Carlos",
 *     segundo_nombre: "Alberto",
 *     primer_apellido: "Martínez",
 *     segundo_apellido: "López",
 *     correo_institucional: "carlos.martinez@universidad.edu",
 *     telefono: "3101234567",
 *     especialidad: "Programación",
 *     horas_semanales: 12,
 *     horas_minimas: 8,
 *     horas_maximas: 16,
 *     estado: "ACTIVO",
 *     total_grupos: 3
 *   }
 * ]
 */
export const fetchDocentes = async (params = {}) => {
	const { data } = await axiosClient.get('/docentes/', { params });
	return data;
};

/**
 * Obtiene información detallada de un docente
 * @param {number} codigo - Código del docente
 * @returns {Promise<Object>}
 */
export const fetchDocenteById = async (codigo) => {
	const { data } = await axiosClient.get(`/docentes/${codigo}`);
	return data;
};

/**
 * Crea un nuevo docente en el sistema
 * @param {Object} payload - Datos del docente
 * @param {string} payload.tipo_documento - Tipo de documento (CC, CE, etc.)
 * @param {string} payload.num_documento - Número de documento
 * @param {string} payload.primer_nombre - Primer nombre
 * @param {string} [payload.segundo_nombre] - Segundo nombre (opcional)
 * @param {string} payload.primer_apellido - Primer apellido
 * @param {string} [payload.segundo_apellido] - Segundo apellido (opcional)
 * @param {string} payload.correo_institucional - Correo institucional
 * @param {string} [payload.telefono] - Teléfono (opcional)
 * @param {string} [payload.especialidad] - Especialidad del docente
 * @returns {Promise<{mensaje: string, cod_docente: number}>}
 */
export const crearDocente = async (payload) => {
	const { data } = await axiosClient.post('/docentes/', payload);
	return data;
};

/**
 * Actualiza información de un docente
 * @param {number} codigo - Código del docente
 * @param {Object} payload - Datos a actualizar
 * @returns {Promise<{mensaje: string}>}
 */
export const actualizarDocente = async (codigo, payload) => {
	const { data } = await axiosClient.put(`/docentes/${codigo}`, payload);
	return data;
};

/**
 * Obtiene los grupos asignados a un docente
 * @param {number} codigoDocente - Código del docente
 * @param {string} [periodo] - Periodo académico (opcional)
 * @returns {Promise<Array>}
 * 
 * Response estructura:
 * [
 *   {
 *     cod_grupo: 7,
 *     cod_asignatura: "IS201",
 *     nombre_asignatura: "Programación Orientada a Objetos",
 *     periodo: "2025-1",
 *     horario: "Lunes 8:00-10:00, Miércoles 8:00-10:00",
 *     salon: "B-201",
 *     cupo_maximo: 30,
 *     estudiantes_inscritos: 28,
 *     horas_semanales: 4
 *   }
 * ]
 */
export const fetchGruposDocente = async (codigoDocente, periodo = null) => {
	const params = periodo ? { periodo } : {};
	const { data } = await axiosClient.get(`/docentes/${codigoDocente}/grupos`, { params });
	return data;
};

/**
 * Asigna un docente a un grupo específico
 * Validaciones automáticas:
 * - Límite de horas (8-16 horas semanales)
 * - Choques de horario
 * - Actualización automática de carga docente
 * 
 * @param {Object} payload - Datos de la asignación
 * @param {number} payload.cod_docente - Código del docente
 * @param {number} payload.cod_grupo - Código del grupo
 * @returns {Promise<{mensaje: string, horas_actuales: number}>}
 */
export const asignarGrupo = async (payload) => {
	const { data } = await axiosClient.post('/docentes/asignar-grupo', payload);
	return data;
};

/**
 * Remueve la asignación de un docente de un grupo
 * @param {Object} payload - Datos para remover asignación
 * @param {number} payload.cod_docente - Código del docente
 * @param {number} payload.cod_grupo - Código del grupo
 * @returns {Promise<{mensaje: string}>}
 */
export const removerAsignacion = async (payload) => {
	const { data } = await axiosClient.delete('/docentes/remover-asignacion', {
		data: payload,
	});
	return data;
};

/**
 * Obtiene el horario completo de un docente
 * @param {number} codigoDocente - Código del docente
 * @param {string} [periodo] - Periodo académico (opcional)
 * @returns {Promise<Array>}
 */
export const fetchHorarioDocente = async (codigoDocente, periodo = null) => {
	const params = periodo ? { periodo } : {};
	const { data } = await axiosClient.get(`/docentes/${codigoDocente}/horario`, { params });
	return data;
};

