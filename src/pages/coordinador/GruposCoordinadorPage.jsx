import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { Users, Plus, Calendar, MapPin, Search, Filter } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function GruposCoordinadorPage() {
	const navigate = useNavigate();
	const [grupos, setGrupos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [busqueda, setBusqueda] = useState('');
	const [periodoFiltro, setPeriodoFiltro] = useState('TODOS');

	useEffect(() => {
		cargarGrupos();
	}, []);

	const cargarGrupos = async () => {
		try {
			setLoading(true);
			const { data } = await axiosClient.get('/grupos');
			setGrupos(data.items || []);
		} catch (error) {
			console.error('Error al cargar grupos:', error);
		} finally {
			setLoading(false);
		}
	};

	const gruposFiltrados = grupos.filter(grupo => {
		const cumpleBusqueda = grupo.nombre_asignatura?.toLowerCase().includes(busqueda.toLowerCase()) ||
			grupo.cod_grupo?.toLowerCase().includes(busqueda.toLowerCase());
		const cumplePeriodo = periodoFiltro === 'TODOS' || grupo.cod_periodo === periodoFiltro;
		return cumpleBusqueda && cumplePeriodo;
	});

	const periodos = ['TODOS', ...new Set(grupos.map(g => g.cod_periodo).filter(Boolean))];

	const getCupoColor = (grupo) => {
		const porcentaje = (grupo.cupo_actual || 0) / (grupo.cupo_maximo || 1) * 100;
		if (porcentaje >= 90) return 'text-red-600 bg-red-50';
		if (porcentaje >= 70) return 'text-yellow-600 bg-yellow-50';
		return 'text-green-600 bg-green-50';
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('coordinador')} />
				
				<main className="flex-1 space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Grupos Académicos</h1>
							<p className="mt-1 text-gray-600">Programación y gestión de grupos</p>
						</div>
						<button 
							onClick={() => navigate('/coordinador/grupos/crear')}
							className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
						>
							<Plus className="h-5 w-5" />
							Nuevo Grupo
						</button>
					</div>

					{/* Filtros */}
					<div className="rounded-lg bg-white p-4 shadow-sm">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									placeholder="Buscar por asignatura o código..."
									value={busqueda}
									onChange={(e) => setBusqueda(e.target.value)}
									className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
								/>
							</div>
							<div className="relative">
								<Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
								<select
									value={periodoFiltro}
									onChange={(e) => setPeriodoFiltro(e.target.value)}
									className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
								>
									{periodos.map(periodo => (
										<option key={periodo} value={periodo}>
											{periodo === 'TODOS' ? 'Todos los períodos' : `Período ${periodo}`}
										</option>
									))}
								</select>
							</div>
							<div className="text-sm text-gray-600 flex items-center justify-end">
								{gruposFiltrados.length} de {grupos.length} grupos
							</div>
						</div>
					</div>

					{/* Lista de Grupos */}
					{loading ? (
						<Loader label="Cargando grupos..." />
					) : gruposFiltrados.length === 0 ? (
						<EmptyState title="No hay grupos" description="No se encontraron grupos programados" />
					) : (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{gruposFiltrados.map((grupo) => (
								<div key={grupo.cod_grupo} className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center gap-2">
											<Users className="h-5 w-5 text-blue-600" />
											<span className="font-semibold text-gray-900">
												{grupo.cod_grupo}
											</span>
										</div>
										<span className={`rounded-full px-2 py-1 text-xs font-medium ${grupo.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
											{grupo.estado}
										</span>
									</div>

									<h3 className="text-sm font-medium text-gray-900 mb-3">
										{grupo.nombre_asignatura}
									</h3>

									<div className="space-y-2 text-sm text-gray-600">
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4" />
											<span>{grupo.horario || 'Por definir'}</span>
										</div>
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4" />
											<span>{grupo.salon || 'Salón por asignar'}</span>
										</div>
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4" />
											<span>Docente: {grupo.nombre_docente || 'Sin asignar'}</span>
										</div>
									</div>

									<div className="mt-4 pt-4 border-t border-gray-200">
										<div className="flex items-center justify-between">
											<span className="text-xs text-gray-500">Cupo</span>
											<span className={`text-xs font-medium px-2 py-1 rounded ${getCupoColor(grupo)}`}>
												{grupo.cupo_actual || 0} / {grupo.cupo_maximo || 0}
											</span>
										</div>
										<div className="mt-2 w-full bg-gray-200 rounded-full h-2">
											<div 
												className="bg-blue-600 h-2 rounded-full transition-all"
												style={{ width: `${Math.min(((grupo.cupo_actual || 0) / (grupo.cupo_maximo || 1)) * 100, 100)}%` }}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Estadísticas */}
					{!loading && grupos.length > 0 && (
						<div className="grid gap-4 md:grid-cols-4">
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<p className="text-sm text-gray-600">Total Grupos</p>
								<p className="mt-1 text-2xl font-bold text-gray-900">{grupos.length}</p>
							</div>
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<p className="text-sm text-gray-600">Grupos Activos</p>
								<p className="mt-1 text-2xl font-bold text-green-600">
									{grupos.filter(g => g.estado === 'ACTIVO').length}
								</p>
							</div>
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<p className="text-sm text-gray-600">Total Estudiantes</p>
								<p className="mt-1 text-2xl font-bold text-gray-900">
									{grupos.reduce((sum, g) => sum + (g.cupo_actual || 0), 0)}
								</p>
							</div>
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<p className="text-sm text-gray-600">Ocupación Promedio</p>
								<p className="mt-1 text-2xl font-bold text-blue-600">
									{grupos.length > 0 
										? Math.round((grupos.reduce((sum, g) => sum + (g.cupo_actual || 0) / (g.cupo_maximo || 1), 0) / grupos.length) * 100)
										: 0}%
								</p>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
