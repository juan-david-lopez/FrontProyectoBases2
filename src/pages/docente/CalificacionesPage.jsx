import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { fetchGruposDocente } from '../../services/docentesService.js';
import { fetchNotasPorGrupo, registrarNotas, fetchReglaEvaluacion } from '../../services/notasService.js';
import { BookOpen, Users, Save, Plus, Edit2, FileText, AlertCircle } from 'lucide-react';

export default function CalificacionesPage() {
	const { user } = useAuth();
	const [grupos, setGrupos] = useState([]);
	const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
	const [estudiantes, setEstudiantes] = useState([]);
	const [reglaEvaluacion, setReglaEvaluacion] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editando, setEditando] = useState({});
	const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

	const items = [
		{ to: '/docente/dashboard', label: 'Dashboard' },
		{ to: '/docente/grupos', label: 'Mis Grupos' },
		{ to: '/docente/calificaciones', label: 'Calificaciones' },
		{ to: '/docente/reportes', label: 'Reportes' },
	];

	useEffect(() => {
		cargarGrupos();
	}, [user]);

	useEffect(() => {
		if (grupoSeleccionado) {
			cargarCalificaciones();
			cargarReglaEvaluacion();
		}
	}, [grupoSeleccionado]);

	const cargarGrupos = async () => {
		try {
			setLoading(true);
			const data = await fetchGruposDocente(user?.cod_referencia || user?.cod_docente);
			setGrupos(data || []);
			if (data && data.length > 0) {
				setGrupoSeleccionado(data[0]);
			}
		} catch (error) {
			console.error('Error al cargar grupos:', error);
		} finally {
			setLoading(false);
		}
	};

	const cargarCalificaciones = async () => {
		try {
			const data = await fetchNotasPorGrupo(grupoSeleccionado.id);
			setEstudiantes(data?.estudiantes || []);
		} catch {
			console.error('Error al cargar calificaciones');
			setEstudiantes([]);
		}
	};

	const cargarReglaEvaluacion = async () => {
		try {
			const data = await fetchReglaEvaluacion(grupoSeleccionado.id);
			setReglaEvaluacion(data?.items || []);
		} catch (error) {
			console.error('Error al cargar regla de evaluación:', error);
			setReglaEvaluacion([]);
		}
	};

	const handleEditarNota = (estudianteId, itemId, valor) => {
		setEditando({
			...editando,
			[`${estudianteId}-${itemId}`]: valor
		});
	};

	const handleGuardarNota = async (estudianteId, itemId) => {
		const key = `${estudianteId}-${itemId}`;
		const valor = parseFloat(editando[key]);

		if (isNaN(valor) || valor < 0 || valor > 5) {
			setMensaje({ tipo: 'error', texto: 'La nota debe estar entre 0.0 y 5.0' });
			return;
		}

		try {
			await registrarNotas({
				cod_estudiante: estudianteId,
				cod_grupo: grupoSeleccionado.id,
				cod_item_evaluacion: itemId,
				nota: valor
			});

			setMensaje({ tipo: 'success', texto: 'Nota guardada correctamente' });
			
			// Limpiar edición y recargar
			const newEditando = { ...editando };
			delete newEditando[key];
			setEditando(newEditando);
			
			cargarCalificaciones();
		} catch (error) {
			setMensaje({ tipo: 'error', texto: 'Error al guardar la nota' });
		}
	};

	const calcularDefinitiva = (notas) => {
		let total = 0;
		reglaEvaluacion.forEach(item => {
			const nota = notas?.find(n => n.cod_item_evaluacion === item.codigo);
			if (nota) {
				total += (nota.nota * item.porcentaje) / 100;
			}
		});
		return total.toFixed(2);
	};

	const getColorNota = (nota) => {
		if (nota >= 3.0) return 'text-green-600 font-semibold';
		if (nota >= 2.0) return 'text-yellow-600 font-semibold';
		return 'text-red-600 font-semibold';
	};

	if (loading) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="mx-auto flex max-w-7xl gap-6 p-4">
					<Sidebar items={items} />
					<main className="flex-1">
						<div className="animate-pulse space-y-4">
							<div className="h-8 w-48 rounded bg-gray-200"></div>
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
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold text-gray-900">Gestión de Calificaciones</h1>
					</div>

					{mensaje.texto && (
						<div className={`rounded-lg p-4 ${
							mensaje.tipo === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
						}`}>
							<div className="flex items-center gap-2">
								<AlertCircle className="h-5 w-5" />
								{mensaje.texto}
							</div>
						</div>
					)}

					{/* Selector de Grupo */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="mb-4 flex items-center gap-2">
							<BookOpen className="h-6 w-6 text-blue-600" />
							<h2 className="text-xl font-semibold text-gray-900">Seleccionar Grupo</h2>
						</div>

						<div className="grid gap-4 md:grid-cols-3">
							{grupos.map((grupo) => (
								<button
									key={grupo.id}
									onClick={() => setGrupoSeleccionado(grupo)}
									className={`rounded-lg border-2 p-4 text-left transition ${
										grupoSeleccionado?.id === grupo.id
											? 'border-blue-600 bg-blue-50'
											: 'border-gray-200 hover:border-blue-300'
									}`}
								>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm font-medium text-gray-600">Grupo {grupo.numero}</span>
										<Users className="h-5 w-5 text-gray-400" />
									</div>
									<h3 className="mb-1 font-semibold text-gray-900">{grupo.asignatura?.nombre}</h3>
									<p className="text-sm text-gray-600">
										{grupo.asignatura?.codigo} • {grupo.estudiantes_matriculados || 0} estudiantes
									</p>
								</button>
							))}
						</div>
					</div>

					{/* Regla de Evaluación */}
					{grupoSeleccionado && reglaEvaluacion.length > 0 && (
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="mb-4 flex items-center gap-2">
								<FileText className="h-6 w-6 text-purple-600" />
								<h2 className="text-xl font-semibold text-gray-900">Regla de Evaluación</h2>
							</div>

							<div className="grid gap-3 md:grid-cols-4">
								{reglaEvaluacion.map((item) => (
									<div key={item.codigo} className="rounded-lg border border-gray-200 p-3">
										<p className="text-sm font-medium text-gray-700">{item.nombre}</p>
										<p className="text-2xl font-bold text-purple-600">{item.porcentaje}%</p>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Tabla de Calificaciones */}
					{grupoSeleccionado && (
						<div className="rounded-lg bg-white shadow-sm">
							<div className="border-b border-gray-200 p-6">
								<h2 className="text-xl font-semibold text-gray-900">
									Calificaciones - {grupoSeleccionado.asignatura?.nombre}
								</h2>
								<p className="text-sm text-gray-600">Grupo {grupoSeleccionado.numero}</p>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
												Código
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
												Estudiante
											</th>
											{reglaEvaluacion.map((item) => (
												<th key={item.codigo} className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700">
													{item.nombre}
													<span className="ml-1 text-gray-500">({item.porcentaje}%)</span>
												</th>
											))}
											<th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-700">
												Definitiva
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{estudiantes.map((estudiante) => (
											<tr key={estudiante.codigo} className="hover:bg-gray-50">
												<td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
													{estudiante.codigo}
												</td>
												<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
													{estudiante.nombre_completo}
												</td>
												{reglaEvaluacion.map((item) => {
													const nota = estudiante.notas?.find(n => n.cod_item_evaluacion === item.codigo);
													const key = `${estudiante.codigo}-${item.codigo}`;
													const estaEditando = Object.prototype.hasOwnProperty.call(editando, key);

													return (
														<td key={item.codigo} className="whitespace-nowrap px-6 py-4 text-center">
															{estaEditando ? (
																<div className="flex items-center justify-center gap-2">
																	<input
																		type="number"
																		step="0.1"
																		min="0"
																		max="5"
																		value={editando[key]}
																		onChange={(e) => handleEditarNota(estudiante.codigo, item.codigo, e.target.value)}
																		className="w-20 rounded border border-gray-300 px-2 py-1 text-center focus:border-blue-500 focus:outline-none"
																	/>
																	<button
																		onClick={() => handleGuardarNota(estudiante.codigo, item.codigo)}
																		className="rounded bg-green-600 p-1 text-white hover:bg-green-700"
																	>
																		<Save className="h-4 w-4" />
																	</button>
																</div>
															) : (
																<div className="flex items-center justify-center gap-2">
																	<span className={getColorNota(nota?.nota || 0)}>
																		{nota?.nota?.toFixed(1) || '-'}
																	</span>
																	<button
																		onClick={() => handleEditarNota(estudiante.codigo, item.codigo, nota?.nota || '')}
																		className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
																	>
																		<Edit2 className="h-4 w-4" />
																	</button>
																</div>
															)}
														</td>
													);
												})}
												<td className={`whitespace-nowrap px-6 py-4 text-center text-lg ${getColorNota(parseFloat(calcularDefinitiva(estudiante.notas)))}`}>
													{calcularDefinitiva(estudiante.notas)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{estudiantes.length === 0 && (
								<div className="py-12 text-center">
									<Users className="mx-auto h-12 w-12 text-gray-400" />
									<p className="mt-2 text-gray-600">No hay estudiantes matriculados en este grupo</p>
								</div>
							)}
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

