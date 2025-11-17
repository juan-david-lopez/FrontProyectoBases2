import { useState, useEffect } from 'react';
import {
	fetchProgramas,
	fetchProgramaById,
	createPrograma,
	updatePrograma,
	deletePrograma,
	fetchEstudiantesPorPrograma,
	fetchAsignaturasPorPrograma
} from '../services/programasService.js';

/**
 * Hook personalizado para gestión de programas académicos
 * Proporciona funcionalidades para administrar programas y sus asignaturas
 * 
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoLoad - Cargar programas automáticamente (default: true)
 * @returns {Object} Estado y funciones para programas
 */
export const useProgramas = (options = {}) => {
	const { autoLoad = true } = options;

	// Estados
	const [programas, setProgramas] = useState([]);
	const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
	const [estudiantes, setEstudiantes] = useState([]);
	const [asignaturas, setAsignaturas] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	/**
	 * Carga la lista de programas académicos
	 */
	const cargarProgramas = async (filtros = {}) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchProgramas(filtros);
			setProgramas(data.items || []);
			return { success: true, data: data.items || [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar programas';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga un programa específico por código
	 */
	const cargarPrograma = async (codigo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchProgramaById(codigo);
			setProgramaSeleccionado(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar programa';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga los estudiantes de un programa
	 */
	const cargarEstudiantes = async (codPrograma) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchEstudiantesPorPrograma(codPrograma);
			setEstudiantes(data.items || []);
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
	 * Carga las asignaturas de un programa
	 */
	const cargarAsignaturas = async (codPrograma) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchAsignaturasPorPrograma(codPrograma);
			setAsignaturas(data.items || []);
			return { success: true, data: data.items || [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar asignaturas';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Crea un nuevo programa académico
	 */
	const crear = async (programaData) => {
		setLoading(true);
		setError(null);
		try {
			const data = await createPrograma(programaData);
			await cargarProgramas(); // Recargar lista
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al crear programa';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Actualiza un programa existente
	 */
	const actualizar = async (codigo, programaData) => {
		setLoading(true);
		setError(null);
		try {
			const data = await updatePrograma(codigo, programaData);
			await cargarProgramas(); // Recargar lista
			if (programaSeleccionado?.cod_programa === codigo) {
				await cargarPrograma(codigo); // Actualizar programa seleccionado
			}
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al actualizar programa';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Elimina un programa
	 */
	const eliminar = async (codigo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await deletePrograma(codigo);
			await cargarProgramas(); // Recargar lista
			if (programaSeleccionado?.cod_programa === codigo) {
				setProgramaSeleccionado(null);
			}
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al eliminar programa';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Selecciona un programa y carga su información completa
	 */
	const seleccionarPrograma = async (codigo) => {
		const resultado = await cargarPrograma(codigo);
		if (resultado.success) {
			await Promise.all([
				cargarEstudiantes(codigo),
				cargarAsignaturas(codigo)
			]);
		}
		return resultado;
	};

	/**
	 * Busca programas por nombre
	 */
	const buscar = async (termino) => {
		return await cargarProgramas({ search: termino });
	};

	/**
	 * Filtra programas por facultad
	 */
	const filtrarPorFacultad = async (facultad) => {
		return await cargarProgramas({ facultad });
	};

	/**
	 * Filtra programas activos
	 */
	const obtenerActivos = () => {
		return programas.filter(p => p.estado === 'ACTIVO' || p.activo === true);
	};

	/**
	 * Filtra programas inactivos
	 */
	const obtenerInactivos = () => {
		return programas.filter(p => p.estado === 'INACTIVO' || p.activo === false);
	};

	/**
	 * Obtiene estadísticas de los programas
	 */
	const obtenerEstadisticas = () => {
		const totalProgramas = programas.length;
		const activos = obtenerActivos().length;
		const inactivos = obtenerInactivos().length;

		const porFacultad = programas.reduce((acc, p) => {
			const facultad = p.facultad || 'SIN_FACULTAD';
			acc[facultad] = (acc[facultad] || 0) + 1;
			return acc;
		}, {});

		return {
			total: totalProgramas,
			activos,
			inactivos,
			porFacultad
		};
	};

	/**
	 * Agrupa programas por facultad
	 */
	const agruparPorFacultad = () => {
		return programas.reduce((grupos, programa) => {
			const facultad = programa.facultad || 'SIN_FACULTAD';
			if (!grupos[facultad]) {
				grupos[facultad] = [];
			}
			grupos[facultad].push(programa);
			return grupos;
		}, {});
	};

	/**
	 * Refresca todos los datos
	 */
	const refrescar = async () => {
		await cargarProgramas();
	};

	// Cargar datos iniciales
	useEffect(() => {
		if (autoLoad) {
			cargarProgramas();
		}
	}, [autoLoad]);

	return {
		// Estado
		programas,
		programaSeleccionado,
		estudiantes,
		asignaturas,
		loading,
		error,

		// Funciones de carga
		cargarProgramas,
		cargarPrograma,
		cargarEstudiantes,
		cargarAsignaturas,

		// Funciones CRUD
		crear,
		actualizar,
		eliminar,

		// Funciones de selección
		seleccionarPrograma,

		// Funciones de búsqueda/filtrado
		buscar,
		filtrarPorFacultad,
		obtenerActivos,
		obtenerInactivos,

		// Funciones de análisis
		obtenerEstadisticas,
		agruparPorFacultad,

		// Funciones auxiliares
		refrescar,
		setProgramaSeleccionado,
		setError,
	};
};

export default useProgramas;
