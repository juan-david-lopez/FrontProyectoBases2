import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import { fetchAsignaturasDisponibles, registrarMatricula } from '../../services/matriculasService.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function MatriculaPage() {
	const { user } = useAuth();
	const items = [
		{ to: '/estudiante/dashboard', label: 'Resumen' },
		{ to: '/estudiante/matricula', label: 'Matrícula' },
		{ to: '/estudiante/notas', label: 'Notas' },
		{ to: '/estudiante/riesgo', label: 'Riesgo' },
		{ to: '/estudiante/perfil', label: 'Perfil' },
	];
	const [data, setData] = useState([]);
	const [seleccion, setSeleccion] = useState([]);
	const [mensaje, setMensaje] = useState('');

	useEffect(() => {
		if (!user?.codigo) return;
		fetchAsignaturasDisponibles(user.codigo).then(setData).catch(() => setData([]));
	}, [user]);

	const toggle = (codigo) => {
		setSeleccion((prev) => (prev.includes(codigo) ? prev.filter((c) => c !== codigo) : [...prev, codigo]));
	};

	const columns = [
		{ key: 'codigo', header: 'Código' },
		{ key: 'nombre', header: 'Nombre' },
		{ key: 'creditos', header: 'Créditos' },
		{ key: 'horario', header: 'Horario' },
		{ key: 'cupo', header: 'Cupo' },
		{ key: 'acciones', header: 'Acciones', render: (_, row) => (
			<button className="rounded border px-2 py-1 text-sm" onClick={() => toggle(row.codigo)}>
				{seleccion.includes(row.codigo) ? 'Quitar' : 'Agregar'}
			</button>
		)},
	];

	const registrar = async () => {
		const res = await registrarMatricula({ codigoEstudiante: String(user.codigo || ''), asignaturas: seleccion });
		setMensaje(`${res.mensaje} - Créditos: ${res.creditos_registrados ?? ''}`);
	};

	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<h1 className="text-2xl font-semibold">Matrícula</h1>
					<Table columns={columns} data={data} />
					<div className="flex items-center justify-between">
						<div className="text-sm text-gray-600">Seleccionadas: {seleccion.length}</div>
						<button className="btn-primary" onClick={registrar}>Confirmar matrícula</button>
					</div>
					{mensaje && <div className="rounded bg-green-50 p-3 text-sm text-green-700">{mensaje}</div>}
				</main>
			</div>
		</div>
	);
}

