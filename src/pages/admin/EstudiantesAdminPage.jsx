import { useEffect, useState } from 'react';
import { useEstudiantes } from '../../hooks/useEstudiantes';
import { useProgramas } from '../../hooks/useProgramas';
import { Table } from '../../components/Table';
import { EstadisticasCard } from '../../components/EstadisticasCard';
import { Modal } from '../../components/Modal';
import { FormInput } from '../../components/FormInput';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../hooks/useToast';
import { 
	Users, 
	UserPlus, 
	Search, 
	Filter,
	UserCheck,
	UserX,
	Edit,
	Trash2,
	Download
} from 'lucide-react';

/**
 * Página de gestión de estudiantes para administradores
 */
export const EstudiantesAdminPage = () => {
	const { showToast } = useToast();
	const {
		estudiantes,
		paginacion,
		loading,
		error,
		cargarEstudiantes,
		crear,
		actualizar,
		eliminar,
		buscar,
		filtrarPorPrograma,
		filtrarPorEstado,
		paginaSiguiente,
		paginaAnterior
	} = useEstudiantes();

	const { programas, cargarProgramas } = useProgramas({ autoLoad: false });

	const [modalCrear, setModalCrear] = useState(false);
	const [modalEditar, setModalEditar] = useState(false);
	const [modalEliminar, setModalEliminar] = useState(false);
	const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
	const [formData, setFormData] = useState({});

	// Filtros
	const [busqueda, setBusqueda] = useState('');
	const [programaFiltro, setProgramaFiltro] = useState('TODOS');
	const [estadoFiltro, setEstadoFiltro] = useState('TODOS');

	useEffect(() => {
		cargarEstudiantes();
		cargarProgramas();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleBuscar = () => {
		if (busqueda.trim()) {
			buscar(busqueda);
		} else {
			cargarEstudiantes();
		}
	};

	const handleFiltrarPrograma = (codPrograma) => {
		setProgramaFiltro(codPrograma);
		if (codPrograma === 'TODOS') {
			cargarEstudiantes();
		} else {
			filtrarPorPrograma(codPrograma);
		}
	};

	const handleFiltrarEstado = (estado) => {
		setEstadoFiltro(estado);
		if (estado === 'TODOS') {
			cargarEstudiantes();
		} else {
			filtrarPorEstado(estado);
		}
	};

	const handleCrear = async () => {
		const result = await crear(formData);
		if (result.success) {
			showToast('Estudiante creado exitosamente', 'success');
			setModalCrear(false);
			setFormData({});
			cargarEstudiantes();
		} else {
			showToast(result.error || 'Error al crear estudiante', 'error');
		}
	};

	const handleActualizar = async () => {
		const result = await actualizar(estudianteSeleccionado.codigo, formData);
		if (result.success) {
			showToast('Estudiante actualizado exitosamente', 'success');
			setModalEditar(false);
			setEstudianteSeleccionado(null);
			setFormData({});
			cargarEstudiantes();
		} else {
			showToast(result.error || 'Error al actualizar estudiante', 'error');
		}
	};

	const handleEliminar = async () => {
		const result = await eliminar(estudianteSeleccionado.codigo);
		if (result.success) {
			showToast('Estudiante eliminado exitosamente', 'success');
			setModalEliminar(false);
			setEstudianteSeleccionado(null);
			cargarEstudiantes();
		} else {
			showToast(result.error || 'Error al eliminar estudiante', 'error');
		}
	};

	const handleExportar = () => {
		console.log('Exportar estudiantes');
		showToast('Exportando estudiantes...', 'info');
	};

	const abrirEditar = (estudiante) => {
		setEstudianteSeleccionado(estudiante);
		setFormData({
			nombre: estudiante.nombre,
			apellido: estudiante.apellido,
			email: estudiante.email,
			telefono: estudiante.telefono,
			direccion: estudiante.direccion,
			fecha_nacimiento: estudiante.fecha_nacimiento,
			cod_programa: estudiante.cod_programa,
			estado: estudiante.estado
		});
		setModalEditar(true);
	};

	const abrirEliminar = (estudiante) => {
		setEstudianteSeleccionado(estudiante);
		setModalEliminar(true);
	};

	// Configurar columnas de la tabla
	const columnas = [
		{ key: 'codigo', label: 'Código' },
		{ key: 'nombre_completo', label: 'Nombre Completo', render: (est) => `${est.nombre} ${est.apellido}` },
		{ key: 'email', label: 'Email' },
		{ key: 'programa', label: 'Programa', render: (est) => est.nombre_programa || est.programa || '-' },
		{
			key: 'estado',
			label: 'Estado',
			render: (est) => (
				<span className={`px-2 py-1 rounded-full text-xs font-semibold ${
					est.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
					est.estado === 'INACTIVO' ? 'bg-red-100 text-red-800' :
					'bg-gray-100 text-gray-800'
				}`}>
					{est.estado}
				</span>
			)
		},
		{
			key: 'acciones',
			label: 'Acciones',
			render: (est) => (
				<div className="flex gap-2">
					<button
						onClick={() => abrirEditar(est)}
						className="p-1 text-blue-600 hover:bg-blue-50 rounded"
						title="Editar"
					>
						<Edit className="w-4 h-4" />
					</button>
					<button
						onClick={() => abrirEliminar(est)}
						className="p-1 text-red-600 hover:bg-red-50 rounded"
						title="Eliminar"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			)
		}
	];

	// Calcular estadísticas
	const totalEstudiantes = paginacion.total || estudiantes.length;
	const estudiantesActivos = estudiantes.filter(e => e.estado === 'ACTIVO').length;
	const estudiantesInactivos = estudiantes.filter(e => e.estado === 'INACTIVO').length;

	if (loading && estudiantes.length === 0) {
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
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
							<Users className="w-8 h-8 text-blue-600" />
							Gestión de Estudiantes
						</h1>
						<p className="text-gray-600 mt-2">
							Administración de estudiantes del sistema
						</p>
					</div>

					<div className="flex gap-3">
						<button
							onClick={handleExportar}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Download className="w-4 h-4" />
							Exportar
						</button>
						<button
							onClick={() => setModalCrear(true)}
							className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
						>
							<UserPlus className="w-4 h-4" />
							Nuevo Estudiante
						</button>
					</div>
				</div>
			</div>

			{/* Estadísticas */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<EstadisticasCard
					titulo="Total Estudiantes"
					valor={totalEstudiantes}
					descripcion="Registrados"
					icono={Users}
					color="blue"
				/>

				<EstadisticasCard
					titulo="Activos"
					valor={estudiantesActivos}
					descripcion="Estudiantes activos"
					icono={UserCheck}
					color="green"
					tendencia="up"
				/>

				<EstadisticasCard
					titulo="Inactivos"
					valor={estudiantesInactivos}
					descripcion="Estudiantes inactivos"
					icono={UserX}
					color="red"
				/>

				<EstadisticasCard
					titulo="Programas"
					valor={programas.length}
					descripcion="Programas académicos"
					icono={Filter}
					color="purple"
				/>
			</div>

			{/* Filtros y Búsqueda */}
			<div className="bg-white rounded-lg shadow-md p-4 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{/* Búsqueda */}
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Buscar
						</label>
						<div className="flex gap-2">
							<input
								type="text"
								value={busqueda}
								onChange={(e) => setBusqueda(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
								placeholder="Nombre, código, email..."
								className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
							<button
								onClick={handleBuscar}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								<Search className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* Filtro Programa */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Programa
						</label>
						<select
							value={programaFiltro}
							onChange={(e) => handleFiltrarPrograma(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="TODOS">Todos</option>
							{programas.map(prog => (
								<option key={prog.cod_programa} value={prog.cod_programa}>
									{prog.nombre}
								</option>
							))}
						</select>
					</div>

					{/* Filtro Estado */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Estado
						</label>
						<select
							value={estadoFiltro}
							onChange={(e) => handleFiltrarEstado(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="TODOS">Todos</option>
							<option value="ACTIVO">Activos</option>
							<option value="INACTIVO">Inactivos</option>
						</select>
					</div>
				</div>
			</div>

			{/* Tabla de Estudiantes */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
					<p className="text-red-800">{error}</p>
				</div>
			)}

			{estudiantes.length === 0 ? (
				<EmptyState
					icon={Users}
					title="No hay estudiantes"
					description="No se encontraron estudiantes con los filtros seleccionados."
				/>
			) : (
				<>
					<Table
						data={estudiantes}
						columns={columnas}
						keyExtractor={(est) => est.codigo}
					/>

					{/* Paginación */}
					{paginacion.hasMore && (
						<div className="flex justify-between items-center mt-6">
							<button
								onClick={paginaAnterior}
								disabled={paginacion.offset === 0}
								className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Anterior
							</button>
							<span className="text-sm text-gray-600">
								Mostrando {estudiantes.length} de {paginacion.total || '...'}
							</span>
							<button
								onClick={paginaSiguiente}
								disabled={!paginacion.hasMore}
								className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Siguiente
							</button>
						</div>
					)}
				</>
			)}

			{/* Modal: Crear Estudiante */}
			<Modal
				isOpen={modalCrear}
				onClose={() => {
					setModalCrear(false);
					setFormData({});
				}}
				title="Nuevo Estudiante"
			>
				<div className="space-y-4">
					<FormInput
						label="Código"
						type="text"
						value={formData.codigo || ''}
						onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
						required
					/>
					<div className="grid grid-cols-2 gap-4">
						<FormInput
							label="Nombre"
							type="text"
							value={formData.nombre || ''}
							onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
							required
						/>
						<FormInput
							label="Apellido"
							type="text"
							value={formData.apellido || ''}
							onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
							required
						/>
					</div>
					<FormInput
						label="Email"
						type="email"
						value={formData.email || ''}
						onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						required
					/>
					<FormInput
						label="Teléfono"
						type="tel"
						value={formData.telefono || ''}
						onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
					/>
					<FormInput
						label="Fecha de Nacimiento"
						type="date"
						value={formData.fecha_nacimiento || ''}
						onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
					/>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Programa
						</label>
						<select
							value={formData.cod_programa || ''}
							onChange={(e) => setFormData({ ...formData, cod_programa: e.target.value })}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="">Seleccione un programa</option>
							{programas.map(prog => (
								<option key={prog.cod_programa} value={prog.cod_programa}>
									{prog.nombre}
								</option>
							))}
						</select>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t">
						<button
							onClick={() => {
								setModalCrear(false);
								setFormData({});
							}}
							className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
						>
							Cancelar
						</button>
						<button
							onClick={handleCrear}
							className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
						>
							Crear Estudiante
						</button>
					</div>
				</div>
			</Modal>

			{/* Modal: Editar Estudiante */}
			<Modal
				isOpen={modalEditar}
				onClose={() => {
					setModalEditar(false);
					setEstudianteSeleccionado(null);
					setFormData({});
				}}
				title="Editar Estudiante"
			>
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<FormInput
							label="Nombre"
							type="text"
							value={formData.nombre || ''}
							onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
						/>
						<FormInput
							label="Apellido"
							type="text"
							value={formData.apellido || ''}
							onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
						/>
					</div>
					<FormInput
						label="Email"
						type="email"
						value={formData.email || ''}
						onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					/>
					<FormInput
						label="Teléfono"
						type="tel"
						value={formData.telefono || ''}
						onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
					/>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Estado
						</label>
						<select
							value={formData.estado || ''}
							onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="ACTIVO">Activo</option>
							<option value="INACTIVO">Inactivo</option>
						</select>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t">
						<button
							onClick={() => {
								setModalEditar(false);
								setEstudianteSeleccionado(null);
								setFormData({});
							}}
							className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
						>
							Cancelar
						</button>
						<button
							onClick={handleActualizar}
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Actualizar
						</button>
					</div>
				</div>
			</Modal>

			{/* Modal: Eliminar Estudiante */}
			<Modal
				isOpen={modalEliminar}
				onClose={() => {
					setModalEliminar(false);
					setEstudianteSeleccionado(null);
				}}
				title="Confirmar Eliminación"
			>
				<div className="space-y-4">
					<p className="text-gray-700">
						¿Estás seguro de que deseas eliminar al estudiante:
					</p>
					{estudianteSeleccionado && (
						<div className="bg-gray-50 rounded-lg p-4">
							<p className="font-semibold text-gray-900">
								{estudianteSeleccionado.nombre} {estudianteSeleccionado.apellido}
							</p>
							<p className="text-sm text-gray-600">
								Código: {estudianteSeleccionado.codigo}
							</p>
						</div>
					)}
					<p className="text-sm text-red-600">
						Esta acción no se puede deshacer.
					</p>

					<div className="flex justify-end gap-3 pt-4 border-t">
						<button
							onClick={() => {
								setModalEliminar(false);
								setEstudianteSeleccionado(null);
							}}
							className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
						>
							Cancelar
						</button>
						<button
							onClick={handleEliminar}
							className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
						>
							Eliminar
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default EstudiantesAdminPage;
