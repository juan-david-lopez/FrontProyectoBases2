import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import { fetchAsignaturas } from '../../services/asignaturasService.js';

export default function AsignaturasPage() {
	const items = [
		{ to: '/admin/dashboard', label: 'Resumen' },
		{ to: '/admin/programas', label: 'Programas' },
		{ to: '/admin/asignaturas', label: 'Asignaturas' },
		{ to: '/admin/docentes', label: 'Docentes' },
		{ to: '/admin/estudiantes', label: 'Estudiantes' },
		{ to: '/admin/sedes', label: 'Sedes' },
		{ to: '/admin/reportes', label: 'Reportes' },
		{ to: '/admin/configuracion', label: 'Configuración' },
	];
	const [data, setData] = useState([]);

	useEffect(() => {
		fetchAsignaturas().then(setData).catch(() => setData([]));
	}, []);

	const columns = [
		{ key: 'codigo', header: 'Código' },
		{ key: 'nombre', header: 'Nombre' },
		{ key: 'creditos', header: 'Créditos' },
		{ key: 'tipo', header: 'Tipo' },
	];

	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold">Asignaturas</h1>
					</div>
					<Table columns={columns} data={data} />
				</main>
			</div>
		</div>
	);
}

