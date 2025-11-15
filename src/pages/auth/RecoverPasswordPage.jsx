import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../../components/FormInput.jsx';
import { recuperarPassword } from '../../services/authService.js';

/**
 * Página de recuperación de contraseña
 * Nota: Esta funcionalidad requiere que el endpoint esté implementado en el backend ORDS
 */
export default function RecoverPasswordPage() {
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const onSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		// Validación básica
		if (!email.trim()) {
			setError('Por favor ingrese su correo institucional');
			return;
		}

		setLoading(true);

		try {
			// Intentar usar el servicio real
			await recuperarPassword(email.trim());
			setSent(true);
		} catch (err) {
			// Si el endpoint no está implementado (404), mostrar mensaje temporal
			if (err.response?.status === 404) {
				setError('Esta funcionalidad aún no está disponible. Contacta al administrador del sistema.');
			} else {
				// Para otros errores, asumir que el correo fue enviado (por seguridad)
				setSent(true);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="w-full max-w-md px-4">
				<div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
					{/* Logo y título */}
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold text-gray-900">
							Recuperar Contraseña
						</h1>
						<p className="mt-2 text-sm text-gray-600">
							Sistema Académico - Universidad del Quindío
						</p>
					</div>

					{sent ? (
						// Estado: Correo enviado
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
								<svg 
									className="h-8 w-8 text-green-600" 
									fill="none" 
									stroke="currentColor" 
									viewBox="0 0 24 24"
								>
									<path 
										strokeLinecap="round" 
										strokeLinejoin="round" 
										strokeWidth={2} 
										d="M5 13l4 4L19 7" 
									/>
								</svg>
							</div>
							
							<h2 className="mb-2 text-xl font-semibold text-gray-900">
								¡Correo Enviado!
							</h2>
							
							<p className="mb-6 text-sm text-gray-600">
								Si el correo <strong>{email}</strong> está registrado en el sistema, 
								recibirás instrucciones para restablecer tu contraseña.
							</p>

							<div className="space-y-3">
								<Link
									to="/login"
									className="block w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
								>
									Volver al inicio de sesión
								</Link>
								
								<button
									onClick={() => {
										setSent(false);
										setEmail('');
									}}
									className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
								>
									Enviar a otro correo
								</button>
							</div>

							{/* Información de ayuda */}
							<div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
								<strong>¿No recibiste el correo?</strong>
								<ul className="mt-1 ml-4 list-disc">
									<li>Revisa tu carpeta de spam</li>
									<li>Verifica que el correo sea el institucional</li>
									<li>Contacta al administrador del sistema</li>
								</ul>
							</div>
						</div>
					) : (
						// Formulario de recuperación
						<form onSubmit={onSubmit}>
							<div className="space-y-4">
								<p className="text-sm text-gray-600">
									Ingresa tu correo institucional y te enviaremos instrucciones 
									para restablecer tu contraseña.
								</p>

								<FormInput 
									label="Correo institucional" 
									type="email" 
									value={email} 
									onChange={(e) => setEmail(e.target.value)}
									placeholder="correo@universidad.edu"
									required 
									autoComplete="email"
								/>

								{/* Mensaje de error */}
								{error && (
									<div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
										{error}
									</div>
								)}

								{/* Información importante */}
								<div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800">
									<strong>Nota:</strong> Solo puedes recuperar la contraseña usando 
									tu correo institucional registrado en el sistema.
								</div>

								{/* Botón de envío */}
								<button 
									disabled={loading} 
									className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed" 
									type="submit"
								>
									{loading ? 'Enviando...' : 'Enviar instrucciones'}
								</button>

								{/* Enlace de retorno */}
								<div className="text-center">
									<Link 
										to="/login"
										className="text-sm text-indigo-600 hover:text-indigo-800"
									>
										← Volver al inicio de sesión
									</Link>
								</div>
							</div>
						</form>
					)}
				</div>

				{/* Footer */}
				<p className="mt-6 text-center text-xs text-gray-500">
					© 2025 Universidad del Quindío. Todos los derechos reservados.
				</p>
			</div>
		</div>
	);
}

