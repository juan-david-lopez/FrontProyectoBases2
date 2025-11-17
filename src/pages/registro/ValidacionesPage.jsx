import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getSidebarItems } from '../../utils/sidebarConfig';
import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';

export default function ValidacionesPage() {
	const [validaciones] = useState([
		{ tipo: 'Promedio Académico', estudiante: 'Juan Pérez', estado: 'VALIDO', valor: '3.8' },
		{ tipo: 'Prerrequisitos', estudiante: 'María García', estado: 'INVALIDO', valor: 'Falta Cálculo I' },
		{ tipo: 'Pago Matrícula', estudiante: 'Carlos López', estado: 'PENDIENTE', valor: 'Verificando' },
	]);

	const getIcono = (estado) => {
		const iconos = {
			VALIDO: { Icon: CheckCircle, color: 'text-green-600' },
			INVALIDO: { Icon: XCircle, color: 'text-red-600' },
			PENDIENTE: { Icon: AlertTriangle, color: 'text-yellow-600' }
		};
		return iconos[estado] || iconos.PENDIENTE;
	};

	const estadisticas = {
		total: validaciones.length,
		validas: validaciones.filter(v => v.estado === 'VALIDO').length,
		invalidas: validaciones.filter(v => v.estado === 'INVALIDO').length,
		pendientes: validaciones.filter(v => v.estado === 'PENDIENTE').length
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={getSidebarItems('registro')} />
				
				<main className="flex-1 space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Validaciones Académicas</h1>
						<p className="mt-1 text-gray-600">Control de requisitos y validaciones</p>
					</div>

					<div className="grid gap-4 md:grid-cols-4">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Total</p>
									<p className="mt-1 text-2xl font-bold text-gray-900">{estadisticas.total}</p>
								</div>
								<Shield className="h-10 w-10 text-blue-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Válidas</p>
									<p className="mt-1 text-2xl font-bold text-green-600">{estadisticas.validas}</p>
								</div>
								<CheckCircle className="h-10 w-10 text-green-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Inválidas</p>
									<p className="mt-1 text-2xl font-bold text-red-600">{estadisticas.invalidas}</p>
								</div>
								<XCircle className="h-10 w-10 text-red-600" />
							</div>
						</div>
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">Pendientes</p>
									<p className="mt-1 text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
								</div>
								<AlertTriangle className="h-10 w-10 text-yellow-600" />
							</div>
						</div>
					</div>

					<div className="space-y-4">
						{validaciones.map((val, idx) => {
							const { Icon, color } = getIcono(val.estado);
							return (
								<div key={idx} className="rounded-lg bg-white p-6 shadow-sm">
									<div className="flex items-start justify-between">
										<div className="flex items-start gap-4">
											<Icon className={`h-6 w-6 ${color} mt-1`} />
											<div>
												<h3 className="font-semibold text-gray-900">{val.tipo}</h3>
												<p className="text-sm text-gray-600 mt-1">Estudiante: {val.estudiante}</p>
												<p className="text-sm text-gray-500 mt-1">Resultado: {val.valor}</p>
											</div>
										</div>
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${
											val.estado === 'VALIDO' ? 'bg-green-100 text-green-800' :
											val.estado === 'INVALIDO' ? 'bg-red-100 text-red-800' :
											'bg-yellow-100 text-yellow-800'
										}`}>
											{val.estado}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</main>
			</div>
		</div>
	);
}
