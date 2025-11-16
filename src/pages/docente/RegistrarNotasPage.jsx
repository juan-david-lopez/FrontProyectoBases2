import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { Save, ArrowLeft, AlertCircle, CheckCircle, Users, BookOpen } from 'lucide-react';
import { fetchNotasPorGrupo, registrarNotas, fetchReglaEvaluacion } from '../../services/notasService.js';

export default function RegistrarNotasPage() {
	const { grupoId } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [estudiantes, setEstudiantes] = useState([]);
	const [reglaEvaluacion, setReglaEvaluacion] = useState([]);
	const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
	const [notas, setNotas] = useState({});
	const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
	const [infoGrupo, setInfoGrupo] = useState(null);

	const items = [
		{ to: '/docente/dashboard', label: 'Dashboard' },
		{ to: '/docente/grupos', label: 'Mis Grupos' },
		{ to: '/docente/calificaciones', label: 'Calificaciones' },
		{ to: '/docente/reportes', label: 'Reportes' },
	];

	useEffect(() => {
		cargarDatos();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [grupoId]);

	const cargarDatos = async () => {
		try {
			setLoading(true);
			
			// Cargar regla de evaluación
			const regla = await fetchReglaEvaluacion(grupoId);
			setReglaEvaluacion(regla.items || regla);
			
			// Cargar estudiantes y notas actuales
			const data = await fetchNotasPorGrupo(grupoId);
			setEstudiantes(data.items || []);
			setInfoGrupo(data.grupo_info);
			
			// Inicializar objeto de notas vacío
			const notasIniciales = {};
			(data.items || []).forEach(est => {
				notasIniciales[est.cod_estudiante] = '';
			});
			setNotas(notasIniciales);
			
		} catch (error) {
			console.error('Error al cargar datos:', error);
			setMensaje({ tipo: 'error', texto: 'Error al cargar los datos' });
		} finally {
			setLoading(false);
		}
	};

	const handleNotaChange = (codEstudiante, valor) => {
		// Validar que sea un número entre 0 y 5
		if (valor === '' || (parseFloat(valor) >= 0 && parseFloat(valor) <= 5)) {
			setNotas(prev => ({
				...prev,
				[codEstudiante]: valor
			}));
		}
	};

	const handleGuardarNotas = async () => {
		if (!actividadSeleccionada) {
			setMensaje({ tipo: 'error', texto: 'Seleccione una actividad primero' });
			return;
		}

		// Validar que al menos haya una nota ingresada
		const notasAGuardar = Object.entries(notas)
			.filter(([_, nota]) => nota !== '')
			.map(([codEstudiante, nota]) => ({
				cod_estudiante: codEstudiante,
				nota: parseFloat(nota)
			}));

		if (notasAGuardar.length === 0) {
			setMensaje({ tipo: 'error', texto: 'Debe ingresar al menos una nota' });
			return;
		}

		try {
			setSaving(true);
			setMensaje({ tipo: '', texto: '' });

			const payload = {
				cod_grupo: parseInt(grupoId),
				cod_tipo_actividad: actividadSeleccionada.cod_tipo_actividad,
				numero_actividad: 1, // Puedes hacer esto dinámico si hay múltiples actividades por tipo
				notas: notasAGuardar
			};

			const response = await registrarNotas(payload);
			
			setMensaje({ 
				tipo: 'success', 
				texto: response.mensaje || `${response.notas_procesadas} notas registradas correctamente` 
			});

			// Recargar datos
			await cargarDatos();
			
			// Limpiar notas
			const notasVacias = {};
			estudiantes.forEach(est => {
				notasVacias[est.cod_estudiante] = '';
			});
			setNotas(notasVacias);

		} catch (error) {
			console.error('Error al guardar notas:', error);
			setMensaje({ 
				tipo: 'error', 
				texto: error.response?.data?.detalle || 'Error al guardar las notas' 
			});
		} finally {
			setSaving(false);
		}
	};

	const calcularProgreso = (estudiante) => {
		let completadas = 0;
		let total = reglaEvaluacion.length;
		
		reglaEvaluacion.forEach(actividad => {
			const campo = `nota_${actividad.nombre_actividad.toLowerCase().replace(/\s+/g, '_')}`;
			if (estudiante[campo] !== null && estudiante[campo] !== undefined) {
				completadas++;
			}
		});
		
		return total > 0 ? Math.round((completadas / total) * 100) : 0;
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
					<div className="flex items-center justify-between">
						<div>
							<button
								onClick={() => navigate('/docente/calificaciones')}
								className="mb-2 flex items-center gap-2 text-blue-600 hover:text-blue-800"
							>
								<ArrowLeft className="h-4 w-4" />
								Volver a Calificaciones
							</button>
							<h1 className="text-3xl font-bold text-gray-900">Registrar Notas</h1>
							{infoGrupo && (
								<p className="text-gray-600">
									{infoGrupo.nombre_asignatura} - Grupo {infoGrupo.cod_grupo}
								</p>
							)}
						</div>
					</div>

					{/* Mensajes */}
					{mensaje.texto && (
						<div className={`rounded-lg p-4 ${
							mensaje.tipo === 'success' 
								? 'bg-green-50 text-green-800 border border-green-200' 
								: 'bg-red-50 text-red-800 border border-red-200'
						}`}>
							<div className="flex items-center gap-2">
								{mensaje.tipo === 'success' ? (
									<CheckCircle className="h-5 w-5" />
								) : (
									<AlertCircle className="h-5 w-5" />
								)}
								{mensaje.texto}
							</div>
						</div>
					)}

					{/* Selector de Actividad */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="mb-4 flex items-center gap-2">
							<BookOpen className="h-5 w-5 text-blue-600" />
							<h2 className="text-xl font-semibold text-gray-900">Seleccionar Actividad</h2>
						</div>
						<div className="grid gap-3 md:grid-cols-3">
							{reglaEvaluacion.map((actividad) => (
								<button
									key={actividad.cod_tipo_actividad}
									onClick={() => setActividadSeleccionada(actividad)}
									className={`rounded-lg border-2 p-4 text-left transition ${
										actividadSeleccionada?.cod_tipo_actividad === actividad.cod_tipo_actividad
											? 'border-blue-600 bg-blue-50'
											: 'border-gray-200 hover:border-blue-300'
									}`}
								>
									<h3 className="font-semibold text-gray-900">{actividad.nombre_actividad}</h3>
									<p className="text-sm text-gray-600">Porcentaje: {actividad.porcentaje}%</p>
									{actividad.fecha_limite && (
										<p className="text-xs text-gray-500">
											Límite: {new Date(actividad.fecha_limite).toLocaleDateString('es-CO')}
										</p>
									)}
								</button>
							))}
						</div>
					</div>

					{/* Tabla de Estudiantes */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="mb-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-blue-600" />
								<h2 className="text-xl font-semibold text-gray-900">
									Estudiantes ({estudiantes.length})
								</h2>
							</div>
							<button
								onClick={handleGuardarNotas}
								disabled={saving || !actividadSeleccionada}
								className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Save className="h-4 w-4" />
								{saving ? 'Guardando...' : 'Guardar Notas'}
							</button>
						</div>

						{!actividadSeleccionada && (
							<div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-center text-yellow-800">
								<AlertCircle className="mx-auto mb-2 h-8 w-8" />
								<p>Seleccione una actividad para comenzar a ingresar notas</p>
							</div>
						)}

						{actividadSeleccionada && (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Estudiante</th>
											<th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Progreso</th>
											<th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
												Nota {actividadSeleccionada.nombre_actividad}
											</th>
											<th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Nota Definitiva</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{estudiantes.map((estudiante) => {
											const progreso = calcularProgreso(estudiante);
											return (
												<tr key={estudiante.cod_estudiante} className="hover:bg-gray-50">
													<td className="px-4 py-3 text-sm font-medium text-gray-900">
														{estudiante.cod_estudiante}
													</td>
													<td className="px-4 py-3 text-sm text-gray-900">
														{estudiante.nombre_estudiante}
													</td>
													<td className="px-4 py-3">
														<div className="flex flex-col items-center gap-1">
															<div className="h-2 w-full rounded-full bg-gray-200">
																<div
																	className={`h-2 rounded-full ${
																		progreso === 100 ? 'bg-green-500' : 'bg-blue-500'
																	}`}
																	style={{ width: `${progreso}%` }}
																></div>
															</div>
															<span className="text-xs text-gray-600">{progreso}%</span>
														</div>
													</td>
													<td className="px-4 py-3">
														<input
															type="number"
															min="0"
															max="5"
															step="0.1"
															value={notas[estudiante.cod_estudiante] || ''}
															onChange={(e) => handleNotaChange(estudiante.cod_estudiante, e.target.value)}
															className="w-20 rounded border border-gray-300 px-2 py-1 text-center focus:border-blue-500 focus:outline-none"
															placeholder="0.0"
														/>
													</td>
													<td className="px-4 py-3 text-center">
														<span className={`font-semibold ${
															estudiante.nota_definitiva >= 3.0 
																? 'text-green-600' 
																: estudiante.nota_definitiva !== null 
																	? 'text-red-600' 
																	: 'text-gray-400'
														}`}>
															{estudiante.nota_definitiva !== null 
																? estudiante.nota_definitiva.toFixed(2) 
																: '-'}
														</span>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
