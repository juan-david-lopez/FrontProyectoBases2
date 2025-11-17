import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function TendenciasPage() {
	const tendencias = [
		{ metrica: 'Matrícula', actual: 2847, anterior: 2720, cambio: 4.7 },
		{ metrica: 'Deserción', actual: 6.2, anterior: 7.5, cambio: -17.3 },
		{ metrica: 'Promedio', actual: 3.7, anterior: 3.65, cambio: 1.4 },
	];

	const getTrendIcon = (cambio) => {
		if (cambio > 0) return <TrendingUp className="h-5 w-5 text-green-600" />;
		if (cambio < 0) return <TrendingDown className="h-5 w-5 text-red-600" />;
		return <Minus className="h-5 w-5 text-gray-600" />;
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('analista')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Análisis de Tendencias</h1>
						<p className="mt-1 text-gray-600">Evolución de indicadores académicos</p>
					</div>

					<div className="space-y-4">
						{tendencias.map((t, i) => (
							<div key={i} className="rounded-lg bg-white p-6 shadow-sm">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										{getTrendIcon(t.cambio)}
										<div>
											<h3 className="font-semibold text-gray-900">{t.metrica}</h3>
											<p className="text-2xl font-bold text-gray-900 mt-1">{t.actual}</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm text-gray-600">Periodo anterior: {t.anterior}</p>
										<p className={`text-lg font-bold ${t.cambio > 0 ? 'text-green-600' : t.cambio < 0 ? 'text-red-600' : 'text-gray-600'}`}>
											{t.cambio > 0 ? '+' : ''}{t.cambio.toFixed(1)}%
										</p>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Proyecciones 2025</h2>
						<div className="grid gap-4 md:grid-cols-3">
							<div className="p-4 border-l-4 border-blue-600 bg-blue-50">
								<p className="text-sm text-gray-600">Matrícula Esperada</p>
								<p className="text-2xl font-bold text-blue-600 mt-1">2,980</p>
								<p className="text-xs text-gray-500 mt-1">+4.7% vs. 2024</p>
							</div>
							<div className="p-4 border-l-4 border-green-600 bg-green-50">
								<p className="text-sm text-gray-600">Tasa de Retención</p>
								<p className="text-2xl font-bold text-green-600 mt-1">95%</p>
								<p className="text-xs text-gray-500 mt-1">+1% vs. 2024</p>
							</div>
							<div className="p-4 border-l-4 border-purple-600 bg-purple-50">
								<p className="text-sm text-gray-600">Promedio Proyectado</p>
								<p className="text-2xl font-bold text-purple-600 mt-1">3.75</p>
								<p className="text-xs text-gray-500 mt-1">+1.4% vs. 2024</p>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
