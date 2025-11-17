import React from 'react';
import { usePeriodos } from '../hooks/usePeriodos.js';

/**
 * Componente que muestra información del período académico activo
 * Útil para mostrar en dashboards y headers
 */
export default function PeriodoActivoInfo({ showVentanas = true, className = '' }) {
	const { periodoActivo, loading, error } = usePeriodos({ autoLoad: false });

	if (loading) {
		return (
			<div className={`periodo-activo-info loading ${className}`}>
				<span className="spinner"></span>
				<span>Cargando período...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className={`periodo-activo-info error ${className}`}>
				<span className="icon">⚠️</span>
				<span>Error al cargar período</span>
			</div>
		);
	}

	if (!periodoActivo) {
		return (
			<div className={`periodo-activo-info sin-periodo ${className}`}>
				<span className="icon">📅</span>
				<span>No hay período activo</span>
			</div>
		);
	}

	return (
		<div className={`periodo-activo-info ${className}`}>
			<div className="periodo-header">
				<span className="icon">📚</span>
				<div className="periodo-detalles">
					<h3 className="periodo-nombre">{periodoActivo.nombre_periodo}</h3>
					<p className="periodo-codigo">Código: {periodoActivo.cod_periodo}</p>
				</div>
				<span className="badge-activo">ACTIVO</span>
			</div>

			{showVentanas && periodoActivo.ventanas_activas && periodoActivo.ventanas_activas.length > 0 && (
				<div className="ventanas-activas">
					<h4>Ventanas Activas:</h4>
					<ul className="ventanas-list">
						{periodoActivo.ventanas_activas.map((ventana, idx) => (
							<li key={idx} className="ventana-item">
								<span className="ventana-tipo">{ventana.tipo}</span>
								<span className="ventana-nombre">{ventana.nombre}</span>
								{ventana.dias_restantes !== undefined && (
									<span className="ventana-dias">
										{ventana.dias_restantes} {ventana.dias_restantes === 1 ? 'día' : 'días'} restantes
									</span>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
