import axiosClient from './axiosClient.js';

/**
 * REPORTE 1: Matrícula y carga por periodo
 * Datos de matrícula por programa, incluyendo créditos y ocupación
 * @param {string} periodo - Código del periodo académico (ej: "2025-1")
 * @returns {Promise<Array>}
 */
export const fetchMatriculaPeriodo = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/matricula-periodo', { 
		params: { periodo } 
	});
	return data;
};

/**
 * REPORTE 2: Ocupación y top grupos
 * Grupos con mayor y menor ocupación
 * @param {string} periodo - Código del periodo académico
 * @returns {Promise<Array>}
 */
export const fetchOcupacionGrupos = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/ocupacion-grupos', {
		params: { periodo }
	});
	return data;
};

/**
 * REPORTE 3: Intentos fallidos de matrícula
 * Asignaturas con más rechazos por prerrequisitos o límites
 * @param {string} periodo - Código del periodo académico
 * @returns {Promise<Array>}
 */
export const fetchIntentosFallidos = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/intentos-fallidos', {
		params: { periodo }
	});
	return data;
};

/**
 * REPORTE 4: Rendimiento por asignatura
 * Estadísticas de aprobación, reprobación y promedios
 * @param {string} periodo - Código del periodo académico
 * @returns {Promise<Array>}
 */
export const fetchRendimientoAsignatura = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/rendimiento-asignatura', { 
		params: { periodo } 
	});
	return data;
};

/**
 * REPORTE 5: Distribución de notas
 * Distribución de calificaciones por rangos
 * @param {string} periodo - Código del periodo académico
 * @param {string} [codAsignatura] - Filtrar por asignatura específica
 * @returns {Promise<Object>}
 */
export const fetchDistribucionNotas = async (periodo, codAsignatura = null) => {
	const params = { periodo };
	if (codAsignatura) params.cod_asignatura = codAsignatura;
	const { data } = await axiosClient.get('/reportes/distribucion-notas', { params });
	return data;
};

/**
 * REPORTE 6: Evolución de promedio por estudiante
 * Seguimiento del promedio acumulado semestre a semestre
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Array>}
 */
export const fetchEvolucionPromedio = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/reportes/evolucion-promedio/${codigoEstudiante}`);
	return data;
};

/**
 * REPORTE 7: Riesgo académico por periodo
 * Estudiantes en riesgo académico y sus niveles
 * @param {string} periodo - Código del periodo académico
 * @returns {Promise<Object>}
 */
export const fetchRiesgoAcademico = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/riesgo-academico', {
		params: { periodo }
	});
	return data;
};

/**
 * REPORTE 8: Intentos por asignatura
 * Asignaturas con más intentos de aprobación
 * @param {string} [codPrograma] - Filtrar por programa (opcional)
 * @returns {Promise<Array>}
 */
export const fetchIntentosPorAsignatura = async (codPrograma = null) => {
	const params = codPrograma ? { cod_programa: codPrograma } : {};
	const { data } = await axiosClient.get('/reportes/intentos-asignatura', { params });
	return data;
};

/**
 * REPORTE 9: Trayectoria por cohorte
 * Seguimiento de cohortes desde ingreso hasta graduación
 * @param {string} cohorte - Año de ingreso (ej: "2020")
 * @returns {Promise<Object>}
 */
export const fetchTrayectoriaCohorte = async (cohorte) => {
	const { data } = await axiosClient.get('/reportes/trayectoria-cohorte', {
		params: { cohorte }
	});
	return data;
};

/**
 * REPORTE 10: Mapa de prerrequisitos
 * Visualización de cadenas de prerrequisitos
 * @param {number} codPrograma - Código del programa
 * @returns {Promise<Array>}
 */
export const fetchMapaPrerrequisitos = async (codPrograma) => {
	const { data } = await axiosClient.get('/reportes/mapa-prerrequisitos', {
		params: { cod_programa: codPrograma }
	});
	return data;
};

/**
 * REPORTE 11: Impacto de prerrequisitos
 * Prerrequisitos que más bloquean la matrícula
 * @param {string} periodo - Código del periodo académico
 * @returns {Promise<Array>}
 */
export const fetchImpactoPrerrequisitos = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/impacto-prerrequisitos', {
		params: { periodo }
	});
	return data;
};

/**
 * REPORTE 12: Reglas de evaluación incompletas
 * Grupos con reglas de evaluación que no suman 100%
 * @param {string} periodo - Código del periodo académico
 * @returns {Promise<Array>}
 */
export const fetchReglasIncompletas = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/reglas-incompletas', {
		params: { periodo }
	});
	return data;
};

/**
 * REPORTE 13: Reprobación por ítem de evaluación
 * Análisis de qué actividades causan más reprobaciones
 * @param {string} periodo - Código del periodo académico
 * @returns {Promise<Array>}
 */
export const fetchReprobacionPorItem = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/reprobacion-items', {
		params: { periodo }
	});
	return data;
};

/**
 * REPORTE 14: Avance en créditos vs plan
 * Comparación del avance real vs el esperado según semestre
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Object>}
 */
export const fetchAvanceCreditos = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/reportes/avance-creditos/${codigoEstudiante}`);
	return data;
};

/**
 * REPORTE 15: Opinión estudiantil consolidada (NoSQL)
 * Retroalimentación de estudiantes sobre asignaturas y docentes
 * @param {string} periodo - Código del periodo académico
 * @returns {Promise<Array>}
 */
export const fetchOpinionEstudiantil = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/opinion-estudiantil', {
		params: { periodo }
	});
	return data;
};

/**
 * REPORTE 16: Cruce de opiniones y desempeño
 * Correlación entre opinión estudiantil y rendimiento académico
 * @param {string} periodo - Código del periodo académico
 * @returns {Promise<Array>}
 */
export const fetchCruceOpinionDesempeno = async (periodo) => {
	const { data } = await axiosClient.get('/reportes/cruce-opinion-desempeno', {
		params: { periodo }
	});
	return data;
};

/**
 * REPORTE 17: Asignaturas "cuello de botella"
 * Asignaturas que más retrasan el avance curricular
 * @param {number} codPrograma - Código del programa
 * @returns {Promise<Array>}
 */
export const fetchAsignaturasCuelloBotella = async (codPrograma) => {
	const { data } = await axiosClient.get('/reportes/cuello-botella', {
		params: { cod_programa: codPrograma }
	});
	return data;
};

/**
 * REPORTE 18: Calidad de datos
 * Detección de inconsistencias y datos faltantes
 * @returns {Promise<Object>}
 */
export const fetchCalidadDatos = async () => {
	const { data } = await axiosClient.get('/reportes/calidad-datos');
	return data;
};

/**
 * Exporta un reporte a PDF
 * @param {string} tipoReporte - Tipo de reporte a exportar
 * @param {Object} params - Parámetros del reporte
 * @returns {Promise<Blob>}
 */
export const exportarReportePDF = async (tipoReporte, params = {}) => {
	const { data } = await axiosClient.get(`/reportes/${tipoReporte}/pdf`, {
		params,
		responseType: 'blob'
	});
	return data;
};

/**
 * Exporta un reporte a Excel
 * @param {string} tipoReporte - Tipo de reporte a exportar
 * @param {Object} params - Parámetros del reporte
 * @returns {Promise<Blob>}
 */
export const exportarReporteExcel = async (tipoReporte, params = {}) => {
	const { data } = await axiosClient.get(`/reportes/${tipoReporte}/excel`, {
		params,
		responseType: 'blob'
	});
	return data;
};

