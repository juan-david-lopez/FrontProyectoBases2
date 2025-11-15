import React, { useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { Calendar, BookOpen, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';

export default function DashboardCoordinador() {
	const [estadisticas] = useState({
		asignaturasActivas: 45,
		gruposCreados: 120,
		docentesAsignados: 38,
		horariosConfigurados: 85
	});

	const items = [
		{ to: '/coordinador/dashboard', label: 'Dashboard' },
		{ to: '/coordinador/asignaturas', label: 'Asignaturas' },
		{ to: '/coordinador/grupos', label: 'Grupos' },
		{ to: '/coordinador/horarios', label: 'Horarios' },
		{ to: '/coordinador/reportes', label: 'Reportes' },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Coordinación Académica</h1>
						<p className="mt-1 text-gray-600">Gestión de programación y control académico</p>
					</div>

					{/* Stats Cards */}
					<div className="grid gap-6 md:grid-cols-4">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Asignaturas</p>
									<p className="mt-2 text-3xl font-bold text-blue-600">
										{estadisticas.asignaturasActivas}
									</p>
								</div>
								<div className="rounded-full bg-blue-100 p-3">
									<BookOpen className="h-8 w-8 text-blue-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">Activas este periodo</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Grupos</p>
									<p className="mt-2 text-3xl font-bold text-green-600">
										{estadisticas.gruposCreados}
									</p>
								</div>
								<div className="rounded-full bg-green-100 p-3">
									<Users className="h-8 w-8 text-green-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">Grupos configurados</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Docentes</p>
									<p className="mt-2 text-3xl font-bold text-purple-600">
										{estadisticas.docentesAsignados}
									</p>
								</div>
								<div className="rounded-full bg-purple-100 p-3">
									<Users className="h-8 w-8 text-purple-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">Con asignación</p>
						</div>

						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Horarios</p>
									<p className="mt-2 text-3xl font-bold text-orange-600">
										{estadisticas.horariosConfigurados}%
									</p>
								</div>
								<div className="rounded-full bg-orange-100 p-3">
									<Clock className="h-8 w-8 text-orange-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">Configuración completa</p>
						</div>
					</div>

					{/* Acciones Rápidas */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
						<div className="grid gap-4 md:grid-cols-3">
							<button className="flex items-center gap-3 rounded-lg border-2 border-blue-200 bg-blue-50 p-4 text-left transition hover:border-blue-400">
								<Calendar className="h-8 w-8 text-blue-600" />
								<div>
									<p className="font-semibold text-gray-900">Crear Grupo</p>
									<p className="text-sm text-gray-600">Nuevo grupo académico</p>
								</div>
							</button>

							<button className="flex items-center gap-3 rounded-lg border-2 border-green-200 bg-green-50 p-4 text-left transition hover:border-green-400">
								<Clock className="h-8 w-8 text-green-600" />
								<div>
									<p className="font-semibold text-gray-900">Asignar Horario</p>
									<p className="text-sm text-gray-600">Configurar horarios</p>
								</div>
							</button>

							<button className="flex items-center gap-3 rounded-lg border-2 border-purple-200 bg-purple-50 p-4 text-left transition hover:border-purple-400">
								<Users className="h-8 w-8 text-purple-600" />
								<div>
									<p className="font-semibold text-gray-900">Asignar Docente</p>
									<p className="text-sm text-gray-600">Asignar a grupos</p>
								</div>
							</button>
						</div>
					</div>

					{/* Alertas */}
					<div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6">
						<div className="flex items-start gap-3">
							<AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
							<div>
								<h3 className="font-semibold text-yellow-900">Grupos Pendientes de Asignación</h3>
								<p className="mt-1 text-sm text-yellow-800">
									Hay 8 grupos sin docente asignado para el próximo periodo académico.
								</p>
							</div>
						</div>
					</div>

					{/* Resumen Grupos */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Grupos Recientes</h2>
						<div className="space-y-3">
							{[
								{ codigo: 'IS301-01', asignatura: 'Base de Datos', docente: 'Dr. García', estudiantes: 35 },
								{ codigo: 'IS201-02', asignatura: 'Programación OO', docente: 'Dra. Martínez', estudiantes: 40 },
								{ codigo: 'MT101-01', asignatura: 'Cálculo I', docente: 'Dr. López', estudiantes: 45 },
							].map((grupo) => (
								<div key={grupo.codigo} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
									<div>
										<p className="font-semibold text-gray-900">{grupo.codigo}</p>
										<p className="text-sm text-gray-600">{grupo.asignatura}</p>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-gray-900">{grupo.docente}</p>
										<p className="text-sm text-gray-600">{grupo.estudiantes} estudiantes</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
