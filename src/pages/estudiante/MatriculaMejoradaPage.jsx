import { useEffect, useState } from 'react';
import { useMatriculas } from '../../hooks/useMatriculas';
import { usePeriodos } from '../../hooks/usePeriodos';
import { useAuth } from '../../hooks/useAuth';
import { AsignaturaCard } from '../../components/AsignaturaCard';
import { GrupoCard } from '../../components/GrupoCard';
import { EstadisticasCard } from '../../components/EstadisticasCard';
import { Modal } from '../../components/Modal';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../hooks/useToast';
import { 
	BookOpen, 
	Calendar, 
	CreditCard, 
	Clock,
	Plus,
	X,
	AlertTriangle,
	CheckCircle2,
	Info
} from 'lucide-react';

/**
 * Página de matrícula de asignaturas para estudiantes
 */
export const MatriculaMejoradaPage = () => {
	const { user } = useAuth();
	const { showToast } = useToast();
	const { periodoActivo } = usePeriodos();
	const {
		matricula,
		asignaturasDisponibles,
		grupos,
		loading,
		error,
		agregarAsignatura,
		retirarAsignatura,
		cargarAsignaturasDisponibles,
		cargarGrupos,
		cargarHorario,
		puedeAgregarAsignatura
	} = useMatriculas(user?.codigo);

	const [modalAgregar, setModalAgregar] = useState(false);
	const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);
	const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
	const [confirmandoRetiro, setConfirmandoRetiro] = useState(null);

	useEffect(() => {
		if (periodoActivo?.cod_periodo && user?.codigo) {
			cargarAsignaturasDisponibles();
			cargarHorario();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [periodoActivo, user]);

	const handleSeleccionarAsignatura = async (asignatura) => {
		setAsignaturaSeleccionada(asignatura);
		// Cargar grupos disponibles para esta asignatura
		await cargarGrupos(asignatura.codigo_asignatura);
		setModalAgregar(true);
	};

	const handleAgregarAsignatura = async () => {
		if (!grupoSeleccionado) {
			showToast('Debes seleccionar un grupo', 'warning');
			return;
		}

		// Validar si puede agregar
		const validacion = puedeAgregarAsignatura(asignaturaSeleccionada);
		if (!validacion.puede) {
			showToast(validacion.razon, 'error');
			return;
		}

		const result = await agregarAsignatura({
			codigo_asignatura: asignaturaSeleccionada.codigo_asignatura,
			cod_grupo: grupoSeleccionado.cod_grupo,
			cod_periodo: periodoActivo.cod_periodo
		});

		if (result.success) {
			showToast('Asignatura agregada exitosamente', 'success');
			setModalAgregar(false);
			setAsignaturaSeleccionada(null);
			setGrupoSeleccionado(null);
			cargarAsignaturasDisponibles();
			cargarHorario();
		} else {
			showToast(result.error || 'Error al agregar asignatura', 'error');
		}
	};

	const handleRetirarAsignatura = async (codMatriculaDet) => {
		const result = await retirarAsignatura(codMatriculaDet);
		
		if (result.success) {
			showToast('Asignatura retirada exitosamente', 'success');
			setConfirmandoRetiro(null);
			cargarAsignaturasDisponibles();
			cargarHorario();
		} else {
			showToast(result.error || 'Error al retirar asignatura', 'error');
		}
	};

	// Calcular estadísticas de la matrícula
	const asignaturasMatriculadas = matricula?.asignaturas || [];
	const totalCreditos = asignaturasMatriculadas.reduce((sum, a) => 
		sum + (a.creditos || 0), 0
	);
	const totalCosto = asignaturasMatriculadas.reduce((sum, a) => 
		sum + (a.costo || a.valor_credito * a.creditos || 0), 0
	);

	if (!periodoActivo) {
		return (
			<div className="container mx-auto px-4 py-8">
				<EmptyState
					icon={Calendar}
					title="No hay período activo"
					description="No hay un período académico activo para realizar matrícula."
				/>
			</div>
		);
	}

	if (loading && asignaturasDisponibles.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader />
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-4">
					<BookOpen className="w-8 h-8 text-blue-600" />
					Matrícula Académica
				</h1>
				<p className="text-gray-600">
					{periodoActivo.nombre} - {user?.nombre}
				</p>
			</div>

			{/* Estadísticas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<EstadisticasCard
					titulo="Asignaturas"
					valor={asignaturasMatriculadas.length}
					descripcion="Materias matriculadas"
					icono={BookOpen}
					color="blue"
				/>

				<EstadisticasCard
					titulo="Créditos"
					valor={totalCreditos}
					descripcion="Total de créditos"
					icono={Calendar}
					color="green"
				/>

				<EstadisticasCard
					titulo="Costo Total"
					valor={`$${totalCosto.toLocaleString()}`}
					descripcion="Valor a pagar"
					icono={CreditCard}
					color="purple"
				/>

				<EstadisticasCard
					titulo="Estado"
					valor={matricula?.estado || 'PENDIENTE'}
					descripcion="Estado de matrícula"
					icono={CheckCircle2}
					color={matricula?.estado === 'CONFIRMADA' ? 'green' : 'yellow'}
				/>
			</div>

			{/* Información del período */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
				<div className="flex items-start gap-3">
					<Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
					<div>
						<h3 className="font-semibold text-blue-900 mb-2">
							Información del Período
						</h3>
						<div className="text-sm text-blue-800 space-y-1">
							<p>• Fecha inicio: {periodoActivo.fecha_inicio || 'No disponible'}</p>
							<p>• Fecha fin: {periodoActivo.fecha_fin || 'No disponible'}</p>
							<p>• Créditos mínimos: {periodoActivo.creditos_minimos || 12}</p>
							<p>• Créditos máximos: {periodoActivo.creditos_maximos || 18}</p>
						</div>
					</div>
				</div>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
					<p className="text-red-800">{error}</p>
				</div>
			)}

			{/* Asignaturas Matriculadas */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-2xl font-bold text-gray-900">
						Asignaturas Matriculadas ({asignaturasMatriculadas.length})
					</h2>
				</div>

				{asignaturasMatriculadas.length === 0 ? (
					<EmptyState
						icon={BookOpen}
						title="No has matriculado asignaturas"
						description="Agrega asignaturas desde la lista de disponibles."
					/>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{asignaturasMatriculadas.map((asignatura, index) => (
							<div key={index} className="relative">
								<AsignaturaCard
									asignatura={asignatura}
									showCreditos={true}
									showHoras={true}
								/>
								{matricula?.estado !== 'CONFIRMADA' && (
									<button
										onClick={() => setConfirmandoRetiro(asignatura)}
										className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
										title="Retirar asignatura"
									>
										<X className="w-4 h-4" />
									</button>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Asignaturas Disponibles */}
			{matricula?.estado !== 'CONFIRMADA' && (
				<div>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-bold text-gray-900">
							Asignaturas Disponibles ({asignaturasDisponibles.length})
						</h2>
					</div>

					{asignaturasDisponibles.length === 0 ? (
						<EmptyState
							icon={BookOpen}
							title="No hay asignaturas disponibles"
							description="Ya has matriculado todas las asignaturas disponibles o no hay cupos."
						/>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{asignaturasDisponibles.map((asignatura, index) => (
								<div key={index} className="relative">
									<AsignaturaCard
										asignatura={asignatura}
										showCreditos={true}
										showHoras={true}
										showPrerequisitos={true}
									/>
									<button
										onClick={() => handleSeleccionarAsignatura(asignatura)}
										className="absolute top-2 right-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
										title="Agregar asignatura"
									>
										<Plus className="w-4 h-4" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			{/* Modal: Seleccionar Grupo */}
			<Modal
				isOpen={modalAgregar}
				onClose={() => {
					setModalAgregar(false);
					setAsignaturaSeleccionada(null);
					setGrupoSeleccionado(null);
				}}
				title="Seleccionar Grupo"
			>
				<div className="space-y-4">
					{asignaturaSeleccionada && (
						<div className="bg-gray-50 rounded-lg p-4">
							<h3 className="font-semibold text-gray-900 mb-2">
								{asignaturaSeleccionada.nombre}
							</h3>
							<div className="text-sm text-gray-600 space-y-1">
								<p>Código: {asignaturaSeleccionada.codigo_asignatura}</p>
								<p>Créditos: {asignaturaSeleccionada.creditos}</p>
							</div>
						</div>
					)}

					{grupos.length === 0 ? (
						<EmptyState
							icon={Clock}
							title="No hay grupos disponibles"
							description="Esta asignatura no tiene grupos con cupos disponibles."
						/>
					) : (
						<div className="space-y-3">
							<p className="text-sm text-gray-600">
								Selecciona el grupo de tu preferencia:
							</p>
							{grupos.map(grupo => (
								<GrupoCard
									key={grupo.cod_grupo}
									grupo={grupo}
									onClick={() => setGrupoSeleccionado(grupo)}
									showHorario={true}
									showEstado={true}
									className={grupoSeleccionado?.cod_grupo === grupo.cod_grupo ? 'ring-2 ring-blue-500' : ''}
								/>
							))}
						</div>
					)}

					<div className="flex justify-end gap-3 pt-4 border-t">
						<button
							onClick={() => {
								setModalAgregar(false);
								setAsignaturaSeleccionada(null);
								setGrupoSeleccionado(null);
							}}
							className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
						>
							Cancelar
						</button>
						<button
							onClick={handleAgregarAsignatura}
							disabled={!grupoSeleccionado}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Agregar Asignatura
						</button>
					</div>
				</div>
			</Modal>

			{/* Modal: Confirmar Retiro */}
			<Modal
				isOpen={!!confirmandoRetiro}
				onClose={() => setConfirmandoRetiro(null)}
				title="Confirmar Retiro"
			>
				<div className="space-y-4">
					<div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
						<div>
							<p className="text-sm text-yellow-800">
								¿Estás seguro de que deseas retirar esta asignatura?
							</p>
							{confirmandoRetiro && (
								<p className="text-sm font-semibold text-yellow-900 mt-2">
									{confirmandoRetiro.nombre}
								</p>
							)}
						</div>
					</div>

					<div className="flex justify-end gap-3">
						<button
							onClick={() => setConfirmandoRetiro(null)}
							className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
						>
							Cancelar
						</button>
						<button
							onClick={() => handleRetirarAsignatura(confirmandoRetiro.cod_matricula_det)}
							className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
						>
							Retirar Asignatura
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default MatriculaMejoradaPage;
