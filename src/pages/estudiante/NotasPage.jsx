import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';

export default function NotasPage() {
	const items = [
		{ to: '/estudiante/dashboard', label: 'Resumen' },
		{ to: '/estudiante/notas', label: 'Notas' },
	];
	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<h1 className="text-2xl font-semibold">Notas</h1>
					<div className="card p-4">Historial de notas por asignatura</div>
				</main>
			</div>
		</div>
	);
}

