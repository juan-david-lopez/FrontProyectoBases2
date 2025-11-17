import { AlertTriangle, Info, CheckCircle, XCircle, Bell, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente reutilizable para mostrar alertas/notificaciones
 * 
 * @param {Object} props
 * @param {Object} props.alerta - Datos de la alerta
 * @param {Function} props.onMarcarLeida - Callback al marcar como leída
 * @param {Function} props.onClick - Callback al hacer click en la alerta
 * @param {boolean} props.showActions - Mostrar botones de acción
 * @param {string} props.className - Clases CSS adicionales
 */
export const AlertaCard = ({
	alerta,
	onMarcarLeida,
	onClick,
	showActions = true,
	className = ''
}) => {
	if (!alerta) return null;

	const {
		cod_alerta,
		tipo_alerta,
		tipo,
		prioridad,
		mensaje,
		descripcion,
		fecha_creacion,
		fecha_lectura,
		leida
	} = alerta;

	const esLeida = fecha_lectura || leida;
	const tipoAlerta = tipo_alerta || tipo || 'INFO';

	// Configuración según tipo de alerta
	const getAlertaConfig = () => {
		const tipoUpper = tipoAlerta.toUpperCase();
		
		switch (tipoUpper) {
			case 'RIESGO':
			case 'RIESGO_ACADEMICO':
				return {
					icon: AlertTriangle,
					bgColor: 'bg-red-50',
					borderColor: 'border-red-500',
					iconColor: 'text-red-600',
					title: '⚠️ Riesgo Académico'
				};
			case 'MATRICULA':
			case 'VENTANA_MATRICULA':
				return {
					icon: Bell,
					bgColor: 'bg-blue-50',
					borderColor: 'border-blue-500',
					iconColor: 'text-blue-600',
					title: '📚 Matrícula'
				};
			case 'NOTA':
			case 'CALIFICACION':
				return {
					icon: CheckCircle,
					bgColor: 'bg-green-50',
					borderColor: 'border-green-500',
					iconColor: 'text-green-600',
					title: '✅ Calificación'
				};
			case 'ERROR':
			case 'ADVERTENCIA':
				return {
					icon: XCircle,
					bgColor: 'bg-yellow-50',
					borderColor: 'border-yellow-500',
					iconColor: 'text-yellow-600',
					title: '⚡ Advertencia'
				};
			default:
				return {
					icon: Info,
					bgColor: 'bg-gray-50',
					borderColor: 'border-gray-500',
					iconColor: 'text-gray-600',
					title: 'ℹ️ Información'
				};
		}
	};

	const config = getAlertaConfig();
	const Icon = config.icon;

	// Configuración según prioridad
	const getPrioridadBadge = () => {
		const prioridadUpper = prioridad?.toUpperCase();
		
		switch (prioridadUpper) {
			case 'ALTA':
			case 'CRÍTICA':
			case 'CRITICA':
				return 'bg-red-100 text-red-800 border-red-300';
			case 'MEDIA':
				return 'bg-yellow-100 text-yellow-800 border-yellow-300';
			case 'BAJA':
				return 'bg-blue-100 text-blue-800 border-blue-300';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-300';
		}
	};

	// Formatear fecha relativa
	const getFechaRelativa = () => {
		if (!fecha_creacion) return null;
		try {
			return formatDistanceToNow(new Date(fecha_creacion), {
				addSuffix: true,
				locale: es
			});
		} catch {
			return null;
		}
	};

	const handleMarcarLeida = (e) => {
		e.stopPropagation();
		if (onMarcarLeida && !esLeida) {
			onMarcarLeida(cod_alerta);
		}
	};

	const handleClick = () => {
		if (onClick) {
			onClick(alerta);
		}
	};

	return (
		<div
			className={`
				${config.bgColor} 
				border-l-4 ${config.borderColor} 
				rounded-lg shadow-sm 
				p-4
				${!esLeida ? 'ring-2 ring-blue-200' : ''}
				${onClick ? 'cursor-pointer hover:shadow-md' : ''}
				transition-all duration-200
				${className}
			`}
			onClick={handleClick}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-2">
				<div className="flex items-start gap-3 flex-1">
					{/* Icono */}
					<div className={`${config.iconColor} mt-1 flex-shrink-0`}>
						<Icon className="w-5 h-5" />
					</div>

					{/* Contenido */}
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1">
							<h4 className="text-sm font-semibold text-gray-900">
								{config.title}
							</h4>
							{!esLeida && (
								<span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
							)}
						</div>

						{/* Mensaje */}
						<p className="text-sm text-gray-800 font-medium mb-1">
							{mensaje || descripcion}
						</p>

						{/* Descripción adicional */}
						{mensaje && descripcion && mensaje !== descripcion && (
							<p className="text-xs text-gray-600 mt-1">
								{descripcion}
							</p>
						)}

						{/* Footer: Fecha y Prioridad */}
						<div className="flex items-center gap-3 mt-2 flex-wrap">
							{getFechaRelativa() && (
								<span className="text-xs text-gray-500">
									🕐 {getFechaRelativa()}
								</span>
							)}

							{prioridad && (
								<span className={`
									text-xs font-semibold px-2 py-0.5 rounded border
									${getPrioridadBadge()}
								`}>
									{prioridad}
								</span>
							)}

							{esLeida && (
								<span className="text-xs text-gray-400 flex items-center gap-1">
									<Eye className="w-3 h-3" />
									Leída
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Acciones */}
				{showActions && !esLeida && onMarcarLeida && (
					<button
						onClick={handleMarcarLeida}
						className="ml-2 flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors"
						title="Marcar como leída"
					>
						<Eye className="w-4 h-4" />
					</button>
				)}
			</div>
		</div>
	);
};

export default AlertaCard;
