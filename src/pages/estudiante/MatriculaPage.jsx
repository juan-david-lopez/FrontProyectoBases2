import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { 
	fetchAsignaturasDisponibles, 
	registrarMatricula,
	fetchMatriculaActual 
} from '../../services/matriculasService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { 
	BookOpen, 
	Clock, 
	MapPin, 
	Users, 
	AlertCircle, 
	CheckCircle, 
	XCircle,
	Search,
	Filter,
	ShoppingCart,
	CreditCard,
	Calendar,
	User,
	Award
} from 'lucide-react';

export default function MatriculaPage() {
	const { user } = useAuth();
	const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
	const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);
	const [creditosDisponibles, setCreditosDisponibles] = useState(0);
	const [creditosSeleccionados, setCreditosSeleccionados] = useState(0);
	const [nivelRiesgo, setNivelRiesgo] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterSede, setFilterSede] = useState('all');
	const [matriculaActual, setMatriculaActual] = useState(null);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const items = [
		{ to: '/estudiante/dashboard', label: 'Resumen' },
		{ to: '/estudiante/matricula', label: 'Matrícula' },
		{ to: '/estudiante/notas', label: 'Notas' },
		{ to: '/estudiante/riesgo', label: 'Riesgo' },
		{ to: '/estudiante/perfil', label: 'Perfil' },
	];

	useEffect(() => {
		cargarAsignaturasDisponibles();
		cargarMatriculaActual();
	}, [user]);

	const cargarAsignaturasDisponibles = async () => {
		if (!user?.codigo) return;
		
		setLoading(true);
		try {
			const response = await fetchAsignaturasDisponibles(user.codigo);
			setAsignaturasDisponibles(response.items || []);
			setCreditosDisponibles(response.creditos_disponibles || 0);
			setNivelRiesgo(response.nivel_riesgo || 0);
			setError(null);
		} catch (err) {
			setError('Error al cargar asignaturas disponibles');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const cargarMatriculaActual = async () => {
		if (!user?.codigo) return;
		
		try {
			const periodo = '2025-1'; // Deberías obtener esto del calendario académico
			const response = await fetchMatriculaActual(user.codigo, periodo);
			setMatriculaActual(response);
		} catch (err) {
			console.log('No hay matrícula actual');
		}
	};

	const toggleAsignatura = (asignatura) => {
		const yaSeleccionada = asignaturasSeleccionadas.find(
			a => a.cod_grupo === asignatura.cod_grupo
		);

		if (yaSeleccionada) {
			setAsignaturasSeleccionadas(prev => 
				prev.filter(a => a.cod_grupo !== asignatura.cod_grupo)
			);
			setCreditosSeleccionados(prev => prev - asignatura.creditos);
		} else {
			// Validar límite de créditos
			if (creditosSeleccionados + asignatura.creditos > creditosDisponibles) {
				setError(`No puedes exceder el límite de ${creditosDisponibles} créditos`);
				setTimeout(() => setError(null), 3000);
				return;
			}

			setAsignaturasSeleccionadas(prev => [...prev, asignatura]);
			setCreditosSeleccionados(prev => prev + asignatura.creditos);
		}
	};

	const confirmarMatricula = async () => {
		if (asignaturasSeleccionadas.length === 0) {
			setError('Debes seleccionar al menos una asignatura');
			return;
		}

		setLoading(true);
		setShowConfirmModal(false);

		try {
			const payload = {
				codigoEstudiante: user.codigo,
				cod_periodo: '2025-1',
				asignaturas: asignaturasSeleccionadas.map(a => ({ cod_grupo: a.cod_grupo }))
			};

			const response = await registrarMatricula(payload);
			setSuccess(`¡Matrícula registrada exitosamente! ${response.creditos_registrados} créditos inscritos`);
			setAsignaturasSeleccionadas([]);
			setCreditosSeleccionados(0);
			
			// Recargar datos
			await cargarAsignaturasDisponibles();
			await cargarMatriculaActual();
			
			setTimeout(() => setSuccess(null), 5000);
		} catch (err) {
			setError(err.response?.data?.error || 'Error al registrar matrícula');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// Filtros
	const asignaturasFiltradas = asignaturasDisponibles.filter(asig => {
		const matchSearch = asig.nombre_asignatura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			asig.cod_asignatura?.toLowerCase().includes(searchTerm.toLowerCase());
		const matchSede = filterSede === 'all' || asig.sede === filterSede;
		return matchSearch && matchSede;
	});

	const sedes = [...new Set(asignaturasDisponibles.map(a => a.sede))];

	const getRiesgoColor = (nivel) => {
		if (nivel === 0) return 'bg-green-100 text-green-800';
		if (nivel === 1 || nivel === 3) return 'bg-red-100 text-red-800';
		if (nivel === 2) return 'bg-orange-100 text-orange-800';
		return 'bg-yellow-100 text-yellow-800';
	};

	const getRiesgoTexto = (nivel) => {
		if (nivel === 0) return 'Sin Riesgo';
		if (nivel === 1) return 'Riesgo Alto';
		if (nivel === 2) return 'Riesgo Medio';
		if (nivel === 3) return 'Riesgo Crítico';
		return 'Bajo Rendimiento';
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					{/* Header */}
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Matrícula de Asignaturas</h1>
						<p className="mt-1 text-gray-600">Periodo Académico 2025-1</p>
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

					{/* Panel de Información */}
					<div className="grid gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-white p-4 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-blue-100 p-3">
									<CreditCard className="h-6 w-6 text-blue-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Créditos Disponibles</p>
									<p className="text-2xl font-bold text-gray-900">{creditosDisponibles}</p>
								</div>
							</div>
						</div>

						<div className="rounded-lg bg-white p-4 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-purple-100 p-3">
									<ShoppingCart className="h-6 w-6 text-purple-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Créditos Seleccionados</p>
									<p className="text-2xl font-bold text-gray-900">{creditosSeleccionados}</p>
								</div>
							</div>
						</div>

						<div className="rounded-lg bg-white p-4 shadow-sm">
							<div className="flex items-center gap-3">
								<div className="rounded-full bg-green-100 p-3">
									<BookOpen className="h-6 w-6 text-green-600" />
								</div>
								<div>
									<p className="text-sm text-gray-600">Asignaturas</p>
									<p className="text-2xl font-bold text-gray-900">{asignaturasSeleccionadas.length}</p>
								</div>
							</div>
						</div>

						<div className="rounded-lg bg-white p-4 shadow-sm">
							<div className="flex items-center gap-3">
								<div className={`rounded-full p-3 ${getRiesgoColor(nivelRiesgo).replace('text-', 'bg-').replace('800', '100')}`}>
									<AlertCircle className={`h-6 w-6 ${getRiesgoColor(nivelRiesgo).replace('bg-', 'text-').replace('100', '600')}`} />
								</div>
								<div>
									<p className="text-sm text-gray-600">Estado</p>
									<p className={`text-sm font-semibold ${getRiesgoColor(nivelRiesgo).replace('bg-', 'text-')}`}>
										{getRiesgoTexto(nivelRiesgo)}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Carrito de Selección */}
					{asignaturasSeleccionadas.length > 0 && (
						<div className="rounded-lg bg-white p-6 shadow-sm border-2 border-blue-200">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
									<ShoppingCart className="h-5 w-5 text-blue-600" />
									Asignaturas Seleccionadas ({asignaturasSeleccionadas.length})
								</h2>
								<button
									onClick={() => setShowConfirmModal(true)}
									disabled={loading}
									className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
								>
									<CheckCircle className="h-5 w-5" />
									Confirmar Matrícula
								</button>
							</div>
							<div className="space-y-2">
								{asignaturasSeleccionadas.map((asig) => (
									<div key={asig.cod_grupo} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-blue-50">
										<div className="flex items-center gap-3">
											<BookOpen className="h-5 w-5 text-blue-600" />
											<div>
												<p className="font-semibold text-gray-900">{asig.cod_asignatura} - {asig.nombre_asignatura}</p>
												<p className="text-sm text-gray-600">
													{asig.creditos} créditos • {asig.horario} • {asig.docente}
												</p>
											</div>
										</div>
										<button
											onClick={() => toggleAsignatura(asig)}
											className="rounded-lg bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
										>
											Quitar
										</button>
									</div>
								))}
							</div>
							<div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
								<p className="text-lg font-semibold text-gray-900">
									Total: {creditosSeleccionados} / {creditosDisponibles} créditos
								</p>
								<div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
									<div 
										className={`h-full ${creditosSeleccionados > creditosDisponibles ? 'bg-red-600' : 'bg-blue-600'}`}
										style={{ width: `${Math.min((creditosSeleccionados / creditosDisponibles) * 100, 100)}%` }}
									/>
								</div>
							</div>
						</div>
					)}

					{/* Filtros y Búsqueda */}
					<div className="rounded-lg bg-white p-4 shadow-sm">
						<div className="flex flex-wrap gap-4">
							<div className="flex-1 min-w-[300px]">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										type="text"
										placeholder="Buscar por código o nombre de asignatura..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
									/>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Filter className="h-5 w-5 text-gray-400" />
								<select
									value={filterSede}
									onChange={(e) => setFilterSede(e.target.value)}
									className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
								>
									<option value="all">Todas las Sedes</option>
									{sedes.map(sede => (
										<option key={sede} value={sede}>{sede}</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Lista de Asignaturas Disponibles */}
					<div className="space-y-4">
						<h2 className="text-xl font-semibold text-gray-900">
							Asignaturas Disponibles ({asignaturasFiltradas.length})
						</h2>

						{loading ? (
							<div className="flex items-center justify-center py-12">
								<div className="text-center">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
									<p className="mt-4 text-gray-600">Cargando asignaturas...</p>
								</div>
							</div>
						) : asignaturasFiltradas.length === 0 ? (
							<div className="rounded-lg bg-white p-12 shadow-sm text-center">
								<BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
								<p className="text-gray-600">No hay asignaturas disponibles con los filtros seleccionados</p>
							</div>
						) : (
							<div className="grid gap-4">
								{asignaturasFiltradas.map((asig) => {
									const yaSeleccionada = asignaturasSeleccionadas.find(
										a => a.cod_grupo === asig.cod_grupo
									);
									const sinCupo = asig.cupo_disponible <= 0;
									const prerequisitosNoOk = asig.tiene_prerrequisitos && !asig.prerrequisitos_cumplidos;

									return (
										<div
											key={asig.cod_grupo}
											className={`rounded-lg bg-white p-6 shadow-sm border-2 transition ${
												yaSeleccionada 
													? 'border-blue-500 bg-blue-50' 
													: 'border-gray-200 hover:border-gray-300'
											}`}
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-start gap-3">
														<div className="rounded-full bg-blue-100 p-2 mt-1">
															<BookOpen className="h-5 w-5 text-blue-600" />
														</div>
														<div className="flex-1">
															<div className="flex items-center gap-2 mb-2">
																<h3 className="text-lg font-semibold text-gray-900">
																	{asig.cod_asignatura} - {asig.nombre_asignatura}
																</h3>
																<span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
																	{asig.creditos} créditos
																</span>
															</div>

															<div className="grid grid-cols-2 gap-4 mb-3">
																<div className="flex items-center gap-2 text-sm text-gray-600">
																	<User className="h-4 w-4" />
																	<span>{asig.docente}</span>
																</div>
																<div className="flex items-center gap-2 text-sm text-gray-600">
																	<Clock className="h-4 w-4" />
																	<span>{asig.horario}</span>
																</div>
																<div className="flex items-center gap-2 text-sm text-gray-600">
																	<MapPin className="h-4 w-4" />
																	<span>{asig.salon} - {asig.sede}</span>
																</div>
																<div className="flex items-center gap-2 text-sm text-gray-600">
																	<Users className="h-4 w-4" />
																	<span>Cupo: {asig.cupo_disponible} / {asig.cupo_maximo}</span>
																</div>
															</div>

															{/* Prerrequisitos */}
															{asig.tiene_prerrequisitos && (
																<div className={`flex items-start gap-2 rounded-lg p-3 ${
																	asig.prerrequisitos_cumplidos 
																		? 'bg-green-50 border border-green-200' 
																		: 'bg-red-50 border border-red-200'
																}`}>
																	{asig.prerrequisitos_cumplidos ? (
																		<CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
																	) : (
																		<AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
																	)}
																	<div>
																		<p className={`text-sm font-semibold ${
																			asig.prerrequisitos_cumplidos ? 'text-green-800' : 'text-red-800'
																		}`}>
																			{asig.prerrequisitos_cumplidos 
																				? 'Prerrequisitos cumplidos' 
																				: 'Prerrequisitos pendientes'}
																		</p>
																		<p className="text-xs text-gray-600 mt-1">
																			{asig.prerrequisitos?.join(', ')}
																		</p>
																	</div>
																</div>
															)}
														</div>
													</div>
												</div>

												<div className="ml-4">
													<button
														onClick={() => toggleAsignatura(asig)}
														disabled={sinCupo || prerequisitosNoOk}
														className={`rounded-lg px-6 py-2 font-semibold transition ${
															yaSeleccionada
																? 'bg-red-600 text-white hover:bg-red-700'
																: sinCupo || prerequisitosNoOk
																? 'bg-gray-300 text-gray-500 cursor-not-allowed'
																: 'bg-blue-600 text-white hover:bg-blue-700'
														}`}
													>
														{yaSeleccionada ? 'Quitar' : sinCupo ? 'Sin Cupo' : prerequisitosNoOk ? 'Bloqueada' : 'Agregar'}
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</main>
			</div>

			{/* Modal de Confirmación */}
			{showConfirmModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-2xl w-full p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
							<CheckCircle className="h-6 w-6 text-blue-600" />
							Confirmar Matrícula
						</h2>
						
						<div className="mb-6">
							<p className="text-gray-700 mb-4">
								Estás por registrar las siguientes asignaturas:
							</p>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{asignaturasSeleccionadas.map((asig) => (
									<div key={asig.cod_grupo} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
										<div>
											<p className="font-semibold text-gray-900">{asig.cod_asignatura} - {asig.nombre_asignatura}</p>
											<p className="text-sm text-gray-600">{asig.creditos} créditos • {asig.horario}</p>
										</div>
										<Award className="h-5 w-5 text-blue-600" />
									</div>
								))}
							</div>
							<div className="mt-4 pt-4 border-t border-gray-200">
								<p className="text-lg font-semibold text-gray-900">
									Total: {creditosSeleccionados} créditos
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowConfirmModal(false)}
								className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50"
							>
								Cancelar
							</button>
							<button
								onClick={confirmarMatricula}
								disabled={loading}
								className="flex-1 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
							>
								{loading ? 'Procesando...' : 'Confirmar Matrícula'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

