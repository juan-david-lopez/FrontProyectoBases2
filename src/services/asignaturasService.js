import axiosClient from './axiosClient.js';

/**
 * Obtiene el listado completo de asignaturas
 * @param {Object} params - Parámetros de filtrado
 * @param {number} [params.cod_programa] - Filtrar por programa académico
 * @param {string} [params.tipo] - Filtrar por tipo (OBLIGATORIA, ELECTIVA)
 * @returns {Promise<Array>}
 */
export const fetchAsignaturas = async (params = {}) => {
	const { data } = await axiosClient.get('/asignaturas/', { params });
	return data;
};

/**
 * Obtiene información detallada de una asignatura
 * @param {string} codigo - Código de la asignatura
 * @returns {Promise<Object>}
 */
export const fetchAsignaturaById = async (codigo) => {
	const { data } = await axiosClient.get(`/asignaturas/${codigo}`);
	return data;
};

/**
 * Crea una nueva asignatura
 * @param {Object} asignatura - Datos de la asignatura
 * @param {string} asignatura.codigo - Código de la asignatura
 * @param {string} asignatura.nombre - Nombre de la asignatura
 * @param {number} asignatura.creditos - Número de créditos (1-6)
 * @param {string} asignatura.tipo - Tipo (OBLIGATORIA, ELECTIVA)
 * @param {number} asignatura.cod_programa - Código del programa
 * @param {number} [asignatura.semestre_sugerido] - Semestre sugerido (1-10)
 * @returns {Promise<{mensaje: string, cod_asignatura: string}>}
 */
export const crearAsignatura = async (asignatura) => {
	const { data } = await axiosClient.post('/asignaturas/', asignatura);
	return data;
};

/**
 * Actualiza información de una asignatura
 * @param {string} codigo - Código de la asignatura
 * @param {Object} payload - Datos a actualizar
 * @returns {Promise<{mensaje: string}>}
 */
export const actualizarAsignatura = async (codigo, payload) => {
	const { data } = await axiosClient.put(`/asignaturas/${codigo}`, payload);
	return data;
};

/**
 * Obtiene los prerrequisitos de una asignatura
 * @param {string} codigo - Código de la asignatura
 * @returns {Promise<Array>}
 */
export const fetchPrerrequisitos = async (codigo) => {
	const { data } = await axiosClient.get(`/asignaturas/${codigo}/prerrequisitos`);
	return data;
};

/**
 * Agrega un prerrequisito a una asignatura
 * @param {Object} payload - Datos del prerrequisito
 * @param {string} payload.cod_asignatura - Código de la asignatura
 * @param {string} payload.cod_asignatura_prereq - Código de la asignatura prerrequisito
 * @returns {Promise<{mensaje: string}>}
 */
export const agregarPrerrequisito = async (payload) => {
	const { data } = await axiosClient.post('/asignaturas/prerrequisitos', payload);
	return data;
};

/**
 * Elimina un prerrequisito de una asignatura
 * @param {string} codAsignatura - Código de la asignatura
 * @param {string} codPrerrequisito - Código del prerrequisito a eliminar
 * @returns {Promise<{mensaje: string}>}
 */
export const eliminarPrerrequisito = async (codAsignatura, codPrerrequisito) => {
	const { data } = await axiosClient.delete(
		`/asignaturas/${codAsignatura}/prerrequisitos/${codPrerrequisito}`
	);
	return data;
};

