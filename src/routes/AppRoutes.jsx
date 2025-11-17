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
import EstudiantesAdminPage from '../pages/admin/EstudiantesAdminPage.jsx';
import SedesPage from '../pages/admin/SedesPage.jsx';
import ReportesPage from '../pages/admin/ReportesPage.jsx';
import ConfiguracionPage from '../pages/admin/ConfiguracionPage.jsx';
import LogsPage from '../pages/admin/LogsPage.jsx';
import GruposPageAdmin from '../pages/admin/GruposPage.jsx';
import CrearGrupoPage from '../pages/admin/CrearGrupoPage.jsx';
import AsignarEstudiantesPage from '../pages/admin/AsignarEstudiantesPage.jsx';
import PeriodosPage from '../pages/admin/PeriodosPage.jsx';

// Docente
import DashboardDocente from '../pages/docente/DashboardDocente.jsx';
import GruposPage from '../pages/docente/GruposPage.jsx';
import GruposDocentePage from '../pages/docente/GruposDocentePage.jsx';
import CalificacionesPage from '../pages/docente/CalificacionesPageV2.jsx';
import CalificacionesGrupoPage from '../pages/docente/CalificacionesGrupoPage.jsx';
import RegistrarNotasPage from '../pages/docente/RegistrarNotasPage.jsx';
import ExamenesPage from '../pages/docente/ExamenesPage.jsx';
import ReportesDocente from '../pages/docente/ReportesDocente.jsx';

// Estudiante
import DashboardEstudiante from '../pages/estudiante/DashboardEstudiante.jsx';
import MatriculaPage from '../pages/estudiante/MatriculaPage.jsx';
import MatriculaMejoradaPage from '../pages/estudiante/MatriculaMejoradaPage.jsx';
import HistorialMatriculaPage from '../pages/estudiante/HistorialMatriculaPage.jsx';
import NotasPage from '../pages/estudiante/NotasPage.jsx';
import NotasMejoradasPage from '../pages/estudiante/NotasMejoradasPage.jsx';
import HorarioPage from '../pages/estudiante/HorarioPage.jsx';
import NotificacionesPage from '../pages/estudiante/NotificacionesPage.jsx';
import RiesgoPage from '../pages/estudiante/RiesgoPage.jsx';
import PerfilPage from '../pages/estudiante/PerfilPage.jsx';

// Coordinador
import DashboardCoordinador from '../pages/coordinador/DashboardCoordinador.jsx';
import AsignaturasCoordinadorPage from '../pages/coordinador/AsignaturasCoordinadorPage.jsx';
import GruposCoordinadorPage from '../pages/coordinador/GruposCoordinadorPage.jsx';
import HorariosCoordinadorPage from '../pages/coordinador/HorariosCoordinadorPage.jsx';
import ReportesCoordinadorPage from '../pages/coordinador/ReportesCoordinadorPage.jsx';

// Registro
import DashboardRegistro from '../pages/registro/DashboardRegistro.jsx';
import MatriculasRegistroPage from '../pages/registro/MatriculasRegistroPage.jsx';
import ReinscripcionesPage from '../pages/registro/ReinscripcionesPage.jsx';
import ExpedientesPage from '../pages/registro/ExpedientesPage.jsx';
import ValidacionesPage from '../pages/registro/ValidacionesPage.jsx';

// Analista
import DashboardAnalista from '../pages/analista/DashboardAnalista.jsx';
import ReportesAnalistaPage from '../pages/analista/ReportesPage.jsx';
import EstadisticasPage from '../pages/analista/EstadisticasPage.jsx';
import TendenciasPage from '../pages/analista/TendenciasPage.jsx';
import ExportarPage from '../pages/analista/ExportarPage.jsx';

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
								{/* Gestión Académica */}
								<Route path="programas" element={<ProgramasPage />} />
								<Route path="asignaturas" element={<AsignaturasPage />} />
								<Route path="periodos" element={<PeriodosPage />} />
								{/* Gestión de Usuarios */}
								<Route path="docentes" element={<DocentesPage />} />
								<Route path="estudiantes" element={<EstudiantesPage />} />
								<Route path="estudiantes-v2" element={<EstudiantesAdminPage />} />
								{/* Grupos */}
								<Route path="grupos" element={<GruposPageAdmin />} />
								<Route path="grupos/crear" element={<CrearGrupoPage />} />
								<Route path="grupos/:grupoId/estudiantes" element={<AsignarEstudiantesPage />} />
								{/* Otras */}
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
								{/* Grupos */}
								<Route path="grupos" element={<GruposPage />} />
								<Route path="grupos-v2" element={<GruposDocentePage />} />
								<Route path="grupos/:codGrupo/calificaciones" element={<CalificacionesGrupoPage />} />
								{/* Calificaciones */}
								<Route path="calificaciones" element={<CalificacionesPage />} />
								<Route path="calificaciones/:grupoId/registrar" element={<RegistrarNotasPage />} />
								{/* Otras páginas */}
								<Route path="examenes" element={<ExamenesPage />} />
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
								{/* Matrícula */}
								<Route path="matricula" element={<MatriculaPage />} />
								<Route path="matricula-v2" element={<MatriculaMejoradaPage />} />
								<Route path="historial-matricula" element={<HistorialMatriculaPage />} />
								{/* Notas */}
								<Route path="notas" element={<NotasPage />} />
								<Route path="notas-v2" element={<NotasMejoradasPage />} />
								{/* Horario y Notificaciones */}
								<Route path="horario" element={<HorarioPage />} />
								<Route path="notificaciones" element={<NotificacionesPage />} />
								{/* Otras páginas */}
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
								<Route path="asignaturas" element={<AsignaturasCoordinadorPage />} />
								<Route path="grupos" element={<GruposCoordinadorPage />} />
								<Route path="horarios" element={<HorariosCoordinadorPage />} />
								<Route path="reportes" element={<ReportesCoordinadorPage />} />
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
								<Route path="matriculas" element={<MatriculasRegistroPage />} />
								<Route path="reinscripciones" element={<ReinscripcionesPage />} />
								<Route path="expedientes" element={<ExpedientesPage />} />
								<Route path="validaciones" element={<ValidacionesPage />} />
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
								<Route path="reportes" element={<ReportesAnalistaPage />} />
								<Route path="estadisticas" element={<EstadisticasPage />} />
								<Route path="tendencias" element={<TendenciasPage />} />
								<Route path="exportar" element={<ExportarPage />} />
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

