import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { Users, Plus, Edit, Trash2, Search, Filter, BookOpen, User as UserIcon, MapPin } from 'lucide-react';
import { fetchGrupos, eliminarGrupo } from '../../services/gruposService.js';
import Modal from '../../components/Modal.jsx';

export default function GruposPage() {
	const navigate = useNavigate();
	const [grupos, setGrupos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [filtros, setFiltros] = useState({
		periodo: '',
		estado: '',
		asignatura: ''
	});
	const [grupoAEliminar, setGrupoAEliminar] = useState(null);
	const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

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
		cargarGrupos();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filtros]);

	const cargarGrupos = async () => {
		try {
			setLoading(true);
			const params = {};
			if (filtros.periodo) params.periodo = filtros.periodo;
			if (filtros.estado) params.estado = filtros.estado;
			if (filtros.asignatura) params.cod_asignatura = filtros.asignatura;
			
			const data = await fetchGrupos(params);
			setGrupos(data.items || data || []);
		} catch (error) {
			console.error('Error al cargar grupos:', error);
			setMensaje({ tipo: 'error', texto: 'Error al cargar los grupos' });
		} finally {
			setLoading(false);
		}
	};

	const handleEliminar = async () => {
		if (!grupoAEliminar) return;
		
		try {
			await eliminarGrupo(grupoAEliminar.cod_grupo);
			setMensaje({ tipo: 'success', texto: 'Grupo eliminado correctamente' });
			setGrupoAEliminar(null);
			cargarGrupos();
		} catch (error) {
			setMensaje({ 
				tipo: 'error', 
				texto: error.response?.data?.detalle || 'Error al eliminar el grupo' 
			});
		}
	};

	const gruposFiltrados = grupos.filter(grupo => {
		const searchLower = searchTerm.toLowerCase();
		return (
			grupo.nombre_asignatura?.toLowerCase().includes(searchLower) ||
			grupo.cod_asignatura?.toLowerCase().includes(searchLower) ||
			grupo.nombre_docente?.toLowerCase().includes(searchLower) ||
			grupo.cod_grupo?.toString().includes(searchLower)
		);
	});

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

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Gestión de Grupos</h1>
							<p className="text-gray-600">Administra los grupos académicos del sistema</p>
						</div>
						<button
							onClick={() => navigate('/administrador/grupos/crear')}
							className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							<Plus className="h-5 w-5" />
							Crear Grupo
						</button>
					</div>

					{/* Mensajes */}
					{mensaje.texto && (
						<div className={`rounded-lg p-4 ${
							mensaje.tipo === 'success' 
								? 'bg-green-50 text-green-800 border border-green-200' 
								: 'bg-red-50 text-red-800 border border-red-200'
						}`}>
							{mensaje.texto}
						</div>
					)}

					{/* Estadísticas */}
					<div className="grid gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center gap-3">
								<BookOpen className="h-8 w-8 text-blue-600" />
								<div>
									<p className="text-sm text-gray-600">Total Grupos</p>
									<p className="text-2xl font-bold text-gray-900">{grupos.length}</p>
								</div>
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center gap-3">
								<Users className="h-8 w-8 text-green-600" />
								<div>
									<p className="text-sm text-gray-600">Estudiantes</p>
									<p className="text-2xl font-bold text-gray-900">
										{grupos.reduce((sum, g) => sum + (g.estudiantes_matriculados || 0), 0)}
									</p>
								</div>
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center gap-3">
								<UserIcon className="h-8 w-8 text-purple-600" />
								<div>
									<p className="text-sm text-gray-600">Docentes</p>
									<p className="text-2xl font-bold text-gray-900">
										{new Set(grupos.map(g => g.cod_docente).filter(Boolean)).size}
									</p>
								</div>
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center gap-3">
								<MapPin className="h-8 w-8 text-orange-600" />
								<div>
									<p className="text-sm text-gray-600">Ocupación Prom.</p>
									<p className="text-2xl font-bold text-gray-900">
										{grupos.length > 0 
											? Math.round(grupos.reduce((sum, g) => sum + (g.porcentaje_ocupacion || 0), 0) / grupos.length)
											: 0}%
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Filtros y Búsqueda */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="grid gap-4 md:grid-cols-4">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									placeholder="Buscar por asignatura, código o docente..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
								/>
							</div>
							<select
								value={filtros.periodo}
								onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
								className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
							>
								<option value="">Todos los periodos</option>
								<option value="2025-I">2025-I</option>
								<option value="2024-II">2024-II</option>
								<option value="2024-I">2024-I</option>
							</select>
							<select
								value={filtros.estado}
								onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
								className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
							>
								<option value="">Todos los estados</option>
								<option value="ACTIVO">Activos</option>
								<option value="CERRADO">Cerrados</option>
							</select>
							<button
								onClick={() => {
									setFiltros({ periodo: '', estado: '', asignatura: '' });
									setSearchTerm('');
								}}
								className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
							>
								<Filter className="h-4 w-4" />
								Limpiar Filtros
							</button>
						</div>
					</div>

					{/* Tabla de Grupos */}
					<div className="rounded-lg bg-white shadow-sm">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Código</th>
										<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Asignatura</th>
										<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Docente</th>
										<th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Horario</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Estudiantes</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Ocupación</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Estado</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{gruposFiltrados.length === 0 ? (
										<tr>
											<td colSpan="8" className="px-6 py-12 text-center">
												<BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
												<p className="text-gray-600">No se encontraron grupos</p>
											</td>
										</tr>
									) : (
										gruposFiltrados.map((grupo) => (
											<tr key={grupo.cod_grupo} className="hover:bg-gray-50">
												<td className="px-6 py-4 text-sm font-medium text-gray-900">
													{grupo.cod_grupo}
												</td>
												<td className="px-6 py-4">
													<div>
														<p className="font-medium text-gray-900">{grupo.nombre_asignatura}</p>
														<p className="text-sm text-gray-500">{grupo.cod_asignatura}</p>
													</div>
												</td>
												<td className="px-6 py-4 text-sm text-gray-900">
													{grupo.nombre_docente || 'Sin asignar'}
												</td>
												<td className="px-6 py-4">
													<div className="text-sm">
														<p className="text-gray-900">{grupo.horario}</p>
														<p className="text-gray-500">{grupo.salon}</p>
													</div>
												</td>
												<td className="px-6 py-4 text-center text-sm">
													<span className="font-medium text-gray-900">
														{grupo.estudiantes_matriculados || 0}
													</span>
													<span className="text-gray-500">/{grupo.cupo_maximo}</span>
												</td>
												<td className="px-6 py-4">
													<div className="flex flex-col items-center gap-1">
														<div className="h-2 w-full rounded-full bg-gray-200">
															<div
																className={`h-2 rounded-full ${
																	(grupo.porcentaje_ocupacion || 0) >= 90
																		? 'bg-red-500'
																		: (grupo.porcentaje_ocupacion || 0) >= 70
																		? 'bg-yellow-500'
																		: 'bg-green-500'
																}`}
																style={{ width: `${grupo.porcentaje_ocupacion || 0}%` }}
															></div>
														</div>
														<span className="text-xs text-gray-600">
															{grupo.porcentaje_ocupacion || 0}%
														</span>
													</div>
												</td>
												<td className="px-6 py-4 text-center">
													<span className={`rounded-full px-3 py-1 text-xs font-medium ${
														grupo.estado === 'ACTIVO'
															? 'bg-green-100 text-green-800'
															: 'bg-gray-100 text-gray-800'
													}`}>
														{grupo.estado}
													</span>
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center justify-center gap-2">
														<button
															onClick={() => navigate(`/administrador/grupos/${grupo.cod_grupo}/editar`)}
															className="rounded p-2 text-blue-600 hover:bg-blue-50"
															title="Editar"
														>
															<Edit className="h-4 w-4" />
														</button>
														<button
															onClick={() => setGrupoAEliminar(grupo)}
															className="rounded p-2 text-red-600 hover:bg-red-50"
															title="Eliminar"
															disabled={grupo.estudiantes_matriculados > 0}
														>
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</main>
			</div>

			{/* Modal de Confirmación de Eliminación */}
			{grupoAEliminar && (
				<Modal
					isOpen={!!grupoAEliminar}
					onClose={() => setGrupoAEliminar(null)}
					title="Confirmar Eliminación"
				>
					<div className="space-y-4">
						<p className="text-gray-700">
							¿Está seguro que desea eliminar el grupo <strong>{grupoAEliminar.cod_grupo}</strong> de la asignatura <strong>{grupoAEliminar.nombre_asignatura}</strong>?
						</p>
						<p className="text-sm text-red-600">
							Esta acción no se puede deshacer.
						</p>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => setGrupoAEliminar(null)}
								className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
							>
								Cancelar
							</button>
							<button
								onClick={handleEliminar}
								className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
							>
								Eliminar
							</button>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
}
