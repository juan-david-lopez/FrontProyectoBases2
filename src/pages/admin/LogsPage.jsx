import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';

export default function LogsPage() {
	const items = [
		{ to: '/admin/dashboard', label: 'Resumen' },
		{ to: '/admin/logs', label: 'Logs' },
	];
	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<h1 className="text-2xl font-semibold">Bitácora</h1>
					<div className="card p-4">Historial de operaciones críticas</div>
				</main>
			</div>
		</div>
	);
}

