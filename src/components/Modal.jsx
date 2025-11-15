import React from 'react';

export default function Modal({ open, title, children, onClose, actions }) {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-xl">
				<div className="mb-3 flex items-center justify-between">
					<h3 className="text-lg font-semibold">{title}</h3>
					<button onClick={onClose} className="rounded p-2 hover:bg-gray-100">✕</button>
				</div>
				<div className="mb-4">{children}</div>
				<div className="flex justify-end gap-2">{actions}</div>
			</div>
		</div>
	);
}

