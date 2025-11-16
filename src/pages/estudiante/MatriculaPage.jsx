import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import VentanaBanner from '../../components/VentanaBanner.jsx';
import CupoIndicator from '../../components/CupoIndicator.jsx';
import PrerrequisitosCard from '../../components/PrerrequisitosCard.jsx';
import { 
	fetchAsignaturasDisponibles,
	fetchResumenMatricula,
	fetchGruposPorAsignatura,
	registrarMatricula,
	fetchMiHorario
} from '../../services/matriculasService.js';
import { useAuth } from '../../hooks/useAuth.js';
import { 
	BookOpen, 
	Clock, 
	MapPin, 
	Users, 
	CheckCircle, 
	XCircle,
	Search,
	ShoppingCart,
	CreditCard,
	User,
	Award,
	Calendar
} from 'lucide-react';

export default function MatriculaPage() {
	const { user } = useAuth();
	const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
	const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
	const [resumenAcademico, setResumenAcademico] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showGruposModal, setShowGruposModal] = useState(false);
	const [gruposModal, setGruposModal] = useState({ asignatura: null, grupos: [] });
	const [miHorario, setMiHorario] = useState([]);

	const items = [
		{ to: '/estudiante/dashboard', label: 'Resumen' },
		{ to: '/estudiante/matricula', label: 'Matrícula' },
		{ to: '/estudiante/historial-matricula', label: 'Historial' },
		{ to: '/estudiante/notas', label: 'Notas' },
		{ to: '/estudiante/riesgo', label: 'Riesgo' },
		{ to: '/estudiante/perfil', label: 'Perfil' },
	];

	useEffect(() => {
		cargarDatosMatricula();
	}, [user]);

	const cargarDatosMatricula = async () => {
		if (!user?.codigo) return;
		
		setLoading(true);
		try {
			const [resumen, disponibles, horario] = await Promise.all([
				fetchResumenMatricula(user.codigo),
				fetchAsignaturasDisponibles(user.codigo),
				fetchMiHorario(user.codigo).catch(() => ({ items: [] }))
			]);

			setResumenAcademico(resumen.items?.[0] || null);
			setAsignaturasDisponibles(disponibles.items || []);
			setMiHorario(horario.items || []);
			setError(null);
		} catch (err) {
			setError('Error al cargar datos de matrícula');
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const mostrarGrupos = async (codAsignatura, nombreAsignatura) => {
		setLoading(true);
		try {
			const response = await fetchGruposPorAsignatura(codAsignatura);
			setGruposModal({
				asignatura: nombreAsignatura,
				codAsignatura: codAsignatura,
				grupos: response.items || []
			});
			setShowGruposModal(true);
			setError(null);
		} catch (err) {
			setError(`Error al cargar grupos de ${nombreAsignatura}`);
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const seleccionarGrupo = (grupo) => {
		// Verificar si ya está seleccionado
		const yaSeleccionado = gruposSeleccionados.find(g => g.cod_grupo === grupo.cod_grupo);
		if (yaSeleccionado) {
			setError('Este grupo ya está seleccionado');
			setTimeout(() => setError(null), 3000);
			return;
		}

		// Calcular créditos totales
		const asignatura = asignaturasDisponibles.find(a => a.cod_asignatura === grupo.cod_asignatura);
		const creditosGrupo = asignatura?.creditos || 0;
		const creditosTotales = gruposSeleccionados.reduce((sum, g) => sum + g.creditos, 0) + creditosGrupo;

		// Validar límite de créditos
		if (creditosTotales > (resumenAcademico?.creditos_disponibles || 0)) {
			setError(`Excede el límite de ${resumenAcademico?.creditos_disponibles} créditos`);
			setTimeout(() => setError(null), 3000);
			return;
		}

		// Agregar grupo seleccionado
		setGruposSeleccionados(prev => [...prev, {
			cod_grupo: grupo.cod_grupo,
			cod_asignatura: grupo.cod_asignatura,
			asignatura: grupo.nombre_asignatura,
			creditos: creditosGrupo,
			horario: grupo.horario,
			docente: grupo.nombre_docente,
			salon: grupo.salon,
			sede: grupo.nombre_sede
		}]);

		setShowGruposModal(false);
		setSuccess(`Grupo ${grupo.cod_grupo} agregado al carrito`);
		setTimeout(() => setSuccess(null), 3000);
	};

	const quitarGrupo = (codGrupo) => {
		setGruposSeleccionados(prev => prev.filter(g => g.cod_grupo !== codGrupo));
	};

	const confirmarMatricula = async () => {
		if (gruposSeleccionados.length === 0) {
			setError('Debes seleccionar al menos un grupo');
			return;
		}

		setLoading(true);
		setShowConfirmModal(false);

		try {
			const payload = {
				codigoEstudiante: user.codigo,
				cod_periodo: resumenAcademico?.periodo_actual || '2025-I',
				grupos: gruposSeleccionados.map(g => ({ cod_grupo: g.cod_grupo }))
			};

			const response = await registrarMatricula(payload);
			setSuccess(response.mensaje || '¡Matrícula registrada exitosamente!');
			setGruposSeleccionados([]);
			
			// Recargar datos
			await cargarDatosMatricula();
			
			setTimeout(() => setSuccess(null), 5000);
		} catch (err) {
			// Manejo de errores según ORDS
			const status = err.response?.status;
			const data = err.response?.data;
			
			switch (status) {
				case 403:
					setError(data?.detalle || data?.error || 'Validación fallida');
					break;
				case 400:
					setError(`Datos inválidos: ${data?.message || 'Verifique los datos'}`);
					break;
				case 404:
					setError('Recurso no encontrado');
					break;
				case 500:
					setError('Error del servidor. Intente más tarde');
					break;
				default:
					setError('Error al registrar matrícula');
			}
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// Filtros
	const asignaturasFiltradas = asignaturasDisponibles.filter(asig => {
		const matchSearch = asig.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			asig.cod_asignatura?.toLowerCase().includes(searchTerm.toLowerCase());
		return matchSearch;
	});

	const creditosSeleccionados = gruposSeleccionados.reduce((sum, g) => sum + g.creditos, 0);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					{/* Header */}
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Matrícula de Asignaturas</h1>
						<p className="mt-1 text-gray-600">
							Periodo Académico {resumenAcademico?.periodo_actual || '2025-I'}
						</p>
					</div>

					{/* Banner de Ventana */}
					<VentanaBanner tipo="MATRICULA" />

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
					{resumenAcademico && (
						<div className="grid gap-4 md:grid-cols-4">
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-blue-100 p-3">
										<CreditCard className="h-6 w-6 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-gray-600">Créditos Disponibles</p>
										<p className="text-2xl font-bold text-gray-900">{resumenAcademico.creditos_disponibles}</p>
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
										<p className="text-sm text-gray-600">Grupos Seleccionados</p>
										<p className="text-2xl font-bold text-gray-900">{gruposSeleccionados.length}</p>
									</div>
								</div>
							</div>

							<div className="rounded-lg bg-white p-4 shadow-sm">
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-orange-100 p-3">
										<Award className="h-6 w-6 text-orange-600" />
									</div>
									<div>
										<p className="text-sm text-gray-600">Estado</p>
										<p className="text-sm font-semibold text-gray-900">{resumenAcademico.descripcion_riesgo}</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Carrito de Selección */}
					{gruposSeleccionados.length > 0 && (
						<div className="rounded-lg bg-white p-6 shadow-sm border-2 border-blue-200">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
									<ShoppingCart className="h-5 w-5 text-blue-600" />
									Grupos Seleccionados ({gruposSeleccionados.length})
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
								{gruposSeleccionados.map((grupo) => (
									<div key={grupo.cod_grupo} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-blue-50">
										<div className="flex items-center gap-3">
											<BookOpen className="h-5 w-5 text-blue-600" />
											<div>
												<p className="font-semibold text-gray-900">
													{grupo.cod_asignatura} - {grupo.asignatura}
												</p>
												<p className="text-sm text-gray-600">
													Grupo {grupo.cod_grupo} • {grupo.creditos} créditos • {grupo.horario}
												</p>
												<p className="text-xs text-gray-500">
													{grupo.docente} • {grupo.salon}
												</p>
											</div>
										</div>
										<button
											onClick={() => quitarGrupo(grupo.cod_grupo)}
											className="rounded-lg bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
										>
											Quitar
										</button>
									</div>
								))}
							</div>
							<div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
								<p className="text-lg font-semibold text-gray-900">
									Total: {creditosSeleccionados} / {resumenAcademico?.creditos_disponibles} créditos
								</p>
								<div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
									<div 
										className={`h-full ${creditosSeleccionados > (resumenAcademico?.creditos_disponibles || 0) ? 'bg-red-600' : 'bg-blue-600'}`}
										style={{ width: `${Math.min((creditosSeleccionados / (resumenAcademico?.creditos_disponibles || 1)) * 100, 100)}%` }}
									/>
								</div>
							</div>
						</div>
					)}

					{/* Búsqueda */}
					<div className="rounded-lg bg-white p-4 shadow-sm">
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
								<p className="text-gray-600">No hay asignaturas disponibles</p>
							</div>
						) : (
							<div className="grid gap-4">
								{asignaturasFiltradas.map((asig) => (
									<div
										key={asig.cod_asignatura}
										className="rounded-lg bg-white p-6 shadow-sm border-2 border-gray-200 hover:border-gray-300 transition"
									>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<h3 className="text-lg font-semibold text-gray-900">
														{asig.cod_asignatura} - {asig.nombre}
													</h3>
													<span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
														{asig.creditos} créditos
													</span>
													{asig.tipo && (
														<span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
															{asig.tipo}
														</span>
													)}
												</div>

												<div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
													<span>Semestre {asig.semestre}</span>
													<span>•</span>
													<span>{asig.grupos_disponibles} grupo(s) disponible(s)</span>
												</div>

												{/* Prerrequisitos */}
												<PrerrequisitosCard 
													cumplidos={asig.prereq_cumplidos}
													puede_inscribir={asig.puede_inscribir}
													razon={asig.razon}
												/>
											</div>

											<div className="ml-4">
												{asig.puede_inscribir === 'SÍ' ? (
													<button
														onClick={() => mostrarGrupos(asig.cod_asignatura, asig.nombre)}
														className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 transition"
													>
														Ver Grupos
													</button>
												) : (
													<button
														disabled
														className="rounded-lg bg-gray-300 px-6 py-2 font-semibold text-gray-500 cursor-not-allowed"
													>
														Bloqueada
													</button>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</main>
			</div>

			{/* Modal de Grupos */}
			{showGruposModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[80vh] overflow-y-auto">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">
							Seleccionar Grupo - {gruposModal.asignatura}
						</h2>
						
						<div className="space-y-3 mb-6">
							{gruposModal.grupos.map((grupo) => (
								<div
									key={grupo.cod_grupo}
									className="rounded-lg border-2 border-gray-200 p-4 hover:border-blue-300 transition"
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-3">
												<h3 className="text-lg font-semibold text-gray-900">
													Grupo {grupo.cod_grupo}
												</h3>
												<CupoIndicator 
													disponible={grupo.cupo_disponible}
													maximo={grupo.cupo_maximo}
													porcentaje={grupo.porcentaje_ocupacion}
												/>
											</div>

											<div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
												<div className="flex items-center gap-2">
													<User className="h-4 w-4" />
													<span>{grupo.nombre_docente}</span>
												</div>
												<div className="flex items-center gap-2">
													<Clock className="h-4 w-4" />
													<span>{grupo.horario}</span>
												</div>
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4" />
													<span>{grupo.salon}</span>
												</div>
												<div className="flex items-center gap-2">
													<MapPin className="h-4 w-4" />
													<span>{grupo.nombre_sede}</span>
												</div>
											</div>
										</div>

										<button
											onClick={() => seleccionarGrupo(grupo)}
											disabled={grupo.cupo_disponible === 0 || grupo.estado !== 'ABIERTO'}
											className="ml-4 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
										>
											{grupo.cupo_disponible === 0 ? 'Sin Cupo' : 'Seleccionar'}
										</button>
									</div>
								</div>
							))}
						</div>

						<div className="flex items-center gap-3">
							<button
								onClick={() => setShowGruposModal(false)}
								className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50"
							>
								Cerrar
							</button>
						</div>
					</div>
				</div>
			)}

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
								Estás por registrar los siguientes grupos:
							</p>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{gruposSeleccionados.map((grupo) => (
									<div key={grupo.cod_grupo} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
										<div>
											<p className="font-semibold text-gray-900">
												{grupo.cod_asignatura} - {grupo.asignatura}
											</p>
											<p className="text-sm text-gray-600">
												Grupo {grupo.cod_grupo} • {grupo.creditos} créditos • {grupo.horario}
											</p>
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
