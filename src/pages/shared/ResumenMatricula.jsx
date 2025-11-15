import React from 'react';

export default function ResumenMatricula({ creditos = 0, asignaturas = [], onConfirm }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-gray-800">Resumen de matrícula</div>
            <ul className="mb-4 list-disc pl-5 text-sm text-gray-700">
                {asignaturas.map((a) => (
                    <li key={a.codigo}>{a.codigo} - {a.nombre} ({a.creditos} créditos)</li>
                ))}
            </ul>
            <div className="mb-4 text-sm">Total créditos: <span className="font-semibold">{creditos}</span></div>
            <button className="btn-primary" onClick={onConfirm}>Confirmar inscripción</button>
        </div>
    );
}


