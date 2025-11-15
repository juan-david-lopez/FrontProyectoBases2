import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';

export default function ReportesDocente() {
	const items = [
		{ to: '/docente/dashboard', label: 'Resumen' },
		{ to: '/docente/reportes', label: 'Reportes' },
	];
	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<h1 className="text-2xl font-semibold">Reportes del docente</h1>
					<div className="card p-4">Indicadores por asignatura</div>
				</main>
			</div>
		</div>
	);
}

