import React from 'react';

export default function FormInput({ label, error, children, ...props }) {
	return (
		<label className="block text-sm">
			<span className="mb-1 block text-gray-700">{label}</span>
			<input {...props} className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-sky-200'}`} />
			{children}
			{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
		</label>
	);
}

