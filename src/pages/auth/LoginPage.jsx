import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import FormInput from '../../components/FormInput.jsx';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Página de inicio de sesión
 * Credenciales iniciales para estudiantes:
 * - Usuario: Correo institucional
 * - Contraseña: Número de documento de identidad
 */
export default function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, loading, user, isAuthenticated } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [showPassword, setShowPassword] = useState(false);

	// Redirigir cuando el usuario se autentique
	useEffect(() => {
		if (isAuthenticated && user) {
			const from = location.state?.from?.pathname;
			if (from) {
				navigate(from, { replace: true });
				return;
			}
			// Usar el role del usuario logueado (normalizado a minúsculas)
			const role = (user?.role || user?.rol || '').toLowerCase();
			const target = role ? `/${role}/dashboard` : '/login';
			navigate(target, { replace: true });
		}
	}, [isAuthenticated, user, navigate, location.state]);

	const onSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		// Validaciones básicas
		if (!email.trim()) {
			setError('Por favor ingrese su correo institucional');
			return;
		}

		if (!password.trim()) {
			setError('Por favor ingrese su contraseña');
			return;
		}

		const res = await login(email.trim(), password.trim());
		if (!res.success) {
			// Mensajes de error específicos según el código de estado
			let errorMessage = 'Credenciales inválidas';
			
			if (res.error?.status === 401) {
				errorMessage = 'Usuario o contraseña incorrectos';
			} else if (res.error?.status === 403) {
				errorMessage = 'Cuenta bloqueada. Contacte al administrador';
			} else if (res.error?.status === 500) {
				errorMessage = 'Error del servidor. Intente nuevamente';
			} else if (res.error?.message) {
				errorMessage = res.error.message;
			}
			
			setError(errorMessage);
		}
		// La redirección se maneja en el useEffect cuando isAuthenticated cambia
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="w-full max-w-md px-4">
				<form 
					onSubmit={onSubmit} 
					className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg"
				>
					{/* Logo y título */}
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold text-gray-900">
							Sistema Académico
						</h1>
						<p className="mt-2 text-sm text-gray-600">
							Universidad del Quindío
						</p>
					</div>

					{/* Formulario */}
					<div className="space-y-4">
						<FormInput 
							label="Correo institucional" 
							type="email" 
							value={email} 
							onChange={(e) => setEmail(e.target.value)}
							placeholder="correo@universidad.edu"
							required 
							autoComplete="email"
						/>
						
						<div className="relative">
							<FormInput 
								label="Contraseña" 
								type={showPassword ? "text" : "password"}
								value={password} 
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Número de documento"
								required 
								autoComplete="current-password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
								aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
							>
								{showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
							</button>
						</div>

						{/* Mensaje de error */}
						{error && (
							<div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
								{error}
							</div>
						)}

						{/* Información de ayuda */}
						<div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
							<strong>Credenciales iniciales:</strong>
							<ul className="mt-1 ml-4 list-disc">
								<li>Usuario: Correo institucional</li>
								<li>Contraseña: Número de documento</li>
							</ul>
						</div>

						{/* Botón de login */}
						<button 
							disabled={loading} 
							className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed" 
							type="submit"
						>
							{loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
						</button>

						{/* Enlaces adicionales */}
						<div className="text-center">
							<Link 
								to="/recuperar-password"
								className="text-sm text-indigo-600 hover:text-indigo-800"
							>
								¿Olvidaste tu contraseña?
							</Link>
						</div>
					</div>
				</form>

				{/* Footer */}
				<p className="mt-6 text-center text-xs text-gray-500">
					© 2025 Universidad del Quindío. Todos los derechos reservados.
				</p>
			</div>
		</div>
	);
}

