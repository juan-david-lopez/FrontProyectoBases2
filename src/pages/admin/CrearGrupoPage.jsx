import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { crearGrupo } from '../../services/gruposService.js';
import { fetchAsignaturas } from '../../services/asignaturasService.js';
import { fetchDocentes } from '../../services/docentesService.js';

export default function CrearGrupoPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [guardando, setGuardando] = useState(false);
	const [asignaturas, setAsignaturas] = useState([]);
	const [docentes, setDocentes] = useState([]);
	const [errors, setErrors] = useState({});
	const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

	const [formData, setFormData] = useState({
		cod_asignatura: '',
		cod_docente: '',
		cod_periodo: '2025-I',
		cupo_maximo: '',
		horario: '',
		salon: '',
		cod_sede: ''
	});

	const items = [
		{ to: '/administrador/dashboard', label: 'Dashboard' },
		{ to: '/administrador/programas', label: 'Programas' },
		{ to: '/administrador/asignaturas', label: 'Asignaturas' },
		{ to: '/administrador/docentes', label: 'Docentes' },
		{ to: '/administrador/estudiantes', label: 'Estudiantes' },
		{ to: '/administrador/grupos', label: 'Grupos' },
		{ to: '/administrador/sedes', label: 'Sedes' },
		{ to: '/administrador/reportes', label: 'Reportes' },
	];

	useEffect(() => {
		cargarDatos();
	}, []);

	const cargarDatos = async () => {
		try {
			setLoading(true);
			const [asignaturasData, docentesData] = await Promise.all([
				fetchAsignaturas(),
				fetchDocentes()
			]);
			
			setAsignaturas(asignaturasData.items || asignaturasData || []);
			setDocentes(docentesData.items || docentesData || []);
		} catch (error) {
			console.error('Error al cargar datos:', error);
			setMensaje({ tipo: 'error', texto: 'Error al cargar asignaturas y docentes' });
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Limpiar error del campo cuando el usuario edita
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
	};

	const validarFormulario = () => {
		const newErrors = {};

		if (!formData.cod_asignatura) {
			newErrors.cod_asignatura = 'Seleccione una asignatura';
		}
		if (!formData.cod_docente) {
			newErrors.cod_docente = 'Seleccione un docente';
		}
		if (!formData.cod_periodo) {
			newErrors.cod_periodo = 'Ingrese el periodo académico';
		}
		if (!formData.cupo_maximo || formData.cupo_maximo < 1) {
			newErrors.cupo_maximo = 'El cupo debe ser mayor a 0';
		}
		if (!formData.horario) {
			newErrors.horario = 'Ingrese el horario';
		}
		if (!formData.salon) {
			newErrors.salon = 'Ingrese el salón';
		}
		if (!formData.cod_sede) {
			newErrors.cod_sede = 'Seleccione una sede';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validarFormulario()) {
			setMensaje({ tipo: 'error', texto: 'Por favor complete todos los campos obligatorios' });
			return;
		}

		try {
			setGuardando(true);
			setMensaje({ tipo: '', texto: '' });

			const payload = {
				...formData,
				cupo_maximo: parseInt(formData.cupo_maximo, 10)
			};

			await crearGrupo(payload);
			setMensaje({ tipo: 'success', texto: 'Grupo creado exitosamente' });
			
			// Navegar de vuelta después de 1.5 segundos
			setTimeout(() => {
				navigate('/administrador/grupos');
			}, 1500);
		} catch (error) {
			console.error('Error al crear grupo:', error);
			setMensaje({ 
				tipo: 'error', 
				texto: error.response?.data?.detalle || 'Error al crear el grupo' 
			});
		} finally {
			setGuardando(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<div className="mx-auto flex max-w-7xl gap-6 p-4">
					<Sidebar items={items} />
					<main className="flex-1">
						<div className="animate-pulse space-y-4">
							<div className="h-8 w-64 rounded bg-gray-200"></div>
							<div className="h-96 rounded-lg bg-gray-200"></div>
						</div>
					</main>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="mx-auto flex max-w-7xl gap-6 p-4">
				<Sidebar items={items} />
				<main className="flex-1 space-y-6">
					{/* Header */}
					<div className="flex items-center gap-4">
						<button
							onClick={() => navigate('/administrador/grupos')}
							className="rounded-lg p-2 hover:bg-gray-200"
						>
							<ArrowLeft className="h-6 w-6" />
						</button>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Grupo</h1>
							<p className="text-gray-600">Complete la información del grupo académico</p>
						</div>
					</div>

					{/* Mensajes */}
					{mensaje.texto && (
						<div className={`rounded-lg p-4 ${
							mensaje.tipo === 'success' 
								? 'bg-green-50 text-green-800 border border-green-200' 
								: 'bg-red-50 text-red-800 border border-red-200'
						}`}>
							{mensaje.texto}
						</div>
					)}

					{/* Formulario */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="rounded-lg bg-white p-6 shadow-sm">
							<div className="mb-6 flex items-center gap-3">
								<BookOpen className="h-6 w-6 text-blue-600" />
								<h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								{/* Asignatura */}
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700">
										Asignatura <span className="text-red-500">*</span>
									</label>
									<select
										name="cod_asignatura"
										value={formData.cod_asignatura}
										onChange={handleChange}
										className={`w-full rounded-lg border px-4 py-2 focus:outline-none ${
											errors.cod_asignatura 
												? 'border-red-300 focus:border-red-500' 
												: 'border-gray-300 focus:border-blue-500'
										}`}
									>
										<option value="">Seleccione una asignatura</option>
										{asignaturas.map(asignatura => (
											<option key={asignatura.cod_asignatura} value={asignatura.cod_asignatura}>
												{asignatura.cod_asignatura} - {asignatura.nombre}
											</option>
										))}
									</select>
									{errors.cod_asignatura && (
										<p className="mt-1 text-sm text-red-600">{errors.cod_asignatura}</p>
									)}
								</div>

								{/* Docente */}
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700">
										Docente <span className="text-red-500">*</span>
									</label>
									<select
										name="cod_docente"
										value={formData.cod_docente}
										onChange={handleChange}
										className={`w-full rounded-lg border px-4 py-2 focus:outline-none ${
											errors.cod_docente 
												? 'border-red-300 focus:border-red-500' 
												: 'border-gray-300 focus:border-blue-500'
										}`}
									>
										<option value="">Seleccione un docente</option>
										{docentes.map(docente => (
											<option key={docente.cod_docente} value={docente.cod_docente}>
												{docente.nombre_completo || `${docente.nombre1} ${docente.apellido1}`}
											</option>
										))}
									</select>
									{errors.cod_docente && (
										<p className="mt-1 text-sm text-red-600">{errors.cod_docente}</p>
									)}
								</div>

								{/* Periodo */}
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700">
										Periodo Académico <span className="text-red-500">*</span>
									</label>
									<select
										name="cod_periodo"
										value={formData.cod_periodo}
										onChange={handleChange}
										className={`w-full rounded-lg border px-4 py-2 focus:outline-none ${
											errors.cod_periodo 
												? 'border-red-300 focus:border-red-500' 
												: 'border-gray-300 focus:border-blue-500'
										}`}
									>
										<option value="2025-I">2025-I</option>
										<option value="2024-II">2024-II</option>
										<option value="2024-I">2024-I</option>
									</select>
									{errors.cod_periodo && (
										<p className="mt-1 text-sm text-red-600">{errors.cod_periodo}</p>
									)}
								</div>

								{/* Cupo Máximo */}
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700">
										Cupo Máximo <span className="text-red-500">*</span>
									</label>
									<input
										type="number"
										name="cupo_maximo"
										value={formData.cupo_maximo}
										onChange={handleChange}
										min="1"
										max="100"
										placeholder="Ej: 30"
										className={`w-full rounded-lg border px-4 py-2 focus:outline-none ${
											errors.cupo_maximo 
												? 'border-red-300 focus:border-red-500' 
												: 'border-gray-300 focus:border-blue-500'
										}`}
									/>
									{errors.cupo_maximo && (
										<p className="mt-1 text-sm text-red-600">{errors.cupo_maximo}</p>
									)}
								</div>

								{/* Horario */}
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700">
										Horario <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="horario"
										value={formData.horario}
										onChange={handleChange}
										placeholder="Ej: Lunes 8:00-10:00, Miércoles 8:00-10:00"
										className={`w-full rounded-lg border px-4 py-2 focus:outline-none ${
											errors.horario 
												? 'border-red-300 focus:border-red-500' 
												: 'border-gray-300 focus:border-blue-500'
										}`}
									/>
									{errors.horario && (
										<p className="mt-1 text-sm text-red-600">{errors.horario}</p>
									)}
								</div>

								{/* Salón */}
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700">
										Salón <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="salon"
										value={formData.salon}
										onChange={handleChange}
										placeholder="Ej: Edificio A - Salón 301"
										className={`w-full rounded-lg border px-4 py-2 focus:outline-none ${
											errors.salon 
												? 'border-red-300 focus:border-red-500' 
												: 'border-gray-300 focus:border-blue-500'
										}`}
									/>
									{errors.salon && (
										<p className="mt-1 text-sm text-red-600">{errors.salon}</p>
									)}
								</div>

								{/* Sede */}
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700">
										Sede <span className="text-red-500">*</span>
									</label>
									<select
										name="cod_sede"
										value={formData.cod_sede}
										onChange={handleChange}
										className={`w-full rounded-lg border px-4 py-2 focus:outline-none ${
											errors.cod_sede 
												? 'border-red-300 focus:border-red-500' 
												: 'border-gray-300 focus:border-blue-500'
										}`}
									>
										<option value="">Seleccione una sede</option>
										<option value="1">Sede Principal</option>
										<option value="2">Sede Norte</option>
										<option value="3">Sede Sur</option>
									</select>
									{errors.cod_sede && (
										<p className="mt-1 text-sm text-red-600">{errors.cod_sede}</p>
									)}
								</div>
							</div>
						</div>

						{/* Botones de Acción */}
						<div className="flex justify-end gap-3">
							<button
								type="button"
								onClick={() => navigate('/administrador/grupos')}
								className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
								disabled={guardando}
							>
								Cancelar
							</button>
							<button
								type="submit"
								disabled={guardando}
								className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
							>
								{guardando ? (
									<>
										<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										Guardando...
									</>
								) : (
									<>
										<Save className="h-5 w-5" />
										Crear Grupo
									</>
								)}
							</button>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
}
