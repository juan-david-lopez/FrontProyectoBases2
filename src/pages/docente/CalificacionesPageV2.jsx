import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { BookOpen, Users, Edit, TrendingUp, Calendar } from 'lucide-react';
import { fetchGruposDocente } from '../../services/docentesService.js';

export default function CalificacionesPage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [grupos, setGrupos] = useState([]);
	const [loading, setLoading] = useState(true);

	const items = [
		{ to: '/docente/dashboard', label: 'Dashboard' },
		{ to: '/docente/grupos', label: 'Mis Grupos' },
		{ to: '/docente/calificaciones', label: 'Calificaciones' },
		{ to: '/docente/reportes', label: 'Reportes' },
	];

	useEffect(() => {
		if (user?.cod_docente) {
			cargarGrupos();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const cargarGrupos = async () => {
		try {
			setLoading(true);
			console.log('🔍 Cargando grupos del docente:', user?.cod_docente);
			const data = await fetchGruposDocente(user?.cod_docente);
			console.log('📦 Grupos recibidos:', data);
			setGrupos(data.items || data || []);
		} catch (err) {
			console.error('Error al cargar grupos:', err);
		} finally {
			setLoading(false);
		}
	};

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
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Calificaciones</h1>
						<p className="text-gray-600">Gestiona las notas de tus grupos</p>
					</div>

					{/* Información */}
					<div className="grid gap-6 md:grid-cols-3">
						<div className="rounded-lg bg-blue-50 p-6 border border-blue-200">
							<div className="flex items-center gap-3 mb-2">
								<BookOpen className="h-8 w-8 text-blue-600" />
								<h3 className="text-lg font-semibold text-gray-900">Mis Grupos</h3>
							</div>
							<p className="text-3xl font-bold text-blue-600">{grupos.length}</p>
							<p className="text-sm text-gray-600">Grupos activos</p>
						</div>

						<div className="rounded-lg bg-green-50 p-6 border border-green-200">
							<div className="flex items-center gap-3 mb-2">
								<Users className="h-8 w-8 text-green-600" />
								<h3 className="text-lg font-semibold text-gray-900">Estudiantes</h3>
							</div>
							<p className="text-3xl font-bold text-green-600">
								{grupos.reduce((sum, g) => sum + (g.estudiantes_matriculados || 0), 0)}
							</p>
							<p className="text-sm text-gray-600">En total</p>
						</div>

						<div className="rounded-lg bg-purple-50 p-6 border border-purple-200">
							<div className="flex items-center gap-3 mb-2">
								<TrendingUp className="h-8 w-8 text-purple-600" />
								<h3 className="text-lg font-semibold text-gray-900">Progreso</h3>
							</div>
							<p className="text-3xl font-bold text-purple-600">
								{grupos.length > 0 ? Math.round(grupos.reduce((sum, g) => sum + (g.progreso_evaluacion || 0), 0) / grupos.length) : 0}%
							</p>
							<p className="text-sm text-gray-600">Promedio</p>
						</div>
					</div>

					{/* Lista de Grupos */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="mb-4 text-xl font-semibold text-gray-900">Grupos Asignados</h2>
						
						{grupos.length === 0 ? (
							<div className="rounded-lg bg-gray-50 p-12 text-center">
								<BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<h3 className="mb-2 text-lg font-semibold text-gray-900">
									No tienes grupos asignados
								</h3>
								<p className="text-gray-600">
									Contacta al coordinador académico para asignación de grupos
								</p>
							</div>
						) : (
							<div className="grid gap-4 md:grid-cols-2">
								{grupos.map((grupo) => (
									<div
										key={grupo.cod_grupo}
										className="rounded-lg border-2 border-gray-200 p-6 hover:border-blue-300 transition"
									>
										<div className="mb-4 flex items-start justify-between">
											<div>
												<h3 className="text-lg font-semibold text-gray-900">
													{grupo.nombre_asignatura}
												</h3>
												<p className="text-sm text-gray-600">
													Grupo {grupo.cod_grupo} • {grupo.nombre_sede}
												</p>
											</div>
											<span className={`rounded-full px-3 py-1 text-xs font-medium ${
												grupo.estado === 'ACTIVO' 
													? 'bg-green-100 text-green-800' 
													: 'bg-gray-100 text-gray-800'
											}`}>
												{grupo.estado}
											</span>
										</div>

										<div className="mb-4 space-y-2 text-sm">
											<div className="flex items-center gap-2 text-gray-600">
												<Users className="h-4 w-4" />
												<span>{grupo.estudiantes_matriculados || 0} estudiantes</span>
											</div>
											<div className="flex items-center gap-2 text-gray-600">
												<Calendar className="h-4 w-4" />
												<span>{grupo.horario}</span>
											</div>
										</div>

										<div className="space-y-3">
											<button
												onClick={() => navigate(`/docente/calificaciones/${grupo.cod_grupo}/registrar`)}
												className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
											>
												<Edit className="h-4 w-4" />
												Registrar Notas
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
