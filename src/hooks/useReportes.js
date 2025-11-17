import { useState } from 'react';
import {
	generarReporteRiesgo,
	generarReporteRendimiento,
	generarReporteAsistencia,
	fetchHistorialReportes
} from '../services/reportesService.js';

/**
 * Hook personalizado para gestión de reportes
 * Proporciona funcionalidades para generar y consultar reportes del sistema
 * 
 * @returns {Object} Estado y funciones para reportes
 */
export const useReportes = () => {
	// Estados
	const [reportes, setReportes] = useState([]);
	const [reporteActual, setReporteActual] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [progreso, setProgreso] = useState(0);

	/**
	 * Genera un reporte de riesgo académico
	 */
	const generarRiesgo = async (parametros = {}) => {
		setLoading(true);
		setError(null);
		setProgreso(10);
		try {
			const data = await generarReporteRiesgo(parametros);
			setReporteActual(data);
			setProgreso(100);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al generar reporte de riesgo';
			setError(errorMsg);
			setProgreso(0);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Genera un reporte de rendimiento académico
	 */
	const generarRendimiento = async (parametros = {}) => {
		setLoading(true);
		setError(null);
		setProgreso(10);
		try {
			const data = await generarReporteRendimiento(parametros);
			setReporteActual(data);
			setProgreso(100);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al generar reporte de rendimiento';
			setError(errorMsg);
			setProgreso(0);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Genera un reporte de asistencia
	 */
	const generarAsistencia = async (parametros = {}) => {
		setLoading(true);
		setError(null);
		setProgreso(10);
		try {
			const data = await generarReporteAsistencia(parametros);
			setReporteActual(data);
			setProgreso(100);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al generar reporte de asistencia';
			setError(errorMsg);
			setProgreso(0);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga el historial de reportes generados
	 */
	const cargarHistorial = async (filtros = {}) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchHistorialReportes(filtros);
			setReportes(data.items || []);
			return { success: true, data: data.items || [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar historial de reportes';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Exporta un reporte a formato específico
	 */
	const exportar = async (reporte, formato = 'pdf') => {
		setLoading(true);
		setError(null);
		try {
			// Aquí iría la lógica de exportación
			// Por ahora, simulamos el proceso
			const blob = new Blob([JSON.stringify(reporte, null, 2)], {
				type: formato === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel'
			});
			
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `reporte_${new Date().getTime()}.${formato}`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			
			return { success: true };
		} catch (err) {
			console.error('Error al exportar:', err);
			const errorMsg = 'Error al exportar reporte';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Filtra reportes por tipo
	 */
	const filtrarPorTipo = (tipo) => {
		if (!tipo) return reportes;
		return reportes.filter(r => r.tipo_reporte === tipo);
	};

	/**
	 * Filtra reportes por fecha
	 */
	const filtrarPorFecha = (fechaInicio, fechaFin) => {
		if (!fechaInicio && !fechaFin) return reportes;
		
		return reportes.filter(r => {
			const fechaReporte = new Date(r.fecha_generacion);
			const inicio = fechaInicio ? new Date(fechaInicio) : null;
			const fin = fechaFin ? new Date(fechaFin) : null;
			
			if (inicio && fin) {
				return fechaReporte >= inicio && fechaReporte <= fin;
			} else if (inicio) {
				return fechaReporte >= inicio;
			} else if (fin) {
				return fechaReporte <= fin;
			}
			return true;
		});
	};

	/**
	 * Obtiene estadísticas de los reportes
	 */
	const obtenerEstadisticas = () => {
		const totalReportes = reportes.length;
		const porTipo = reportes.reduce((acc, r) => {
			const tipo = r.tipo_reporte || 'OTRO';
			acc[tipo] = (acc[tipo] || 0) + 1;
			return acc;
		}, {});

		return {
			total: totalReportes,
			porTipo,
			ultimoGenerado: reportes[0]?.fecha_generacion || null
		};
	};

	/**
	 * Limpia el reporte actual
	 */
	const limpiarReporte = () => {
		setReporteActual(null);
		setProgreso(0);
		setError(null);
	};

	/**
	 * Refresca el historial de reportes
	 */
	const refrescar = async () => {
		return await cargarHistorial();
	};

	return {
		// Estado
		reportes,
		reporteActual,
		loading,
		error,
		progreso,

		// Funciones de generación
		generarRiesgo,
		generarRendimiento,
		generarAsistencia,

		// Funciones de consulta
		cargarHistorial,

		// Funciones de exportación
		exportar,

		// Funciones de filtrado
		filtrarPorTipo,
		filtrarPorFecha,

		// Funciones de análisis
		obtenerEstadisticas,

		// Funciones auxiliares
		limpiarReporte,
		refrescar,
		setError,
	};
};

export default useReportes;
