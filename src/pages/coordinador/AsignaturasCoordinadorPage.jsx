import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { BookOpen, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function AsignaturasCoordinadorPage() {
	const [asignaturas, setAsignaturas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [busqueda, setBusqueda] = useState('');
	const [semestreFiltro, setSemestreFiltro] = useState('TODOS');

	useEffect(() => {
		cargarAsignaturas();
	}, []);

	const cargarAsignaturas = async () => {
		try {
			setLoading(true);
			const { data } = await axiosClient.get('/asignaturas');
			setAsignaturas(data.items || []);
		} catch (error) {
			console.error('Error al cargar asignaturas:', error);
		} finally {
			setLoading(false);
		}
	};

	const asignaturasFiltradas = asignaturas.filter(asig => {
		const cumpleBusqueda = asig.nombre_asignatura?.toLowerCase().includes(busqueda.toLowerCase()) ||
			asig.cod_asignatura?.toLowerCase().includes(busqueda.toLowerCase());
		const cumpleSemestre = semestreFiltro === 'TODOS' || asig.semestre?.toString() === semestreFiltro;
		return cumpleBusqueda && cumpleSemestre;
	});

	const semestres = ['TODOS', ...new Set(asignaturas.map(a => a.semestre).filter(Boolean))].sort();

	const handleEditar = (asignatura) => {
		// TODO: Implementar modal de edición
		console.log('Editar asignatura:', asignatura);
	};

	const handleEliminar = async (codAsignatura) => {
		if (!confirm('¿Está seguro de eliminar esta asignatura?')) return;
		try {
			await axiosClient.delete(`/asignaturas/${codAsignatura}`);
			cargarAsignaturas();
		} catch (error) {
			alert('Error al eliminar: ' + error.message);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('coordinador')} />
				
				<main className="flex-1 space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Asignaturas</h1>
							<p className="mt-1 text-gray-600">Gestión del catálogo de asignaturas</p>
						</div>
						<button 
							onClick={() => console.log('TODO: Abrir modal de nueva asignatura')}
							className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							<Plus className="h-5 w-5" />
							Nueva Asignatura
						</button>
					</div>

					{/* Filtros */}
					<div className="rounded-lg bg-white p-4 shadow-sm">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									placeholder="Buscar por código o nombre..."
									value={busqueda}
									onChange={(e) => setBusqueda(e.target.value)}
									className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								/>
							</div>
							<div className="relative">
								<Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
								<select
									value={semestreFiltro}
									onChange={(e) => setSemestreFiltro(e.target.value)}
									className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
								>
									{semestres.map(sem => (
										<option key={sem} value={sem}>
											{sem === 'TODOS' ? 'Todos los semestres' : `Semestre ${sem}`}
										</option>
									))}
								</select>
							</div>
							<div className="text-sm text-gray-600 flex items-center justify-end">
								Mostrando {asignaturasFiltradas.length} de {asignaturas.length} asignaturas
							</div>
						</div>
					</div>

					{/* Lista de Asignaturas */}
					{loading ? (
						<Loader label="Cargando asignaturas..." />
					) : asignaturasFiltradas.length === 0 ? (
						<EmptyState 
							title="No hay asignaturas"
							description="No se encontraron asignaturas con los filtros aplicados"
						/>
					) : (
						<div className="grid gap-4 md:grid-cols-2">
							{asignaturasFiltradas.map((asignatura) => (
								<div key={asignatura.cod_asignatura} className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<BookOpen className="h-5 w-5 text-blue-600" />
												<h3 className="font-semibold text-gray-900">
													{asignatura.cod_asignatura}
												</h3>
												<span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
													Sem {asignatura.semestre}
												</span>
											</div>
											<p className="mt-2 text-sm text-gray-900">
												{asignatura.nombre_asignatura}
											</p>
											<div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
												<span className="rounded bg-gray-100 px-2 py-1">
													{asignatura.creditos} créditos
												</span>
												<span className="rounded bg-gray-100 px-2 py-1">
													{asignatura.horas_semanales}h/semana
												</span>
												<span className="rounded bg-gray-100 px-2 py-1">
													{asignatura.tipo_asignatura || 'Teórica'}
												</span>
											</div>
											{asignatura.prerequisitos && (
												<p className="mt-2 text-xs text-gray-500">
													Prerrequisitos: {asignatura.prerequisitos}
												</p>
											)}
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => handleEditar(asignatura)}
												className="rounded p-2 text-blue-600 hover:bg-blue-50"
												title="Editar"
											>
												<Edit2 className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleEliminar(asignatura.cod_asignatura)}
												className="rounded p-2 text-red-600 hover:bg-red-50"
												title="Eliminar"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Estadísticas */}
					{!loading && asignaturas.length > 0 && (
						<div className="grid gap-4 md:grid-cols-4">
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<p className="text-sm text-gray-600">Total Asignaturas</p>
								<p className="mt-1 text-2xl font-bold text-gray-900">{asignaturas.length}</p>
							</div>
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<p className="text-sm text-gray-600">Total Créditos</p>
								<p className="mt-1 text-2xl font-bold text-gray-900">
									{asignaturas.reduce((sum, a) => sum + (a.creditos || 0), 0)}
								</p>
							</div>
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<p className="text-sm text-gray-600">Teóricas</p>
								<p className="mt-1 text-2xl font-bold text-gray-900">
									{asignaturas.filter(a => a.tipo_asignatura === 'TEORICA').length}
								</p>
							</div>
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<p className="text-sm text-gray-600">Prácticas</p>
								<p className="mt-1 text-2xl font-bold text-gray-900">
									{asignaturas.filter(a => a.tipo_asignatura === 'PRACTICA').length}
								</p>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
