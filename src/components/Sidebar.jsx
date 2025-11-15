import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ items }) {
	const { pathname } = useLocation();
	return (
		<aside className="hidden w-64 border-r border-gray-200 bg-white md:block">
			<nav className="p-3">
				<ul className="space-y-1">
					{items.map((item) => (
						<li key={item.to}>
							<Link
								to={item.to}
								className={
									`block rounded px-3 py-2 text-sm ${pathname.includes(item.to) ? 'bg-sky-50 text-sky-700' : 'text-gray-700 hover:bg-gray-50'}`
								}
							>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}

