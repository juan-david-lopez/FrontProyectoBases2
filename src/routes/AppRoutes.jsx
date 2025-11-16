import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';
import RoleGuard from './RoleGuard.jsx';

// Auth
import LoginPage from '../pages/auth/LoginPage.jsx';
import RecoverPasswordPage from '../pages/auth/RecoverPasswordPage.jsx';
import PerfilUsuarioPage from '../pages/auth/PerfilUsuarioPage.jsx';

// Admin
import DashboardAdmin from '../pages/admin/DashboardAdmin.jsx';
import ProgramasPage from '../pages/admin/ProgramasPage.jsx';
import AsignaturasPage from '../pages/admin/AsignaturasPage.jsx';
import DocentesPage from '../pages/admin/DocentesPage.jsx';
import EstudiantesPage from '../pages/admin/EstudiantesPage.jsx';
import SedesPage from '../pages/admin/SedesPage.jsx';
import ReportesPage from '../pages/admin/ReportesPage.jsx';
import ConfiguracionPage from '../pages/admin/ConfiguracionPage.jsx';
import LogsPage from '../pages/admin/LogsPage.jsx';

// Docente
import DashboardDocente from '../pages/docente/DashboardDocente.jsx';
import GruposPage from '../pages/docente/GruposPage.jsx';
import CalificacionesPage from '../pages/docente/CalificacionesPage.jsx';
import ExamenesPage from '../pages/docente/ExamenesPage.jsx';
import ReportesDocente from '../pages/docente/ReportesDocente.jsx';

// Estudiante
import DashboardEstudiante from '../pages/estudiante/DashboardEstudiante.jsx';
import MatriculaPage from '../pages/estudiante/MatriculaPage.jsx';
import HistorialMatriculaPage from '../pages/estudiante/HistorialMatriculaPage.jsx';
import NotasPage from '../pages/estudiante/NotasPage.jsx';
import RiesgoPage from '../pages/estudiante/RiesgoPage.jsx';
import PerfilPage from '../pages/estudiante/PerfilPage.jsx';

// Coordinador
import DashboardCoordinador from '../pages/coordinador/DashboardCoordinador.jsx';

// Registro
import DashboardRegistro from '../pages/registro/DashboardRegistro.jsx';

// Analista
import DashboardAnalista from '../pages/analista/DashboardAnalista.jsx';

// Shared
import ReporteDetallePage from '../pages/shared/ReporteDetallePage.jsx';

export default function AppRoutes() {
	return (
		<Routes>
			{/* Public */}
			<Route path="/login" element={<LoginPage />} />
			<Route path="/recuperar-password" element={<RecoverPasswordPage />} />

			{/* Private - Administrador */}
			<Route
				path="/administrador/*"
				element={
					<PrivateRoute>
						<RoleGuard roles={["administrador"]}>
							<Routes>
								<Route path="dashboard" element={<DashboardAdmin />} />
								<Route path="programas" element={<ProgramasPage />} />
								<Route path="asignaturas" element={<AsignaturasPage />} />
								<Route path="docentes" element={<DocentesPage />} />
								<Route path="estudiantes" element={<EstudiantesPage />} />
								<Route path="sedes" element={<SedesPage />} />
								<Route path="reportes" element={<ReportesPage />} />
								<Route path="configuracion" element={<ConfiguracionPage />} />
								<Route path="logs" element={<LogsPage />} />
								<Route path="*" element={<Navigate to="dashboard" replace />} />
							</Routes>
						</RoleGuard>
					</PrivateRoute>
				}
			/>

			{/* Private - Docente */}
			<Route
				path="/docente/*"
				element={
					<PrivateRoute>
						<RoleGuard roles={["docente"]}>
							<Routes>
								<Route path="dashboard" element={<DashboardDocente />} />
								<Route path="grupos" element={<GruposPage />} />
								<Route path="examenes" element={<ExamenesPage />} />
								<Route path="calificaciones" element={<CalificacionesPage />} />
								<Route path="reportes" element={<ReportesDocente />} />
								<Route path="*" element={<Navigate to="dashboard" replace />} />
							</Routes>
						</RoleGuard>
					</PrivateRoute>
				}
			/>

			{/* Private - Estudiante */}
			<Route
				path="/estudiante/*"
				element={
					<PrivateRoute>
						<RoleGuard roles={["estudiante"]}>
							<Routes>
								<Route path="dashboard" element={<DashboardEstudiante />} />
								<Route path="matricula" element={<MatriculaPage />} />
								<Route path="historial-matricula" element={<HistorialMatriculaPage />} />
								<Route path="notas" element={<NotasPage />} />
								<Route path="riesgo" element={<RiesgoPage />} />
								<Route path="perfil" element={<PerfilPage />} />
								<Route path="*" element={<Navigate to="dashboard" replace />} />
							</Routes>
						</RoleGuard>
					</PrivateRoute>
				}
			/>

			{/* Private - Coordinador Académico */}
			<Route
				path="/coordinador/*"
				element={
					<PrivateRoute>
						<RoleGuard roles={["coordinador"]}>
							<Routes>
								<Route path="dashboard" element={<DashboardCoordinador />} />
								<Route path="*" element={<Navigate to="dashboard" replace />} />
							</Routes>
						</RoleGuard>
					</PrivateRoute>
				}
			/>

			{/* Private - Registro Académico */}
			<Route
				path="/registro/*"
				element={
					<PrivateRoute>
						<RoleGuard roles={["registro"]}>
							<Routes>
								<Route path="dashboard" element={<DashboardRegistro />} />
								<Route path="*" element={<Navigate to="dashboard" replace />} />
							</Routes>
						</RoleGuard>
					</PrivateRoute>
				}
			/>

			{/* Private - Analista */}
			<Route
				path="/analista/*"
				element={
					<PrivateRoute>
						<RoleGuard roles={["analista"]}>
							<Routes>
								<Route path="dashboard" element={<DashboardAnalista />} />
								<Route path="*" element={<Navigate to="dashboard" replace />} />
							</Routes>
						</RoleGuard>
					</PrivateRoute>
				}
			/>

			{/* Shared */}
			<Route
				path="/reportes/detalle"
				element={
					<PrivateRoute>
						<ReporteDetallePage />
					</PrivateRoute>
				}
			/>

			{/* Root */}
			<Route path="/" element={<Navigate to="/login" replace />} />
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}

