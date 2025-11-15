import React from 'react';

export default function Table({ columns, data, empty = 'Sin datos' }) {
	return (
		<div className="overflow-hidden rounded-lg border border-gray-200">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						{columns.map((col) => (
							<th key={col.key} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100 bg-white">
					{data.length === 0 ? (
						<tr>
							<td colSpan={columns.length} className="px-3 py-6 text-center text-sm text-gray-500">{empty}</td>
						</tr>
					) : (
						data.map((row, idx) => (
							<tr key={idx} className="hover:bg-gray-50">
								{columns.map((col) => (
									<td key={col.key} className="px-3 py-2 text-sm text-gray-700">{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

