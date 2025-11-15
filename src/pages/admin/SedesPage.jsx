import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';

export default function SedesPage() {
	const items = [
		{ to: '/admin/dashboard', label: 'Resumen' },
		{ to: '/admin/sedes', label: 'Sedes' },
	];
	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<h1 className="text-2xl font-semibold">Sedes y salones</h1>
					<div className="card p-4">Próximamente: gestión de sedes y salones</div>
				</main>
			</div>
		</div>
	);
}

