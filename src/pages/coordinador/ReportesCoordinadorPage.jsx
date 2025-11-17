import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { BarChart3, Download, FileText, TrendingUp, Users } from 'lucide-react';

export default function ReportesCoordinadorPage() {
	const [tipoReporte, setTipoReporte] = useState('ocupacion');
	const [generando, setGenerando] = useState(false);

	const reportesDisponibles = [
		{
			id: 'ocupacion',
			nombre: 'Ocupación de Grupos',
			descripcion: 'Análisis de cupos y matrículas por grupo',
			icon: Users,
			color: 'blue'
		},
		{
			id: 'asignaturas',
			nombre: 'Asignaturas Ofertadas',
			descripcion: 'Listado completo de asignaturas por período',
			icon: FileText,
			color: 'green'
		},
		{
			id: 'docentes',
			nombre: 'Carga Docente',
			descripcion: 'Distribución de grupos por docente',
			icon: TrendingUp,
			color: 'purple'
		},
		{
			id: 'horarios',
			nombre: 'Uso de Salones',
			descripcion: 'Ocupación de espacios físicos',
			icon: BarChart3,
			color: 'orange'
		}
	];

	const handleGenerar = async () => {
		setGenerando(true);
		// Simulación de generación
		await new Promise(resolve => setTimeout(resolve, 2000));
		setGenerando(false);
		alert(`Reporte "${reportesDisponibles.find(r => r.id === tipoReporte)?.nombre}" generado correctamente`);
	};

	const estadisticasMock = {
		gruposActivos: 120,
		ocupacionPromedio: 85,
		asignaturasOfertadas: 45,
		docentesActivos: 38
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('coordinador')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Reportes Académicos</h1>
						<p className="mt-1 text-gray-600">Generación de informes y estadísticas</p>
					</div>

					{/* Estadísticas Rápidas */}
					<div className="grid gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Grupos Activos</p>
									<p className="mt-1 text-2xl font-bold text-gray-900">
										{estadisticasMock.gruposActivos}
									</p>
								</div>
								<Users className="h-10 w-10 text-blue-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Ocupación</p>
									<p className="mt-1 text-2xl font-bold text-green-600">
										{estadisticasMock.ocupacionPromedio}%
									</p>
								</div>
								<TrendingUp className="h-10 w-10 text-green-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Asignaturas</p>
									<p className="mt-1 text-2xl font-bold text-gray-900">
										{estadisticasMock.asignaturasOfertadas}
									</p>
								</div>
								<FileText className="h-10 w-10 text-purple-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Docentes</p>
									<p className="mt-1 text-2xl font-bold text-gray-900">
										{estadisticasMock.docentesActivos}
									</p>
								</div>
								<BarChart3 className="h-10 w-10 text-orange-600" />
							</div>
						</div>
					</div>

					{/* Selector de Reportes */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Tipo de Reporte</h2>
						<div className="grid gap-4 md:grid-cols-2">
							{reportesDisponibles.map((reporte) => {
								const Icon = reporte.icon;
								const isSelected = tipoReporte === reporte.id;
								return (
									<button
										key={reporte.id}
										onClick={() => setTipoReporte(reporte.id)}
										className={`text-left p-4 rounded-lg border-2 transition-all ${
											isSelected 
												? `border-${reporte.color}-500 bg-${reporte.color}-50` 
												: 'border-gray-200 hover:border-gray-300'
										}`}
									>
										<div className="flex items-start gap-3">
											<Icon className={`h-6 w-6 ${isSelected ? `text-${reporte.color}-600` : 'text-gray-400'}`} />
											<div className="flex-1">
												<h3 className={`font-semibold ${isSelected ? `text-${reporte.color}-900` : 'text-gray-900'}`}>
													{reporte.nombre}
												</h3>
												<p className="mt-1 text-sm text-gray-600">
													{reporte.descripcion}
												</p>
											</div>
											{isSelected && (
												<div className={`rounded-full bg-${reporte.color}-600 w-5 h-5 flex items-center justify-center`}>
													<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
													</svg>
												</div>
											)}
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* Configuración del Reporte */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h2>
						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Período Académico
								</label>
								<select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
									<option>2025-I</option>
									<option>2024-II</option>
									<option>2024-I</option>
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Formato de Salida
								</label>
								<select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
									<option value="pdf">PDF</option>
									<option value="excel">Excel</option>
									<option value="csv">CSV</option>
								</select>
							</div>
						</div>
					</div>

					{/* Botón Generar */}
					<div className="flex justify-end gap-4">
						<button
							onClick={() => alert('Vista previa no disponible')}
							className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
						>
							Vista Previa
						</button>
						<button
							onClick={handleGenerar}
							disabled={generando}
							className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
						>
							<Download className="h-5 w-5" />
							{generando ? 'Generando...' : 'Generar Reporte'}
						</button>
					</div>

					{/* Historial de Reportes */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">Reportes Recientes</h2>
						<div className="space-y-3">
							{[
								{ nombre: 'Ocupación de Grupos - 2025-I', fecha: '2025-01-15', formato: 'PDF' },
								{ nombre: 'Carga Docente - 2024-II', fecha: '2025-01-10', formato: 'Excel' },
								{ nombre: 'Uso de Salones - 2024-II', fecha: '2025-01-05', formato: 'PDF' }
							].map((reporte, idx) => (
								<div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
									<div className="flex items-center gap-3">
										<FileText className="h-5 w-5 text-gray-400" />
										<div>
											<p className="font-medium text-gray-900">{reporte.nombre}</p>
											<p className="text-sm text-gray-500">{reporte.fecha} • {reporte.formato}</p>
										</div>
									</div>
									<button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
										Descargar
									</button>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
