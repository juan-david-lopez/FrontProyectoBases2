import axiosClient from './axiosClient.js';

/**
 * Obtiene las asignaturas disponibles para matrícula de un estudiante
 * Endpoint: GET /registro-materias/disponibles/:cod_estudiante
 * 
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
 *       cod_asignatura: "IS102",
 *       nombre: "Estructura de Datos",
 *       creditos: 4,
 *       semestre: 2,
 *       tipo: "OBLIGATORIA",
 *       prereq_cumplidos: "SÍ",
 *       grupos_disponibles: 3,
 *       puede_inscribir: "SÍ",
 *       razon: null
 *     }
 *   ]
 * }
 */
export const fetchAsignaturasDisponibles = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/registro-materias/disponibles/${codigoEstudiante}`);
	return data;
};

/**
 * Obtiene los grupos disponibles de una asignatura específica
 * Endpoint: GET /registro-materias/grupos/:cod_asignatura
 * 
 * @param {string} codAsignatura - Código de la asignatura
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       cod_grupo: "G01",
 *       cod_asignatura: "IS102",
 *       nombre_asignatura: "Estructura de Datos",
 *       cod_docente: "D001",
 *       nombre_docente: "Dr. Roberto Méndez",
 *       horario: "LUN-MIE 08:00-10:00",
 *       salon: "LAB-201",
 *       cupo_maximo: 35,
 *       cupo_disponible: 12,
 *       porcentaje_ocupacion: 66,
 *       nombre_sede: "Campus Principal Armenia",
 *       estado: "ABIERTO"
 *     }
 *   ]
 * }
 */
export const fetchGruposPorAsignatura = async (codAsignatura) => {
	const { data } = await axiosClient.get(`/registro-materias/grupos/${codAsignatura}`);
	return data;
};

/**
 * Obtiene el horario actual del estudiante
 * Endpoint: GET /registro-materias/mi-horario/:cod_estudiante
 * 
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       dia: "LUNES",
 *       orden_dia: 1,
 *       hora_inicio: "08:00",
 *       hora_fin: "10:00",
 *       cod_asignatura: "IS102",
 *       nombre_asignatura: "Estructura de Datos",
 *       cod_grupo: "G01",
 *       docente: "Dr. Roberto Méndez",
 *       salon: "LAB-201",
 *       creditos: 4
 *     }
 *   ]
 * }
 */
export const fetchMiHorario = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/registro-materias/mi-horario/${codigoEstudiante}`);
	return data;
};

/**
 * Obtiene el resumen completo del estado académico y matrícula actual
 * Endpoint: GET /registro-materias/resumen/:cod_estudiante
 * 
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       cod_estudiante: "202500001",
 *       nombre_completo: "JUAN CARLOS PÉREZ GÓMEZ",
 *       cod_programa: "ISOFT",
 *       nombre_programa: "Ingeniería de Sistemas y Computación",
 *       creditos_programa: 160,
 *       creditos_aprobados: 48,
 *       porcentaje_avance: 30,
 *       nivel_riesgo: 0,
 *       descripcion_riesgo: "SIN RIESGO",
 *       creditos_disponibles: 21,
 *       creditos_matriculados: 18,
 *       creditos_restantes: 3,
 *       puede_matricular_mas: "SÍ",
 *       periodo_actual: "2025-I",
 *       asignaturas_perdidas_pendientes: 0,
 *       es_primer_semestre: "NO"
 *     }
 *   ]
 * }
 */
export const fetchResumenMatricula = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/registro-materias/resumen/${codigoEstudiante}`);
	return data;
};

/**
 * Registra la matrícula de un estudiante en asignaturas seleccionadas
 * Endpoint: POST /matriculas/registrar
 * 
 * Validaciones automáticas del backend:
 * - Ventana de calendario activa
 * - Prerrequisitos cumplidos
 * - Límite de créditos según riesgo académico
 * - Choques de horario
 * - Cupos disponibles
 * 
 * @param {Object} payload - Datos de la matrícula
 * @param {string} payload.codigoEstudiante - Código del estudiante
 * @param {string} payload.cod_periodo - Código del periodo académico (ej: "2025-I")
 * @param {Array<{cod_grupo: string}>} payload.grupos - Array de códigos de grupo a inscribir
 * @returns {Promise<Object>}
 * 
 * Response exitoso (200):
 * {
 *   mensaje: "Matrícula registrada exitosamente",
 *   cod_matricula: "M2025-1-001",
 *   creditos_registrados: 12,
 *   asignaturas_inscritas: [...]
 * }
 * 
 * Response error (403):
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
 * Endpoint: POST /matriculas/agregar-asignatura
 * 
 * Se validan las mismas reglas que en la matrícula inicial
 * 
 * @param {Object} payload - Datos para agregar asignatura
 * @param {string} payload.cod_matricula - Código de la matrícula existente
 * @param {string} payload.cod_grupo - Código del grupo a agregar
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
 * Endpoint: DELETE /matriculas/retirar-asignatura
 * 
 * Restricciones validadas por el backend:
 * - Solo dentro de ventana CANCELACION
 * - No se puede cancelar asignatura de primer semestre
 * - No se puede cancelar si está repitiendo (segundo o tercer intento)
 * - No se puede cancelar si ya la canceló 2+ veces
 * - No se puede cancelar asignaturas obligatorias perdidas
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
 * Response error (403):
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
 * Endpoint: GET /matriculas/estudiante/:cod
 * 
 * @param {string} codigoEstudiante - Código del estudiante
 * @param {string} periodo - Código del periodo (ej: "2025-I")
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       cod_matricula: "M2025-1-001",
 *       cod_estudiante: "202500001",
 *       nombre_estudiante: "JUAN CARLOS PÉREZ GÓMEZ",
 *       cod_periodo: "2025-I",
 *       fecha_matricula: "2025-01-20T10:30:00Z",
 *       total_creditos: 18,
 *       estado: "ACTIVA",
 *       detalles: [
 *         {
 *           cod_detalle_matricula: 1001,
 *           cod_asignatura: "IS101",
 *           nombre_asignatura: "Fundamentos de Programación",
 *           creditos: 4,
 *           cod_grupo: "G01",
 *           estado_detalle: "ACTIVO"
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export const fetchMatriculaActual = async (codigoEstudiante, periodo) => {
	const { data } = await axiosClient.get(`/matriculas/estudiante/${codigoEstudiante}`, {
		params: { periodo },
	});
	return data;
};

/**
 * Obtiene el historial completo de matrículas de un estudiante
 * Endpoint: GET /estudiantes/:codigo/matriculas
 * 
 * @param {string} codigoEstudiante - Código del estudiante
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       cod_matricula: "M2025-1-001",
 *       cod_periodo: "2025-I",
 *       fecha_matricula: "2025-01-20T10:30:00Z",
 *       total_creditos: 18,
 *       estado: "ACTIVA",
 *       asignaturas: [
 *         {
 *           cod_asignatura: "IS101",
 *           nombre_asignatura: "Fundamentos de Programación",
 *           creditos: 4,
 *           cod_grupo: "G01",
 *           docente: "Dr. Roberto Méndez",
 *           horario: "LUN-MIE 08:00-10:00"
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export const fetchHistorialMatriculas = async (codigoEstudiante) => {
	const { data } = await axiosClient.get(`/estudiantes/${codigoEstudiante}/matriculas`);
	return data;
};

