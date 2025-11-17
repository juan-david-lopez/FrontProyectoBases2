import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCalificaciones } from '../../hooks/useCalificaciones';
import { useDocente } from '../../hooks/useDocente';
import { useAuth } from '../../hooks/useAuth';
import { TablaCalificaciones } from '../../components/TablaCalificaciones';
import { EstadisticasCard } from '../../components/EstadisticasCard';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../hooks/useToast';
import { 
	Award, 
	TrendingUp, 
	TrendingDown, 
	Users, 
	ArrowLeft, 
	Save,
	Download,
	UserCheck,
	AlertCircle
} from 'lucide-react';

/**
 * Página de gestión de calificaciones de un grupo específico
 */
export const CalificacionesGrupoPage = () => {
	const { codGrupo } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { showToast } = useToast();

	const { cargarEstudiantes } = useDocente(user?.codigo);
	const {
		calificaciones,
		loading,
		error,
		cargarNotasGrupo,
		registrarNota,
		actualizarNota,
		calcularEstadisticas
	} = useCalificaciones({
		codigoGrupo: codGrupo,
		autoLoad: false
	});

	const [modoEdicion, setModoEdicion] = useState(false);
	const [notasEditadas, setNotasEditadas] = useState({});
	const [guardando, setGuardando] = useState(false);

	useEffect(() => {
		if (codGrupo) {
			cargarNotasGrupo();
			cargarEstudiantes(codGrupo);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [codGrupo]);

	const handleEditarNota = (codigoEstudiante, campo, valor) => {
		setNotasEditadas(prev => ({
			...prev,
			[codigoEstudiante]: {
				...prev[codigoEstudiante],
				[campo]: valor
			}
		}));
	};

	const handleGuardarNotas = async () => {
		setGuardando(true);
		let exitosas = 0;
		let errores = 0;

		for (const [codigoEstudiante, notas] of Object.entries(notasEditadas)) {
			// Verificar si ya existe la nota
			const notaExistente = calificaciones.find(
				c => c.codigo_estudiante === codigoEstudiante
			);

			const datosNota = {
				codigo_estudiante: codigoEstudiante,
				cod_grupo: codGrupo,
				...notas
			};

			const result = notaExistente
				? await actualizarNota(notaExistente.cod_nota, datosNota)
				: await registrarNota(datosNota);

			if (result.success) {
				exitosas++;
			} else {
				errores++;
			}
		}

		setGuardando(false);
		setNotasEditadas({});
		setModoEdicion(false);

		if (errores === 0) {
			showToast(`${exitosas} calificaciones guardadas exitosamente`, 'success');
		} else {
			showToast(`${exitosas} guardadas, ${errores} con error`, 'warning');
		}

		// Recargar las notas
		cargarNotasGrupo();
	};

	const handleCancelar = () => {
		setNotasEditadas({});
		setModoEdicion(false);
	};

	const handleExportar = () => {
		// Implementar exportación a Excel
		console.log('Exportar calificaciones');
		showToast('Exportando calificaciones...', 'info');
	};

	// Calcular estadísticas del grupo
	const stats = calcularEstadisticas();
	const totalEstudiantes = calificaciones.length;
	const estudiantesAprobados = calificaciones.filter(c => 
		parseFloat(c.nota_final || 0) >= 3.0
	).length;
	const tasaAprobacion = totalEstudiantes > 0 
		? ((estudiantesAprobados / totalEstudiantes) * 100).toFixed(1)
		: 0;

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

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<button
					onClick={() => navigate('/docente/grupos')}
					className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
				>
					<ArrowLeft className="w-4 h-4" />
					Volver a Mis Grupos
				</button>

				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							<Award className="w-8 h-8 text-blue-600" />
							Calificaciones - Grupo {codGrupo}
						</h1>
						<p className="text-gray-600 mt-2">
							Gestión de notas y evaluaciones
						</p>
					</div>

					{/* Acciones */}
					<div className="flex gap-3">
						{modoEdicion ? (
							<>
								<button
									onClick={handleCancelar}
									disabled={guardando}
									className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
								>
									Cancelar
								</button>
								<button
									onClick={handleGuardarNotas}
									disabled={guardando || Object.keys(notasEditadas).length === 0}
									className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
								>
									<Save className="w-4 h-4" />
									{guardando ? 'Guardando...' : `Guardar (${Object.keys(notasEditadas).length})`}
								</button>
							</>
						) : (
							<>
								<button
									onClick={handleExportar}
									className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									<Download className="w-4 h-4" />
									Exportar
								</button>
								<button
									onClick={() => setModoEdicion(true)}
									className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
								>
									<Award className="w-4 h-4" />
									Editar Notas
								</button>
							</>
						)}
					</div>
				</div>

				{/* Advertencia en modo edición */}
				{modoEdicion && (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
						<AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
						<p className="text-sm text-yellow-800">
							Modo de edición activado. Los cambios no se guardarán hasta que presiones el botón "Guardar".
						</p>
					</div>
				)}
			</div>

			{/* Estadísticas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<EstadisticasCard
					titulo="Promedio del Grupo"
					valor={parseFloat(stats?.promedio || 0).toFixed(2)}
					descripcion="Nota promedio"
					icono={Award}
					color={parseFloat(stats?.promedio || 0) >= 4.0 ? 'green' : parseFloat(stats?.promedio || 0) >= 3.0 ? 'blue' : 'yellow'}
				/>

				<EstadisticasCard
					titulo="Total Estudiantes"
					valor={totalEstudiantes}
					descripcion="Inscritos en el grupo"
					icono={Users}
					color="blue"
				/>

				<EstadisticasCard
					titulo="Aprobados"
					valor={estudiantesAprobados}
					descripcion={`${tasaAprobacion}% de éxito`}
					icono={TrendingUp}
					color="green"
					tendencia="up"
				/>

				<EstadisticasCard
					titulo="Reprobados"
					valor={totalEstudiantes - estudiantesAprobados}
					descripcion="Nota menor a 3.0"
					icono={TrendingDown}
					color="red"
					tendencia={totalEstudiantes - estudiantesAprobados > 0 ? 'down' : 'neutral'}
				/>
			</div>

			{/* Tabla de Calificaciones */}
			{calificaciones.length === 0 ? (
				<EmptyState
					icon={UserCheck}
					title="No hay calificaciones registradas"
					description="Aún no se han registrado calificaciones para este grupo."
					action={
						<button
							onClick={() => setModoEdicion(true)}
							className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Award className="w-4 h-4" />
							Registrar Calificaciones
						</button>
					}
				/>
			) : (
				<TablaCalificaciones
					calificaciones={calificaciones}
					expandible={true}
					mostrarEstadisticas={true}
					editable={modoEdicion}
					onEditarNota={handleEditarNota}
				/>
			)}

			{/* Información */}
			<div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
				<h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
				<ul className="text-sm text-blue-800 space-y-1">
					<li>• La nota final se calcula automáticamente con base en los parciales ingresados.</li>
					<li>• Todas las notas deben estar en el rango de 0.0 a 5.0.</li>
					<li>• La nota mínima aprobatoria es 3.0.</li>
					<li>• Los cambios se guardan individualmente por estudiante.</li>
					<li>• Puedes exportar las calificaciones a Excel para reportes.</li>
				</ul>
			</div>
		</div>
	);
};

export default CalificacionesGrupoPage;
