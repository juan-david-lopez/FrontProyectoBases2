import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { FileText, Download, Eye, Search } from 'lucide-react';

export default function ExpedientesPage() {
	const [busqueda, setBusqueda] = useState('');
	const expedientes = [
		{ cod: 'EXP001', estudiante: 'Juan Pérez', codigo: '20191234567', documentos: 12, completo: true },
		{ cod: 'EXP002', estudiante: 'María García', codigo: '20201234568', documentos: 8, completo: false },
	];

	const expedientesFiltrados = expedientes.filter(exp =>
		exp.estudiante.toLowerCase().includes(busqueda.toLowerCase()) ||
		exp.codigo.includes(busqueda)
	);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('registro')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Expedientes Académicos</h1>
						<p className="mt-1 text-gray-600">Gestión documental de estudiantes</p>
					</div>

					<div className="rounded-lg bg-white p-4 shadow-sm">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar por código o nombre..."
								value={busqueda}
								onChange={(e) => setBusqueda(e.target.value)}
								className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
							/>
						</div>
					</div>

					<div className="space-y-4">
						{expedientesFiltrados.map((exp) => (
							<div key={exp.cod} className="rounded-lg bg-white p-6 shadow-sm">
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-4">
										<FileText className="h-6 w-6 text-blue-600 mt-1" />
										<div>
											<h3 className="font-semibold text-gray-900">{exp.estudiante}</h3>
											<p className="text-sm text-gray-600 mt-1">Código: {exp.codigo}</p>
											<p className="text-sm text-gray-600">Documentos: {exp.documentos}</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${
											exp.completo ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
										}`}>
											{exp.completo ? 'Completo' : 'Incompleto'}
										</span>
										<button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
											<Eye className="h-5 w-5" />
										</button>
										<button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
											<Download className="h-5 w-5" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</main>
			</div>
		</div>
	);
}
