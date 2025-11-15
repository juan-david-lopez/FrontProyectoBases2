import React from 'react';
import EmptyState from '../../components/EmptyState.jsx';

export default function HorarioTable({ items = [] }) {
    if (!items.length) return <EmptyState title="Sin horarios" description="No hay asignaciones de horario." />;
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs text-gray-600">
                    <tr>
                        <th className="px-3 py-2">Asignatura</th>
                        <th className="px-3 py-2">Día</th>
                        <th className="px-3 py-2">Hora</th>
                        <th className="px-3 py-2">Salón</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((r, idx) => (
                        <tr key={idx} className="border-t">
                            <td className="px-3 py-2">{r.nombre}</td>
                            <td className="px-3 py-2">{r.dia}</td>
                            <td className="px-3 py-2">{r.horario}</td>
                            <td className="px-3 py-2">{r.salon}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


