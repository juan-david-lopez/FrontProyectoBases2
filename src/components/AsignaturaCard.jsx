import { BookOpen, Award, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Componente reutilizable para mostrar información de una asignatura
 * 
 * @param {Object} props
 * @param {Object} props.asignatura - Datos de la asignatura
 * @param {Function} props.onClick - Función a ejecutar al hacer click
 * @param {boolean} props.showNota - Mostrar calificación si está disponible
 * @param {boolean} props.showEstado - Mostrar estado de la asignatura
 * @param {boolean} props.showPrerequisitos - Mostrar prerequisitos
 * @param {string} props.className - Clases CSS adicionales
 */
export const AsignaturaCard = ({
	asignatura,
	onClick,
	showNota = false,
	showEstado = true,
	showPrerequisitos = false,
	className = ''
}) => {
	if (!asignatura) return null;

	const {
		cod_asignatura,
		codigo,
		nombre_asignatura,
		nombre,
		creditos,
		semestre,
		tipo_asignatura,
		tipo,
		nota_final,
		estado,
		prerequisitos,
		horas_teoricas,
		horas_practicas
	} = asignatura;

	const nombreAsignatura = nombre_asignatura || nombre;
	const codigoAsignatura = cod_asignatura || codigo;
	const tipoAsignatura = tipo_asignatura || tipo;

	// Determinar color según nota
	const getNotaColor = (nota) => {
		if (!nota) return 'text-gray-500';
		if (nota >= 4.0) return 'text-green-600';
		if (nota >= 3.0) return 'text-blue-600';
		if (nota >= 2.0) return 'text-yellow-600';
		return 'text-red-600';
	};

	// Determinar ícono según nota
	const getNotaIcon = (nota) => {
		if (!nota) return null;
		if (nota >= 3.0) return <CheckCircle className="w-5 h-5 text-green-600" />;
		if (nota >= 2.0) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
		return <XCircle className="w-5 h-5 text-red-600" />;
	};

	// Determinar color de tipo
	const getTipoColor = () => {
		const tipoUpper = tipoAsignatura?.toUpperCase();
		switch (tipoUpper) {
			case 'OBLIGATORIA':
			case 'FUNDAMENTAL':
				return 'bg-blue-100 text-blue-800';
			case 'ELECTIVA':
				return 'bg-purple-100 text-purple-800';
			case 'LIBRE':
				return 'bg-green-100 text-green-800';
			case 'TRABAJO_GRADO':
			case 'PROYECTO':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// Determinar color de estado
	const getEstadoColor = () => {
		const estadoUpper = estado?.toUpperCase();
		switch (estadoUpper) {
			case 'APROBADA':
			case 'APROBADO':
				return 'bg-green-100 text-green-800';
			case 'REPROBADA':
			case 'REPROBADO':
				return 'bg-red-100 text-red-800';
			case 'EN_CURSO':
			case 'CURSANDO':
				return 'bg-blue-100 text-blue-800';
			case 'PENDIENTE':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const handleClick = () => {
		if (onClick) {
			onClick(asignatura);
		}
	};

	return (
		<div
			className={`
				bg-white rounded-lg shadow-md hover:shadow-lg 
				transition-shadow duration-200 p-5
				${onClick ? 'cursor-pointer hover:border-blue-500 border-2 border-transparent' : 'border border-gray-200'}
				${className}
			`}
			onClick={handleClick}
		>
			{/* Header */}
			<div className="flex justify-between items-start mb-3">
				<div className="flex-1">
					<div className="flex items-start gap-2 mb-2">
						<BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
						<div className="flex-1">
							<h3 className="text-base font-bold text-gray-900 leading-tight">
								{nombreAsignatura}
							</h3>
							{codigoAsignatura && (
								<p className="text-xs text-gray-500 mt-1">
									Código: {codigoAsignatura}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Nota */}
				{showNota && nota_final !== undefined && nota_final !== null && (
					<div className="ml-3 flex items-center gap-2">
						{getNotaIcon(nota_final)}
						<span className={`text-xl font-bold ${getNotaColor(nota_final)}`}>
							{nota_final.toFixed(1)}
						</span>
					</div>
				)}
			</div>

			{/* Badges */}
			<div className="flex flex-wrap gap-2 mb-3">
				{/* Créditos */}
				{creditos && (
					<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
						<Award className="w-3 h-3 mr-1" />
						{creditos} {creditos === 1 ? 'crédito' : 'créditos'}
					</span>
				)}

				{/* Semestre */}
				{semestre && (
					<span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
						Semestre {semestre}
					</span>
				)}

				{/* Tipo */}
				{tipoAsignatura && (
					<span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getTipoColor()}`}>
						{tipoAsignatura}
					</span>
				)}

				{/* Estado */}
				{showEstado && estado && (
					<span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getEstadoColor()}`}>
						{estado}
					</span>
				)}
			</div>

			{/* Horas */}
			{(horas_teoricas || horas_practicas) && (
				<div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
					{horas_teoricas && (
						<div className="flex items-center gap-1">
							<Clock className="w-3 h-3" />
							<span>{horas_teoricas}h teóricas</span>
						</div>
					)}
					{horas_practicas && (
						<div className="flex items-center gap-1">
							<Clock className="w-3 h-3" />
							<span>{horas_practicas}h prácticas</span>
						</div>
					)}
				</div>
			)}

			{/* Prerequisitos */}
			{showPrerequisitos && prerequisitos && prerequisitos.length > 0 && (
				<div className="mt-3 pt-3 border-t border-gray-200">
					<p className="text-xs font-semibold text-gray-700 mb-1">
						Prerequisitos:
					</p>
					<div className="flex flex-wrap gap-1">
						{prerequisitos.map((prereq, index) => (
							<span
								key={index}
								className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
							>
								{prereq.codigo || prereq.nombre || prereq}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default AsignaturaCard;
