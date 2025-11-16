import React from 'react';
import { Users } from 'lucide-react';

export default function CupoIndicator({ disponible, maximo, porcentaje }) {
	const getColor = () => {
		if (disponible === 0) return 'bg-red-100 text-red-800 border-red-200';
		if (porcentaje >= 90) return 'bg-red-100 text-red-800 border-red-200';
		if (porcentaje >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		return 'bg-green-100 text-green-800 border-green-200';
	};

	return (
		<div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${getColor()}`}>
			<Users className="h-4 w-4" />
			<span>{disponible}/{maximo}</span>
			{disponible === 0 && <span className="ml-1">CERRADO</span>}
		</div>
	);
}
