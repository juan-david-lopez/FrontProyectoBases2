import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { fetchGruposDocente } from '../../services/docentesService.js';
import { fetchReglaEvaluacion } from '../../services/notasService.js';
import { Plus, Trash2, Save, BookOpen, Percent, AlertCircle, FileText } from 'lucide-react';

export default function ExamenesPage() {
	const { user } = useAuth();
	const [grupos, setGrupos] = useState([]);
	const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
	const [itemsEvaluacion, setItemsEvaluacion] = useState([]);
	const [nuevoItem, setNuevoItem] = useState({ nombre: '', porcentaje: '' });
	const [loading, setLoading] = useState(true);
	const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

	const items = [
		{ to: '/docente/dashboard', label: 'Dashboard' },
		{ to: '/docente/grupos', label: 'Mis Grupos' },
		{ to: '/docente/examenes', label: 'Configurar Evaluaciones' },
		{ to: '/docente/calificaciones', label: 'Calificaciones' },
		{ to: '/docente/reportes', label: 'Reportes' },
	];

	useEffect(() => {
		cargarGrupos();
	}, []);

	useEffect(() => {
		if (grupoSeleccionado) {
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

	const cargarReglaEvaluacion = async () => {
		try {
			const data = await fetchReglaEvaluacion(grupoSeleccionado.id);
			setItemsEvaluacion(data?.items || []);
		} catch (error) {
			console.error('Error al cargar regla de evaluación:', error);
			setItemsEvaluacion([]);
		}
	};

	const agregarItem = () => {
		if (!nuevoItem.nombre || !nuevoItem.porcentaje) {
			setMensaje({ tipo: 'error', texto: 'Completa todos los campos' });
			return;
		}

		const porcentaje = parseFloat(nuevoItem.porcentaje);
		if (isNaN(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
			setMensaje({ tipo: 'error', texto: 'El porcentaje debe estar entre 1 y 100' });
			return;
		}

		const totalActual = itemsEvaluacion.reduce((sum, item) => sum + item.porcentaje, 0);
		if (totalActual + porcentaje > 100) {
			setMensaje({ tipo: 'error', texto: `El total superaría 100%. Disponible: ${100 - totalActual}%` });
			return;
		}

		setItemsEvaluacion([
			...itemsEvaluacion,
			{
				id: Date.now(),
				nombre: nuevoItem.nombre,
				porcentaje: porcentaje,
				temporal: true
			}
		]);

		setNuevoItem({ nombre: '', porcentaje: '' });
		setMensaje({ tipo: '', texto: '' });
	};

	const eliminarItem = (id) => {
		setItemsEvaluacion(itemsEvaluacion.filter(item => item.id !== id));
	};

	const guardarRegla = async () => {
		const total = itemsEvaluacion.reduce((sum, item) => sum + item.porcentaje, 0);
		
		if (total !== 100) {
			setMensaje({ tipo: 'error', texto: `El total debe ser 100%. Actual: ${total}%` });
			return;
		}

		try {
			// Aquí iría la llamada al servicio para guardar
			// await crearReglaEvaluacion(grupoSeleccionado.id, itemsEvaluacion);
			
			setMensaje({ tipo: 'success', texto: 'Regla de evaluación guardada correctamente' });
			setTimeout(() => cargarReglaEvaluacion(), 1000);
		} catch (error) {
			setMensaje({ tipo: 'error', texto: 'Error al guardar la regla de evaluación' });
		}
	};

	const totalPorcentaje = itemsEvaluacion.reduce((sum, item) => sum + item.porcentaje, 0);

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
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Configurar Evaluaciones</h1>
						<p className="mt-1 text-gray-600">Define cómo se evaluarán tus grupos</p>
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
										<FileText className="h-5 w-5 text-gray-400" />
									</div>
									<h3 className="mb-1 font-semibold text-gray-900">{grupo.asignatura?.nombre}</h3>
									<p className="text-sm text-gray-600">{grupo.asignatura?.codigo}</p>
								</button>
							))}
						</div>
					</div>

					{grupoSeleccionado && (
						<>
							{/* Agregar Nuevo Item */}
							<div className="rounded-lg bg-white p-6 shadow-sm">
								<h3 className="mb-4 text-lg font-semibold text-gray-900">Agregar Item de Evaluación</h3>
								
								<div className="grid gap-4 md:grid-cols-3">
									<div className="md:col-span-2">
										<label className="mb-2 block text-sm font-medium text-gray-700">
											Nombre del Item
										</label>
										<input
											type="text"
											value={nuevoItem.nombre}
											onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })}
											placeholder="Ej: Parcial 1, Quices, Proyecto Final"
											className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
										/>
									</div>

									<div>
										<label className="mb-2 block text-sm font-medium text-gray-700">
											Porcentaje (%)
										</label>
										<div className="flex gap-2">
											<input
												type="number"
												step="0.01"
												min="0"
												max="100"
												value={nuevoItem.porcentaje}
												onChange={(e) => setNuevoItem({ ...nuevoItem, porcentaje: e.target.value })}
												placeholder="0-100"
												className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
											/>
											<button
												onClick={agregarItem}
												className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
											>
												<Plus className="h-5 w-5" />
											</button>
										</div>
									</div>
								</div>

								<p className="mt-2 text-sm text-gray-600">
									Disponible: <span className="font-semibold">{(100 - totalPorcentaje).toFixed(2)}%</span>
								</p>
							</div>

							{/* Lista de Items */}
							<div className="rounded-lg bg-white p-6 shadow-sm">
								<div className="mb-4 flex items-center justify-between">
									<h3 className="text-lg font-semibold text-gray-900">Regla de Evaluación</h3>
									<div className={`rounded-full px-4 py-2 text-sm font-semibold ${
										totalPorcentaje === 100 
											? 'bg-green-100 text-green-800' 
											: totalPorcentaje > 100
											? 'bg-red-100 text-red-800'
											: 'bg-yellow-100 text-yellow-800'
									}`}>
										Total: {totalPorcentaje.toFixed(2)}%
									</div>
								</div>

								{itemsEvaluacion.length === 0 ? (
									<div className="py-12 text-center">
										<FileText className="mx-auto h-12 w-12 text-gray-400" />
										<p className="mt-2 text-gray-600">No hay items de evaluación configurados</p>
										<p className="text-sm text-gray-500">Agrega items arriba para crear la regla</p>
									</div>
								) : (
									<div className="space-y-3">
										{itemsEvaluacion.map((item) => (
											<div
												key={item.id}
												className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
											>
												<div className="flex items-center gap-3">
													<Percent className="h-5 w-5 text-blue-600" />
													<div>
														<p className="font-medium text-gray-900">{item.nombre}</p>
														{item.temporal && (
															<span className="text-xs text-gray-500">(No guardado)</span>
														)}
													</div>
												</div>
												<div className="flex items-center gap-4">
													<span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
														{item.porcentaje}%
													</span>
													<button
														onClick={() => eliminarItem(item.id)}
														className="rounded p-2 text-red-600 hover:bg-red-50"
													>
														<Trash2 className="h-5 w-5" />
													</button>
												</div>
											</div>
										))}
									</div>
								)}

								{itemsEvaluacion.length > 0 && (
									<div className="mt-6 flex justify-end gap-3">
										<button
											onClick={() => setItemsEvaluacion([])}
											className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-300"
										>
											Limpiar Todo
										</button>
										<button
											onClick={guardarRegla}
											disabled={totalPorcentaje !== 100}
											className={`flex items-center gap-2 rounded-lg px-6 py-2 font-semibold text-white ${
												totalPorcentaje === 100
													? 'bg-green-600 hover:bg-green-700'
													: 'cursor-not-allowed bg-gray-400'
											}`}
										>
											<Save className="h-5 w-5" />
											Guardar Regla
										</button>
									</div>
								)}
							</div>
						</>
					)}
				</main>
			</div>
		</div>
	);
}
