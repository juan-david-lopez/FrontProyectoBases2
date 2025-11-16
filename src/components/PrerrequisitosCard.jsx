import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function PrerrequisitosCard({ cumplidos, puede_inscribir, razon }) {
	if (puede_inscribir === 'SÍ' && cumplidos === 'SÍ') {
		return (
			<div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
				<CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
				<span className="text-sm font-semibold text-green-800">
					Prerrequisitos cumplidos
				</span>
			</div>
		);
	}

	return (
		<div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
			<AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
			<div>
				<span className="text-sm font-semibold text-red-800 block">
					No puede inscribir esta asignatura
				</span>
				{razon && (
					<span className="text-xs text-red-700 mt-1 block">
						{razon}
					</span>
				)}
			</div>
		</div>
	);
}
