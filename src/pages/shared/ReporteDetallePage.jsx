import React from 'react';
import Navbar from '../../components/Navbar.jsx';

export default function ReporteDetallePage() {
	return (
		<div className="min-h-screen">
			<Navbar />
			<main className="mx-auto max-w-5xl p-4">
				<h1 className="text-2xl font-semibold">Detalle del reporte</h1>
				<div className="card mt-4 p-4">
					Contenido detallado con exportación CSV/PDF (pendiente)
				</div>
			</main>
		</div>
	);
}

