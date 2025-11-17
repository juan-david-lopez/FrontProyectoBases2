import { useState, useEffect } from 'react';
import {
	fetchNotasEstudiante,
	fetchNotasGrupo,
	registrarNota,
	actualizarNota,
	eliminarNota
} from '../services/notasService.js';

/**
 * Hook personalizado para gestión de calificaciones
 * Proporciona funcionalidades para consultar y registrar notas
 * 
 * @param {Object} options - Opciones de configuración
 * @param {string} options.codigoEstudiante - Código del estudiante (para vista estudiante)
 * @param {number} options.codigoGrupo - Código del grupo (para vista docente)
 * @param {boolean} options.autoLoad - Cargar datos automáticamente (default: true)
 * @returns {Object} Estado y funciones para calificaciones
 */
export const useCalificaciones = (options = {}) => {
	const {
		codigoEstudiante = null,
		codigoGrupo = null,
		autoLoad = true
	} = options;

	// Estados
	const [calificaciones, setCalificaciones] = useState([]);
	const [calificacionSeleccionada, setCalificacionSeleccionada] = useState(null);
	const [estadisticas, setEstadisticas] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	/**
	 * Carga las notas de un estudiante
	 */
	const cargarNotasEstudiante = async (codigo = codigoEstudiante) => {
		if (!codigo) {
			setError('Código de estudiante requerido');
			return { success: false, error: 'Código de estudiante requerido' };
		}

		setLoading(true);
		setError(null);
		try {
			const data = await fetchNotasEstudiante(codigo);
			setCalificaciones(data.items || []);
			calcularEstadisticas(data.items || []);
			return { success: true, data: data.items || [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar notas';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga las notas de un grupo (vista docente)
	 */
	const cargarNotasGrupo = async (codigo = codigoGrupo) => {
		if (!codigo) {
			setError('Código de grupo requerido');
			return { success: false, error: 'Código de grupo requerido' };
		}

		setLoading(true);
		setError(null);
		try {
			const data = await fetchNotasGrupo(codigo);
			setCalificaciones(data.items || []);
			return { success: true, data: data.items || [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar notas del grupo';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Registra una nueva calificación
	 */
	const registrar = async (notaData) => {
		setLoading(true);
		setError(null);
		try {
			const data = await registrarNota(notaData);
			
			// Recargar notas según el contexto
			if (codigoEstudiante) {
				await cargarNotasEstudiante();
			} else if (codigoGrupo) {
				await cargarNotasGrupo();
			}
			
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al registrar calificación';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Actualiza una calificación existente
	 */
	const actualizar = async (codCalificacion, notaData) => {
		setLoading(true);
		setError(null);
		try {
			const data = await actualizarNota(codCalificacion, notaData);
			
			// Recargar notas según el contexto
			if (codigoEstudiante) {
				await cargarNotasEstudiante();
			} else if (codigoGrupo) {
				await cargarNotasGrupo();
			}
			
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al actualizar calificación';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Elimina una calificación
	 */
	const eliminar = async (codCalificacion) => {
		setLoading(true);
		setError(null);
		try {
			const data = await eliminarNota(codCalificacion);
			
			// Recargar notas según el contexto
			if (codigoEstudiante) {
				await cargarNotasEstudiante();
			} else if (codigoGrupo) {
				await cargarNotasGrupo();
			}
			
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al eliminar calificación';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Calcula estadísticas de las calificaciones
	 */
	const calcularEstadisticas = (notas) => {
		if (!notas || notas.length === 0) {
			setEstadisticas(null);
			return;
		}

		const totalNotas = notas.length;
		const suma = notas.reduce((acc, nota) => acc + (nota.nota_final || 0), 0);
		const promedio = suma / totalNotas;
		
		const aprobadas = notas.filter(n => (n.nota_final || 0) >= 3.0).length;
		const reprobadas = notas.filter(n => (n.nota_final || 0) < 3.0 && n.nota_final !== null).length;
		
		const notaMasAlta = Math.max(...notas.map(n => n.nota_final || 0));
		const notaMasBaja = Math.min(...notas.filter(n => n.nota_final !== null).map(n => n.nota_final));

		setEstadisticas({
			totalNotas,
			promedio: promedio.toFixed(2),
			aprobadas,
			reprobadas,
			tasa_aprobacion: ((aprobadas / totalNotas) * 100).toFixed(1),
			nota_mas_alta: notaMasAlta.toFixed(1),
			nota_mas_baja: notaMasBaja.toFixed(1)
		});
	};

	/**
	 * Filtra calificaciones por período
	 */
	const filtrarPorPeriodo = (periodo) => {
		if (!periodo) {
			return calificaciones;
		}
		return calificaciones.filter(c => c.periodo === periodo || c.cod_periodo === periodo);
	};

	/**
	 * Filtra calificaciones por asignatura
	 */
	const filtrarPorAsignatura = (codAsignatura) => {
		if (!codAsignatura) {
			return calificaciones;
		}
		return calificaciones.filter(c => c.cod_asignatura === codAsignatura);
	};

	/**
	 * Obtiene el promedio de un período específico
	 */
	const promedioDelPeriodo = (periodo) => {
		const notasPeriodo = filtrarPorPeriodo(periodo);
		if (notasPeriodo.length === 0) return 0;
		
		const suma = notasPeriodo.reduce((acc, nota) => acc + (nota.nota_final || 0), 0);
		return (suma / notasPeriodo.length).toFixed(2);
	};

	/**
	 * Refresca todos los datos
	 */
	const refrescar = async () => {
		if (codigoEstudiante) {
			await cargarNotasEstudiante();
		} else if (codigoGrupo) {
			await cargarNotasGrupo();
		}
	};

	// Cargar datos iniciales
	useEffect(() => {
		if (autoLoad) {
			if (codigoEstudiante) {
				cargarNotasEstudiante();
			} else if (codigoGrupo) {
				cargarNotasGrupo();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoLoad, codigoEstudiante, codigoGrupo]);

	return {
		// Estado
		calificaciones,
		calificacionSeleccionada,
		estadisticas,
		loading,
		error,

		// Funciones de carga
		cargarNotasEstudiante,
		cargarNotasGrupo,

		// Funciones CRUD
		registrar,
		actualizar,
		eliminar,

		// Funciones de análisis
		filtrarPorPeriodo,
		filtrarPorAsignatura,
		promedioDelPeriodo,

		// Funciones auxiliares
		refrescar,
		setCalificacionSeleccionada,
		setError,
	};
};

export default useCalificaciones;
