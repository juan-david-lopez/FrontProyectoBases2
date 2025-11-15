import React from 'react';

export default function CardInfo({ title, value, subtitle }) {
	return (
		<div className="card p-4">
			<div className="text-sm text-gray-500">{title}</div>
			<div className="text-2xl font-bold">{value}</div>
			{subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
		</div>
	);
}

