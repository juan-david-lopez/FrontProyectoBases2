import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { 
	fetchHistorialMatriculas,
	fetchMatriculaActual,
	retirarAsignatura 
} from '../../services/matriculasService.js';
import { 
	BookOpen, 
	Calendar, 
	Award, 
	CheckCircle, 
	XCircle,
	AlertCircle,
	Trash2,
	Clock,
	User,
	CreditCard
} from 'lucide-react';

export default function HistorialMatriculaPage() {
	const { user } = useAuth();
	const [historial, setHistorial] = useState([]);
	const [matriculaActual, setMatriculaActual] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [showRetiroModal, setShowRetiroModal] = useState(false);
	const [asignaturaRetiro, setAsignaturaRetiro] = useState(null);

	const items = [
		{ to: '/estudiante/dashboard', label: 'Resumen' },
		{ to: '/estudiante/matricula', label: 'Matrícula' },
		{ to: '/estudiante/historial-matricula', label: 'Historial' },
		{ to: '/estudiante/notas', label: 'Notas' },
		{ to: '/estudiante/riesgo', label: 'Riesgo' },
		{ to: '/estudiante/perfil', label: 'Perfil' },
	];

	useEffect(() => {
		cargarDatos();
	}, [user]);

	const cargarDatos = async () => {
		if (!user?.codigo) return;
		
		setLoading(true);
		try {
			const periodo = '2025-1';
			const [historialData, actualData] = await Promise.all([
				fetchHistorialMatriculas(user.codigo),
				fetchMatriculaActual(user.codigo, periodo).catch(() => null)
			]);
			
			setHistorial(historialData || []);
			setMatriculaActual(actualData);
			setError(null);
		} catch (err) {
			setError('Error al cargar el historial de matrículas');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleRetiroAsignatura = async () => {
		if (!asignaturaRetiro) return;

		setLoading(true);
		setShowRetiroModal(false);

		try {
			await retirarAsignatura({ cod_detalle_matricula: asignaturaRetiro.cod_detalle_matricula });
			setSuccess('Asignatura retirada exitosamente');
			await cargarDatos();
			setTimeout(() => setSuccess(null), 3000);
		} catch (err) {
			setError(err.response?.data?.detalle || 'Error al retirar asignatura');
			console.error(err);
		} finally {
			setLoading(false);
			setAsignaturaRetiro(null);
		}
	};

	const getEstadoColor = (estado) => {
		if (estado === 'ACTIVA') return 'bg-green-100 text-green-800';
		if (estado === 'CANCELADA') return 'bg-red-100 text-red-800';
		if (estado === 'RETIRADA') return 'bg-orange-100 text-orange-800';
		return 'bg-gray-100 text-gray-800';
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Historial de Matrículas</h1>
						<p className="mt-1 text-gray-600">Consulta tus matrículas anteriores y gestiona la actual</p>
					</div>

					{/* Alertas */}
					{error && (
						<div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 flex items-start gap-3">
							<XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
							<p className="text-red-700">{error}</p>
						</div>
					)}

					{success && (
						<div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4 flex items-start gap-3">
							<CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
							<p className="text-green-700">{success}</p>
						</div>
					)}

					{/* Matrícula Actual */}
					{matriculaActual && (
						<div className="rounded-lg bg-white shadow-sm border-2 border-blue-200">
							<div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
								<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
									<Calendar className="h-5 w-5 text-blue-600" />
									Matrícula Actual - Periodo {matriculaActual.periodo}
								</h2>
							</div>
							<div className="p-6">
								<div className="grid gap-4 md:grid-cols-3 mb-6">
									<div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
										<div className="rounded-full bg-blue-100 p-2">
											<CreditCard className="h-5 w-5 text-blue-600" />
										</div>
										<div>
											<p className="text-sm text-gray-600">Créditos Inscritos</p>
											<p className="text-2xl font-bold text-gray-900">{matriculaActual.total_creditos}</p>
										</div>
									</div>
									<div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
										<div className="rounded-full bg-green-100 p-2">
											<BookOpen className="h-5 w-5 text-green-600" />
										</div>
										<div>
											<p className="text-sm text-gray-600">Asignaturas</p>
											<p className="text-2xl font-bold text-gray-900">{matriculaActual.asignaturas?.length || 0}</p>
										</div>
									</div>
									<div className="flex items-center gap-3 rounded-lg bg-purple-50 p-4">
										<div className="rounded-full bg-purple-100 p-2">
											<CheckCircle className="h-5 w-5 text-purple-600" />
										</div>
										<div>
											<p className="text-sm text-gray-600">Estado</p>
											<p className="text-lg font-semibold text-green-600">
												{matriculaActual.estado || 'ACTIVA'}
											</p>
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<h3 className="font-semibold text-gray-900 mb-3">Asignaturas Inscritas</h3>
									{matriculaActual.asignaturas?.map((asig) => (
										<div key={asig.cod_detalle_matricula} className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
											<div className="flex items-start justify-between">
												<div className="flex items-start gap-3 flex-1">
													<div className="rounded-full bg-blue-100 p-2 mt-1">
														<BookOpen className="h-5 w-5 text-blue-600" />
													</div>
													<div className="flex-1">
														<h4 className="font-semibold text-gray-900 mb-2">
															{asig.cod_asignatura} - {asig.nombre_asignatura}
														</h4>
														<div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
															<div className="flex items-center gap-2">
																<Award className="h-4 w-4" />
																<span>{asig.creditos} créditos</span>
															</div>
															<div className="flex items-center gap-2">
																<User className="h-4 w-4" />
																<span>{asig.docente}</span>
															</div>
															<div className="flex items-center gap-2">
																<Clock className="h-4 w-4" />
																<span>{asig.horario}</span>
															</div>
															<div className="flex items-center gap-2">
																<Calendar className="h-4 w-4" />
																<span>Grupo {asig.cod_grupo}</span>
															</div>
														</div>
														{asig.intento > 1 && (
															<div className="mt-2 flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-2 border border-yellow-200">
																<AlertCircle className="h-4 w-4 text-yellow-600" />
																<span className="text-sm text-yellow-800">
																	Intento #{asig.intento} de {asig.intentos_permitidos}
																</span>
															</div>
														)}
													</div>
												</div>
												<button
													onClick={() => {
														setAsignaturaRetiro(asig);
														setShowRetiroModal(true);
													}}
													className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200 transition"
													title="Retirar asignatura"
												>
													<Trash2 className="h-5 w-5" />
												</button>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Historial de Periodos Anteriores */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
							<Calendar className="h-5 w-5 text-gray-600" />
							Periodos Anteriores
						</h2>

						{loading ? (
							<div className="flex items-center justify-center py-12">
								<div className="text-center">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
									<p className="mt-4 text-gray-600">Cargando historial...</p>
								</div>
							</div>
						) : historial.length === 0 ? (
							<div className="text-center py-12">
								<Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-600">No hay historial de matrículas</p>
							</div>
						) : (
							<div className="space-y-4">
								{historial.map((periodo) => (
									<div key={periodo.cod_matricula} className="rounded-lg border border-gray-200 p-4">
										<div className="flex items-center justify-between mb-3">
											<div>
												<h3 className="text-lg font-semibold text-gray-900">
													Periodo {periodo.periodo}
												</h3>
												<p className="text-sm text-gray-600">
													Fecha: {new Date(periodo.fecha_matricula).toLocaleDateString('es-ES')}
												</p>
											</div>
											<span className={`rounded-full px-4 py-1 text-sm font-semibold ${getEstadoColor(periodo.estado)}`}>
												{periodo.estado}
											</span>
										</div>

										<div className="grid gap-3 md:grid-cols-2 mb-3">
											<div className="text-sm">
												<span className="text-gray-600">Total Créditos:</span>
												<span className="ml-2 font-semibold text-gray-900">{periodo.total_creditos}</span>
											</div>
											<div className="text-sm">
												<span className="text-gray-600">Asignaturas:</span>
												<span className="ml-2 font-semibold text-gray-900">{periodo.asignaturas?.length || 0}</span>
											</div>
										</div>

										<details className="mt-3">
											<summary className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700">
												Ver asignaturas inscritas
											</summary>
											<div className="mt-3 space-y-2 pl-4">
												{periodo.asignaturas?.map((asig, idx) => (
													<div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
														<div className="flex items-center gap-2">
															<BookOpen className="h-4 w-4 text-gray-600" />
															<span className="text-sm text-gray-900">
																{asig.cod_asignatura} - {asig.nombre_asignatura}
															</span>
														</div>
														<span className="text-sm text-gray-600">{asig.creditos} créditos</span>
													</div>
												))}
											</div>
										</details>
									</div>
								))}
							</div>
						)}
					</div>
				</main>
			</div>

			{/* Modal de Confirmación de Retiro */}
			{showRetiroModal && asignaturaRetiro && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-md w-full p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="rounded-full bg-red-100 p-3">
								<AlertCircle className="h-6 w-6 text-red-600" />
							</div>
							<h2 className="text-xl font-bold text-gray-900">Confirmar Retiro</h2>
						</div>
						
						<div className="mb-6">
							<p className="text-gray-700 mb-4">
								¿Estás seguro de que deseas retirar esta asignatura?
							</p>
							<div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
								<p className="font-semibold text-gray-900">
									{asignaturaRetiro.cod_asignatura} - {asignaturaRetiro.nombre_asignatura}
								</p>
								<p className="text-sm text-gray-600 mt-1">
									{asignaturaRetiro.creditos} créditos
								</p>
							</div>
							<div className="mt-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
								<p className="text-sm text-yellow-800">
									<strong>Advertencia:</strong> Esta acción solo está permitida dentro de las fechas establecidas 
									por el calendario académico y puede tener restricciones según tu historial.
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<button
								onClick={() => {
									setShowRetiroModal(false);
									setAsignaturaRetiro(null);
								}}
								className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50"
							>
								Cancelar
							</button>
							<button
								onClick={handleRetiroAsignatura}
								disabled={loading}
								className="flex-1 rounded-lg bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
							>
								{loading ? 'Procesando...' : 'Confirmar Retiro'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
