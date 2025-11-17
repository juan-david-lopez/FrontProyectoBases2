import { useState, useEffect } from 'react';
import {
	fetchPeriodos,
	fetchPeriodoActivo,
	fetchPeriodoById,
	crearPeriodo,
	actualizarPeriodo,
	eliminarPeriodo,
	fetchEstadisticasPeriodo,
	activarPeriodo,
	cerrarPeriodo,
	isPeriodoActivo,
	getCodigoPeriodoActivo,
	fetchPeriodosPorAnio,
	fetchPeriodoProximo
} from '../services/periodosService.js';

/**
 * Hook personalizado para gestión de períodos académicos
 * Proporciona estado y funciones para trabajar con períodos
 * 
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoLoad - Cargar períodos automáticamente al montar (default: true)
 * @param {boolean} options.loadActivo - Cargar período activo automáticamente (default: true)
 * @returns {Object} Estado y funciones para períodos
 */
export const usePeriodos = (options = {}) => {
	const { autoLoad = true, loadActivo = true } = options;

	// Estados
	const [periodos, setPeriodos] = useState([]);
	const [periodoActivo, setPeriodoActivo] = useState(null);
	const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	/**
	 * Carga todos los períodos
	 */
	const cargarPeriodos = async (params = {}) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchPeriodos(params);
			setPeriodos(data.items || []);
			return { success: true, data: data.items || [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar períodos';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga el período activo
	 */
	const cargarPeriodoActivo = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchPeriodoActivo();
			setPeriodoActivo(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar período activo';
			setError(errorMsg);
			setPeriodoActivo(null);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga un período específico por código
	 */
	const cargarPeriodo = async (codPeriodo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchPeriodoById(codPeriodo);
			setPeriodoSeleccionado(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar período';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Crea un nuevo período
	 */
	const crear = async (periodoData) => {
		setLoading(true);
		setError(null);
		try {
			const data = await crearPeriodo(periodoData);
			await cargarPeriodos(); // Recargar lista
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al crear período';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Actualiza un período existente
	 */
	const actualizar = async (codPeriodo, periodoData) => {
		setLoading(true);
		setError(null);
		try {
			const data = await actualizarPeriodo(codPeriodo, periodoData);
			await cargarPeriodos(); // Recargar lista
			if (periodoActivo?.cod_periodo === codPeriodo) {
				await cargarPeriodoActivo(); // Actualizar período activo si corresponde
			}
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al actualizar período';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Elimina un período
	 */
	const eliminar = async (codPeriodo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await eliminarPeriodo(codPeriodo);
			await cargarPeriodos(); // Recargar lista
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al eliminar período';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Obtiene estadísticas de un período
	 */
	const obtenerEstadisticas = async (codPeriodo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchEstadisticasPeriodo(codPeriodo);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar estadísticas';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Activa un período
	 */
	const activar = async (codPeriodo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await activarPeriodo(codPeriodo);
			await cargarPeriodos(); // Recargar lista
			await cargarPeriodoActivo(); // Actualizar período activo
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al activar período';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Cierra un período
	 */
	const cerrar = async (codPeriodo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await cerrarPeriodo(codPeriodo);
			await cargarPeriodos(); // Recargar lista
			if (periodoActivo?.cod_periodo === codPeriodo) {
				setPeriodoActivo(null); // Limpiar período activo
			}
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cerrar período';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Verifica si un período está activo
	 */
	const verificarActivo = async (codPeriodo) => {
		try {
			const activo = await isPeriodoActivo(codPeriodo);
			return activo;
		} catch (err) {
			console.error('Error verificando período activo:', err);
			return false;
		}
	};

	/**
	 * Obtiene el código del período activo
	 */
	const obtenerCodigoActivo = async () => {
		try {
			const codigo = await getCodigoPeriodoActivo();
			return codigo;
		} catch (err) {
			console.error('Error obteniendo código período activo:', err);
			return null;
		}
	};

	/**
	 * Carga períodos de un año específico
	 */
	const cargarPorAnio = async (anio) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchPeriodosPorAnio(anio);
			setPeriodos(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar períodos del año';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Obtiene el período próximo
	 */
	const obtenerProximo = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchPeriodoProximo();
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar período próximo';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Refresca todos los datos
	 */
	const refrescar = async () => {
		await Promise.all([
			cargarPeriodos(),
			loadActivo && cargarPeriodoActivo()
		]);
	};

	// Cargar datos iniciales
	useEffect(() => {
		if (autoLoad) {
			cargarPeriodos();
		}
		if (loadActivo) {
			cargarPeriodoActivo();
		}
	}, [autoLoad, loadActivo]);

	return {
		// Estado
		periodos,
		periodoActivo,
		periodoSeleccionado,
		loading,
		error,

		// Funciones de carga
		cargarPeriodos,
		cargarPeriodoActivo,
		cargarPeriodo,
		cargarPorAnio,

		// Funciones CRUD
		crear,
		actualizar,
		eliminar,

		// Funciones de gestión
		activar,
		cerrar,
		obtenerEstadisticas,

		// Funciones auxiliares
		verificarActivo,
		obtenerCodigoActivo,
		obtenerProximo,
		refrescar,

		// Funciones de estado
		setPeriodoSeleccionado,
		setError,
	};
};

export default usePeriodos;
