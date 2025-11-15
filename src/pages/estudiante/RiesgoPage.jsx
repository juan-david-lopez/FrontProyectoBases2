import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { fetchRiesgoPorPeriodo } from '../../services/riesgoService.js';

export default function RiesgoPage() {
	const items = [
		{ to: '/estudiante/dashboard', label: 'Resumen' },
		{ to: '/estudiante/riesgo', label: 'Riesgo' },
	];
	const [periodo, setPeriodo] = useState('2025-1');
	const [data, setData] = useState([]);

	useEffect(() => {
		fetchRiesgoPorPeriodo(periodo).then(setData).catch(() => setData([]));
	}, [periodo]);

	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<h1 className="text-2xl font-semibold">Riesgo Académico</h1>
					<div className="flex items-center gap-2">
						<input className="rounded border px-3 py-2" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
					</div>
					<div className="card p-4">
						<pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
					</div>
				</main>
			</div>
		</div>
	);
}

