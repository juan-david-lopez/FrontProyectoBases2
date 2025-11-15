import React, { useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { BarChart3, TrendingUp, Users, BookOpen, Award, AlertCircle } from 'lucide-react';

export default function DashboardAnalista() {
	const [metricas] = useState({
		tasaRetencion: 87.5,
		promedioGeneral: 3.8,
		estudiantesActivos: 2840,
		tasaAprobacion: 82.3
	});

	const items = [
		{ to: '/analista/dashboard', label: 'Dashboard' },
		{ to: '/analista/reportes', label: 'Reportes' },
		{ to: '/analista/estadisticas', label: 'Estadísticas' },
		{ to: '/analista/tendencias', label: 'Tendencias' },
		{ to: '/analista/exportar', label: 'Exportar Datos' },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Panel de Análisis</h1>
						<p className="mt-1 text-gray-600">Estadísticas institucionales y reportes anonimizados</p>
					</div>

					{/* KPIs Principales */}
					<div className="grid gap-6 md:grid-cols-4">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Tasa de Retención</p>
									<p className="mt-2 text-3xl font-bold text-green-600">
										{metricas.tasaRetencion}%
									</p>
								</div>
								<div className="rounded-full bg-green-100 p-3">
									<Users className="h-8 w-8 text-green-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-green-600 flex items-center gap-1">
								<TrendingUp className="h-4 w-4" />
								+2.3% vs semestre anterior
							</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Promedio General</p>
									<p className="mt-2 text-3xl font-bold text-blue-600">
										{metricas.promedioGeneral}
									</p>
								</div>
								<div className="rounded-full bg-blue-100 p-3">
									<Award className="h-8 w-8 text-blue-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">De 5.0 posibles</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Estudiantes</p>
									<p className="mt-2 text-3xl font-bold text-purple-600">
										{metricas.estudiantesActivos.toLocaleString()}
									</p>
								</div>
								<div className="rounded-full bg-purple-100 p-3">
									<BookOpen className="h-8 w-8 text-purple-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">Activos este semestre</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Tasa Aprobación</p>
									<p className="mt-2 text-3xl font-bold text-orange-600">
										{metricas.tasaAprobacion}%
									</p>
								</div>
								<div className="rounded-full bg-orange-100 p-3">
									<BarChart3 className="h-8 w-8 text-orange-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-orange-600 flex items-center gap-1">
								<TrendingUp className="h-4 w-4" />
								+1.5% vs periodo anterior
							</p>
						</div>
					</div>

					{/* Alertas Institucionales */}
					<div className="rounded-lg bg-yellow-50 border-l-4 border-yellow-500 p-6">
						<div className="flex items-start gap-3">
							<AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
							<div className="flex-1">
								<h3 className="font-semibold text-gray-900">Indicadores que Requieren Atención</h3>
								<ul className="mt-2 space-y-1 text-sm text-gray-700">
									<li>• Tasa de deserción en Ingeniería Civil aumentó 3.2%</li>
									<li>• 15% de asignaturas con promedio inferior a 3.0</li>
									<li>• Correlación negativa detectada entre créditos cursados y rendimiento</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Distribución por Programas */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Rendimiento por Programa (Top 5)</h2>
						<div className="space-y-4">
							{[
								{ programa: 'Medicina', promedio: 4.2, estudiantes: 450, color: 'bg-green-500' },
								{ programa: 'Ingeniería Sistemas', promedio: 3.9, estudiantes: 580, color: 'bg-blue-500' },
								{ programa: 'Derecho', promedio: 3.7, estudiantes: 420, color: 'bg-purple-500' },
								{ programa: 'Administración', promedio: 3.5, estudiantes: 520, color: 'bg-yellow-500' },
								{ programa: 'Contaduría', promedio: 3.4, estudiantes: 380, color: 'bg-orange-500' },
							].map((prog) => (
								<div key={prog.programa} className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span className="font-medium text-gray-900">{prog.programa}</span>
										<div className="flex items-center gap-4">
											<span className="text-gray-600">{prog.estudiantes} estudiantes</span>
											<span className="font-semibold text-gray-900">Promedio: {prog.promedio}</span>
										</div>
									</div>
									<div className="h-3 rounded-full bg-gray-200">
										<div 
											className={`h-3 rounded-full ${prog.color}`}
											style={{ width: `${(prog.promedio / 5) * 100}%` }}
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Tendencias Semestrales */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Tendencias Académicas</h2>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="rounded-lg border border-gray-200 p-4">
								<div className="flex items-center gap-2 mb-3">
									<TrendingUp className="h-5 w-5 text-green-600" />
									<h3 className="font-semibold text-gray-900">Indicadores Positivos</h3>
								</div>
								<ul className="space-y-2 text-sm text-gray-700">
									<li className="flex items-start gap-2">
										<span className="text-green-600">✓</span>
										<span>Aumento del 8% en créditos aprobados por estudiante</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-green-600">✓</span>
										<span>Reducción del 12% en estudiantes en riesgo académico</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-green-600">✓</span>
										<span>Mejora del 5% en asistencia promedio</span>
									</li>
								</ul>
							</div>

							<div className="rounded-lg border border-gray-200 p-4">
								<div className="flex items-center gap-2 mb-3">
									<AlertCircle className="h-5 w-5 text-orange-600" />
									<h3 className="font-semibold text-gray-900">Áreas de Mejora</h3>
								</div>
								<ul className="space-y-2 text-sm text-gray-700">
									<li className="flex items-start gap-2">
										<span className="text-orange-600">!</span>
										<span>Incremento del 4% en cancelaciones de asignaturas</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-orange-600">!</span>
										<span>Disminución del 3% en satisfacción estudiantil</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-orange-600">!</span>
										<span>Aumento de 2.5% en tiempo promedio de graduación</span>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Acceso Rápido a Reportes */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Reportes Disponibles</h2>
						<div className="grid gap-3 md:grid-cols-3">
							<button className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-left transition hover:border-blue-400">
								<BarChart3 className="h-6 w-6 text-blue-600 mb-2" />
								<p className="font-semibold text-gray-900">Rendimiento Académico</p>
								<p className="text-xs text-gray-600 mt-1">Análisis por programa y periodo</p>
							</button>

							<button className="rounded-lg border-2 border-green-200 bg-green-50 p-4 text-left transition hover:border-green-400">
								<Users className="h-6 w-6 text-green-600 mb-2" />
								<p className="font-semibold text-gray-900">Deserción y Retención</p>
								<p className="text-xs text-gray-600 mt-1">Tasas institucionales</p>
							</button>

							<button className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4 text-left transition hover:border-purple-400">
								<Award className="h-6 w-6 text-purple-600 mb-2" />
								<p className="font-semibold text-gray-900">Graduación y Titulación</p>
								<p className="text-xs text-gray-600 mt-1">Eficiencia terminal</p>
							</button>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
