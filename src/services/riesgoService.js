import axiosClient from './axiosClient.js';

/**
 * Obtiene estadísticas de riesgo académico por programa en un periodo
 * @param {string} periodo - Código del periodo académico (ej: "2025-1")
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       cod_programa: "IS",
 *       nombre_programa: "Ingeniería de Sistemas",
 *       total_estudiantes: 150,
 *       sin_riesgo: 120,
 *       riesgo_1: 15,  // Promedio < 2.0
 *       riesgo_2: 10,  // 2+ asignaturas perdidas
 *       riesgo_3: 3,   // Misma asignatura perdida 3 veces
 *       riesgo_4: 2,   // Promedio < 3.0
 *       porcentaje_riesgo: 20.0
 *     }
 *   ],
 *   resumen_institucional: {
 *     total_estudiantes: 450,
 *     porcentaje_riesgo_general: 18.5
 *   }
 * }
 */
export const fetchRiesgoPorPeriodo = async (periodo) => {
	const { data } = await axiosClient.get('/riesgo/periodo', { 
		params: { periodo } 
	});
	return data;
};

/**
 * Obtiene el nivel de riesgo de un estudiante específico
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   cod_estudiante: "202500001",
 *   nombre_completo: "Juan Carlos Pérez Gómez",
 *   nivel_riesgo: 0,
 *   descripcion_riesgo: "Sin riesgo",
 *   creditos_permitidos: 21,
 *   promedio_acumulado: 4.2,
 *   promedio_ultimo_semestre: 4.1,
 *   asignaturas_perdidas_semestre: 0,
 *   intentos_maximos_asignatura: 1,
 *   historial_riesgo: [
 *     {
 *       periodo: "2024-2",
 *       nivel_riesgo: 0,
 *       fecha_calculo: "2024-12-15"
 *     }
 *   ]
 * }
 */
export const fetchRiesgoEstudiante = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/riesgo/estudiante/${codigoEstudiante}`);
	return data;
};

/**
 * Recalcula el nivel de riesgo académico de todos los estudiantes
 * 
 * Niveles de riesgo:
 * - Nivel 0: Sin riesgo (créditos máximos: 21)
 * - Nivel 1: Promedio semestre < 2.0 (créditos máximos: 8)
 * - Nivel 2: 2+ asignaturas perdidas (créditos máximos: 12)
 * - Nivel 3: Misma asignatura perdida 3 veces (créditos máximos: 8)
 * - Nivel 4: Promedio semestre < 3.0 (créditos máximos: 16)
 * 
 * Se ejecuta automáticamente al cerrar cada periodo académico
 * 
 * @returns {Promise<Object>}
 * 
 * Response exitoso:
 * {
 *   mensaje: "Riesgos recalculados exitosamente",
 *   estudiantes_evaluados: 450,
 *   cambios_nivel_riesgo: 35,
 *   estadisticas: {
 *     sin_riesgo: 380,
 *     riesgo_1: 25,
 *     riesgo_2: 30,
 *     riesgo_3: 10,
 *     riesgo_4: 5
 *   }
 * }
 */
export const recalcularRiesgos = async () => {
	const { data } = await axiosClient.post('/riesgo/recalcular');
	return data;
};

/**
 * Obtiene el historial de cambios de riesgo de un estudiante
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Array>}
 */
export const fetchHistorialRiesgo = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/riesgo/historial/${codigoEstudiante}`);
	return data;
};

