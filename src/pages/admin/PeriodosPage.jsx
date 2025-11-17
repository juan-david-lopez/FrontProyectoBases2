import React, { useState } from 'react';
import { usePeriodos } from '../../hooks/usePeriodos.js';
import Modal from '../../components/Modal.jsx';
import Loader from '../../components/Loader.jsx';
import Table from '../../components/Table.jsx';
import { useToast } from '../../hooks/useToast.js';

/**
 * Página de gestión de períodos académicos (Admin)
 * Permite crear, editar, activar y cerrar períodos
 */
export default function PeriodosPage() {
	const {
		periodos,
		periodoActivo,
		loading,
		error,
		crear,
		actualizar,
		eliminar,
		activar,
		cerrar
	} = usePeriodos();

	const { showToast } = useToast();

	// Estados del formulario
	const [showModal, setShowModal] = useState(false);
	const [periodoEditando, setPeriodoEditando] = useState(null);
	const [formData, setFormData] = useState({
		cod_periodo: '',
		nombre_periodo: '',
		anio: new Date().getFullYear(),
		periodo: 1,
		fecha_inicio: '',
		fecha_fin: '',
		descripcion: ''
	});

	// Manejo del formulario
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const abrirModalCrear = () => {
		setPeriodoEditando(null);
		setFormData({
			cod_periodo: '',
			nombre_periodo: '',
			anio: new Date().getFullYear(),
			periodo: 1,
			fecha_inicio: '',
			fecha_fin: '',
			descripcion: ''
		});
		setShowModal(true);
	};

	const abrirModalEditar = (periodo) => {
		setPeriodoEditando(periodo);
		setFormData({
			cod_periodo: periodo.cod_periodo,
			nombre_periodo: periodo.nombre_periodo,
			anio: periodo.anio,
			periodo: periodo.periodo,
			fecha_inicio: periodo.fecha_inicio?.split('T')[0] || '',
			fecha_fin: periodo.fecha_fin?.split('T')[0] || '',
			descripcion: periodo.descripcion || ''
		});
		setShowModal(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			...formData,
			anio: parseInt(formData.anio),
			periodo: parseInt(formData.periodo)
		};

		let resultado;
		if (periodoEditando) {
			resultado = await actualizar(periodoEditando.cod_periodo, payload);
		} else {
			resultado = await crear(payload);
		}

		if (resultado.success) {
			showToast(
				periodoEditando ? 'Período actualizado exitosamente' : 'Período creado exitosamente',
				'success'
			);
			setShowModal(false);
		} else {
			showToast(resultado.error, 'error');
		}
	};

	const handleEliminar = async (codPeriodo) => {
		if (!confirm('¿Está seguro de eliminar este período? Esta acción no se puede deshacer.')) {
			return;
		}

		const resultado = await eliminar(codPeriodo);
		if (resultado.success) {
			showToast('Período eliminado exitosamente', 'success');
		} else {
			showToast(resultado.error, 'error');
		}
	};

	const handleActivar = async (codPeriodo) => {
		if (!confirm('¿Desea activar este período? El período activo actual se cerrará.')) {
			return;
		}

		const resultado = await activar(codPeriodo);
		if (resultado.success) {
			showToast('Período activado exitosamente', 'success');
		} else {
			showToast(resultado.error, 'error');
		}
	};

	const handleCerrar = async (codPeriodo) => {
		if (!confirm('¿Está seguro de cerrar este período?')) {
			return;
		}

		const resultado = await cerrar(codPeriodo);
		if (resultado.success) {
			showToast('Período cerrado exitosamente', 'success');
		} else {
			showToast(resultado.error, 'error');
		}
	};

	// Columnas de la tabla
	const columnas = [
		{ key: 'cod_periodo', label: 'Código' },
		{ key: 'nombre_periodo', label: 'Nombre' },
		{ key: 'anio', label: 'Año' },
		{ key: 'periodo', label: 'Período' },
		{
			key: 'fecha_inicio',
			label: 'Fecha Inicio',
			render: (value) => value ? new Date(value).toLocaleDateString('es-CO') : '-'
		},
		{
			key: 'fecha_fin',
			label: 'Fecha Fin',
			render: (value) => value ? new Date(value).toLocaleDateString('es-CO') : '-'
		},
		{
			key: 'estado',
			label: 'Estado',
			render: (value) => (
				<span className={`badge badge-${value.toLowerCase()}`}>
					{value}
				</span>
			)
		},
		{
			key: 'acciones',
			label: 'Acciones',
			render: (_, periodo) => (
				<div className="flex gap-2">
					<button
						onClick={() => abrirModalEditar(periodo)}
						className="btn-sm btn-secondary"
						title="Editar"
					>
						✏️
					</button>

					{periodo.estado !== 'ACTIVO' && (
						<button
							onClick={() => handleActivar(periodo.cod_periodo)}
							className="btn-sm btn-success"
							title="Activar"
						>
							✅
						</button>
					)}

					{periodo.estado === 'ACTIVO' && (
						<button
							onClick={() => handleCerrar(periodo.cod_periodo)}
							className="btn-sm btn-warning"
							title="Cerrar"
						>
							🔒
						</button>
					)}

					{periodo.estado !== 'ACTIVO' && (
						<button
							onClick={() => handleEliminar(periodo.cod_periodo)}
							className="btn-sm btn-danger"
							title="Eliminar"
						>
							🗑️
						</button>
					)}
				</div>
			)
		}
	];

	if (loading && periodos.length === 0) {
		return <Loader />;
	}

	return (
		<div className="periodos-page">
			{/* Header */}
			<div className="page-header">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Períodos Académicos</h1>
					<p className="text-gray-600 mt-2">
						Gestión de períodos académicos del sistema
					</p>
				</div>
				<button
					onClick={abrirModalCrear}
					className="btn btn-primary"
				>
					➕ Nuevo Período
				</button>
			</div>

			{/* Período Activo */}
			{periodoActivo && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-semibold text-blue-900">
								Período Activo
							</h3>
							<p className="text-blue-800">
								{periodoActivo.nombre_periodo} ({periodoActivo.cod_periodo})
							</p>
						</div>
						<span className="badge badge-activo text-lg">ACTIVO</span>
					</div>
				</div>
			)}

			{/* Tabla de Períodos */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-800">
					{error}
				</div>
			)}

			<div className="bg-white rounded-lg shadow">
				<Table
					data={periodos}
					columns={columnas}
					loading={loading}
					emptyMessage="No hay períodos registrados"
				/>
			</div>

			{/* Modal de Crear/Editar */}
			<Modal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				title={periodoEditando ? 'Editar Período' : 'Crear Nuevo Período'}
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Código del Período *
							</label>
							<input
								type="text"
								name="cod_periodo"
								value={formData.cod_periodo}
								onChange={handleInputChange}
								placeholder="ej: 2025-1"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg"
								required
								disabled={!!periodoEditando}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Nombre del Período *
							</label>
							<input
								type="text"
								name="nombre_periodo"
								value={formData.nombre_periodo}
								onChange={handleInputChange}
								placeholder="ej: Primer Semestre 2025"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Año *
							</label>
							<input
								type="number"
								name="anio"
								value={formData.anio}
								onChange={handleInputChange}
								min="2020"
								max="2100"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Período *
							</label>
							<select
								name="periodo"
								value={formData.periodo}
								onChange={handleInputChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg"
								required
							>
								<option value="1">1 - Primer Semestre</option>
								<option value="2">2 - Segundo Semestre</option>
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Fecha de Inicio *
							</label>
							<input
								type="date"
								name="fecha_inicio"
								value={formData.fecha_inicio}
								onChange={handleInputChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Fecha de Fin *
							</label>
							<input
								type="date"
								name="fecha_fin"
								value={formData.fecha_fin}
								onChange={handleInputChange}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg"
								required
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Descripción
						</label>
						<textarea
							name="descripcion"
							value={formData.descripcion}
							onChange={handleInputChange}
							rows="3"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							placeholder="Descripción opcional del período"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<button
							type="button"
							onClick={() => setShowModal(false)}
							className="btn btn-secondary"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading}
						>
							{loading ? 'Guardando...' : periodoEditando ? 'Actualizar' : 'Crear'}
						</button>
					</div>
				</form>
			</Modal>
		</div>
	);
}
