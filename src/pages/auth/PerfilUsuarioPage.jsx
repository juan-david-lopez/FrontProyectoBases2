import React from 'react';
import Navbar from '../../components/Navbar.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function PerfilUsuarioPage() {
	const { user } = useAuth();
	return (
		<div>
			<Navbar />
			<main className="mx-auto max-w-4xl p-4">
				<h1 className="mb-4 text-2xl font-semibold">Perfil de usuario</h1>
				<div className="card p-4">
					<pre className="text-sm text-gray-700">{JSON.stringify(user, null, 2)}</pre>
				</div>
			</main>
		</div>
	);
}

