import React, { useEffect, useState } from 'react';
import { fetchVentanaActiva } from '../services/alertasService.js';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

export default function VentanaBanner({ tipo }) {
	const [ventana, setVentana] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function cargarVentana() {
			try {
				const data = await fetchVentanaActiva(tipo);
				setVentana(data.items?.[0] || null);
			} catch (error) {
				console.error(`Error cargando ventana ${tipo}:`, error);
			} finally {
				setLoading(false);
			}
		}
		cargarVentana();
	}, [tipo]);

	if (loading) {
		return null;
	}

	if (!ventana || ventana.activa !== 'SÍ') {
		return (
			<div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 mb-4">
				<div className="flex items-start gap-3">
					<AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
					<div>
						<p className="font-semibold text-yellow-800">
							Ventana de {tipo.toLowerCase()} cerrada
						</p>
						<p className="text-sm text-yellow-700 mt-1">
							{ventana?.mensaje || `La ventana de ${tipo.toLowerCase()} no está activa en este momento.`}
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4 mb-4">
			<div className="flex items-start gap-3">
				<CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
				<div className="flex-1">
					<p className="font-semibold text-blue-800">{ventana.mensaje}</p>
					{ventana.dias_restantes !== undefined && (
						<div className="flex items-center gap-2 mt-2 text-sm text-blue-700">
							<Clock className="h-4 w-4" />
							<span>
								Tiempo restante: {ventana.dias_restantes} días ({ventana.horas_restantes} horas)
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
