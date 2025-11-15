import React from 'react';
import { useAuth } from '../hooks/useAuth.js';

export default function Navbar() {
	const { user, logout } = useAuth();
	return (
		<header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
			<div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<div className="h-6 w-6 rounded bg-sky-600" />
					<span className="font-semibold">Académico</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-sm text-gray-600">{user?.nombre}</span>
					<button className="btn-primary" onClick={logout}>Salir</button>
				</div>
			</div>
		</header>
	);
}

