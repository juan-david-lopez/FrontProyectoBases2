import { useState, useEffect } from 'react';
import {
	fetchGruposDocente,
	fetchDetalleGrupo,
	fetchEstudiantesGrupo,
	fetchHorarioGrupo
} from '../services/gruposService.js';

/**
 * Hook personalizado para gestión de grupos (vista docente)
 * Proporciona funcionalidades para consultar y gestionar grupos asignados
 * 
 * @param {string} codigoDocente - Código del docente (opcional)
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.autoLoad - Cargar grupos automáticamente (default: true)
 * @returns {Object} Estado y funciones para grupos
 */
export const useDocente = (codigoDocente = null, options = {}) => {
	const { autoLoad = true } = options;

	// Estados
	const [grupos, setGrupos] = useState([]);
	const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
	const [estudiantes, setEstudiantes] = useState([]);
	const [horario, setHorario] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	/**
	 * Carga los grupos asignados al docente
	 */
	const cargarGrupos = async (codigo = codigoDocente) => {
		if (!codigo) {
			setError('Código de docente requerido');
			return { success: false, error: 'Código de docente requerido' };
		}

		setLoading(true);
		setError(null);
		try {
			const data = await fetchGruposDocente(codigo);
			setGrupos(data.items || []);
			return { success: true, data: data.items || [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar grupos';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga el detalle de un grupo específico
	 */
	const cargarDetalleGrupo = async (codGrupo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchDetalleGrupo(codGrupo);
			setGrupoSeleccionado(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar detalle del grupo';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga los estudiantes matriculados en un grupo
	 */
	const cargarEstudiantes = async (codGrupo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchEstudiantesGrupo(codGrupo);
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
	 * Carga el horario de un grupo
	 */
	const cargarHorario = async (codGrupo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchHorarioGrupo(codGrupo);
			setHorario(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar horario';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Selecciona un grupo y carga su información completa
	 */
	const seleccionarGrupo = async (codGrupo) => {
		const resultado = await cargarDetalleGrupo(codGrupo);
		if (resultado.success) {
			await Promise.all([
				cargarEstudiantes(codGrupo),
				cargarHorario(codGrupo)
			]);
		}
		return resultado;
	};

	/**
	 * Filtra grupos por período
	 */
	const filtrarPorPeriodo = (codPeriodo) => {
		if (!codPeriodo) return grupos;
		return grupos.filter(g => g.cod_periodo === codPeriodo);
	};

	/**
	 * Filtra grupos por asignatura
	 */
	const filtrarPorAsignatura = (codAsignatura) => {
		if (!codAsignatura) return grupos;
		return grupos.filter(g => g.cod_asignatura === codAsignatura);
	};

	/**
	 * Obtiene estadísticas de los grupos
	 */
	const obtenerEstadisticas = () => {
		const totalGrupos = grupos.length;
		const totalEstudiantes = grupos.reduce((sum, g) => sum + (g.total_estudiantes || 0), 0);
		const promedioEstudiantes = totalGrupos > 0 ? (totalEstudiantes / totalGrupos).toFixed(1) : 0;

		return {
			totalGrupos,
			totalEstudiantes,
			promedioEstudiantes,
			gruposActivos: grupos.filter(g => g.estado === 'ACTIVO').length
		};
	};

	/**
	 * Refresca todos los datos
	 */
	const refrescar = async () => {
		if (codigoDocente) {
			await cargarGrupos();
		}
	};

	// Cargar datos iniciales
	useEffect(() => {
		if (autoLoad && codigoDocente) {
			cargarGrupos();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoLoad, codigoDocente]);

	return {
		// Estado
		grupos,
		grupoSeleccionado,
		estudiantes,
		horario,
		loading,
		error,

		// Funciones de carga
		cargarGrupos,
		cargarDetalleGrupo,
		cargarEstudiantes,
		cargarHorario,

		// Funciones auxiliares
		seleccionarGrupo,
		filtrarPorPeriodo,
		filtrarPorAsignatura,
		obtenerEstadisticas,
		refrescar,
		setError,
	};
};

export default useDocente;
