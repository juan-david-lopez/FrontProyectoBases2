import React from 'react';

export const EmptyState = ({ title = 'Sin datos', description = 'No hay información para mostrar.' }) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
            <div className="mb-2 text-sm font-medium">{title}</div>
            <div className="text-xs">{description}</div>
        </div>
    );
};

export default EmptyState;


