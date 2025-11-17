import { useEffect, useState } from 'react';
import { useCalificaciones } from '../../hooks/useCalificaciones';
import { useAuth } from '../../hooks/useAuth';
import { TablaCalificaciones } from '../../components/TablaCalificaciones';
import { EstadisticasCard } from '../../components/EstadisticasCard';
import { AsignaturaCard } from '../../components/AsignaturaCard';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { Award, TrendingUp, TrendingDown, BookOpen, BarChart3 } from 'lucide-react';

/**
 * Página mejorada de consulta de notas para estudiantes
 */
export const NotasMejoradasPage = () => {
	const { user } = useAuth();
	const {
		calificaciones,
		estadisticas,
		loading,
		error,
		cargarNotasEstudiante,
		filtrarPorPeriodo,
		promedioDelPeriodo
	} = useCalificaciones({
		codigoEstudiante: user?.codigo,
		autoLoad: false
	});

	const [vistaActual, setVistaActual] = useState('tabla'); // 'tabla' o 'cards'
	const [periodoSeleccionado, setPeriodoSeleccionado] = useState('TODOS');

	useEffect(() => {
		if (user?.codigo) {
			cargarNotasEstudiante();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// Obtener períodos únicos
	const periodosDisponibles = calificaciones.length > 0
		? ['TODOS', ...new Set(calificaciones.map(c => c.periodo || c.cod_periodo).filter(Boolean))]
		: ['TODOS'];

	// Obtener calificaciones filtradas
	const calificacionesFiltradas = periodoSeleccionado === 'TODOS'
		? calificaciones
		: filtrarPorPeriodo(periodoSeleccionado);

	// Calcular promedio del período seleccionado
	const promedioActual = periodoSeleccionado === 'TODOS'
		? estadisticas?.promedio || 0
		: promedioDelPeriodo(periodoSeleccionado);

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

	if (calificaciones.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<EmptyState
					icon={BookOpen}
					title="No hay calificaciones disponibles"
					description="Aún no tienes calificaciones registradas en el sistema."
				/>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-4">
					<Award className="w-8 h-8 text-blue-600" />
					Mis Calificaciones
				</h1>
				<p className="text-gray-600">
					Consulta tu historial académico y rendimiento - {user?.nombre}
				</p>
			</div>

			{/* Estadísticas Principales */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<EstadisticasCard
					titulo="Promedio General"
					valor={parseFloat(promedioActual).toFixed(2)}
					descripcion={periodoSeleccionado === 'TODOS' ? 'Histórico' : `Período ${periodoSeleccionado}`}
					icono={Award}
					color={parseFloat(promedioActual) >= 4.0 ? 'green' : parseFloat(promedioActual) >= 3.0 ? 'blue' : 'yellow'}
				/>

				<EstadisticasCard
					titulo="Asignaturas Cursadas"
					valor={calificacionesFiltradas.length}
					descripcion="Total de asignaturas"
					icono={BookOpen}
					color="blue"
				/>

				<EstadisticasCard
					titulo="Aprobadas"
					valor={estadisticas?.aprobadas || 0}
					descripcion={`${estadisticas?.tasa_aprobacion || 0}% de éxito`}
					icono={TrendingUp}
					color="green"
					tendencia="up"
				/>

				<EstadisticasCard
					titulo="Reprobadas"
					valor={estadisticas?.reprobadas || 0}
					descripcion="Materias perdidas"
					icono={TrendingDown}
					color="red"
					tendencia={estadisticas?.reprobadas > 0 ? 'down' : 'neutral'}
				/>
			</div>

			{/* Controles */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					{/* Selector de Período */}
					<div className="flex items-center gap-4">
						<label className="text-sm font-medium text-gray-700">
							Período:
						</label>
						<select
							value={periodoSeleccionado}
							onChange={(e) => setPeriodoSeleccionado(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							{periodosDisponibles.map(periodo => (
								<option key={periodo} value={periodo}>
									{periodo === 'TODOS' ? 'Todos los períodos' : `Período ${periodo}`}
								</option>
							))}
						</select>
					</div>

					{/* Selector de Vista */}
					<div className="flex items-center gap-2">
						<button
							onClick={() => setVistaActual('tabla')}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								vistaActual === 'tabla'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<BarChart3 className="w-4 h-4 inline mr-2" />
							Tabla
						</button>
						<button
							onClick={() => setVistaActual('cards')}
							className={`px-4 py-2 rounded-lg font-medium transition-colors ${
								vistaActual === 'cards'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							<BookOpen className="w-4 h-4 inline mr-2" />
							Tarjetas
						</button>
					</div>
				</div>
			</div>

			{/* Vista de Tabla */}
			{vistaActual === 'tabla' && (
				<TablaCalificaciones
					calificaciones={calificacionesFiltradas}
					expandible={true}
					mostrarEstadisticas={true}
				/>
			)}

			{/* Vista de Cards */}
			{vistaActual === 'cards' && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{calificacionesFiltradas.map((calificacion, index) => (
						<AsignaturaCard
							key={index}
							asignatura={{
								...calificacion,
								nombre: calificacion.nombre_asignatura,
								codigo: calificacion.codigo_asignatura
							}}
							showNota={true}
							showEstado={true}
						/>
					))}
				</div>
			)}

			{/* Información adicional */}
			<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
				<ul className="text-sm text-blue-800 space-y-1">
					<li>• Las calificaciones se actualizan al finalizar cada período académico.</li>
					<li>• Para aprobar una asignatura necesitas una nota mínima de 3.0.</li>
					<li>• Haz clic en "Expandir" en la tabla para ver detalles de cada asignatura.</li>
					<li>• Si tienes dudas sobre alguna calificación, contacta a tu docente o coordinador.</li>
				</ul>
			</div>
		</div>
	);
};

export default NotasMejoradasPage;
