import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { ArrowLeft, Search, Users, UserPlus, UserMinus, Save, AlertCircle, X, CheckCircle } from 'lucide-react';
import { fetchEstudiantesGrupo, asignarEstudiantesGrupo, desasignarEstudianteGrupo, fetchEstadisticasGrupo } from '../../services/gruposService.js';
import { fetchEstudiantes } from '../../services/estudiantesService.js';

export default function AsignarEstudiantesPage() {
	const { grupoId } = useParams();
	const navigate = useNavigate();
	
	const [grupoInfo, setGrupoInfo] = useState(null);
	const [estudiantesInscritos, setEstudiantesInscritos] = useState([]);
	const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([]);
	const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(true);
	const [guardando, setGuardando] = useState(false);
	const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
	const [estudianteParaQuitar, setEstudianteParaQuitar] = useState(null);

	const items = [
		{ to: '/administrador/dashboard', label: 'Dashboard' },
		{ to: '/administrador/programas', label: 'Programas' },
		{ to: '/administrador/asignaturas', label: 'Asignaturas' },
		{ to: '/administrador/docentes', label: 'Docentes' },
		{ to: '/administrador/estudiantes', label: 'Estudiantes' },
		{ to: '/administrador/grupos', label: 'Grupos' },
		{ to: '/administrador/sedes', label: 'Sedes' },
		{ to: '/administrador/reportes', label: 'Reportes' },
	];

	useEffect(() => {
		cargarDatos();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [grupoId]);

	const cargarDatos = async () => {
		try {
			setLoading(true);
			const [estadisticas, inscritos, todos] = await Promise.all([
				fetchEstadisticasGrupo(grupoId),
				fetchEstudiantesGrupo(grupoId),
				fetchEstudiantes()
			]);

			setGrupoInfo(estadisticas);
			const listaInscritos = inscritos.items || inscritos || [];
			setEstudiantesInscritos(listaInscritos);
			
			// Filtrar estudiantes que no están inscritos en este grupo
			const todosEstudiantes = todos.items || todos || [];
			const codigosInscritos = listaInscritos.map(e => e.cod_estudiante);
			const disponibles = todosEstudiantes.filter(e => !codigosInscritos.includes(e.cod_estudiante));
			
			setEstudiantesDisponibles(disponibles);
			setMensaje({ tipo: '', texto: '' });
		} catch (error) {
			console.error('Error al cargar datos:', error);
			setMensaje({ tipo: 'error', texto: 'Error al cargar los datos del grupo' });
		} finally {
			setLoading(false);
		}
	};

	const toggleSeleccion = (codEstudiante) => {
		setEstudiantesSeleccionados(prev => {
			if (prev.includes(codEstudiante)) {
				return prev.filter(cod => cod !== codEstudiante);
			} else {
				return [...prev, codEstudiante];
			}
		});
	};

	const seleccionarTodos = () => {
		setEstudiantesSeleccionados(estudiantesDisponiblesFiltrados.map(e => e.cod_estudiante));
	};

	const deseleccionarTodos = () => {
		setEstudiantesSeleccionados([]);
	};

	const validarCupo = () => {
		const totalInscritos = estudiantesInscritos.length + estudiantesSeleccionados.length;
		return totalInscritos <= grupoInfo?.cupo_maximo;
	};

	const handleAsignar = async () => {
		if (estudiantesSeleccionados.length === 0) {
			setMensaje({ tipo: 'error', texto: 'Seleccione al menos un estudiante' });
			return;
		}

		if (!validarCupo()) {
			setMensaje({ 
				tipo: 'error', 
				texto: `Excede el cupo máximo de ${grupoInfo?.cupo_maximo}. Espacios disponibles: ${grupoInfo?.cupo_maximo - estudiantesInscritos.length}` 
			});
			return;
		}

		try {
			setGuardando(true);
			setMensaje({ tipo: '', texto: '' });

			const payload = {
				cod_grupo: grupoId,
				estudiantes: estudiantesSeleccionados
			};

			await asignarEstudiantesGrupo(payload);
			setMensaje({ 
				tipo: 'success', 
				texto: `${estudiantesSeleccionados.length} estudiante(s) asignado(s) correctamente` 
			});

			// Recargar datos
			setEstudiantesSeleccionados([]);
			await cargarDatos();

			// Ocultar mensaje después de 3 segundos
			setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
		} catch (error) {
			console.error('Error al asignar estudiantes:', error);
			setMensaje({ 
				tipo: 'error', 
				texto: error.response?.data?.detalle || 'Error al asignar estudiantes al grupo' 
			});
		} finally {
			setGuardando(false);
		}
	};

	const confirmarQuitar = (estudiante) => {
		setEstudianteParaQuitar(estudiante);
	};

	const handleDesasignar = async () => {
		if (!estudianteParaQuitar) return;

		try {
			setGuardando(true);
			await desasignarEstudianteGrupo(grupoId, estudianteParaQuitar.cod_estudiante);
			
			setMensaje({ 
				tipo: 'success', 
				texto: `${estudianteParaQuitar.nombre_completo} fue removido del grupo` 
			});

			// Recargar datos
			setEstudianteParaQuitar(null);
			await cargarDatos();

			// Ocultar mensaje después de 3 segundos
			setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
		} catch (error) {
			console.error('Error al desasignar estudiante:', error);
			setMensaje({ 
				tipo: 'error', 
				texto: error.response?.data?.detalle || 'Error al remover estudiante del grupo' 
			});
		} finally {
			setGuardando(false);
		}
	};

	// Optimización de búsqueda con useMemo
	const estudiantesDisponiblesFiltrados = useMemo(() => {
		if (!searchTerm.trim()) return estudiantesDisponibles;

		const searchLower = searchTerm.toLowerCase().trim();
		return estudiantesDisponibles.filter(est => {
			const nombre = est.nombre_completo?.toLowerCase() || '';
			const codigo = est.cod_estudiante?.toLowerCase() || '';
			const correo = est.correo?.toLowerCase() || '';
			
			return nombre.includes(searchLower) || 
				   codigo.includes(searchLower) || 
				   correo.includes(searchLower);
		});
	}, [estudiantesDisponibles, searchTerm]);

	// Optimización de búsqueda de inscritos
	const estudiantesInscritosFiltrados = useMemo(() => {
		if (!searchTerm.trim()) return estudiantesInscritos;

		const searchLower = searchTerm.toLowerCase().trim();
		return estudiantesInscritos.filter(est => {
			const nombre = est.nombre_completo?.toLowerCase() || '';
			const codigo = est.cod_estudiante?.toLowerCase() || '';
			const correo = est.correo?.toLowerCase() || '';
			
			return nombre.includes(searchLower) || 
				   codigo.includes(searchLower) || 
				   correo.includes(searchLower);
		});
	}, [estudiantesInscritos, searchTerm]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<div className="mx-auto flex max-w-7xl gap-6 p-4">
					<Sidebar items={items} />
					<main className="flex-1">
						<div className="animate-pulse space-y-4">
							<div className="h-8 w-64 rounded bg-gray-200"></div>
							<div className="h-96 rounded-lg bg-gray-200"></div>
						</div>
					</main>
				</div>
			</div>
		);
	}

	const espaciosDisponibles = grupoInfo?.cupo_maximo - estudiantesInscritos.length;
	const excedeCupo = estudiantesSeleccionados.length > espaciosDisponibles;

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					{/* Header */}
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate('/administrador/grupos')}
							className="rounded-lg p-2 hover:bg-gray-200 transition"
						>
							<ArrowLeft className="h-6 w-6" />
						</button>
						<div className="flex-1">
							<h1 className="text-3xl font-bold text-gray-900">Asignar Estudiantes al Grupo</h1>
							<p className="text-gray-600">Grupo {grupoId}</p>
						</div>
					</div>

					{/* Información del Grupo */}
					{grupoInfo && (
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="grid gap-4 md:grid-cols-4">
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-blue-100 p-3">
										<Users className="h-6 w-6 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-gray-600">Inscritos</p>
										<p className="text-2xl font-bold text-gray-900">{estudiantesInscritos.length}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-purple-100 p-3">
										<Users className="h-6 w-6 text-purple-600" />
									</div>
									<div>
										<p className="text-sm text-gray-600">Cupo Máximo</p>
										<p className="text-2xl font-bold text-gray-900">{grupoInfo.cupo_maximo}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-green-100 p-3">
										<Users className="h-6 w-6 text-green-600" />
									</div>
									<div>
										<p className="text-sm text-gray-600">Espacios Disponibles</p>
										<p className="text-2xl font-bold text-gray-900">{espaciosDisponibles}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="rounded-full bg-orange-100 p-3">
										<UserPlus className="h-6 w-6 text-orange-600" />
									</div>
									<div>
										<p className="text-sm text-gray-600">Seleccionados</p>
										<p className={`text-2xl font-bold ${excedeCupo ? 'text-red-600' : 'text-gray-900'}`}>
											{estudiantesSeleccionados.length}
										</p>
									</div>
								</div>
							</div>

							{/* Barra de Cupo */}
							<div className="mt-4">
								<div className="flex items-center justify-between text-sm text-gray-600 mb-2">
									<span>Ocupación del Grupo</span>
									<span>{Math.round((estudiantesInscritos.length / grupoInfo.cupo_maximo) * 100)}%</span>
								</div>
								<div className="h-3 w-full rounded-full bg-gray-200">
									<div
										className={`h-3 rounded-full transition-all ${
											grupoInfo.porcentaje_ocupacion >= 90
												? 'bg-red-500'
												: grupoInfo.porcentaje_ocupacion >= 70
												? 'bg-yellow-500'
												: 'bg-green-500'
										}`}
										style={{ width: `${grupoInfo.porcentaje_ocupacion}%` }}
									></div>
								</div>
							</div>
						</div>
					)}

					{/* Mensajes */}
					{mensaje.texto && (
						<div className={`rounded-lg p-4 ${
							mensaje.tipo === 'success' 
								? 'bg-green-50 text-green-800 border border-green-200' 
								: 'bg-red-50 text-red-800 border border-red-200'
						}`}>
							<div className="flex items-start gap-3">
								{mensaje.tipo === 'success' ? (
									<CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
								) : (
									<AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
								)}
								<p className="flex-1">{mensaje.texto}</p>
								<button 
									onClick={() => setMensaje({ tipo: '', texto: '' })}
									className="text-gray-500 hover:text-gray-700"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						</div>
					)}

					{/* Advertencia de Cupo */}
					{excedeCupo && (
						<div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
								<div>
									<p className="font-semibold text-red-800">Excede el cupo máximo</p>
									<p className="text-sm text-red-700 mt-1">
										Has seleccionado {estudiantesSeleccionados.length} estudiantes, pero solo hay {espaciosDisponibles} espacio(s) disponible(s).
									</p>
								</div>
							</div>
						</div>
					)}

					<div className="grid gap-6 lg:grid-cols-2">
						{/* Panel Izquierdo: Estudiantes Disponibles */}
						<div className="rounded-lg bg-white shadow-sm">
							<div className="border-b border-gray-200 p-4">
								<h2 className="text-xl font-semibold text-gray-900 mb-4">
									Estudiantes Disponibles ({estudiantesDisponiblesFiltrados.length})
								</h2>

								{/* Búsqueda */}
								<div className="relative mb-3">
									<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
									<input
										type="text"
										placeholder="Buscar por nombre, código o correo..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
									/>
								</div>

								{/* Botones de Selección */}
								<div className="flex gap-2">
									<button
										onClick={seleccionarTodos}
										disabled={estudiantesDisponiblesFiltrados.length === 0}
										className="flex-1 rounded-lg border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
									>
										Seleccionar Todos
									</button>
									<button
										onClick={deseleccionarTodos}
										disabled={estudiantesSeleccionados.length === 0}
										className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
									>
										Deseleccionar Todos
									</button>
								</div>
							</div>

							<div className="max-h-[600px] overflow-y-auto p-4">
								{estudiantesDisponiblesFiltrados.length === 0 ? (
									<div className="py-12 text-center">
										<Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
										<p className="text-gray-600">
											{searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes disponibles'}
										</p>
										{searchTerm && (
											<button
												onClick={() => setSearchTerm('')}
												className="mt-2 text-sm text-blue-600 hover:underline"
											>
												Limpiar búsqueda
											</button>
										)}
									</div>
								) : (
									<div className="space-y-2">
										{estudiantesDisponiblesFiltrados.map((estudiante) => (
											<div
												key={estudiante.cod_estudiante}
												onClick={() => toggleSeleccion(estudiante.cod_estudiante)}
												className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md ${
													estudiantesSeleccionados.includes(estudiante.cod_estudiante)
														? 'border-blue-500 bg-blue-50 shadow-sm'
														: 'border-gray-200 hover:border-gray-300'
												}`}
											>
												<div className="flex items-center gap-3">
													<input
														type="checkbox"
														checked={estudiantesSeleccionados.includes(estudiante.cod_estudiante)}
														onChange={() => {}}
														className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
													/>
													<div className="flex-1">
														<p className="font-semibold text-gray-900">
															{estudiante.nombre_completo}
														</p>
														<p className="text-sm text-gray-600">
															{estudiante.cod_estudiante}
														</p>
														{estudiante.correo && (
															<p className="text-xs text-gray-500">{estudiante.correo}</p>
														)}
													</div>
													{estudiantesSeleccionados.includes(estudiante.cod_estudiante) && (
														<UserPlus className="h-5 w-5 text-blue-600" />
													)}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Panel Derecho: Estudiantes Inscritos */}
						<div className="rounded-lg bg-white shadow-sm">
							<div className="border-b border-gray-200 p-4">
								<h2 className="text-xl font-semibold text-gray-900">
									Estudiantes Inscritos ({estudiantesInscritosFiltrados.length})
								</h2>
							</div>

							<div className="max-h-[600px] overflow-y-auto p-4">
								{estudiantesInscritosFiltrados.length === 0 ? (
									<div className="py-12 text-center">
										<Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
										<p className="text-gray-600">
											{searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes inscritos aún'}
										</p>
									</div>
								) : (
									<div className="space-y-2">
										{estudiantesInscritosFiltrados.map((estudiante) => (
											<div
												key={estudiante.cod_estudiante}
												className="rounded-lg border-2 border-green-200 bg-green-50 p-3 hover:shadow-md transition"
											>
												<div className="flex items-center gap-3">
													<div className="rounded-full bg-green-100 p-2">
														<Users className="h-5 w-5 text-green-600" />
													</div>
													<div className="flex-1">
														<p className="font-semibold text-gray-900">
															{estudiante.nombre_completo}
														</p>
														<p className="text-sm text-gray-600">
															{estudiante.cod_estudiante}
														</p>
														{estudiante.correo && (
															<p className="text-xs text-gray-500">{estudiante.correo}</p>
														)}
													</div>
													<button
														onClick={() => confirmarQuitar(estudiante)}
														className="rounded-lg p-2 text-red-600 hover:bg-red-100 transition"
														title="Quitar del grupo"
													>
														<UserMinus className="h-5 w-5" />
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Botones de Acción */}
					<div className="flex justify-end gap-3">
						<button
							onClick={() => navigate('/administrador/grupos')}
							className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 transition"
							disabled={guardando}
						>
							Cancelar
						</button>
						<button
							onClick={handleAsignar}
							disabled={guardando || estudiantesSeleccionados.length === 0 || excedeCupo}
							className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
						>
							{guardando ? (
								<>
									<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									Asignando...
								</>
							) : (
								<>
									<Save className="h-5 w-5" />
									Asignar Estudiantes ({estudiantesSeleccionados.length})
								</>
							)}
						</button>
					</div>
				</main>
			</div>

			{/* Modal de Confirmación para Quitar */}
			{estudianteParaQuitar && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl">
						<div className="mb-4 flex items-start gap-3">
							<div className="rounded-full bg-red-100 p-3">
								<AlertCircle className="h-6 w-6 text-red-600" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-gray-900">Confirmar Remoción</h3>
								<p className="mt-2 text-sm text-gray-600">
									¿Está seguro que desea remover a <strong>{estudianteParaQuitar.nombre_completo}</strong> del grupo?
								</p>
								<p className="mt-1 text-xs text-gray-500">
									Esta acción no se puede deshacer.
								</p>
							</div>
						</div>

						<div className="flex justify-end gap-3">
							<button
								onClick={() => setEstudianteParaQuitar(null)}
								disabled={guardando}
								className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition"
							>
								Cancelar
							</button>
							<button
								onClick={handleDesasignar}
								disabled={guardando}
								className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50 transition"
							>
								{guardando ? (
									<>
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										Removiendo...
									</>
								) : (
									<>
										<UserMinus className="h-4 w-4" />
										Confirmar
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
