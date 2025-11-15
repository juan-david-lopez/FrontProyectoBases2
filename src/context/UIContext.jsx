import React, { createContext, useMemo, useState } from 'react';

export const UIContext = createContext(null);

export function UIProvider({ children }) {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [toast, setToast] = useState(null);

	const openToast = (message, type = 'info') => setToast({ message, type });
	const closeToast = () => setToast(null);

	const value = useMemo(() => ({ sidebarOpen, setSidebarOpen, toast, openToast, closeToast }), [sidebarOpen, toast]);

	return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

