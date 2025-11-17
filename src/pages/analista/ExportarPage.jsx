import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { Download, FileText, FileSpreadsheet, Database } from 'lucide-react';

export default function ExportarPage() {
	const [formato, setFormato] = useState('excel');
	const [dataset, setDataset] = useState('estudiantes');

	const datasets = [
		{ id: 'estudiantes', nombre: 'Estudiantes', registros: 2847 },
		{ id: 'asignaturas', nombre: 'Asignaturas', registros: 124 },
		{ id: 'matriculas', nombre: 'Matrículas', registros: 5420 },
		{ id: 'notas', nombre: 'Calificaciones', registros: 12340 },
	];

	const formatos = [
		{ id: 'excel', nombre: 'Excel (.xlsx)', icon: FileSpreadsheet, color: 'text-green-600' },
		{ id: 'csv', nombre: 'CSV (.csv)', icon: FileText, color: 'text-blue-600' },
		{ id: 'json', nombre: 'JSON (.json)', icon: Database, color: 'text-purple-600' },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('analista')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Exportar Datos</h1>
						<p className="mt-1 text-gray-600">Descarga información en diferentes formatos</p>
					</div>

					<div className="rounded-lg bg-white p-6 shadow-sm space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								Conjunto de Datos
							</label>
							<div className="grid gap-3 md:grid-cols-2">
								{datasets.map((ds) => (
									<button
										key={ds.id}
										onClick={() => setDataset(ds.id)}
										className={`p-4 border-2 rounded-lg text-left transition-all ${
											dataset === ds.id
												? 'border-blue-600 bg-blue-50'
												: 'border-gray-200 hover:border-gray-300'
										}`}
									>
										<h3 className="font-semibold text-gray-900">{ds.nombre}</h3>
										<p className="text-sm text-gray-600">{ds.registros.toLocaleString()} registros</p>
									</button>
								))}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">
								Formato de Exportación
							</label>
							<div className="grid gap-3 md:grid-cols-3">
								{formatos.map((fmt) => {
									const Icon = fmt.icon;
									return (
										<button
											key={fmt.id}
											onClick={() => setFormato(fmt.id)}
											className={`p-4 border-2 rounded-lg text-center transition-all ${
												formato === fmt.id
													? 'border-blue-600 bg-blue-50'
													: 'border-gray-200 hover:border-gray-300'
											}`}
										>
											<Icon className={`h-8 w-8 mx-auto mb-2 ${fmt.color}`} />
											<p className="font-semibold text-gray-900">{fmt.nombre}</p>
										</button>
									);
								})}
							</div>
						</div>

						<div className="pt-4 border-t">
							<button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
								<Download className="h-5 w-5" />
								Descargar Exportación
							</button>
						</div>
					</div>

					<div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
						<h3 className="font-semibold text-blue-900 mb-2">Información de Exportación</h3>
						<ul className="text-sm text-blue-800 space-y-1">
							<li>• Los datos se exportarán según los filtros aplicados</li>
							<li>• El formato Excel incluye formato de celdas y filtros</li>
							<li>• CSV es compatible con herramientas de análisis externas</li>
							<li>• JSON es ideal para integración con otros sistemas</li>
						</ul>
					</div>
				</main>
			</div>
		</div>
	);
}
