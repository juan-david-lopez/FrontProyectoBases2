import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { UserPlus, CheckCircle, XCircle, Clock, Search, Filter, FileText } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function MatriculasRegistroPage() {
	const [matriculas, setMatriculas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [busqueda, setBusqueda] = useState('');
	const [estadoFiltro, setEstadoFiltro] = useState('TODOS');

	useEffect(() => {
		cargarMatriculas();
	}, []);

	const cargarMatriculas = async () => {
		try {
			setLoading(true);
			const { data } = await axiosClient.get('/matriculas');
			setMatriculas(data.items || []);
		} catch (error) {
			console.error('Error al cargar matrículas:', error);
			setMatriculas([]);
		} finally {
			setLoading(false);
		}
	};

	const matriculasFiltradas = matriculas.filter(mat => {
		const cumpleBusqueda = mat.cod_estudiante?.toLowerCase().includes(busqueda.toLowerCase()) ||
			mat.nombre_estudiante?.toLowerCase().includes(busqueda.toLowerCase());
		const cumpleEstado = estadoFiltro === 'TODOS' || mat.estado === estadoFiltro;
		return cumpleBusqueda && cumpleEstado;
	});

	const handleAprobar = async (codMatricula) => {
		if (!confirm('¿Aprobar esta matrícula?')) return;
		try {
			await axiosClient.post(`/matriculas/${codMatricula}/aprobar`);
			cargarMatriculas();
		} catch (error) {
			alert('Error: ' + error.message);
		}
	};

	const handleRechazar = async (codMatricula) => {
		const motivo = prompt('Motivo del rechazo:');
		if (!motivo) return;
		try {
			await axiosClient.post(`/matriculas/${codMatricula}/rechazar`, { motivo });
			cargarMatriculas();
		} catch (error) {
			alert('Error: ' + error.message);
		}
	};

	const getEstadoBadge = (estado) => {
		const badges = {
			PENDIENTE: { color: 'yellow', icon: Clock, text: 'Pendiente' },
			APROBADA: { color: 'green', icon: CheckCircle, text: 'Aprobada' },
			RECHAZADA: { color: 'red', icon: XCircle, text: 'Rechazada' }
		};
		const badge = badges[estado] || badges.PENDIENTE;
		const Icon = badge.icon;
		return (
			<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${badge.color}-100 text-${badge.color}-800`}>
				<Icon className="h-3 w-3" />
				{badge.text}
			</span>
		);
	};

	const estadisticas = {
		total: matriculas.length,
		pendientes: matriculas.filter(m => m.estado === 'PENDIENTE').length,
		aprobadas: matriculas.filter(m => m.estado === 'APROBADA').length,
		rechazadas: matriculas.filter(m => m.estado === 'RECHAZADA').length
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('registro')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Gestión de Matrículas</h1>
						<p className="mt-1 text-gray-600">Aprobación y control de matrículas estudiantiles</p>
					</div>

					{/* Estadísticas */}
					<div className="grid gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Total</p>
									<p className="mt-1 text-2xl font-bold text-gray-900">{estadisticas.total}</p>
								</div>
								<UserPlus className="h-10 w-10 text-blue-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Pendientes</p>
									<p className="mt-1 text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
								</div>
								<Clock className="h-10 w-10 text-yellow-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Aprobadas</p>
									<p className="mt-1 text-2xl font-bold text-green-600">{estadisticas.aprobadas}</p>
								</div>
								<CheckCircle className="h-10 w-10 text-green-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Rechazadas</p>
									<p className="mt-1 text-2xl font-bold text-red-600">{estadisticas.rechazadas}</p>
								</div>
								<XCircle className="h-10 w-10 text-red-600" />
							</div>
						</div>
					</div>

					{/* Filtros */}
					<div className="rounded-lg bg-white p-4 shadow-sm">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="relative md:col-span-2">
								<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									placeholder="Buscar por código o nombre del estudiante..."
									value={busqueda}
									onChange={(e) => setBusqueda(e.target.value)}
									className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
								/>
							</div>
							<div className="relative">
								<Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
								<select
									value={estadoFiltro}
									onChange={(e) => setEstadoFiltro(e.target.value)}
									className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
								>
									<option value="TODOS">Todos los estados</option>
									<option value="PENDIENTE">Pendientes</option>
									<option value="APROBADA">Aprobadas</option>
									<option value="RECHAZADA">Rechazadas</option>
								</select>
							</div>
						</div>
					</div>

					{/* Lista de Matrículas */}
					{loading ? (
						<Loader label="Cargando matrículas..." />
					) : matriculasFiltradas.length === 0 ? (
						<EmptyState title="No hay matrículas" description="No se encontraron matrículas con los filtros aplicados" />
					) : (
						<div className="space-y-4">
							{matriculasFiltradas.map((matricula) => (
								<div key={matricula.cod_matricula} className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3 className="font-semibold text-gray-900">
													{matricula.nombre_estudiante}
												</h3>
												{getEstadoBadge(matricula.estado)}
											</div>
											<div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
												<p>📋 Código: {matricula.cod_estudiante}</p>
												<p>📅 Período: {matricula.periodo}</p>
												<p>📚 Asignaturas: {matricula.num_asignaturas || 0}</p>
												<p>💰 Créditos: {matricula.total_creditos || 0}</p>
											</div>
											{matricula.fecha_solicitud && (
												<p className="mt-2 text-xs text-gray-500">
													Solicitado: {new Date(matricula.fecha_solicitud).toLocaleDateString()}
												</p>
											)}
										</div>
										{matricula.estado === 'PENDIENTE' && (
											<div className="flex gap-2 ml-4">
												<button
													onClick={() => handleAprobar(matricula.cod_matricula)}
													className="flex items-center gap-1 px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
												>
													<CheckCircle className="h-4 w-4" />
													Aprobar
												</button>
												<button
													onClick={() => handleRechazar(matricula.cod_matricula)}
													className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
												>
													<XCircle className="h-4 w-4" />
													Rechazar
												</button>
											</div>
										)}
										<button className="ml-4 text-blue-600 hover:text-blue-700">
											<FileText className="h-5 w-5" />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
