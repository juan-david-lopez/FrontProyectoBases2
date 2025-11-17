import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { Loader } from '../../components/Loader';
import { Clock, Calendar, BookOpen, Users, AlertCircle } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

export default function HorariosCoordinadorPage() {
	const [horarios, setHorarios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');
	const [conflictos, setConflictos] = useState([]);

	const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
	const horas = Array.from({ length: 14 }, (_, i) => `${6 + i}:00`);

	const cargarHorarios = async () => {
		try {
			setLoading(true);
			const params = periodoSeleccionado ? { periodo: periodoSeleccionado } : {};
			const { data } = await axiosClient.get('/grupos', { params });
			setHorarios(data.items || []);
			detectarConflictos(data.items || []);
		} catch (error) {
			console.error('Error al cargar horarios:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarHorarios();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [periodoSeleccionado]);

	const detectarConflictos = (grupos) => {
		const conflictosEncontrados = [];
		// Lógica simplificada de detección de conflictos
		const horariosPorSlot = {};
		
		grupos.forEach(grupo => {
			if (grupo.horario && grupo.salon) {
				const key = `${grupo.horario}-${grupo.salon}`;
				if (horariosPorSlot[key]) {
					conflictosEncontrados.push({
						grupo1: horariosPorSlot[key],
						grupo2: grupo,
						tipo: 'salon'
					});
				} else {
					horariosPorSlot[key] = grupo;
				}
			}
		});

		setConflictos(conflictosEncontrados);
	};

	const getGruposEnSlot = (dia, hora) => {
		return horarios.filter(grupo => {
			if (!grupo.horario) return false;
			// Formato esperado: "LUN-MIE 08:00-10:00"
			const horarioStr = grupo.horario.toUpperCase();
			return horarioStr.includes(dia) && horarioStr.includes(hora);
		});
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('coordinador')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Horarios Académicos</h1>
						<p className="mt-1 text-gray-600">Visualización y gestión de horarios por período</p>
					</div>

					{/* Selector de Período */}
					<div className="rounded-lg bg-white p-4 shadow-sm">
						<div className="flex items-center gap-4">
							<Calendar className="h-5 w-5 text-gray-400" />
							<select
								value={periodoSeleccionado}
								onChange={(e) => setPeriodoSeleccionado(e.target.value)}
								className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
							>
								<option value="">Período Actual</option>
								<option value="2025-I">2025-I</option>
								<option value="2025-II">2025-II</option>
								<option value="2024-II">2024-II</option>
							</select>
						</div>
					</div>

					{/* Alertas de Conflictos */}
					{conflictos.length > 0 && (
						<div className="rounded-lg bg-red-50 border border-red-200 p-4">
							<div className="flex items-start gap-3">
								<AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
								<div>
									<h3 className="font-semibold text-red-900">
										{conflictos.length} Conflicto{conflictos.length > 1 ? 's' : ''} Detectado{conflictos.length > 1 ? 's' : ''}
									</h3>
									<ul className="mt-2 text-sm text-red-800 space-y-1">
										{conflictos.slice(0, 3).map((conflicto, idx) => (
											<li key={idx}>
												• {conflicto.grupo1.nombre_asignatura} y {conflicto.grupo2.nombre_asignatura} 
												{' '}comparten {conflicto.tipo === 'salon' ? 'salón' : 'horario'}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					)}

					{/* Grid de Horarios */}
					{loading ? (
						<Loader label="Cargando horarios..." />
					) : (
						<div className="rounded-lg bg-white p-6 shadow-sm overflow-x-auto">
							<div className="min-w-[800px]">
								<div className="grid grid-cols-7 gap-2">
									{/* Header */}
									<div className="font-semibold text-gray-700 p-2">Hora</div>
									{diasSemana.map(dia => (
										<div key={dia} className="font-semibold text-gray-700 p-2 text-center">
											{dia}
										</div>
									))}

									{/* Filas por hora */}
									{horas.map(hora => (
										<React.Fragment key={hora}>
											<div className="text-sm text-gray-600 p-2 border-r border-gray-200">
												{hora}
											</div>
											{diasSemana.map(dia => {
												const grupos = getGruposEnSlot(dia, hora);
												return (
													<div key={`${dia}-${hora}`} className="border border-gray-200 p-1 min-h-[60px]">
														{grupos.map((grupo, idx) => (
															<div 
																key={idx}
																className="text-xs bg-blue-100 text-blue-900 p-1 rounded mb-1 hover:bg-blue-200 cursor-pointer"
																title={`${grupo.nombre_asignatura} - ${grupo.salon}`}
															>
																<div className="font-semibold truncate">
																	{grupo.cod_asignatura}
																</div>
																<div className="text-[10px] truncate">
																	{grupo.salon}
																</div>
															</div>
														))}
													</div>
												);
											})}
										</React.Fragment>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Estadísticas */}
					{!loading && (
						<div className="grid gap-4 md:grid-cols-4">
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<div className="flex items-center gap-2">
									<Clock className="h-5 w-5 text-blue-600" />
									<div>
										<p className="text-sm text-gray-600">Total Grupos</p>
										<p className="text-2xl font-bold text-gray-900">{horarios.length}</p>
									</div>
								</div>
							</div>
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<div className="flex items-center gap-2">
									<BookOpen className="h-5 w-5 text-green-600" />
									<div>
										<p className="text-sm text-gray-600">Asignaturas</p>
										<p className="text-2xl font-bold text-gray-900">
											{new Set(horarios.map(h => h.cod_asignatura)).size}
										</p>
									</div>
								</div>
							</div>
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<div className="flex items-center gap-2">
									<Users className="h-5 w-5 text-purple-600" />
									<div>
										<p className="text-sm text-gray-600">Docentes</p>
										<p className="text-2xl font-bold text-gray-900">
											{new Set(horarios.map(h => h.cod_docente).filter(Boolean)).size}
										</p>
									</div>
								</div>
							</div>
							<div className="rounded-lg bg-white p-4 shadow-sm">
								<div className="flex items-center gap-2">
									<AlertCircle className="h-5 w-5 text-red-600" />
									<div>
										<p className="text-sm text-gray-600">Conflictos</p>
										<p className="text-2xl font-bold text-red-600">{conflictos.length}</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
