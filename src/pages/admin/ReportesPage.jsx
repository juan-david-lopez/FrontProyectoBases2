import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { fetchMatriculaPeriodo } from '../../services/reportesService.js';

export default function ReportesPage() {
	const items = [
		{ to: '/admin/dashboard', label: 'Resumen' },
		{ to: '/admin/reportes', label: 'Reportes' },
	];
	const [periodo, setPeriodo] = useState('2025-1');
	const [data, setData] = useState([]);

	useEffect(() => {
		fetchMatriculaPeriodo(periodo).then(setData).catch(() => setData([]));
	}, [periodo]);

	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<h1 className="text-2xl font-semibold">Reportes</h1>
					<div className="flex items-center gap-2">
						<input className="rounded border px-3 py-2" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
						<span className="text-sm text-gray-500">Periodo</span>
					</div>
					<div className="card p-4">
						<pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
					</div>
				</main>
			</div>
		</div>
	);
}

