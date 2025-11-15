import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { fetchHistorial } from '../../services/estudiantesService.js';
import { fetchRiesgoEstudiante } from '../../services/riesgoService.js';
import { fetchMatriculaActual } from '../../services/matriculasService.js';
import { BookOpen, TrendingUp, AlertTriangle, Award, Calendar, Target } from 'lucide-react';

export default function DashboardEstudiante() {
	const { user } = useAuth();
	const [historial, setHistorial] = useState(null);
	const [riesgo, setRiesgo] = useState(null);
	const [matriculaActual, setMatriculaActual] = useState(null);
	const [loading, setLoading] = useState(true);

	const items = [
		{ to: '/estudiante/dashboard', label: 'Dashboard' },
		{ to: '/estudiante/matricula', label: 'Matrícula' },
		{ to: '/estudiante/notas', label: 'Notas' },
		{ to: '/estudiante/riesgo', label: 'Riesgo Académico' },
		{ to: '/estudiante/perfil', label: 'Mi Perfil' },
	];

	useEffect(() => {
		cargarDatos();
	}, [user]);

	const cargarDatos = async () => {
		try {
			setLoading(true);
			const codigoEstudiante = user?.cod_referencia || user?.cod_estudiante;
			
			const [historialData, riesgoData, matriculaData] = await Promise.all([
				fetchHistorial(codigoEstudiante).catch(() => null),
				fetchRiesgoEstudiante(codigoEstudiante).catch(() => null),
				fetchMatriculaActual(codigoEstudiante).catch(() => null)
			]);

			setHistorial(historialData);
			setRiesgo(riesgoData);
			setMatriculaActual(matriculaData);
		} catch (error) {
			console.error('Error al cargar datos del dashboard:', error);
		} finally {
			setLoading(false);
		}
	};

	const getRiesgoColor = (nivel) => {
		const colores = {
			0: 'bg-green-100 text-green-800 border-green-200',
			1: 'bg-red-100 text-red-800 border-red-200',
			2: 'bg-orange-100 text-orange-800 border-orange-200',
			3: 'bg-red-200 text-red-900 border-red-300',
			4: 'bg-yellow-100 text-yellow-800 border-yellow-200'
		};
		return colores[nivel] || 'bg-gray-100 text-gray-800 border-gray-200';
	};

	const getRiesgoIcono = (nivel) => {
		if (nivel === 0) return '✅';
		if (nivel === 1 || nivel === 3) return '🔴';
		if (nivel === 2) return '🟠';
		return '🟡';
	};

	if (loading) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="mx-auto flex max-w-7xl gap-6 p-4">
					<Sidebar items={items} />
					<main className="flex-1">
						<div className="animate-pulse space-y-6">
							<div className="h-8 w-64 rounded bg-gray-200"></div>
							<div className="grid gap-6 md:grid-cols-3">
								<div className="h-32 rounded-lg bg-gray-200"></div>
								<div className="h-32 rounded-lg bg-gray-200"></div>
								<div className="h-32 rounded-lg bg-gray-200"></div>
							</div>
							<div className="h-64 rounded-lg bg-gray-200"></div>
						</div>
					</main>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							¡Hola, {user?.nombre_completo || user?.username}! 👋
						</h1>
						<p className="mt-1 text-gray-600">Aquí está tu resumen académico</p>
					</div>

					{/* Cards de Resumen */}
					<div className="grid gap-6 md:grid-cols-3">
						{/* Promedio Acumulado */}
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Promedio Acumulado</p>
									<p className="mt-2 text-3xl font-bold text-blue-600">
										{historial?.resumen?.promedio_acumulado?.toFixed(2) || 'N/A'}
									</p>
								</div>
								<div className="rounded-full bg-blue-100 p-3">
									<TrendingUp className="h-8 w-8 text-blue-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">
								De {historial?.resumen?.total_creditos_cursados || 0} créditos cursados
							</p>
						</div>

						{/* Créditos Aprobados */}
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Créditos Aprobados</p>
									<p className="mt-2 text-3xl font-bold text-green-600">
										{historial?.resumen?.creditos_aprobados || 0}
									</p>
								</div>
								<div className="rounded-full bg-green-100 p-3">
									<Award className="h-8 w-8 text-green-600" />
								</div>
							</div>
							<p className="mt-4 text-sm text-gray-500">
								{((historial?.resumen?.creditos_aprobados / (historial?.programa?.total_creditos || 1)) * 100).toFixed(1)}% del programa
							</p>
						</div>

						{/* Riesgo Académico */}
						<div className={`rounded-lg border-2 p-6 shadow-sm ${getRiesgoColor(riesgo?.nivel_riesgo)}`}>
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Riesgo Académico</p>
									<p className="mt-2 text-3xl font-bold">
										{getRiesgoIcono(riesgo?.nivel_riesgo)} Nivel {riesgo?.nivel_riesgo || 0}
									</p>
								</div>
								<div className="rounded-full bg-white bg-opacity-50 p-3">
									<AlertTriangle className="h-8 w-8" />
								</div>
							</div>
							<p className="mt-4 text-sm">
								{riesgo?.descripcion || 'Sin restricciones'}
							</p>
						</div>
					</div>

					{/* Matrícula Actual */}
					{matriculaActual && (
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="mb-4 flex items-center gap-2">
								<Calendar className="h-6 w-6 text-purple-600" />
								<h2 className="text-xl font-semibold text-gray-900">Matrícula Actual</h2>
							</div>

							<div className="mb-4 flex items-center justify-between rounded-lg bg-purple-50 p-4">
								<div>
									<p className="text-sm text-purple-600">Período Académico</p>
									<p className="text-lg font-semibold text-purple-900">
										{matriculaActual.periodo?.nombre || 'No definido'}
									</p>
								</div>
								<div className="text-right">
									<p className="text-sm text-purple-600">Créditos Matriculados</p>
									<p className="text-2xl font-bold text-purple-900">
										{matriculaActual.total_creditos || 0}
									</p>
								</div>
							</div>

							<div className="space-y-2">
								{matriculaActual.asignaturas?.map((asignatura) => (
									<div key={asignatura.codigo} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
										<div className="flex items-center gap-3">
											<div className="rounded bg-blue-100 p-2">
												<BookOpen className="h-5 w-5 text-blue-600" />
											</div>
											<div>
												<p className="font-medium text-gray-900">{asignatura.nombre}</p>
												<p className="text-sm text-gray-600">
													{asignatura.codigo} • Grupo {asignatura.grupo}
												</p>
											</div>
										</div>
										<div className="text-right">
											<span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
												{asignatura.creditos} créditos
											</span>
										</div>
									</div>
								))}
							</div>

							{!matriculaActual.asignaturas || matriculaActual.asignaturas.length === 0 && (
								<p className="py-8 text-center text-gray-500">No hay asignaturas matriculadas</p>
							)}
						</div>
					)}

					{/* Progreso Académico */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="mb-4 flex items-center gap-2">
							<Target className="h-6 w-6 text-indigo-600" />
							<h2 className="text-xl font-semibold text-gray-900">Progreso del Programa</h2>
						</div>

						<div className="space-y-4">
							<div>
								<div className="mb-2 flex items-center justify-between text-sm">
									<span className="font-medium text-gray-700">Créditos Completados</span>
									<span className="font-semibold text-indigo-600">
										{historial?.resumen?.creditos_aprobados || 0} / {historial?.programa?.total_creditos || 0}
									</span>
								</div>
								<div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
									<div
										className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
										style={{
											width: `${((historial?.resumen?.creditos_aprobados / (historial?.programa?.total_creditos || 1)) * 100)}%`
										}}
									></div>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-3">
								<div className="rounded-lg bg-gray-50 p-4">
									<p className="text-sm text-gray-600">Asignaturas Aprobadas</p>
									<p className="mt-1 text-2xl font-bold text-gray-900">
										{historial?.asignaturas?.filter(a => a.estado === 'APROBADA').length || 0}
									</p>
								</div>
								<div className="rounded-lg bg-gray-50 p-4">
									<p className="text-sm text-gray-600">Asignaturas Reprobadas</p>
									<p className="mt-1 text-2xl font-bold text-gray-900">
										{historial?.asignaturas?.filter(a => a.estado === 'REPROBADA').length || 0}
									</p>
								</div>
								<div className="rounded-lg bg-gray-50 p-4">
									<p className="text-sm text-gray-600">En Curso</p>
									<p className="mt-1 text-2xl font-bold text-gray-900">
										{matriculaActual?.asignaturas?.length || 0}
									</p>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

