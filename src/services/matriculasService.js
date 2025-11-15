import axiosClient from './axiosClient.js';

/**
 * Obtiene las asignaturas disponibles para matrícula de un estudiante
 * Valida automáticamente:
 * - Prerrequisitos cumplidos
 * - Límite de créditos según riesgo académico
 * - Cupos disponibles
 * - Choques de horario
 * 
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       cod_grupo: 7,
 *       cod_asignatura: "IS201",
 *       nombre_asignatura: "Programación Orientada a Objetos",
 *       creditos: 4,
 *       docente: "Dr. Carlos Martínez",
 *       horario: "Lunes 8:00-10:00, Miércoles 8:00-10:00",
 *       salon: "B-201",
 *       cupo_disponible: 28,
 *       cupo_maximo: 30,
 *       sede: "Armenia",
 *       tiene_prerrequisitos: true,
 *       prerrequisitos_cumplidos: true,
 *       prerrequisitos: ["IS101 - Introducción a la Programación"]
 *     }
 *   ],
 *   creditos_disponibles: 21,
 *   creditos_matriculados: 0,
 *   nivel_riesgo: 0,
 *   asignaturas_obligatorias_perdidas: []
 * }
 */
export const fetchAsignaturasDisponibles = async (codigoEstudiante) => {
	const { data } = await axiosClient.get('/asignaturas/disponibles', {
		params: { codigoEstudiante },
	});
	return data;
};

/**
 * Registra la matrícula de un estudiante en asignaturas seleccionadas
 * Validaciones automáticas:
 * - Prerrequisitos cumplidos
 * - Límite de créditos según riesgo académico
 * - Choques de horario
 * - Cupos disponibles
 * - Ventanas de calendario académico
 * 
 * @param {Object} payload - Datos de la matrícula
 * @param {string} payload.codigoEstudiante - Código del estudiante
 * @param {string} payload.cod_periodo - Código del periodo académico (ej: "2025-1")
 * @param {Array<{cod_grupo: number}>} payload.asignaturas - Array de grupos a inscribir
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   mensaje: "Matrícula registrada exitosamente",
 *   cod_matricula: 1,
 *   creditos_registrados: 12,
 *   asignaturas_inscritas: [
 *     {
 *       cod_asignatura: "IS201",
 *       nombre: "Programación Orientada a Objetos",
 *       creditos: 4,
 *       horario: "Lunes 8:00-10:00"
 *     }
 *   ],
 *   alertas: []
 * }
 * 
 * Response error (400):
 * {
 *   error: "Límite de créditos excedido",
 *   detalle: "El estudiante está en riesgo nivel 1 y solo puede registrar 8 créditos"
 * }
 */
export const registrarMatricula = async (payload) => {
	const { data } = await axiosClient.post('/matriculas/registrar', payload);
	return data;
};

/**
 * Agrega una asignatura adicional a una matrícula existente
 * Se validan las mismas reglas que en la matrícula inicial
 * 
 * @param {Object} payload - Datos para agregar asignatura
 * @param {number} payload.cod_matricula - Código de la matrícula existente
 * @param {number} payload.cod_grupo - Código del grupo a agregar
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   mensaje: "Asignatura agregada correctamente",
 *   total_creditos: 16
 * }
 */
export const agregarAsignatura = async (payload) => {
	const { data } = await axiosClient.post('/matriculas/agregar-asignatura', payload);
	return data;
};

/**
 * Retira una asignatura de la matrícula
 * Restricciones:
 * - No se puede cancelar asignatura de primer semestre
 * - No se puede cancelar si está repitiendo (segundo o tercer intento)
 * - No se puede cancelar si ya la canceló 2+ veces
 * - No se puede cancelar asignaturas obligatorias perdidas
 * - Solo dentro de fechas del calendario académico
 * 
 * @param {Object} payload - Datos para retirar asignatura
 * @param {number} payload.cod_detalle_matricula - Código del detalle de matrícula
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   mensaje: "Asignatura retirada correctamente"
 * }
 * 
 * Response error (400):
 * {
 *   error: "No se puede cancelar esta asignatura",
 *   detalle: "Asignatura de primer semestre o ya cancelada 2 veces"
 * }
 */
export const retirarAsignatura = async (payload) => {
	const { data } = await axiosClient.delete('/matriculas/retirar-asignatura', {
		data: payload,
	});
	return data;
};

/**
 * Obtiene la matrícula actual de un estudiante para un periodo
 * @param {string} codigoEstudiante - Código del estudiante
 * @param {string} periodo - Código del periodo (ej: "2025-1")
 * @returns {Promise<Object>}
 */
export const fetchMatriculaActual = async (codigoEstudiante, periodo) => {
	const { data } = await axiosClient.get('/matriculas/actual', {
		params: { codigoEstudiante, periodo },
	});
	return data;
};

/**
 * Obtiene el historial completo de matrículas de un estudiante
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Array>}
 */
export const fetchHistorialMatriculas = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/matriculas/historial/${codigoEstudiante}`);
	return data;
};

