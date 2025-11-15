import React from 'react';

function Node({ code, name, childrenNodes = [] }) {
    return (
        <div className="rounded-md border border-gray-200 p-2">
            <div className="text-xs font-semibold">{code}</div>
            <div className="text-xs text-gray-600">{name}</div>
            {childrenNodes.length > 0 && (
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {childrenNodes.map((child) => (
                        <Node key={child.code} {...child} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function PrerrequisitosTree({ tree = [] }) {
    if (!tree?.length) return <div className="text-sm text-gray-500">Sin prerrequisitos</div>;
    return (
        <div className="grid gap-2 md:grid-cols-2">
            {tree.map((n) => (
                <Node key={n.code} {...n} />
            ))}
        </div>
    );
}


