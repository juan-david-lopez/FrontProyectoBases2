import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import Table from '../../components/Table.jsx';
import Modal from '../../components/Modal.jsx';
import { crearPrograma, fetchProgramas } from '../../services/programasService.js';

export default function ProgramasPage() {
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
	const [open, setOpen] = useState(false);
	const [form, setForm] = useState({ codigo: '', nombre: '', creditos: 0, facultad: '' });

	useEffect(() => {
		fetchProgramas().then(setData).catch(() => setData([]));
	}, []);

	const columns = [
		{ key: 'codigo', header: 'Código' },
		{ key: 'nombre', header: 'Nombre' },
		{ key: 'creditos', header: 'Créditos' },
		{ key: 'facultad', header: 'Facultad' },
	];

	const submit = async () => {
		await crearPrograma(form);
		setOpen(false);
		setForm({ codigo: '', nombre: '', creditos: 0, facultad: '' });
		const list = await fetchProgramas();
		setData(list);
	};

	return (
		<div className="min-h-screen">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold">Programas</h1>
						<button className="btn-primary" onClick={() => setOpen(true)}>Nuevo</button>
					</div>
					<Table columns={columns} data={data} />
				</main>
			</div>
			<Modal open={open} onClose={() => setOpen(false)} title="Crear Programa" actions={(
				<>
					<button className="rounded border px-4 py-2" onClick={() => setOpen(false)}>Cancelar</button>
					<button className="btn-primary" onClick={submit}>Guardar</button>
				</>
			)}>
				<div className="grid gap-3">
					<input placeholder="Código" className="rounded border px-3 py-2" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
					<input placeholder="Nombre" className="rounded border px-3 py-2" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
					<input placeholder="Créditos" type="number" className="rounded border px-3 py-2" value={form.creditos} onChange={(e) => setForm({ ...form, creditos: Number(e.target.value) })} />
					<input placeholder="Facultad" className="rounded border px-3 py-2" value={form.facultad} onChange={(e) => setForm({ ...form, facultad: e.target.value })} />
				</div>
			</Modal>
		</div>
	);
}

