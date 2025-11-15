import React from 'react';

export default function ChartContainer({ title, children, actions }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-800">{title}</div>
                <div className="flex items-center gap-2">{actions}</div>
            </div>
            <div className="min-h-[220px]">{children}</div>
        </div>
    );
}


