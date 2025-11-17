import { Calendar, Users, Clock, BookOpen, User } from 'lucide-react';

/**
 * Componente reutilizable para mostrar información de un grupo
 * 
 * @param {Object} props
 * @param {Object} props.grupo - Datos del grupo
 * @param {Function} props.onClick - Función a ejecutar al hacer click
 * @param {boolean} props.showEstudiantes - Mostrar contador de estudiantes
 * @param {boolean} props.showDocente - Mostrar nombre del docente
 * @param {boolean} props.showHorario - Mostrar información de horario
 * @param {string} props.className - Clases CSS adicionales
 */
export const GrupoCard = ({
	grupo,
	onClick,
	showEstudiantes = true,
	showDocente = true,
	showHorario = true,
	className = ''
}) => {
	if (!grupo) return null;

	const {
		nombre_grupo,
		cod_grupo,
		nombre_asignatura,
		codigo_asignatura,
		creditos,
		cupo_maximo,
		cupo_disponible,
		total_estudiantes,
		nombre_docente,
		horario,
		dias,
		hora_inicio,
		hora_fin,
		aula,
		estado
	} = grupo;

	// Calcular porcentaje de ocupación
	const ocupacion = cupo_maximo > 0 
		? ((total_estudiantes || 0) / cupo_maximo * 100).toFixed(0)
		: 0;

	// Determinar color según ocupación
	const getOcupacionColor = () => {
		if (ocupacion >= 90) return 'text-red-600 bg-red-50';
		if (ocupacion >= 70) return 'text-yellow-600 bg-yellow-50';
		return 'text-green-600 bg-green-50';
	};

	// Determinar color de estado
	const getEstadoColor = () => {
		switch (estado?.toLowerCase()) {
			case 'activo':
				return 'bg-green-100 text-green-800';
			case 'cerrado':
				return 'bg-red-100 text-red-800';
			case 'en_curso':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const handleClick = () => {
		if (onClick) {
			onClick(grupo);
		}
	};

	return (
		<div
			className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 ${
				onClick ? 'cursor-pointer hover:border-blue-500 border-2 border-transparent' : ''
			} ${className}`}
			onClick={handleClick}
		>
			{/* Header */}
			<div className="flex justify-between items-start mb-4">
				<div className="flex-1">
					<h3 className="text-lg font-bold text-gray-900 mb-1">
						{nombre_grupo || `Grupo ${cod_grupo}`}
					</h3>
					<div className="flex items-center text-sm text-gray-600 mb-2">
						<BookOpen className="w-4 h-4 mr-1" />
						<span className="font-medium">{nombre_asignatura}</span>
						{codigo_asignatura && (
							<span className="ml-2 text-gray-400">
								({codigo_asignatura})
							</span>
						)}
					</div>
					{creditos && (
						<span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
							{creditos} {creditos === 1 ? 'crédito' : 'créditos'}
						</span>
					)}
				</div>

				{estado && (
					<span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoColor()}`}>
						{estado}
					</span>
				)}
			</div>

			{/* Docente */}
			{showDocente && nombre_docente && (
				<div className="flex items-center text-sm text-gray-700 mb-3 pb-3 border-b border-gray-200">
					<User className="w-4 h-4 mr-2 text-gray-500" />
					<span>{nombre_docente}</span>
				</div>
			)}

			{/* Horario */}
			{showHorario && (dias || horario) && (
				<div className="mb-3 pb-3 border-b border-gray-200">
					<div className="flex items-start text-sm text-gray-700">
						<Clock className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
						<div className="flex-1">
							{horario ? (
								<span>{horario}</span>
							) : (
								<>
									<div className="font-medium">{dias}</div>
									{(hora_inicio || hora_fin) && (
										<div className="text-gray-600">
											{hora_inicio} - {hora_fin}
										</div>
									)}
								</>
							)}
							{aula && (
								<div className="text-gray-500 mt-1">
									📍 {aula}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Estudiantes y Cupo */}
			{showEstudiantes && cupo_maximo > 0 && (
				<div className="flex items-center justify-between">
					<div className="flex items-center text-sm text-gray-700">
						<Users className="w-4 h-4 mr-2 text-gray-500" />
						<span>
							{total_estudiantes || 0} / {cupo_maximo} estudiantes
						</span>
					</div>

					<div className={`px-3 py-1 rounded-full text-xs font-semibold ${getOcupacionColor()}`}>
						{ocupacion}% ocupado
					</div>
				</div>
			)}

			{/* Cupo disponible */}
			{cupo_disponible !== undefined && cupo_disponible >= 0 && (
				<div className="mt-2 text-sm text-gray-600">
					<Calendar className="w-4 h-4 inline mr-1" />
					{cupo_disponible > 0 ? (
						<span className="text-green-600 font-medium">
							{cupo_disponible} {cupo_disponible === 1 ? 'cupo disponible' : 'cupos disponibles'}
						</span>
					) : (
						<span className="text-red-600 font-medium">
							Sin cupos disponibles
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export default GrupoCard;
