import { useState } from 'react';
import {
	registrarMatricula,
	agregarAsignatura,
	retirarAsignatura,
	fetchMatriculaActual,
	fetchHistorialMatriculas,
	fetchAsignaturasDisponibles,
	fetchGruposAsignatura,
	fetchMiHorario,
	fetchResumenMatricula
} from '../services/matriculasService.js';

/**
 * Hook personalizado para gestión de matrículas
 * Proporciona funcionalidades para el proceso de matrícula de estudiantes
 * 
 * @param {string} codigoEstudiante - Código del estudiante (opcional)
 * @returns {Object} Estado y funciones para matrículas
 */
export const useMatriculas = (codigoEstudiante = null) => {
	// Estados
	const [matriculaActual, setMatriculaActual] = useState(null);
	const [historial, setHistorial] = useState([]);
	const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
	const [gruposDisponibles, setGruposDisponibles] = useState([]);
	const [horario, setHorario] = useState(null);
	const [resumen, setResumen] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	/**
	 * Registra una nueva matrícula para el estudiante
	 */
	const registrar = async (codPeriodo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await registrarMatricula({
				cod_estudiante: codigoEstudiante,
				cod_periodo: codPeriodo
			});
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al registrar matrícula';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Agrega una asignatura a la matrícula actual
	 */
	const agregar = async (codGrupo) => {
		setLoading(true);
		setError(null);
		try {
			const data = await agregarAsignatura({
				cod_estudiante: codigoEstudiante,
				cod_grupo: codGrupo
			});
			
			// Actualizar matrícula actual
			if (codigoEstudiante) {
				await cargarMatriculaActual();
			}
			
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al agregar asignatura';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Retira una asignatura de la matrícula
	 */
	const retirar = async (codDetalleMatricula) => {
		setLoading(true);
		setError(null);
		try {
			const data = await retirarAsignatura(codDetalleMatricula);
			
			// Actualizar matrícula actual
			if (codigoEstudiante) {
				await cargarMatriculaActual();
			}
			
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al retirar asignatura';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga la matrícula actual del estudiante
	 */
	const cargarMatriculaActual = async () => {
		if (!codigoEstudiante) {
			setError('Código de estudiante requerido');
			return { success: false, error: 'Código de estudiante requerido' };
		}

		setLoading(true);
		setError(null);
		try {
			const data = await fetchMatriculaActual(codigoEstudiante);
			setMatriculaActual(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar matrícula actual';
			setError(errorMsg);
			setMatriculaActual(null);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga el historial de matrículas del estudiante
	 */
	const cargarHistorial = async () => {
		if (!codigoEstudiante) {
			setError('Código de estudiante requerido');
			return { success: false, error: 'Código de estudiante requerido' };
		}

		setLoading(true);
		setError(null);
		try {
			const data = await fetchHistorialMatriculas(codigoEstudiante);
			setHistorial(data.items || []);
			return { success: true, data: data.items || [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar historial';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga las asignaturas disponibles para matricular
	 */
	const cargarAsignaturasDisponibles = async () => {
		if (!codigoEstudiante) {
			setError('Código de estudiante requerido');
			return { success: false, error: 'Código de estudiante requerido' };
		}

		setLoading(true);
		setError(null);
		try {
			const data = await fetchAsignaturasDisponibles(codigoEstudiante);
			setAsignaturasDisponibles(Array.isArray(data) ? data : []);
			return { success: true, data: Array.isArray(data) ? data : [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar asignaturas disponibles';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga los grupos disponibles de una asignatura
	 */
	const cargarGrupos = async (codAsignatura) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchGruposAsignatura(codAsignatura);
			setGruposDisponibles(Array.isArray(data) ? data : []);
			return { success: true, data: Array.isArray(data) ? data : [] };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar grupos';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga el horario del estudiante
	 */
	const cargarHorario = async () => {
		if (!codigoEstudiante) {
			setError('Código de estudiante requerido');
			return { success: false, error: 'Código de estudiante requerido' };
		}

		setLoading(true);
		setError(null);
		try {
			const data = await fetchMiHorario(codigoEstudiante);
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
	 * Carga el resumen de la matrícula
	 */
	const cargarResumen = async () => {
		if (!codigoEstudiante) {
			setError('Código de estudiante requerido');
			return { success: false, error: 'Código de estudiante requerido' };
		}

		setLoading(true);
		setError(null);
		try {
			const data = await fetchResumenMatricula(codigoEstudiante);
			setResumen(data);
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar resumen';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Verifica si se puede agregar una asignatura (validaciones)
	 */
	const puedeAgregarAsignatura = () => {
		if (!matriculaActual) return false;
		if (!resumen) return true; // Si no hay resumen, permitir

		// Verificar límite de créditos según riesgo
		const creditosActuales = resumen.creditos_matriculados || 0;
		const limiteCreditos = resumen.creditos_permitidos || 20;

		return creditosActuales < limiteCreditos;
	};

	/**
	 * Refresca todos los datos de matrícula
	 */
	const refrescar = async () => {
		if (!codigoEstudiante) return;

		await Promise.all([
			cargarMatriculaActual(),
			cargarAsignaturasDisponibles(),
			cargarResumen()
		]);
	};

	return {
		// Estado
		matriculaActual,
		historial,
		asignaturasDisponibles,
		gruposDisponibles,
		horario,
		resumen,
		loading,
		error,

		// Funciones de matrícula
		registrar,
		agregar,
		retirar,

		// Funciones de carga
		cargarMatriculaActual,
		cargarHistorial,
		cargarAsignaturasDisponibles,
		cargarGrupos,
		cargarHorario,
		cargarResumen,

		// Funciones auxiliares
		puedeAgregarAsignatura,
		refrescar,
		setError,
	};
};

export default useMatriculas;
