import { useEffect, useState } from 'react';
import { useDocente } from '../../hooks/useDocente';
import { useAuth } from '../../hooks/useAuth';
import { GrupoCard } from '../../components/GrupoCard';
import { EstadisticasCard } from '../../components/EstadisticasCard';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Página mejorada de gestión de grupos para docentes
 */
export const GruposDocentePage = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const {
		grupos,
		grupoSeleccionado,
		loading,
		error,
		cargarGrupos,
		seleccionarGrupo,
		filtrarPorPeriodo
	} = useDocente(user?.codigo);

	const [periodoFiltro, setPeriodoFiltro] = useState('TODOS');
	const [asignaturaFiltro, setAsignaturaFiltro] = useState('TODAS');

	useEffect(() => {
		if (user?.codigo) {
			cargarGrupos();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// Obtener períodos y asignaturas únicas
	const periodosDisponibles = grupos.length > 0
		? ['TODOS', ...new Set(grupos.map(g => g.cod_periodo || g.periodo).filter(Boolean))]
		: ['TODOS'];

	const asignaturasDisponibles = grupos.length > 0
		? ['TODAS', ...new Set(grupos.map(g => g.nombre_asignatura || g.asignatura).filter(Boolean))]
		: ['TODAS'];

	// Aplicar filtros
	let gruposFiltrados = grupos;
	if (periodoFiltro !== 'TODOS') {
		gruposFiltrados = filtrarPorPeriodo(periodoFiltro);
	}
	if (asignaturaFiltro !== 'TODAS') {
		gruposFiltrados = gruposFiltrados.filter(g => 
			(g.nombre_asignatura || g.asignatura) === asignaturaFiltro
		);
	}

	// Calcular estadísticas generales
	const totalEstudiantes = gruposFiltrados.reduce((sum, g) => 
		sum + (g.estudiantes_inscritos || 0), 0
	);
	const capacidadTotal = gruposFiltrados.reduce((sum, g) => 
		sum + (g.cupo_maximo || 0), 0
	);
	const promedioOcupacion = capacidadTotal > 0 
		? ((totalEstudiantes / capacidadTotal) * 100).toFixed(1)
		: 0;

	const handleVerGrupo = (grupo) => {
		seleccionarGrupo(grupo.cod_grupo);
		// Navegar a página de detalles o abrir modal
		navigate(`/docente/grupos/${grupo.cod_grupo}/calificaciones`);
	};

	if (loading && grupos.length === 0) {
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

	if (grupos.length === 0) {
		return (
			<div className="container mx-auto px-4 py-8">
				<EmptyState
					icon={Users}
					title="No tienes grupos asignados"
					description="Aún no se te han asignado grupos para el período académico actual."
				/>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-4">
					<Users className="w-8 h-8 text-blue-600" />
					Mis Grupos
				</h1>
				<p className="text-gray-600">
					Gestión de grupos asignados - {user?.nombre}
				</p>
			</div>

			{/* Estadísticas Generales */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<EstadisticasCard
					titulo="Total Grupos"
					valor={gruposFiltrados.length}
					descripcion="Grupos asignados"
					icono={Users}
					color="blue"
				/>

				<EstadisticasCard
					titulo="Total Estudiantes"
					valor={totalEstudiantes}
					descripcion={`Capacidad: ${capacidadTotal}`}
					icono={BookOpen}
					color="green"
				/>

				<EstadisticasCard
					titulo="Ocupación Promedio"
					valor={`${promedioOcupacion}%`}
					descripcion="Cupos utilizados"
					icono={TrendingUp}
					color={parseFloat(promedioOcupacion) > 90 ? 'red' : parseFloat(promedioOcupacion) > 70 ? 'yellow' : 'green'}
					tendencia={parseFloat(promedioOcupacion) > 80 ? 'up' : 'neutral'}
				/>

				<EstadisticasCard
					titulo="Asignaturas"
					valor={asignaturasDisponibles.length - 1}
					descripcion="Distintas asignaturas"
					icono={Calendar}
					color="purple"
				/>
			</div>

			{/* Filtros */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Filtro por Período */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Período Académico
						</label>
						<select
							value={periodoFiltro}
							onChange={(e) => setPeriodoFiltro(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							{periodosDisponibles.map(periodo => (
								<option key={periodo} value={periodo}>
									{periodo === 'TODOS' ? 'Todos los períodos' : `Período ${periodo}`}
								</option>
							))}
						</select>
					</div>

					{/* Filtro por Asignatura */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Asignatura
						</label>
						<select
							value={asignaturaFiltro}
							onChange={(e) => setAsignaturaFiltro(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							{asignaturasDisponibles.map(asignatura => (
								<option key={asignatura} value={asignatura}>
									{asignatura === 'TODAS' ? 'Todas las asignaturas' : asignatura}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Lista de Grupos */}
			{gruposFiltrados.length === 0 ? (
				<EmptyState
					icon={Users}
					title="No hay grupos con estos filtros"
					description="Intenta ajustar los filtros de búsqueda."
				/>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{gruposFiltrados.map(grupo => (
						<GrupoCard
							key={grupo.cod_grupo}
							grupo={grupo}
							onClick={() => handleVerGrupo(grupo)}
							showHorario={true}
							showEstado={true}
							className={grupoSeleccionado?.cod_grupo === grupo.cod_grupo ? 'ring-2 ring-blue-500' : ''}
						/>
					))}
				</div>
			)}

			{/* Información adicional */}
			<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
				<ul className="text-sm text-blue-800 space-y-1">
					<li>• Haz clic en cualquier grupo para ver los estudiantes y gestionar calificaciones.</li>
					<li>• Los grupos con indicador rojo están cerca del cupo máximo.</li>
					<li>• Puedes filtrar por período académico y asignatura.</li>
					<li>• Las estadísticas se actualizan automáticamente.</li>
				</ul>
			</div>
		</div>
	);
};

export default GruposDocentePage;
