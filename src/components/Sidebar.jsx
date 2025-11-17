import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ items }) {
	const { pathname } = useLocation();
	return (
		<aside className="hidden w-64 border-r border-gray-200 bg-white md:block">
			<nav className="p-3">
				<ul className="space-y-1">
					{items.map((item) => {
						const isActive = pathname === item.to || pathname.startsWith(item.to + '/');
						return (
							<li key={item.to}>
								<Link
									to={item.to}
									className={`flex items-center justify-between rounded px-3 py-2 text-sm transition-colors ${
										isActive 
											? 'bg-blue-50 text-blue-700 font-medium' 
											: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
									}`}
								>
									<span className="flex items-center gap-2">
										{item.icon && <span className="text-lg">{item.icon}</span>}
										{item.label}
									</span>
									{item.badge && (
										<span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
											{item.badge}
										</span>
									)}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
}

