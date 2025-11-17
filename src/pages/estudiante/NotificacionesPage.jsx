import { useEffect, useState } from 'react';
import { useAlertas } from '../../hooks/useAlertas';
import { useAuth } from '../../hooks/useAuth';
import { AlertaCard } from '../../components/AlertaCard';
import { Loader } from '../../components/Loader';
import { EmptyState } from '../../components/EmptyState';
import { useToast } from '../../hooks/useToast';
import { Bell, Filter, CheckCheck, Eye, EyeOff } from 'lucide-react';

/**
 * Página de notificaciones y alertas del estudiante
 */
export const NotificacionesPage = () => {
	const { user } = useAuth();
	const { showToast } = useToast();
	const {
		alertas,
		loading,
		error,
		conteoNoLeidas,
		cargarAlertasEstudiante,
		marcarComoLeida,
		marcarTodasComoLeidas,
		obtenerNoLeidas,
		obtenerCriticas
	} = useAlertas(user?.codigo);

	const [filtroTipo, setFiltroTipo] = useState('TODAS');
	const [filtroPrioridad, setFiltroPrioridad] = useState('TODAS');
	const [mostrarLeidas, setMostrarLeidas] = useState(true);

	useEffect(() => {
		if (user?.codigo) {
			cargarAlertasEstudiante();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// Aplicar filtros
	const getAlertasFiltradas = () => {
		let resultado = alertas;

		// Filtrar por leídas/no leídas
		if (!mostrarLeidas) {
			resultado = obtenerNoLeidas();
		}

		// Filtrar por tipo
		if (filtroTipo !== 'TODAS') {
			resultado = resultado.filter(a => 
				(a.tipo_alerta || a.tipo || '').toUpperCase() === filtroTipo
			);
		}

		// Filtrar por prioridad
		if (filtroPrioridad !== 'TODAS') {
			resultado = resultado.filter(a => 
				(a.prioridad || '').toUpperCase() === filtroPrioridad
			);
		}

		return resultado;
	};

	const alertasFiltradas = getAlertasFiltradas();

	const handleMarcarLeida = async (codAlerta) => {
		const result = await marcarComoLeida(codAlerta);
		if (result.success) {
			showToast('Alerta marcada como leída', 'success');
		} else {
			showToast(result.error || 'Error al marcar alerta', 'error');
		}
	};

	const handleMarcarTodasLeidas = async () => {
		const result = await marcarTodasComoLeidas();
		if (result.success) {
			showToast(`${result.exitosas} alertas marcadas como leídas`, 'success');
		} else {
			showToast('Error al marcar alertas', 'error');
		}
	};

	if (loading && alertas.length === 0) {
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
							<Bell className="w-8 h-8 text-blue-600" />
							Notificaciones
							{conteoNoLeidas > 0 && (
								<span className="inline-flex items-center justify-center px-3 py-1 text-sm font-bold leading-none text-white bg-red-600 rounded-full">
									{conteoNoLeidas}
								</span>
							)}
						</h1>
						<p className="text-gray-600 mt-2">
							Centro de alertas y notificaciones del sistema
						</p>
					</div>

					{conteoNoLeidas > 0 && (
						<button
							onClick={handleMarcarTodasLeidas}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<CheckCheck className="w-4 h-4" />
							Marcar todas como leídas
						</button>
					)}
				</div>

				{/* Filtros */}
				<div className="bg-white rounded-lg shadow-md p-4">
					<div className="flex items-center gap-2 mb-4">
						<Filter className="w-5 h-5 text-gray-600" />
						<h3 className="font-semibold text-gray-900">Filtros</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						{/* Filtro: Mostrar leídas */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Vista
							</label>
							<button
								onClick={() => setMostrarLeidas(!mostrarLeidas)}
								className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
									mostrarLeidas
										? 'border-blue-500 bg-blue-50 text-blue-700'
										: 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
								}`}
							>
								{mostrarLeidas ? (
									<>
										<Eye className="w-4 h-4" />
										Todas
									</>
								) : (
									<>
										<EyeOff className="w-4 h-4" />
										Solo no leídas
									</>
								)}
							</button>
						</div>

						{/* Filtro: Tipo */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Tipo de Alerta
							</label>
							<select
								value={filtroTipo}
								onChange={(e) => setFiltroTipo(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="TODAS">Todas</option>
								<option value="RIESGO_ACADEMICO">Riesgo Académico</option>
								<option value="MATRICULA">Matrícula</option>
								<option value="NOTA">Calificación</option>
								<option value="ADVERTENCIA">Advertencia</option>
								<option value="INFO">Información</option>
							</select>
						</div>

						{/* Filtro: Prioridad */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Prioridad
							</label>
							<select
								value={filtroPrioridad}
								onChange={(e) => setFiltroPrioridad(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="TODAS">Todas</option>
								<option value="ALTA">Alta</option>
								<option value="MEDIA">Media</option>
								<option value="BAJA">Baja</option>
							</select>
						</div>

						{/* Contador de resultados */}
						<div className="flex items-end">
							<div className="w-full bg-gray-50 rounded-lg p-3 border border-gray-200">
								<div className="text-xs text-gray-600 mb-1">Mostrando</div>
								<div className="text-2xl font-bold text-gray-900">
									{alertasFiltradas.length}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Alertas Críticas (Destacadas) */}
			{obtenerCriticas().length > 0 && mostrarLeidas && filtroTipo === 'TODAS' && (
				<div className="mb-6">
					<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
						⚠️ Alertas Críticas
					</h2>
					<div className="space-y-3">
						{obtenerCriticas().slice(0, 3).map(alerta => (
							<AlertaCard
								key={alerta.cod_alerta}
								alerta={alerta}
								onMarcarLeida={handleMarcarLeida}
							/>
						))}
					</div>
				</div>
			)}

			{/* Lista de Alertas */}
			{error && (
				<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-800">{error}</p>
				</div>
			)}

			{alertasFiltradas.length === 0 ? (
				<EmptyState
					icon={Bell}
					title="No hay notificaciones"
					description={
						mostrarLeidas
							? 'No tienes notificaciones con los filtros seleccionados.'
							: 'No tienes notificaciones sin leer. ¡Todo al día!'
					}
				/>
			) : (
				<div className="space-y-3">
					{alertasFiltradas.map(alerta => (
						<AlertaCard
							key={alerta.cod_alerta}
							alerta={alerta}
							onMarcarLeida={handleMarcarLeida}
							onClick={() => console.log('Ver detalle:', alerta)}
						/>
					))}
				</div>
			)}

			{/* Resumen */}
			{alertas.length > 0 && (
				<div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="bg-white rounded-lg shadow-md p-4">
						<div className="text-sm text-gray-600 mb-1">Total</div>
						<div className="text-2xl font-bold text-gray-900">{alertas.length}</div>
					</div>
					<div className="bg-white rounded-lg shadow-md p-4">
						<div className="text-sm text-gray-600 mb-1">No leídas</div>
						<div className="text-2xl font-bold text-blue-600">{conteoNoLeidas}</div>
					</div>
					<div className="bg-white rounded-lg shadow-md p-4">
						<div className="text-sm text-gray-600 mb-1">Leídas</div>
						<div className="text-2xl font-bold text-green-600">
							{alertas.length - conteoNoLeidas}
						</div>
					</div>
					<div className="bg-white rounded-lg shadow-md p-4">
						<div className="text-sm text-gray-600 mb-1">Críticas</div>
						<div className="text-2xl font-bold text-red-600">
							{obtenerCriticas().length}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificacionesPage;
