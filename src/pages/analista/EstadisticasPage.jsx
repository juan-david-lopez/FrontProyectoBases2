import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { PieChart, BarChart2, Activity } from 'lucide-react';

export default function EstadisticasPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('analista')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Estadísticas Generales</h1>
						<p className="mt-1 text-gray-600">Análisis cuantitativo institucional</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center gap-2 mb-4">
								<PieChart className="h-6 w-6 text-blue-600" />
								<h2 className="text-lg font-semibold">Distribución por Programas</h2>
							</div>
							<div className="space-y-3">
								{['Ingeniería de Sistemas', 'Ingeniería Civil', 'Administración'].map((prog, i) => (
									<div key={i}>
										<div className="flex justify-between text-sm mb-1">
											<span>{prog}</span>
											<span className="font-semibold">{[42, 35, 23][i]}%</span>
										</div>
										<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
											<div 
												className="h-full bg-blue-600 rounded-full"
												style={{ width: `${[42, 35, 23][i]}%` }}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center gap-2 mb-4">
								<BarChart2 className="h-6 w-6 text-green-600" />
								<h2 className="text-lg font-semibold">Rendimiento por Semestre</h2>
							</div>
							<div className="space-y-3">
								{[1, 2, 3, 4].map((sem) => (
									<div key={sem} className="flex items-center gap-3">
										<span className="w-20 text-sm font-medium">Semestre {sem}</span>
										<div className="flex-1 h-8 bg-gray-200 rounded-lg overflow-hidden">
											<div 
												className="h-full bg-green-600 flex items-center justify-end px-2 text-white text-sm font-semibold"
												style={{ width: `${[85, 78, 82, 90][sem-1]}%` }}
											>
												{[85, 78, 82, 90][sem-1]}%
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm md:col-span-2">
							<div className="flex items-center gap-2 mb-4">
								<Activity className="h-6 w-6 text-purple-600" />
								<h2 className="text-lg font-semibold">Resumen Académico 2024-2</h2>
							</div>
							<div className="grid gap-4 md:grid-cols-4">
								<div className="text-center p-4 bg-blue-50 rounded-lg">
									<p className="text-3xl font-bold text-blue-600">2,847</p>
									<p className="text-sm text-gray-600 mt-1">Estudiantes Activos</p>
								</div>
								<div className="text-center p-4 bg-green-50 rounded-lg">
									<p className="text-3xl font-bold text-green-600">3.7</p>
									<p className="text-sm text-gray-600 mt-1">Promedio General</p>
								</div>
								<div className="text-center p-4 bg-purple-50 rounded-lg">
									<p className="text-3xl font-bold text-purple-600">94%</p>
									<p className="text-sm text-gray-600 mt-1">Tasa de Aprobación</p>
								</div>
								<div className="text-center p-4 bg-orange-50 rounded-lg">
									<p className="text-3xl font-bold text-orange-600">6%</p>
									<p className="text-sm text-gray-600 mt-1">Deserción</p>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
