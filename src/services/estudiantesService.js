import axiosClient from './axiosClient.js';

/**
 * Obtiene listado completo de estudiantes con paginación
 * @param {Object} params - Parámetros de paginación
 * @param {number} params.limit - Límite de resultados (default: 25)
 * @param {number} params.offset - Offset para paginación (default: 0)
 * @returns {Promise<{items: Array, hasMore: boolean, limit: number, offset: number, count: number}>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       cod_estudiante: "202500001",
 *       tipo_documento: "CC",
 *       num_documento: "1234567890",
 *       primer_nombre: "Juan",
 *       segundo_nombre: "Carlos",
 *       primer_apellido: "Pérez",
 *       segundo_apellido: "Gómez",
 *       correo_institucional: "juan.perez@universidad.edu",
 *       correo_personal: "juan.perez@gmail.com",
 *       telefono: "3101234567",
 *       cod_programa: 1,
 *       nombre_programa: "Ingeniería de Sistemas",
 *       estado_estudiante: "ACTIVO",
 *       fecha_ingreso: "2025-01-10T00:00:00Z",
 *       promedio_acumulado: 4.2,
 *       creditos_aprobados: 48,
 *       nivel_riesgo: 0
 *     }
 *   ],
 *   hasMore: false,
 *   limit: 25,
 *   offset: 0,
 *   count: 1
 * }
 */
export const fetchEstudiantes = async (params = {}) => {
	const { limit = 25, offset = 0 } = params;
	const { data } = await axiosClient.get('/estudiantes/', {
		params: { limit, offset },
	});
	return data;
};

/**
 * Obtiene el historial académico completo de un estudiante
 * @param {string} codigo - Código del estudiante
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   items: [
 *     {
 *       periodo: "2025-1",
 *       cod_asignatura: "IS101",
 *       nombre_asignatura: "Introducción a la Programación",
 *       creditos: 4,
 *       nota_final: 4.5,
 *       resultado: "APROBADO",
 *       intento: 1,
 *       docente: "Dr. Carlos Martínez"
 *     }
 *   ],
 *   resumen: {
 *     creditos_aprobados: 48,
 *     creditos_totales: 160,
 *     porcentaje_avance: 30.0,
 *     promedio_acumulado: 4.15,
 *     asignaturas_aprobadas: 12,
 *     asignaturas_reprobadas: 1,
 *     nivel_riesgo: 0
 *   }
 * }
 */
export const fetchHistorial = async (codigo) => {
	const { data } = await axiosClient.get(`/estudiantes/${codigo}/historial`);
	return data;
};

/**
 * Crea un nuevo estudiante en el sistema
 * Se crea automáticamente un usuario con:
 * - Username: correo institucional
 * - Password: número de documento (hash SHA-256)
 * 
 * @param {Object} payload - Datos del estudiante
 * @param {string} payload.codigo - Código del estudiante
 * @param {string} payload.tipo_documento - Tipo de documento (CC, TI, CE, etc.)
 * @param {string} payload.num_documento - Número de documento
 * @param {string} payload.primer_nombre - Primer nombre
 * @param {string} [payload.segundo_nombre] - Segundo nombre (opcional)
 * @param {string} payload.primer_apellido - Primer apellido
 * @param {string} [payload.segundo_apellido] - Segundo apellido (opcional)
 * @param {string} payload.correo_institucional - Correo institucional
 * @param {string} [payload.correo_personal] - Correo personal (opcional)
 * @param {string} [payload.telefono] - Teléfono (opcional)
 * @param {number} payload.cod_programa - Código del programa académico
 * @param {string} payload.fecha_ingreso - Fecha de ingreso (YYYY-MM-DD)
 * @returns {Promise<Object>}
 * 
 * Response estructura:
 * {
 *   mensaje: "Estudiante creado correctamente",
 *   cod_estudiante: "202500003",
 *   usuario_creado: {
 *     username: "maria.gonzalez@universidad.edu",
 *     password_inicial: "9876543210"
 *   }
 * }
 */
export const crearEstudiante = async (payload) => {
	const { data } = await axiosClient.post('/estudiantes/', payload);
	return data;
};

/**
 * Actualiza información de un estudiante
 * @param {string} codigo - Código del estudiante
 * @param {Object} payload - Datos a actualizar
 * @param {string} [payload.correo_institucional] - Correo institucional
 * @param {string} [payload.correo_personal] - Correo personal
 * @param {string} [payload.telefono] - Teléfono
 * @param {string} [payload.direccion] - Dirección
 * @param {string} [payload.estado_estudiante] - Estado (ACTIVO, INACTIVO, RETIRADO, GRADUADO)
 * @returns {Promise<{mensaje: string}>}
 */
export const actualizarEstudiante = async (codigo, payload) => {
	const { data } = await axiosClient.put(`/estudiantes/${codigo}`, payload);
	return data;
};

/**
 * Obtiene información detallada de un estudiante específico
 * @param {string} codigo - Código del estudiante
 * @returns {Promise<Object>}
 */
export const fetchEstudianteById = async (codigo) => {
	const { data } = await axiosClient.get(`/estudiantes/${codigo}`);
	return data;
};

