import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

/**
 * Componente reutilizable para mostrar tabla de calificaciones con detalles
 * 
 * @param {Object} props
 * @param {Array} props.calificaciones - Array de calificaciones
 * @param {boolean} props.expandible - Permitir expandir/colapsar filas
 * @param {boolean} props.mostrarEstadisticas - Mostrar estadísticas al final
 * @param {Function} props.onEditarNota - Callback para editar nota (vista docente)
 * @param {boolean} props.editable - Permitir edición (vista docente)
 * @param {string} props.className - Clases CSS adicionales
 */
export const TablaCalificaciones = ({
	calificaciones = [],
	expandible = true,
	mostrarEstadisticas = true,
	onEditarNota,
	editable = false,
	className = ''
}) => {
	const [filaExpandida, setFilaExpandida] = useState(null);

	// Calcular estadísticas
	const calcularEstadisticas = () => {
		if (calificaciones.length === 0) return null;

		const notasValidas = calificaciones.filter(c => c.nota_final !== null && c.nota_final !== undefined);
		const suma = notasValidas.reduce((acc, c) => acc + parseFloat(c.nota_final), 0);
		const promedio = suma / notasValidas.length;
		const aprobadas = notasValidas.filter(c => c.nota_final >= 3.0).length;
		const reprobadas = notasValidas.filter(c => c.nota_final < 3.0).length;

		return {
			total: calificaciones.length,
			promedio: promedio.toFixed(2),
			aprobadas,
			reprobadas,
			tasa_aprobacion: ((aprobadas / notasValidas.length) * 100).toFixed(1)
		};
	};

	const estadisticas = calcularEstadisticas();

	// Obtener color según nota
	const getNotaColor = (nota) => {
		if (nota === null || nota === undefined) return 'text-gray-400';
		if (nota >= 4.0) return 'text-green-600 font-bold';
		if (nota >= 3.0) return 'text-blue-600 font-semibold';
		if (nota >= 2.0) return 'text-yellow-600 font-semibold';
		return 'text-red-600 font-bold';
	};

	// Obtener ícono según nota
	const getNotaIcon = (nota) => {
		if (nota === null || nota === undefined) return <AlertCircle className="w-5 h-5 text-gray-400" />;
		if (nota >= 3.0) return <CheckCircle className="w-5 h-5 text-green-600" />;
		if (nota >= 2.0) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
		return <XCircle className="w-5 h-5 text-red-600" />;
	};

	// Obtener color de fondo según nota
	const getNotaBgColor = (nota) => {
		if (nota === null || nota === undefined) return 'bg-gray-50';
		if (nota >= 4.0) return 'bg-green-50';
		if (nota >= 3.0) return 'bg-blue-50';
		if (nota >= 2.0) return 'bg-yellow-50';
		return 'bg-red-50';
	};

	const toggleFila = (index) => {
		if (!expandible) return;
		setFilaExpandida(filaExpandida === index ? null : index);
	};

	const handleEditar = (calificacion) => {
		if (onEditarNota && editable) {
			onEditarNota(calificacion);
		}
	};

	if (calificaciones.length === 0) {
		return (
			<div className="text-center py-12 bg-gray-50 rounded-lg">
				<p className="text-gray-500">No hay calificaciones registradas</p>
			</div>
		);
	}

	return (
		<div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							{expandible && (
								<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
									{/* Columna para expandir */}
								</th>
							)}
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Asignatura
							</th>
							<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								Parcial 1
							</th>
							<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								Parcial 2
							</th>
							<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								Parcial 3
							</th>
							<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								Nota Final
							</th>
							<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								Estado
							</th>
							{editable && (
								<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
									Acciones
								</th>
							)}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{calificaciones.map((calificacion, index) => {
							const {
								nombre_asignatura,
								codigo_asignatura,
								parcial1,
								parcial2,
								parcial3,
								nota_final,
								creditos,
								nombre_estudiante,
								codigo_estudiante
							} = calificacion;

							const esExpandida = filaExpandida === index;

							return (
								<>
									{/* Fila principal */}
									<tr
										key={index}
										className={`
											hover:bg-gray-50 transition-colors
											${getNotaBgColor(nota_final)}
										`}
									>
										{/* Botón expandir */}
										{expandible && (
											<td className="px-3 py-4 whitespace-nowrap">
												<button
													onClick={() => toggleFila(index)}
													className="text-gray-400 hover:text-gray-600 transition-colors"
												>
													{esExpandida ? (
														<ChevronDown className="w-5 h-5" />
													) : (
														<ChevronRight className="w-5 h-5" />
													)}
												</button>
											</td>
										)}

										{/* Asignatura */}
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-900">
												{nombre_asignatura}
											</div>
											{codigo_asignatura && (
												<div className="text-xs text-gray-500">
													{codigo_asignatura}
												</div>
											)}
											{nombre_estudiante && (
												<div className="text-xs text-gray-600 mt-1">
													{nombre_estudiante}
												</div>
											)}
										</td>

										{/* Parciales */}
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<span className={`text-sm ${getNotaColor(parcial1)}`}>
												{parcial1 !== null && parcial1 !== undefined ? parcial1.toFixed(1) : '—'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<span className={`text-sm ${getNotaColor(parcial2)}`}>
												{parcial2 !== null && parcial2 !== undefined ? parcial2.toFixed(1) : '—'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<span className={`text-sm ${getNotaColor(parcial3)}`}>
												{parcial3 !== null && parcial3 !== undefined ? parcial3.toFixed(1) : '—'}
											</span>
										</td>

										{/* Nota Final */}
										<td className="px-6 py-4 whitespace-nowrap text-center">
											<div className="flex items-center justify-center gap-2">
												{getNotaIcon(nota_final)}
												<span className={`text-lg ${getNotaColor(nota_final)}`}>
													{nota_final !== null && nota_final !== undefined ? nota_final.toFixed(1) : '—'}
												</span>
											</div>
										</td>

										{/* Estado */}
										<td className="px-6 py-4 whitespace-nowrap text-center">
											{nota_final !== null && nota_final !== undefined ? (
												<span className={`
													px-2 py-1 text-xs font-semibold rounded-full
													${nota_final >= 3.0
														? 'bg-green-100 text-green-800'
														: 'bg-red-100 text-red-800'
													}
												`}>
													{nota_final >= 3.0 ? 'Aprobada' : 'Reprobada'}
												</span>
											) : (
												<span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
													Pendiente
												</span>
											)}
										</td>

										{/* Acciones */}
										{editable && (
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<button
													onClick={() => handleEditar(calificacion)}
													className="text-blue-600 hover:text-blue-800 text-sm font-medium"
												>
													Editar
												</button>
											</td>
										)}
									</tr>

									{/* Fila expandida con detalles */}
									{esExpandida && expandible && (
										<tr className="bg-gray-50">
											<td colSpan={editable ? 8 : 7} className="px-6 py-4">
												<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
													{creditos && (
														<div>
															<span className="text-gray-500">Créditos:</span>
															<span className="ml-2 font-medium">{creditos}</span>
														</div>
													)}
													{codigo_estudiante && (
														<div>
															<span className="text-gray-500">Código:</span>
															<span className="ml-2 font-medium">{codigo_estudiante}</span>
														</div>
													)}
													<div>
														<span className="text-gray-500">Promedio Parciales:</span>
														<span className="ml-2 font-medium">
															{(((parcial1 || 0) + (parcial2 || 0) + (parcial3 || 0)) / 3).toFixed(1)}
														</span>
													</div>
													{calificacion.observaciones && (
														<div className="col-span-full">
															<span className="text-gray-500">Observaciones:</span>
															<p className="mt-1 text-gray-700">{calificacion.observaciones}</p>
														</div>
													)}
												</div>
											</td>
										</tr>
									)}
								</>
							);
						})}
					</tbody>

					{/* Estadísticas */}
					{mostrarEstadisticas && estadisticas && (
						<tfoot className="bg-gray-100 border-t-2 border-gray-300">
							<tr>
								<td
									colSpan={expandible ? 6 : 5}
									className="px-6 py-4 text-sm font-semibold text-gray-700"
								>
									Resumen
								</td>
								<td className="px-6 py-4 text-center" colSpan={editable ? 2 : 1}>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
										<div>
											<div className="text-gray-500 text-xs">Total</div>
											<div className="font-bold text-gray-900">{estadisticas.total}</div>
										</div>
										<div>
											<div className="text-gray-500 text-xs">Promedio</div>
											<div className="font-bold text-blue-600">{estadisticas.promedio}</div>
										</div>
										<div>
											<div className="text-gray-500 text-xs">Aprobadas</div>
											<div className="font-bold text-green-600">{estadisticas.aprobadas}</div>
										</div>
										<div>
											<div className="text-gray-500 text-xs">Tasa Aprobación</div>
											<div className="font-bold text-green-600">{estadisticas.tasa_aprobacion}%</div>
										</div>
									</div>
								</td>
							</tr>
						</tfoot>
					)}
				</table>
			</div>
		</div>
	);
};

export default TablaCalificaciones;
