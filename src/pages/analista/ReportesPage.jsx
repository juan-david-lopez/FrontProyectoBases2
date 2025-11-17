import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function ReportesAnalistaPage() {
	const [reportes] = useState([
		{ id: 1, nombre: 'Deserción Estudiantil', periodo: '2024-2', generado: '2025-01-10', registros: 234 },
		{ id: 2, nombre: 'Rendimiento Académico', periodo: '2024-2', generado: '2025-01-09', registros: 1450 },
	]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('analista')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Reportes Analíticos</h1>
						<p className="mt-1 text-gray-600">Generación de informes estratégicos</p>
					</div>

					<div className="grid gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm opacity-90">Estudiantes</p>
									<p className="mt-1 text-3xl font-bold">2,847</p>
								</div>
								<Users className="h-12 w-12 opacity-80" />
							</div>
						</div>
						<div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm opacity-90">Asignaturas</p>
									<p className="mt-1 text-3xl font-bold">124</p>
								</div>
								<BookOpen className="h-12 w-12 opacity-80" />
							</div>
						</div>
						<div className="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white shadow-lg">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm opacity-90">Promedio</p>
									<p className="mt-1 text-3xl font-bold">3.7</p>
								</div>
								<BarChart3 className="h-12 w-12 opacity-80" />
							</div>
						</div>
						<div className="rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm opacity-90">Retención</p>
									<p className="mt-1 text-3xl font-bold">94%</p>
								</div>
								<TrendingUp className="h-12 w-12 opacity-80" />
							</div>
						</div>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Reportes Generados</h2>
						<div className="space-y-3">
							{reportes.map((rep) => (
								<div key={rep.id} className="flex items-center justify-between border-b pb-3">
									<div>
										<h3 className="font-semibold text-gray-900">{rep.nombre}</h3>
										<p className="text-sm text-gray-600">
											Periodo: {rep.periodo} • {rep.registros} registros • {rep.generado}
										</p>
									</div>
									<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
										Ver Reporte
									</button>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
