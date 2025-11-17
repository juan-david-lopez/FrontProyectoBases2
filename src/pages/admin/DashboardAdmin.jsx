import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import CardInfo from '../../components/CardInfo.jsx';

export default function DashboardAdmin() {
	const items = [
		{ to: '/administrador/dashboard', label: '📊 Dashboard' },
		{ to: '/administrador/periodos', label: '📅 Períodos' },
		{ to: '/administrador/programas', label: '🎓 Programas' },
		{ to: '/administrador/asignaturas', label: '📚 Asignaturas' },
		{ to: '/administrador/grupos', label: '👥 Grupos' },
		{ to: '/administrador/docentes', label: '👨‍🏫 Docentes' },
		{ to: '/administrador/estudiantes-v2', label: '👨‍🎓 Estudiantes' },
		{ to: '/administrador/sedes', label: '🏢 Sedes' },
		{ to: '/administrador/reportes', label: '📊 Reportes' },
		{ to: '/administrador/configuracion', label: '⚙️ Configuración' },
		{ to: '/administrador/logs', label: '📋 Logs' },
	];

	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<h1 className="text-2xl font-semibold">Panel de Administrador</h1>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<CardInfo title="Estudiantes" value="1,240" />
						<CardInfo title="Matrículas" value="3,420" />
						<CardInfo title="Ocupación" value="78%" />
					</div>
				</main>
			</div>
		</div>
	);
}

