import { useState } from 'react';
import {
	fetchAlertasEstudiante,
	fetchTodasAlertas,
	marcarAlertaComoLeida
} from '../services/alertasService.js';

/**
 * Hook personalizado para gestión de alertas
 * Proporciona funcionalidades para consultar y gestionar alertas del sistema
 * 
 * @param {string} codigoEstudiante - Código del estudiante (opcional, para alertas específicas)
 * @returns {Object} Estado y funciones para alertas
 */
export const useAlertas = (codigoEstudiante = null) => {
	// Estados
	const [alertas, setAlertas] = useState([]);
	const [alertaSeleccionada, setAlertaSeleccionada] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [conteoNoLeidas, setConteoNoLeidas] = useState(0);

	/**
	 * Carga las alertas de un estudiante específico
	 */
	const cargarAlertasEstudiante = async (codigo = codigoEstudiante) => {
		if (!codigo) {
			setError('Código de estudiante requerido');
			return { success: false, error: 'Código de estudiante requerido' };
		}

		setLoading(true);
		setError(null);
		try {
			const data = await fetchAlertasEstudiante(codigo);
			const items = data.items || [];
			setAlertas(items);
			actualizarConteoNoLeidas(items);
			return { success: true, data: items };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar alertas';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Carga todas las alertas del sistema (vista administrador)
	 */
	const cargarTodasAlertas = async (filtros = {}) => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchTodasAlertas(filtros);
			const items = data.items || [];
			setAlertas(items);
			return { success: true, data: items };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al cargar alertas';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Marca una alerta como leída
	 */
	const marcarComoLeida = async (codAlerta) => {
		setLoading(true);
		setError(null);
		try {
			const data = await marcarAlertaComoLeida(codAlerta);
			
			// Actualizar estado local
			setAlertas(prev =>
				prev.map(alerta =>
					alerta.cod_alerta === codAlerta
						? { ...alerta, fecha_lectura: new Date().toISOString(), leida: true }
						: alerta
				)
			);
			
			actualizarConteoNoLeidas(alertas);
			
			return { success: true, data };
		} catch (err) {
			const errorMsg = err.response?.data?.error || 'Error al marcar alerta como leída';
			setError(errorMsg);
			return { success: false, error: errorMsg };
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Actualiza el conteo de alertas no leídas
	 */
	const actualizarConteoNoLeidas = (listaAlertas) => {
		const noLeidas = listaAlertas.filter(a => !a.fecha_lectura && !a.leida).length;
		setConteoNoLeidas(noLeidas);
	};

	/**
	 * Filtra alertas por tipo
	 */
	const filtrarPorTipo = (tipo) => {
		if (!tipo) return alertas;
		return alertas.filter(a => a.tipo_alerta === tipo || a.tipo === tipo);
	};

	/**
	 * Filtra alertas por prioridad
	 */
	const filtrarPorPrioridad = (prioridad) => {
		if (!prioridad) return alertas;
		return alertas.filter(a => a.prioridad === prioridad);
	};

	/**
	 * Obtiene solo las alertas no leídas
	 */
	const obtenerNoLeidas = () => {
		return alertas.filter(a => !a.fecha_lectura && !a.leida);
	};

	/**
	 * Obtiene solo las alertas leídas
	 */
	const obtenerLeidas = () => {
		return alertas.filter(a => a.fecha_lectura || a.leida);
	};

	/**
	 * Obtiene alertas críticas (prioridad alta)
	 */
	const obtenerCriticas = () => {
		return alertas.filter(a => 
			a.prioridad === 'ALTA' || 
			a.prioridad === 'CRÍTICA' ||
			a.prioridad === 'CRITICA'
		);
	};

	/**
	 * Marca todas las alertas como leídas
	 */
	const marcarTodasComoLeidas = async () => {
		const noLeidas = obtenerNoLeidas();
		const resultados = await Promise.allSettled(
			noLeidas.map(alerta => marcarComoLeida(alerta.cod_alerta))
		);
		
		const exitosas = resultados.filter(r => r.status === 'fulfilled').length;
		return {
			success: exitosas === noLeidas.length,
			total: noLeidas.length,
			exitosas
		};
	};

	/**
	 * Agrupa alertas por tipo
	 */
	const agruparPorTipo = () => {
		return alertas.reduce((grupos, alerta) => {
			const tipo = alerta.tipo_alerta || alerta.tipo || 'SIN_TIPO';
			if (!grupos[tipo]) {
				grupos[tipo] = [];
			}
			grupos[tipo].push(alerta);
			return grupos;
		}, {});
	};

	/**
	 * Obtiene estadísticas de las alertas
	 */
	const obtenerEstadisticas = () => {
		return {
			total: alertas.length,
			noLeidas: conteoNoLeidas,
			leidas: alertas.length - conteoNoLeidas,
			criticas: obtenerCriticas().length,
			porTipo: agruparPorTipo()
		};
	};

	/**
	 * Refresca las alertas
	 */
	const refrescar = async () => {
		if (codigoEstudiante) {
			return await cargarAlertasEstudiante();
		}
		return { success: false, error: 'No hay contexto para refrescar' };
	};

	return {
		// Estado
		alertas,
		alertaSeleccionada,
		loading,
		error,
		conteoNoLeidas,

		// Funciones de carga
		cargarAlertasEstudiante,
		cargarTodasAlertas,

		// Funciones de actualización
		marcarComoLeida,
		marcarTodasComoLeidas,

		// Funciones de filtrado
		filtrarPorTipo,
		filtrarPorPrioridad,
		obtenerNoLeidas,
		obtenerLeidas,
		obtenerCriticas,

		// Funciones de análisis
		agruparPorTipo,
		obtenerEstadisticas,

		// Funciones auxiliares
		refrescar,
		setAlertaSeleccionada,
		setError,
	};
};

export default useAlertas;
