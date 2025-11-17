import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * Componente reutilizable para mostrar estadísticas con iconos
 * 
 * @param {Object} props
 * @param {string} props.titulo - Título de la estadística
 * @param {string|number} props.valor - Valor principal a mostrar
 * @param {string} props.descripcion - Descripción adicional
 * @param {string} props.icono - Nombre del ícono a mostrar
 * @param {string} props.color - Color del tema ('blue', 'green', 'red', 'yellow', 'purple')
 * @param {number} props.cambio - Porcentaje de cambio (positivo/negativo)
 * @param {string} props.tendencia - Tendencia ('up', 'down', 'neutral')
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.className - Clases CSS adicionales
 */
export const EstadisticasCard = ({
	titulo,
	valor,
	descripcion,
	icono: IconComponent,
	color = 'blue',
	cambio,
	tendencia,
	loading = false,
	className = ''
}) => {
	// Configuración de colores
	const colorConfig = {
		blue: {
			bg: 'bg-blue-50',
			icon: 'bg-blue-500',
			text: 'text-blue-600',
			lightText: 'text-blue-500'
		},
		green: {
			bg: 'bg-green-50',
			icon: 'bg-green-500',
			text: 'text-green-600',
			lightText: 'text-green-500'
		},
		red: {
			bg: 'bg-red-50',
			icon: 'bg-red-500',
			text: 'text-red-600',
			lightText: 'text-red-500'
		},
		yellow: {
			bg: 'bg-yellow-50',
			icon: 'bg-yellow-500',
			text: 'text-yellow-600',
			lightText: 'text-yellow-500'
		},
		purple: {
			bg: 'bg-purple-50',
			icon: 'bg-purple-500',
			text: 'text-purple-600',
			lightText: 'text-purple-500'
		},
		gray: {
			bg: 'bg-gray-50',
			icon: 'bg-gray-500',
			text: 'text-gray-600',
			lightText: 'text-gray-500'
		}
	};

	const colors = colorConfig[color] || colorConfig.blue;

	// Determinar ícono de tendencia
	const getTendenciaIcon = () => {
		if (tendencia === 'up') return <TrendingUp className="w-4 h-4" />;
		if (tendencia === 'down') return <TrendingDown className="w-4 h-4" />;
		return <Minus className="w-4 h-4" />;
	};

	// Determinar color de cambio
	const getCambioColor = () => {
		if (!cambio) return 'text-gray-500';
		if (cambio > 0) return 'text-green-600';
		if (cambio < 0) return 'text-red-600';
		return 'text-gray-500';
	};

	// Skeleton loader
	if (loading) {
		return (
			<div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
				<div className="animate-pulse">
					<div className="flex items-center justify-between mb-4">
						<div className="h-4 bg-gray-200 rounded w-1/3"></div>
						<div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
					</div>
					<div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
					<div className="h-3 bg-gray-200 rounded w-2/3"></div>
				</div>
			</div>
		);
	}

	return (
		<div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 ${className}`}>
			{/* Header con título e ícono */}
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-sm font-medium text-gray-600">
					{titulo}
				</h3>
				{IconComponent && (
					<div className={`${colors.icon} p-2.5 rounded-lg`}>
						<IconComponent className="w-5 h-5 text-white" />
					</div>
				)}
			</div>

			{/* Valor principal */}
			<div className="mb-2">
				<p className={`text-3xl font-bold ${colors.text}`}>
					{valor ?? '—'}
				</p>
			</div>

			{/* Descripción y cambio */}
			<div className="flex items-center justify-between">
				{descripcion && (
					<p className="text-sm text-gray-500">
						{descripcion}
					</p>
				)}

				{/* Indicador de cambio */}
				{(cambio !== undefined || tendencia) && (
					<div className={`flex items-center gap-1 text-sm font-medium ${getCambioColor()}`}>
						{tendencia && getTendenciaIcon()}
						{cambio !== undefined && (
							<>
								{cambio > 0 && <ArrowUpRight className="w-4 h-4" />}
								{cambio < 0 && <ArrowDownRight className="w-4 h-4" />}
								<span>
									{cambio > 0 ? '+' : ''}{cambio}%
								</span>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default EstadisticasCard;
