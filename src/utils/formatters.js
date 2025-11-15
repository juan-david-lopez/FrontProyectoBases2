/**
 * Utilidades de formateo para el Sistema Académico
 * Universidad del Quindío
 */

/**
 * Formatea una fecha ISO a formato legible en español
 * @param {string} isoDate - Fecha en formato ISO (2025-01-10T00:00:00Z)
 * @param {boolean} includeTime - Si incluir la hora (default: false)
 * @returns {string} - Fecha formateada (ej: "10 de enero de 2025")
 */
export const formatDate = (isoDate, includeTime = false) => {
	if (!isoDate) return 'N/A';
	
	const date = new Date(isoDate);
	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		...(includeTime && { hour: '2-digit', minute: '2-digit' })
	};
	
	return new Intl.DateTimeFormat('es-CO', options).format(date);
};

/**
 * Formatea una fecha a formato corto (dd/mm/yyyy)
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} - Fecha formateada (ej: "10/01/2025")
 */
export const formatDateShort = (isoDate) => {
	if (!isoDate) return 'N/A';
	
	const date = new Date(isoDate);
	return new Intl.DateTimeFormat('es-CO', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(date);
};

/**
 * Formatea una nota académica (0.0 - 5.0)
 * @param {number} nota - Nota a formatear
 * @param {number} decimals - Número de decimales (default: 1)
 * @returns {string} - Nota formateada (ej: "4.5")
 */
export const formatNota = (nota, decimals = 1) => {
	if (nota === null || nota === undefined) return 'N/A';
	return Number(nota).toFixed(decimals);
};

/**
 * Determina el color CSS según la nota
 * @param {number} nota - Nota a evaluar
 * @returns {string} - Clase de color CSS
 */
export const getNotaColor = (nota) => {
	if (nota === null || nota === undefined) return 'text-gray-500';
	if (nota >= 4.5) return 'text-green-600';
	if (nota >= 3.5) return 'text-blue-600';
	if (nota >= 3.0) return 'text-yellow-600';
	return 'text-red-600';
};

/**
 * Determina el estado de aprobación según la nota
 * @param {number} nota - Nota a evaluar
 * @returns {string} - Estado (APROBADO, REPROBADO, PENDIENTE)
 */
export const getEstadoNota = (nota) => {
	if (nota === null || nota === undefined) return 'PENDIENTE';
	return nota >= 3.0 ? 'APROBADO' : 'REPROBADO';
};

/**
 * Formatea el nivel de riesgo académico
 * @param {number} nivel - Nivel de riesgo (0-4)
 * @returns {string} - Descripción del riesgo
 */
export const formatRiesgo = (nivel) => {
	const riesgos = {
		0: 'Sin riesgo',
		1: 'Riesgo Alto (Promedio < 2.0)',
		2: 'Riesgo Medio (2+ asignaturas perdidas)',
		3: 'Riesgo Crítico (3 intentos misma asignatura)',
		4: 'Riesgo Moderado (Promedio < 3.0)'
	};
	return riesgos[nivel] || 'Desconocido';
};

/**
 * Obtiene el color según el nivel de riesgo
 * @param {number} nivel - Nivel de riesgo (0-4)
 * @returns {string} - Clase de color CSS
 */
export const getRiesgoColor = (nivel) => {
	const colores = {
		0: 'bg-green-100 text-green-800',
		1: 'bg-red-900 text-white',
		2: 'bg-orange-100 text-orange-800',
		3: 'bg-red-600 text-white',
		4: 'bg-yellow-100 text-yellow-800'
	};
	return colores[nivel] || 'bg-gray-100 text-gray-800';
};

/**
 * Obtiene el límite de créditos según el nivel de riesgo
 * @param {number} nivel - Nivel de riesgo (0-4)
 * @returns {number} - Créditos máximos permitidos
 */
export const getCreditosMaximos = (nivel) => {
	const limites = {
		0: 21,
		1: 8,
		2: 12,
		3: 8,
		4: 16
	};
	return limites[nivel] || 21;
};

/**
 * Formatea un número de documento con separadores de miles
 * @param {string|number} documento - Número de documento
 * @returns {string} - Documento formateado
 */
export const formatDocumento = (documento) => {
	if (!documento) return 'N/A';
	return String(documento).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Formatea un número de teléfono colombiano
 * @param {string} telefono - Número de teléfono
 * @returns {string} - Teléfono formateado (ej: "310 123 4567")
 */
export const formatTelefono = (telefono) => {
	if (!telefono) return 'N/A';
	const cleaned = String(telefono).replace(/\D/g, '');
	if (cleaned.length === 10) {
		return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
	}
	return telefono;
};

/**
 * Formatea créditos académicos
 * @param {number} creditos - Número de créditos
 * @returns {string} - Créditos formateados con pluralización
 */
export const formatCreditos = (creditos) => {
	if (creditos === null || creditos === undefined) return 'N/A';
	return creditos === 1 ? '1 crédito' : `${creditos} créditos`;
};

/**
 * Calcula el porcentaje de avance en el programa
 * @param {number} creditosAprobados - Créditos ya aprobados
 * @param {number} creditosTotales - Créditos totales del programa
 * @returns {number} - Porcentaje (0-100)
 */
export const calcularAvance = (creditosAprobados, creditosTotales) => {
	if (!creditosTotales || creditosTotales === 0) return 0;
	return Math.round((creditosAprobados / creditosTotales) * 100);
};

/**
 * Formatea el estado de un estudiante
 * @param {string} estado - Estado del estudiante
 * @returns {Object} - {label, color}
 */
export const formatEstadoEstudiante = (estado) => {
	const estados = {
		ACTIVO: { label: 'Activo', color: 'bg-green-100 text-green-800' },
		INACTIVO: { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
		RETIRADO: { label: 'Retirado', color: 'bg-red-100 text-red-800' },
		GRADUADO: { label: 'Graduado', color: 'bg-blue-100 text-blue-800' },
		SUSPENDIDO: { label: 'Suspendido', color: 'bg-orange-100 text-orange-800' }
	};
	return estados[estado] || { label: estado, color: 'bg-gray-100 text-gray-800' };
};

/**
 * Formatea el nombre completo de una persona
 * @param {Object} persona - Objeto con nombres y apellidos
 * @returns {string} - Nombre completo formateado
 */
export const formatNombreCompleto = (persona) => {
	const partes = [
		persona.primer_nombre,
		persona.segundo_nombre,
		persona.primer_apellido,
		persona.segundo_apellido
	].filter(Boolean);
	
	return partes.join(' ') || 'N/A';
};

/**
 * Formatea un periodo académico
 * @param {string} periodo - Periodo (ej: "2025-1")
 * @returns {string} - Periodo formateado (ej: "2025 - Primer Semestre")
 */
export const formatPeriodo = (periodo) => {
	if (!periodo) return 'N/A';
	
	const [year, semestre] = periodo.split('-');
	const semestreNombre = semestre === '1' ? 'Primer Semestre' : 'Segundo Semestre';
	
	return `${year} - ${semestreNombre}`;
};

/**
 * Formatea una hora en formato HH:MM a formato legible
 * @param {string} hora - Hora en formato HH:MM (ej: "08:00")
 * @returns {string} - Hora formateada (ej: "8:00 AM")
 */
export const formatHora = (hora) => {
	if (!hora) return 'N/A';
	
	const [hours, minutes] = hora.split(':');
	const hour = parseInt(hours);
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const hour12 = hour % 12 || 12;
	
	return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Valida si una nota está en el rango válido (0.0 - 5.0)
 * @param {number} nota - Nota a validar
 * @returns {boolean} - true si es válida
 */
export const isNotaValida = (nota) => {
	return nota !== null && nota !== undefined && nota >= 0 && nota <= 5.0;
};

/**
 * Trunca un texto largo y agrega puntos suspensivos
 * @param {string} texto - Texto a truncar
 * @param {number} maxLength - Longitud máxima (default: 50)
 * @returns {string} - Texto truncado
 */
export const truncateText = (texto, maxLength = 50) => {
	if (!texto) return 'N/A';
	if (texto.length <= maxLength) return texto;
	return texto.substring(0, maxLength) + '...';
};

/**
 * Formatea un código de estudiante
 * @param {string} codigo - Código del estudiante
 * @returns {string} - Código formateado
 */
export const formatCodigoEstudiante = (codigo) => {
	if (!codigo) return 'N/A';
	// Formato: 2025-00001 o similar
	if (codigo.length >= 8) {
		return `${codigo.slice(0, 4)}-${codigo.slice(4)}`;
	}
	return codigo;
};

/**
 * Obtiene el color de un badge según el tipo
 * @param {string} type - Tipo de badge (success, warning, error, info)
 * @returns {string} - Clases CSS
 */
export const getBadgeColor = (type) => {
	const colors = {
		success: 'bg-green-100 text-green-800',
		warning: 'bg-yellow-100 text-yellow-800',
		error: 'bg-red-100 text-red-800',
		info: 'bg-blue-100 text-blue-800',
		neutral: 'bg-gray-100 text-gray-800'
	};
	return colors[type] || colors.neutral;
};

/**
 * Calcula el promedio de un array de notas
 * @param {Array<number>} notas - Array de notas
 * @returns {number} - Promedio calculado
 */
export const calcularPromedio = (notas) => {
	if (!notas || notas.length === 0) return 0;
	const notasValidas = notas.filter(n => n !== null && n !== undefined);
	if (notasValidas.length === 0) return 0;
	
	const suma = notasValidas.reduce((acc, nota) => acc + nota, 0);
	return suma / notasValidas.length;
};

/**
 * Formatea un número con separador de miles
 * @param {number} numero - Número a formatear
 * @returns {string} - Número formateado
 */
export const formatNumber = (numero) => {
	if (numero === null || numero === undefined) return 'N/A';
	return new Intl.NumberFormat('es-CO').format(numero);
};

/**
 * Formatea un porcentaje
 * @param {number} valor - Valor del porcentaje (0-100)
 * @param {number} decimals - Número de decimales (default: 1)
 * @returns {string} - Porcentaje formateado
 */
export const formatPorcentaje = (valor, decimals = 1) => {
	if (valor === null || valor === undefined) return 'N/A';
	return `${Number(valor).toFixed(decimals)}%`;
};
