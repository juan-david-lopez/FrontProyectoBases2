import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Componente que verifica la conexión con el backend ORDS
 * Muestra una alerta visual si el backend no está disponible
 */
export default function BackendHealthCheck() {
	const [isBackendDown, setIsBackendDown] = useState(false);
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		checkBackend();
		// Verificar cada 30 segundos
		const interval = setInterval(checkBackend, 30000);
		return () => clearInterval(interval);
	}, []);

	const checkBackend = async () => {
		try {
			const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/ords/academico';
			// Intentar hacer una petición OPTIONS al endpoint de login para verificar conectividad
			await axios.options(`${baseUrl}/auth/login`, { 
				timeout: 3000,
				// No enviar credenciales en esta verificación
				headers: {}
			});
			setIsBackendDown(false);
		} catch (error) {
			// Solo marcar como caído si es error de conexión
			// Si recibimos cualquier respuesta HTTP (incluso 404/405), el servidor está arriba
			if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
				setIsBackendDown(true);
			} else {
				// Si hay respuesta (aunque sea error), el servidor está corriendo
				setIsBackendDown(false);
			}
		} finally {
			setIsChecking(false);
		}
	};

	// No mostrar nada mientras verifica
	if (isChecking) {
		return null;
	}

	// No mostrar nada si el backend está funcionando
	if (!isBackendDown) {
		return null;
	}

	return (
		<div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white">
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<svg 
							className="h-6 w-6 animate-pulse" 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24"
						>
							<path 
								strokeLinecap="round" 
								strokeLinejoin="round" 
								strokeWidth={2} 
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
							/>
						</svg>
						<div>
							<p className="font-semibold">
								⚠️ No se puede conectar con el servidor backend
							</p>
							<p className="text-sm opacity-90">
								Verifica que el servidor ORDS esté corriendo en:{' '}
								<code className="bg-red-700 px-2 py-1 rounded">
									{import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}
								</code>
							</p>
						</div>
					</div>
					<button
						onClick={checkBackend}
						className="rounded bg-red-700 px-4 py-2 text-sm font-semibold hover:bg-red-800 transition"
					>
						Reintentar
					</button>
				</div>
			</div>
		</div>
	);
}
