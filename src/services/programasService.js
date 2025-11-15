import axiosClient from './axiosClient.js';

/**
 * Obtiene el listado completo de programas académicos
 * @returns {Promise<Array>}
 * 
 * Response estructura:
 * [
 *   {
 *     cod_programa: 1,
 *     codigo_snies: "123456",
 *     nombre: "Ingeniería de Sistemas",
 *     nivel: "PREGRADO",
 *     duracion_semestres: 10,
 *     creditos_totales: 160,
 *     cod_facultad: 1,
 *     nombre_facultad: "Facultad de Ingeniería",
 *     estado: "ACTIVO",
 *     total_estudiantes: 150
 *   }
 * ]
 */
export const fetchProgramas = async () => {
	const { data } = await axiosClient.get('/programas/');
	return data;
};

/**
 * Obtiene información detallada de un programa académico
 * @param {number} codigo - Código del programa
 * @returns {Promise<Object>}
 */
export const fetchProgramaById = async (codigo) => {
	const { data } = await axiosClient.get(`/programas/${codigo}`);
	return data;
};

/**
 * Crea un nuevo programa académico
 * @param {Object} programa - Datos del programa
 * @param {string} programa.codigo_snies - Código SNIES del programa
 * @param {string} programa.nombre - Nombre del programa
 * @param {string} programa.nivel - Nivel (PREGRADO, POSGRADO, MAESTRIA, DOCTORADO)
 * @param {number} programa.duracion_semestres - Duración en semestres
 * @param {number} programa.creditos_totales - Total de créditos requeridos
 * @param {number} programa.cod_facultad - Código de la facultad
 * @returns {Promise<{mensaje: string, cod_programa: number}>}
 */
export const crearPrograma = async (programa) => {
	const { data } = await axiosClient.post('/programas/', programa);
	return data;
};

/**
 * Actualiza información de un programa académico
 * @param {number} codigo - Código del programa
 * @param {Object} payload - Datos a actualizar
 * @returns {Promise<{mensaje: string}>}
 */
export const actualizarPrograma = async (codigo, payload) => {
	const { data } = await axiosClient.put(`/programas/${codigo}`, payload);
	return data;
};

/**
 * Elimina un programa académico (solo si no tiene estudiantes activos)
 * @param {number} codigo - Código del programa
 * @returns {Promise<{mensaje: string}>}
 */
export const eliminarPrograma = async (codigo) => {
	const { data } = await axiosClient.delete(`/programas/${codigo}`);
	return data;
};

/**
 * Obtiene las asignaturas de un programa académico
 * @param {number} codigoPrograma - Código del programa
 * @returns {Promise<Array>}
 */
export const fetchAsignaturasPrograma = async (codigoPrograma) => {
	const { data } = await axiosClient.get(`/programas/${codigoPrograma}/asignaturas`);
	return data;
};

/**
 * Obtiene el plan de estudios completo de un programa
 * Incluye todas las asignaturas organizadas por semestre
 * @param {number} codigoPrograma - Código del programa
 * @returns {Promise<Object>}
 */
export const fetchPlanEstudios = async (codigoPrograma) => {
	const { data } = await axiosClient.get(`/programas/${codigoPrograma}/plan-estudios`);
	return data;
};

