import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Award, Edit2, Save, X } from 'lucide-react';
import { fetchEstudianteById } from '../../services/estudiantesService.js';
import { actualizarPassword } from '../../services/authService.js';

export default function PerfilPage() {
	const { user } = useAuth();
	const [estudiante, setEstudiante] = useState(null);
	const [loading, setLoading] = useState(true);
	const [editandoPassword, setEditandoPassword] = useState(false);
	const [passwords, setPasswords] = useState({ nueva: '', confirmar: '' });
	const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

	const items = [
		{ to: '/estudiante/dashboard', label: 'Resumen' },
		{ to: '/estudiante/matricula', label: 'Matrícula' },
		{ to: '/estudiante/notas', label: 'Notas' },
		{ to: '/estudiante/perfil', label: 'Perfil' },
	];

	useEffect(() => {
		if (user) {
			cargarPerfil();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const cargarPerfil = async () => {
		try {
			setLoading(true);
			
			// Debug: mostrar estructura del usuario
			console.log('👤 Usuario completo:', user);
			
			// Intentar obtener el código del estudiante de varias ubicaciones posibles
			const codigo = user?.cod_estudiante 
				|| user?.cod_referencia 
				|| user?.codigo
				|| user?.usuario?.cod_estudiante;
			
			console.log('🔍 Código detectado:', codigo);
			
			if (!codigo) {
				console.error('❌ No se encontró código de estudiante en:', user);
				setMensaje({ tipo: 'error', texto: 'No se pudo obtener el código de estudiante' });
				setLoading(false);
				return;
			}
			
			const data = await fetchEstudianteById(codigo);
			console.log('✅ Datos del estudiante cargados:', data);
			
			// Verificar si data.items existe (respuesta ORDS)
			if (data?.items && data.items.length > 0) {
				setEstudiante(data.items[0]);
			} else if (data) {
				setEstudiante(data);
			} else {
				console.error('❌ Respuesta vacía del servidor');
				setMensaje({ tipo: 'error', texto: 'No se encontraron datos del estudiante' });
			}
		} catch (error) {
			console.error('❌ Error al cargar perfil:', error);
			console.error('Response:', error.response?.data);
			setMensaje({ tipo: 'error', texto: error.response?.data?.message || 'Error al cargar los datos del perfil' });
		} finally {
			setLoading(false);
		}
	};

	const handleCambiarPassword = async () => {
		if (passwords.nueva !== passwords.confirmar) {
			setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
			return;
		}

		if (passwords.nueva.length < 6) {
			setMensaje({ tipo: 'error', texto: 'La contraseña debe tener al menos 6 caracteres' });
			return;
		}

		try {
			await actualizarPassword(user?.username || user?.email || user?.correo, passwords.nueva);
			setMensaje({ tipo: 'success', texto: 'Contraseña actualizada correctamente' });
			setEditandoPassword(false);
			setPasswords({ nueva: '', confirmar: '' });
		} catch (err) {
			console.error('❌ Error al cambiar contraseña:', err);
			setMensaje({ tipo: 'error', texto: err.response?.data?.message || 'Error al actualizar la contraseña' });
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen">
				<Navbar />
				<div className="mx-auto flex max-w-7xl gap-6 p-4">
					<Sidebar items={items} />
					<main className="flex-1">
						<div className="animate-pulse space-y-4">
							<div className="h-8 w-48 rounded bg-gray-200"></div>
							<div className="h-64 rounded-lg bg-gray-200"></div>
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
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
					</div>

					{mensaje.texto && (
						<div className={`rounded-lg p-4 ${
							mensaje.tipo === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
						}`}>
							{mensaje.texto}
						</div>
					)}

					{/* Información Personal */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="mb-6 flex items-center gap-4">
							<div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
								<User className="h-10 w-10 text-blue-600" />
							</div>
							<div>
								<h2 className="text-2xl font-bold text-gray-900">
									{estudiante?.primer_nombre || estudiante?.nombre1} {estudiante?.segundo_nombre || estudiante?.nombre2 || ''} {estudiante?.primer_apellido || estudiante?.apellido1} {estudiante?.segundo_apellido || estudiante?.apellido2 || ''}
								</h2>
								<p className="text-gray-600">Estudiante</p>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<CreditCard className="mt-1 h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-500">Código de Estudiante</p>
										<p className="text-lg font-semibold text-gray-900">
											{estudiante?.cod_estudiante || estudiante?.codigo || 'No disponible'}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<User className="mt-1 h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-500">Documento</p>
										<p className="text-lg text-gray-900">
											{estudiante?.tipo_documento || 'CC'} {estudiante?.num_documento || estudiante?.documento || 'No disponible'}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Mail className="mt-1 h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-500">Correo Institucional</p>
										<p className="text-lg text-gray-900">
											{estudiante?.correo_institucional || estudiante?.correo || estudiante?.email || 'No disponible'}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Phone className="mt-1 h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-500">Teléfono</p>
										<p className="text-lg text-gray-900">{estudiante?.telefono || 'No registrado'}</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<MapPin className="mt-1 h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-500">Dirección</p>
										<p className="text-lg text-gray-900">{estudiante?.direccion || 'No registrada'}</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Calendar className="mt-1 h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
										<p className="text-lg text-gray-900">
											{estudiante?.fecha_nacimiento ? new Date(estudiante.fecha_nacimiento).toLocaleDateString('es-CO') : 'No registrada'}
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Award className="mt-1 h-5 w-5 text-gray-400" />
									<div>
										<p className="text-sm font-medium text-gray-500">Programa Académico</p>
										<p className="text-lg text-gray-900">
											{estudiante?.nombre_programa || estudiante?.programa?.nombre || 'No asignado'}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Seguridad */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-xl font-semibold text-gray-900">Seguridad</h3>
							{!editandoPassword && (
								<button
									onClick={() => setEditandoPassword(true)}
									className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
								>
									<Edit2 className="h-4 w-4" />
									Cambiar Contraseña
								</button>
							)}
						</div>

						{editandoPassword && (
							<div className="space-y-4">
								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700">Nueva Contraseña</label>
									<input
										type="password"
										value={passwords.nueva}
										onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })}
										className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
										placeholder="Mínimo 6 caracteres"
									/>
								</div>

								<div>
									<label className="mb-2 block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
									<input
										type="password"
										value={passwords.confirmar}
										onChange={(e) => setPasswords({ ...passwords, confirmar: e.target.value })}
										className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
										placeholder="Repite la contraseña"
									/>
								</div>

								<div className="flex gap-3">
									<button
										onClick={handleCambiarPassword}
										className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
									>
										<Save className="h-4 w-4" />
										Guardar
									</button>
									<button
										onClick={() => {
											setEditandoPassword(false);
											setPasswords({ nueva: '', confirmar: '' });
											setMensaje({ tipo: '', texto: '' });
										}}
										className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
									>
										<X className="h-4 w-4" />
										Cancelar
									</button>
								</div>
							</div>
						)}

						{!editandoPassword && (
							<p className="text-gray-600">Tu contraseña está protegida. Puedes cambiarla en cualquier momento.</p>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

