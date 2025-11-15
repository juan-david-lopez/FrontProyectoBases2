import React, { useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { FileText, UserPlus, RefreshCw, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DashboardRegistro() {
	const [estadisticas] = useState({
		matriculasHoy: 45,
		reinscripciones: 120,
		expedientesPendientes: 15,
		procesosActivos: 8
	});

	const items = [
		{ to: '/registro/dashboard', label: 'Dashboard' },
		{ to: '/registro/matriculas', label: 'Matrículas' },
		{ to: '/registro/reinscripciones', label: 'Reinscripciones' },
		{ to: '/registro/expedientes', label: 'Expedientes' },
		{ to: '/registro/validaciones', label: 'Validaciones' },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Registro Académico</h1>
						<p className="mt-1 text-gray-600">Gestión de matrículas y expedientes académicos</p>
					</div>

					{/* Stats Cards */}
					<div className="grid gap-6 md:grid-cols-4">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Matrículas Hoy</p>
									<p className="mt-2 text-3xl font-bold text-blue-600">
										{estadisticas.matriculasHoy}
									</p>
								</div>
								<div className="rounded-full bg-blue-100 p-3">
									<UserPlus className="h-8 w-8 text-blue-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-green-600 flex items-center gap-1">
								<TrendingUp className="h-4 w-4" />
								+12% vs ayer
							</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Reinscripciones</p>
									<p className="mt-2 text-3xl font-bold text-green-600">
										{estadisticas.reinscripciones}
									</p>
								</div>
								<div className="rounded-full bg-green-100 p-3">
									<RefreshCw className="h-8 w-8 text-green-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">Este periodo</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Expedientes</p>
									<p className="mt-2 text-3xl font-bold text-orange-600">
										{estadisticas.expedientesPendientes}
									</p>
								</div>
								<div className="rounded-full bg-orange-100 p-3">
									<FileText className="h-8 w-8 text-orange-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">Pendientes revisión</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Procesos</p>
									<p className="mt-2 text-3xl font-bold text-purple-600">
										{estadisticas.procesosActivos}
									</p>
								</div>
								<div className="rounded-full bg-purple-100 p-3">
									<Clock className="h-8 w-8 text-purple-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">En curso</p>
						</div>
					</div>

					{/* Procesos Pendientes */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Procesos Pendientes</h2>
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
								<div className="flex items-center gap-3">
									<AlertTriangle className="h-6 w-6 text-yellow-600" />
									<div>
										<p className="font-semibold text-gray-900">Validación de Documentos</p>
										<p className="text-sm text-gray-600">15 estudiantes requieren validación</p>
									</div>
								</div>
								<button className="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700">
									Revisar
								</button>
							</div>

							<div className="flex items-center justify-between rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
								<div className="flex items-center gap-3">
									<Clock className="h-6 w-6 text-blue-600" />
									<div>
										<p className="font-semibold text-gray-900">Matrículas en Proceso</p>
										<p className="text-sm text-gray-600">23 matrículas esperando confirmación</p>
									</div>
								</div>
								<button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
									Ver
								</button>
							</div>

							<div className="flex items-center justify-between rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
								<div className="flex items-center gap-3">
									<CheckCircle className="h-6 w-6 text-green-600" />
									<div>
										<p className="font-semibold text-gray-900">Expedientes Actualizados</p>
										<p className="text-sm text-gray-600">120 expedientes procesados hoy</p>
									</div>
								</div>
								<button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
									Ver Detalles
								</button>
							</div>
						</div>
					</div>

					{/* Acciones Rápidas */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
						<div className="grid gap-4 md:grid-cols-3">
							<button className="flex items-center gap-3 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-left transition hover:border-blue-400">
								<UserPlus className="h-8 w-8 text-blue-600" />
								<div>
									<p className="font-semibold text-gray-900">Nueva Matrícula</p>
									<p className="text-sm text-gray-600">Registrar estudiante</p>
								</div>
							</button>

							<button className="flex items-center gap-3 rounded-lg border-2 border-green-200 bg-green-50 p-4 text-left transition hover:border-green-400">
								<RefreshCw className="h-8 w-8 text-green-600" />
								<div>
									<p className="font-semibold text-gray-900">Reinscripción</p>
									<p className="text-sm text-gray-600">Proceso de renovación</p>
								</div>
							</button>

							<button className="flex items-center gap-3 rounded-lg border-2 border-purple-200 bg-purple-50 p-4 text-left transition hover:border-purple-400">
								<FileText className="h-8 w-8 text-purple-600" />
								<div>
									<p className="font-semibold text-gray-900">Actualizar Expediente</p>
									<p className="text-sm text-gray-600">Modificar información</p>
								</div>
							</button>
						</div>
					</div>

					{/* Últimas Matrículas */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Últimas Matrículas Procesadas</h2>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">Código</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">Estudiante</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">Programa</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">Créditos</th>
										<th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-700">Estado</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{[
										{ codigo: '202500123', nombre: 'Ana García', programa: 'Ingeniería Sistemas', creditos: 18, estado: 'Aprobada' },
										{ codigo: '202500124', nombre: 'Carlos López', programa: 'Medicina', creditos: 20, estado: 'Aprobada' },
										{ codigo: '202500125', nombre: 'María Ruiz', programa: 'Derecho', creditos: 16, estado: 'En Revisión' },
									].map((matricula) => (
										<tr key={matricula.codigo} className="hover:bg-gray-50">
											<td className="px-4 py-3 text-sm font-medium text-gray-900">{matricula.codigo}</td>
											<td className="px-4 py-3 text-sm text-gray-700">{matricula.nombre}</td>
											<td className="px-4 py-3 text-sm text-gray-700">{matricula.programa}</td>
											<td className="px-4 py-3 text-sm text-gray-700">{matricula.creditos}</td>
											<td className="px-4 py-3">
												<span className={`rounded-full px-3 py-1 text-xs font-semibold ${
													matricula.estado === 'Aprobada' 
														? 'bg-green-100 text-green-800' 
														: 'bg-yellow-100 text-yellow-800'
												}`}>
													{matricula.estado}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
