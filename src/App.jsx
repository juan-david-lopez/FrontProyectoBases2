import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { UIProvider } from './context/UIContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
// import BackendHealthCheck from './components/BackendHealthCheck.jsx';

export default function App() {
    return (
        <AuthProvider>
            <UIProvider>
                {/* BackendHealthCheck deshabilitado temporalmente debido a errores de CORS en OPTIONS */}
                {/* <BackendHealthCheck /> */}
                <AppRoutes />
            </UIProvider>
        </AuthProvider>
    );
}
