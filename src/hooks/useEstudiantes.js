import { useState, useEffect } from 'react';
import {
	fetchEstudiantes,
	fetchEstudianteById,
	createEstudiante,
	updateEstudiante,
	deleteEstudiante,
	fetchHistorialAcademico
} from '../services/estudiantesService.js';

/**
 * Hook personalizado para gestión de estudiantes
 * Proporciona estado y funciones para trabajar con estudiantes
 * 
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoLoad - Cargar estudiantes automáticamente al montar (default: true)
 * @param {number} options.limit - Límite de resultados por página (default: 25)
 * @returns {Object} Estado y funciones para estudiantes
 */
export const useEstudiantes = (options = {}) => {
	const { autoLoad = true, limit = 25 } = options;

	// Estados
	const [estudiantes, setEstudiantes] = useState([]);
	const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
	const [historial, setHistorial] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({
		offset: 0,
		limit,
		hasMore: false,
		count: 0
	});

	/**
	 * Carga la lista de estudiantes con paginación
	 */
	const cargarEstudiantes = async (params = {}) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchEstudiantes({
				limit: pagination.limit,
				offset: pagination.offset,
				...params
			});
			
			setEstudiantes(data.items || []);
			setPagination(prev => ({
				...prev,
				hasMore: data.hasMore || false,
				count: data.count || 0
			}));
			
			return { success: true, data: data.items || [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar estudiantes';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga un estudiante específico por código
	 */
	const cargarEstudiante = async (codigo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchEstudianteById(codigo);
			setEstudianteSeleccionado(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar estudiante';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga el historial académico de un estudiante
	 */
	const cargarHistorial = async (codigo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchHistorialAcademico(codigo);
			setHistorial(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar historial';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Crea un nuevo estudiante
	 */
	const crear = async (estudianteData) => {
		setLoading(true);
		setError(null);
		try {
			const data = await createEstudiante(estudianteData);
			await cargarEstudiantes(); // Recargar lista
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al crear estudiante';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Actualiza un estudiante existente
	 */
	const actualizar = async (codigo, estudianteData) => {
		setLoading(true);
		setError(null);
		try {
			const data = await updateEstudiante(codigo, estudianteData);
			await cargarEstudiantes(); // Recargar lista
			if (estudianteSeleccionado?.cod_estudiante === codigo) {
				await cargarEstudiante(codigo); // Actualizar estudiante seleccionado
			}
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al actualizar estudiante';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Elimina un estudiante
	 */
	const eliminar = async (codigo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await deleteEstudiante(codigo);
			await cargarEstudiantes(); // Recargar lista
			if (estudianteSeleccionado?.cod_estudiante === codigo) {
				setEstudianteSeleccionado(null);
			}
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al eliminar estudiante';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Busca estudiantes por criterio
	 */
	const buscar = async (criterio) => {
		return await cargarEstudiantes({ search: criterio });
	};

	/**
	 * Filtra estudiantes por programa
	 */
	const filtrarPorPrograma = async (codPrograma) => {
		return await cargarEstudiantes({ cod_programa: codPrograma });
	};

	/**
	 * Filtra estudiantes por estado
	 */
	const filtrarPorEstado = async (estado) => {
		return await cargarEstudiantes({ estado });
	};

	/**
	 * Navega a la página siguiente
	 */
	const paginaSiguiente = async () => {
		if (!pagination.hasMore) return;
		
		setPagination(prev => ({
			...prev,
			offset: prev.offset + prev.limit
		}));
		
		await cargarEstudiantes();
	};

	/**
	 * Navega a la página anterior
	 */
	const paginaAnterior = async () => {
		if (pagination.offset === 0) return;
		
		setPagination(prev => ({
			...prev,
			offset: Math.max(0, prev.offset - prev.limit)
		}));
		
		await cargarEstudiantes();
	};

	/**
	 * Reinicia la paginación
	 */
	const reiniciarPaginacion = () => {
		setPagination(prev => ({
			...prev,
			offset: 0
		}));
	};

	/**
	 * Refresca todos los datos
	 */
	const refrescar = async () => {
		reiniciarPaginacion();
		await cargarEstudiantes();
	};

	// Cargar datos iniciales
	useEffect(() => {
		if (autoLoad) {
			cargarEstudiantes();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoLoad, pagination.offset, pagination.limit]);

	return {
		// Estado
		estudiantes,
		estudianteSeleccionado,
		historial,
		loading,
		error,
		pagination,

		// Funciones de carga
		cargarEstudiantes,
		cargarEstudiante,
		cargarHistorial,

		// Funciones CRUD
		crear,
		actualizar,
		eliminar,

		// Funciones de búsqueda/filtrado
		buscar,
		filtrarPorPrograma,
		filtrarPorEstado,

		// Funciones de paginación
		paginaSiguiente,
		paginaAnterior,
		reiniciarPaginacion,

		// Funciones auxiliares
		refrescar,
		setEstudianteSeleccionado,
		setError,
	};
};

export default useEstudiantes;
