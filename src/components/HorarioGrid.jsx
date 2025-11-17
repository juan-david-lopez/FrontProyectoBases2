import { useState } from 'react';
import { Clock, MapPin, User, BookOpen } from 'lucide-react';

/**
 * Componente reutilizable para mostrar horarios en formato de grilla semanal
 * 
 * @param {Object} props
 * @param {Array} props.horarios - Array de bloques de horario
 * @param {boolean} props.compacto - Modo compacto (menos información)
 * @param {Function} props.onBloqueClick - Callback al hacer click en un bloque
 * @param {string} props.className - Clases CSS adicionales
 */
export const HorarioGrid = ({
	horarios = [],
	compacto = false,
	onBloqueClick,
	className = ''
}) => {
	const [selectedBloque, setSelectedBloque] = useState(null);

	// Días de la semana
	const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	const diasAbrev = ['L', 'M', 'X', 'J', 'V', 'S'];

	// Horas del día (7am - 9pm)
	const horas = Array.from({ length: 14 }, (_, i) => i + 7);

	// Normalizar datos de horario
	const normalizarHorarios = () => {
		return horarios.map(h => {
			// Extraer día
			let dia = h.dia || h.dia_semana || '';
			dia = dia.toLowerCase();

			// Mapear día a índice
			const diaIndex = {
				'lunes': 0, 'lu': 0, 'l': 0,
				'martes': 1, 'ma': 1, 'm': 1,
				'miércoles': 2, 'miercoles': 2, 'mi': 2, 'x': 2,
				'jueves': 3, 'ju': 3, 'j': 3,
				'viernes': 4, 'vi': 4, 'v': 4,
				'sábado': 5, 'sabado': 5, 'sa': 5, 's': 5
			}[dia];

			// Extraer horas
			const horaInicio = h.hora_inicio ? parseInt(h.hora_inicio.split(':')[0]) : 0;
			const horaFin = h.hora_fin ? parseInt(h.hora_fin.split(':')[0]) : 0;
			const duracion = horaFin - horaInicio || 1;

			return {
				...h,
				diaIndex,
				horaInicio,
				horaFin,
				duracion,
				nombre: h.nombre_asignatura || h.asignatura || h.nombre || 'Clase',
				docente: h.nombre_docente || h.docente || '',
				aula: h.aula || h.salon || '',
				codigo: h.codigo_asignatura || h.codigo || ''
			};
		});
	};

	const horariosNormalizados = normalizarHorarios();

	// Obtener bloque para celda específica
	const getBloqueEnCelda = (diaIndex, hora) => {
		return horariosNormalizados.find(h =>
			h.diaIndex === diaIndex &&
			h.horaInicio <= hora &&
			h.horaFin > hora
		);
	};

	// Verificar si es el inicio del bloque
	const esInicioBolque = (bloque, hora) => {
		return bloque && bloque.horaInicio === hora;
	};

	// Colores para diferentes asignaturas
	const colores = [
		'bg-blue-100 border-blue-300 text-blue-900',
		'bg-green-100 border-green-300 text-green-900',
		'bg-purple-100 border-purple-300 text-purple-900',
		'bg-yellow-100 border-yellow-300 text-yellow-900',
		'bg-pink-100 border-pink-300 text-pink-900',
		'bg-indigo-100 border-indigo-300 text-indigo-900',
		'bg-red-100 border-red-300 text-red-900',
		'bg-teal-100 border-teal-300 text-teal-900'
	];

	const getColorBloque = (nombre) => {
		const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colores[hash % colores.length];
	};

	const handleBloqueClick = (bloque) => {
		setSelectedBloque(bloque);
		if (onBloqueClick) {
			onBloqueClick(bloque);
		}
	};

	if (horarios.length === 0) {
		return (
			<div className="text-center py-12 bg-gray-50 rounded-lg">
				<Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
				<p className="text-gray-500">No hay horarios disponibles</p>
			</div>
		);
	}

	return (
		<div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
			{/* Grid de horario */}
			<div className="overflow-x-auto">
				<div className="inline-block min-w-full">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-gray-100">
								<th className="border border-gray-300 p-2 text-xs font-semibold text-gray-600 w-16">
									Hora
								</th>
								{dias.map((dia, index) => (
									<th
										key={dia}
										className="border border-gray-300 p-2 text-xs font-semibold text-gray-600 min-w-32"
									>
										{compacto ? diasAbrev[index] : dia}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{horas.map(hora => (
								<tr key={hora} className="hover:bg-gray-50">
									{/* Columna de hora */}
									<td className="border border-gray-300 p-2 text-xs text-center text-gray-600 bg-gray-50">
										{hora}:00
									</td>

									{/* Celdas de cada día */}
									{dias.map((_, diaIndex) => {
										const bloque = getBloqueEnCelda(diaIndex, hora);
										const esInicio = esInicioBolque(bloque, hora);

										if (bloque && !esInicio) {
											// Celda que es parte de un bloque pero no su inicio (se oculta)
											return null;
										}

										if (bloque && esInicio) {
											// Inicio de bloque - muestra la información
											return (
												<td
													key={`${diaIndex}-${hora}`}
													rowSpan={bloque.duracion}
													className={`
														border border-gray-300 p-2 cursor-pointer
														hover:opacity-80 transition-opacity
														${getColorBloque(bloque.nombre)}
														${selectedBloque === bloque ? 'ring-2 ring-blue-500' : ''}
													`}
													onClick={() => handleBloqueClick(bloque)}
												>
													<div className="text-xs">
														<div className="font-bold mb-1 flex items-start gap-1">
															<BookOpen className="w-3 h-3 mt-0.5 flex-shrink-0" />
															<span className="line-clamp-2">{bloque.nombre}</span>
														</div>

														{!compacto && (
															<>
																{bloque.codigo && (
																	<div className="text-gray-600 mb-1">
																		{bloque.codigo}
																	</div>
																)}
																{bloque.docente && (
																	<div className="flex items-center gap-1 text-gray-700 mb-1">
																		<User className="w-3 h-3 flex-shrink-0" />
																		<span className="truncate">{bloque.docente}</span>
																	</div>
																)}
																{bloque.aula && (
																	<div className="flex items-center gap-1 text-gray-700">
																		<MapPin className="w-3 h-3 flex-shrink-0" />
																		<span>{bloque.aula}</span>
																	</div>
																)}
															</>
														)}

														<div className="flex items-center gap-1 text-gray-600 mt-1">
															<Clock className="w-3 h-3" />
															<span>
																{bloque.hora_inicio} - {bloque.hora_fin}
															</span>
														</div>
													</div>
												</td>
											);
										}

										// Celda vacía
										return (
											<td
												key={`${diaIndex}-${hora}`}
												className="border border-gray-300 p-2 bg-white"
											>
												<div className="h-16"></div>
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Leyenda */}
			{!compacto && horariosNormalizados.length > 0 && (
				<div className="p-4 bg-gray-50 border-t border-gray-200">
					<h4 className="text-sm font-semibold text-gray-700 mb-2">Leyenda</h4>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
						{Array.from(new Set(horariosNormalizados.map(h => h.nombre))).map(nombre => (
							<div
								key={nombre}
								className={`flex items-center gap-2 text-xs p-2 rounded ${getColorBloque(nombre)}`}
							>
								<BookOpen className="w-3 h-3 flex-shrink-0" />
								<span className="truncate">{nombre}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default HorarioGrid;
