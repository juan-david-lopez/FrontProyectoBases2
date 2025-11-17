import React from 'react';

export const Loader = ({ label = 'Cargando...' }) => {
    return (
        <div className="flex items-center justify-center gap-2 p-4 text-gray-600">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-sky-600" />
            <span className="text-sm">{label}</span>
        </div>
    );
};

export default Loader;


