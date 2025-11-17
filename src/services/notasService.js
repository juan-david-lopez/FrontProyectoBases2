import axiosClient from './axiosClient.js';

/**
 * Obtiene las calificaciones de todos los estudiantes de un grupo
 * @param {number} grupoId - ID del grupo
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       cod_estudiante: "202500001",
 *       nombre_estudiante: "Juan Pérez",
 *       corte_1: 4.2,
 *       corte_2: 4.5,
 *       corte_3: null,
 *       nota_definitiva: null,
 *       estado: "EN_PROCESO",
 *       porcentaje_completado: 60
 *     }
 *   ],
 *   estadisticas: {
 *     promedio_grupo: 4.35,
 *     nota_maxima: 5.0,
 *     nota_minima: 3.0,
 *     aprobados: 28,
 *     reprobados: 2,
 *     en_proceso: 0
 *   }
 * }
 */
export const fetchNotasPorGrupo = async (grupoId) => {
	const { data } = await axiosClient.get(`/notas/${grupoId}`);
	return data;
};

/**
 * Registra o actualiza calificaciones de estudiantes
 * Validaciones automáticas:
 * - Notas entre 0.0 y 5.0
 * - Solo para ítems de evaluación definidos
 * - Dentro del rango de fechas permitido
 * - Por el docente asignado al grupo
 * 
 * Cuando se completa el 100% de la evaluación, se calcula automáticamente la nota definitiva
 * 
 * @param {Object} payload - Datos de las calificaciones
 * @param {number} payload.cod_grupo - ID del grupo
 * @param {number} payload.cod_tipo_actividad - ID del tipo de actividad (1: Corte 1, 2: Corte 2, etc.)
 * @param {number} payload.numero_actividad - Número de la actividad
 * @param {Array<{cod_detalle_matricula: number, nota: number}>} payload.notas - Array de notas a registrar
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   mensaje: "Notas registradas correctamente",
 *   notas_procesadas: 2,
 *   notas_actualizadas: 2,
 *   definitivas_calculadas: 0
 * }
 * 
 * Response error (400):
 * {
 *   error: "Nota fuera de rango",
 *   detalle: "La nota debe estar entre 0.0 y 5.0"
 * }
 */
export const registrarNotas = async (payload) => {
	const { data } = await axiosClient.post('/notas/registrar', payload);
	return data;
};

/**
 * Obtiene las notas de un estudiante específico en un grupo
 * @param {string} codigoEstudiante - Código del estudiante
 * @param {number} grupoId - ID del grupo
 * @returns {Promise<Object>}
 */
export const fetchNotasEstudiante = async (codigoEstudiante, grupoId) => {
	const { data } = await axiosClient.get(`/notas/estudiante/${codigoEstudiante}/grupo/${grupoId}`);
	return data;
};

/**
 * Obtiene todas las notas de un estudiante para el periodo actual
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Array>}
 */
export const fetchNotasEstudiantePeriodoActual = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/notas/estudiante/${codigoEstudiante}/periodo-actual`);
	return data;
};

/**
 * Cierra el periodo académico y consolida notas definitivas
 * Proceso automático:
 * 1. Calcula todas las notas definitivas pendientes
 * 2. Actualiza promedios acumulados de todos los estudiantes
 * 3. Recalcula el nivel de riesgo académico
 * 4. Actualiza créditos aprobados
 * 5. Bloquea modificaciones de notas
 * 6. Genera reportes estadísticos
 * 
 * @param {Object} payload - Datos para cerrar periodo
 * @param {string} payload.cod_periodo - Código del periodo a cerrar
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   mensaje: "Periodo cerrado exitosamente",
 *   estudiantes_actualizados: 450,
 *   notas_consolidadas: 1350,
 *   riesgos_recalculados: 450
 * }
 */
export const cerrarPeriodo = async (payload) => {
	const { data } = await axiosClient.post('/notas/cerrar-periodo', payload);
	return data;
};

/**
 * Obtiene la regla de evaluación de un grupo (porcentajes de cada corte)
 * @param {number} grupoId - ID del grupo
 * @returns {Promise<Array>}
 * 
 * Response estructura:
 * [
 *   {
 *     cod_tipo_actividad: 1,
 *     nombre_actividad: "Primer Corte",
 *     porcentaje: 30,
 *     fecha_limite: "2025-03-15"
 *   },
 *   {
 *     cod_tipo_actividad: 2,
 *     nombre_actividad: "Segundo Corte",
 *     porcentaje: 30,
 *     fecha_limite: "2025-05-15"
 *   },
 *   {
 *     cod_tipo_actividad: 3,
 *     nombre_actividad: "Examen Final",
 *     porcentaje: 40,
 *     fecha_limite: "2025-06-30"
 *   }
 * ]
 */
export const fetchReglaEvaluacion = async (grupoId) => {
	const { data } = await axiosClient.get(`/notas/regla-evaluacion/${grupoId}`);
	return data;
};

/**
 * Obtiene las notas de un grupo específico
 * Alias para fetchNotasPorGrupo
 * @param {number} grupoId - ID del grupo
 * @returns {Promise<Object>}
 */
export const fetchNotasGrupo = async (grupoId) => {
	return fetchNotasPorGrupo(grupoId);
};

/**
 * Registra una única nota (alias de registrarNotas para compatibilidad)
 * @param {Object} payload - Datos de la nota
 * @returns {Promise<Object>}
 */
export const registrarNota = async (payload) => {
	return registrarNotas(payload);
};

/**
 * Actualiza una nota existente
 * @param {number} notaId - ID de la nota
 * @param {Object} payload - Datos actualizados
 * @returns {Promise<Object>}
 */
export const actualizarNota = async (notaId, payload) => {
	const { data } = await axiosClient.put(`/notas/${notaId}`, payload);
	return data;
};

/**
 * Elimina una nota
 * @param {number} notaId - ID de la nota
 * @returns {Promise<Object>}
 */
export const eliminarNota = async (notaId) => {
	const { data } = await axiosClient.delete(`/notas/${notaId}`);
	return data;
};
