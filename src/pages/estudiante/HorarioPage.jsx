import { useEffect } from 'react';
import { useMatriculas } from '../../hooks/useMatriculas';
import { useAuth } from '../../hooks/useAuth';
import { HorarioGrid } from '../../components/HorarioGrid';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { Calendar, Download, Printer } from 'lucide-react';

/**
 * Página de horario del estudiante
 * Muestra la grilla semanal de clases matriculadas
 */
export const HorarioPage = () => {
	const { user } = useAuth();
	const { horario, loading, error, cargarHorario } = useMatriculas(user?.codigo);

	useEffect(() => {
		if (user?.codigo) {
			cargarHorario();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const handleDescargar = () => {
		// Implementar lógica de descarga PDF
		console.log('Descargar horario como PDF');
	};

	const handleImprimir = () => {
		window.print();
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader />
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-800">{error}</p>
				</div>
			</div>
		);
	}

	if (!horario || horario.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<EmptyState
					icon={Calendar}
					title="No tienes horario disponible"
					description="Aún no has matriculado asignaturas o no hay información de horario."
				/>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							<Calendar className="w-8 h-8 text-blue-600" />
							Mi Horario
						</h1>
						<p className="text-gray-600 mt-2">
							Horario semanal de clases - {user?.nombre}
						</p>
					</div>

					{/* Acciones */}
					<div className="flex gap-3">
						<button
							onClick={handleDescargar}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Download className="w-4 h-4" />
							Descargar PDF
						</button>
						<button
							onClick={handleImprimir}
							className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
						>
							<Printer className="w-4 h-4" />
							Imprimir
						</button>
					</div>
				</div>

				{/* Info adicional */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<p className="text-sm text-blue-800">
						📅 Este es tu horario actual. Haz clic en cualquier bloque para ver más detalles de la clase.
					</p>
				</div>
			</div>

			{/* Grilla de Horario */}
			<div className="print:shadow-none">
				<HorarioGrid
					horarios={horario}
					onBloqueClick={(bloque) => {
						console.log('Clase seleccionada:', bloque);
						// Aquí podrías abrir un modal con más detalles
					}}
				/>
			</div>

			{/* Información adicional */}
			<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
						📚 Total de Asignaturas
					</h3>
					<p className="text-3xl font-bold text-blue-600">
						{new Set(horario.map(h => h.codigo_asignatura || h.nombre)).size}
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
						⏰ Horas Semanales
					</h3>
					<p className="text-3xl font-bold text-green-600">
						{horario.reduce((sum, h) => {
							const inicio = parseInt(h.hora_inicio?.split(':')[0] || 0);
							const fin = parseInt(h.hora_fin?.split(':')[0] || 0);
							return sum + (fin - inicio);
						}, 0)}
					</p>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
						📍 Días de Clase
					</h3>
					<p className="text-3xl font-bold text-purple-600">
						{new Set(horario.map(h => h.dia || h.dia_semana)).size}
					</p>
				</div>
			</div>

			{/* Estilos para impresión */}
			<style jsx>{`
				@media print {
					body * {
						visibility: hidden;
					}
					.print\\:shadow-none,
					.print\\:shadow-none * {
						visibility: visible;
					}
					.print\\:shadow-none {
						position: absolute;
						left: 0;
						top: 0;
					}
					button {
						display: none !important;
					}
				}
			`}</style>
		</div>
	);
};

export default HorarioPage;
