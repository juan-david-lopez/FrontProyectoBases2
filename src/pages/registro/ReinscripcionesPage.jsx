import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { RefreshCw, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

export default function ReinscripcionesPage() {
	const [reinscripciones] = useState([
		{ cod: 'R001', estudiante: 'Juan Pérez', programa: 'Ingeniería de Sistemas', semestre: 3, estado: 'PENDIENTE', fecha: '2025-01-10' },
		{ cod: 'R002', estudiante: 'María García', programa: 'Ingeniería Civil', semestre: 5, estado: 'APROBADA', fecha: '2025-01-09' },
	]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('registro')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Reinscripciones</h1>
						<p className="mt-1 text-gray-600">Gestión de renovación de matrículas</p>
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Total</p>
									<p className="mt-1 text-2xl font-bold text-gray-900">{reinscripciones.length}</p>
								</div>
								<RefreshCw className="h-10 w-10 text-blue-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Pendientes</p>
									<p className="mt-1 text-2xl font-bold text-yellow-600">
										{reinscripciones.filter(r => r.estado === 'PENDIENTE').length}
									</p>
								</div>
								<AlertCircle className="h-10 w-10 text-yellow-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Aprobadas</p>
									<p className="mt-1 text-2xl font-bold text-green-600">
										{reinscripciones.filter(r => r.estado === 'APROBADA').length}
									</p>
								</div>
								<CheckCircle className="h-10 w-10 text-green-600" />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						{reinscripciones.map((reinsc) => (
							<div key={reinsc.cod} className="rounded-lg bg-white p-6 shadow-sm">
								<div className="flex items-start justify-between">
									<div>
										<h3 className="font-semibold text-gray-900">{reinsc.estudiante}</h3>
										<div className="mt-2 space-y-1 text-sm text-gray-600">
											<p>📚 Programa: {reinsc.programa}</p>
											<p>📅 Semestre: {reinsc.semestre}</p>
											<p className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												{reinsc.fecha}
											</p>
										</div>
									</div>
									<span className={`px-3 py-1 rounded-full text-xs font-medium ${
										reinsc.estado === 'APROBADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
									}`}>
										{reinsc.estado}
									</span>
								</div>
							</div>
						))}
					</div>
				</main>
			</div>
		</div>
	);
}
