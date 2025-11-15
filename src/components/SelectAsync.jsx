import React, { useEffect, useMemo, useState } from 'react';

export default function SelectAsync({
    label,
    value,
    onChange,
    loadOptions,
    placeholder = 'Seleccione...',
    disabled = false,
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        Promise.resolve(loadOptions?.() ?? [])
            .then((res) => {
                if (mounted) setOptions(res);
            })
            .finally(() => setLoading(false));
        return () => {
            mounted = false;
        };
    }, [loadOptions]);

    const rendered = useMemo(() => options ?? [], [options]);

    return (
        <label className="block text-sm w-full">
            <span className="mb-1 block font-medium text-gray-700">{label}</span>
            <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                value={value ?? ''}
                disabled={disabled || loading}
                onChange={(e) => onChange?.(e.target.value)}
            >
                <option value="" disabled>
                    {loading ? 'Cargando...' : placeholder}
                </option>
                {rendered.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}


