# 🎓 Sistema Académico Universidad del Quindío - Frontend

## ✅ Integración con Backend ORDS Completada

Este documento resume la integración completa del frontend React con el backend Oracle REST Data Services (ORDS).

---

## 📦 Archivos Actualizados y Creados

### 1. Configuración Base

#### ✅ `.env`
- URL base del backend: `http://localhost:8080`
- Configurado para conectar con ORDS

#### ✅ `src/services/axiosClient.js`
**Mejoras implementadas:**
- Interceptor de peticiones con token automático
- Interceptor de respuestas con manejo de errores centralizado
- Logout automático en error 401
- Mensajes de error específicos por código HTTP (400, 401, 403, 404, 500)

---

### 2. Servicios de API

#### ✅ `src/services/authService.js`
**Endpoints implementados:**
- `POST /ords/academico/auth/login` - Inicio de sesión
- `GET /ords/academico/usuarios/perfil` - Obtener perfil
- `PUT /ords/academico/usuarios/{username}/actualizar-password` - Cambiar contraseña
- `logout()` - Cierre de sesión local

**Estructura de respuesta documentada:**
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  role: "estudiante" | "docente" | "administrador",
  usuario: {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@universidad.edu",
    cod_estudiante: "202500001"
  }
}
```

---

#### ✅ `src/services/estudiantesService.js`
**Endpoints implementados:**
- `GET /ords/academico/estudiantes/` - Listar estudiantes con paginación
- `GET /ords/academico/estudiantes/{codigo}` - Obtener estudiante por código
- `GET /ords/academico/estudiantes/{codigo}/historial` - Historial académico completo
- `POST /ords/academico/estudiantes/` - Crear nuevo estudiante
- `PUT /ords/academico/estudiantes/{codigo}` - Actualizar estudiante

**Características:**
- Paginación con `limit` y `offset`
- Historial con resumen de créditos, promedio y riesgo
- Creación automática de usuario con credenciales iniciales

---

#### ✅ `src/services/matriculasService.js`
**Endpoints implementados:**
- `GET /ords/academico/asignaturas/disponibles` - Asignaturas disponibles para matrícula
- `POST /ords/academico/matriculas/registrar` - Registrar matrícula
- `POST /ords/academico/matriculas/agregar-asignatura` - Agregar asignatura
- `DELETE /ords/academico/matriculas/retirar-asignatura` - Retirar asignatura
- `GET /ords/academico/matriculas/actual` - Matrícula actual
- `GET /ords/academico/matriculas/historial/{codigo}` - Historial de matrículas

**Validaciones automáticas:**
- ✅ Prerrequisitos cumplidos
- ✅ Límite de créditos según riesgo académico
- ✅ Choques de horario
- ✅ Cupos disponibles
- ✅ Ventanas de calendario académico

---

#### ✅ `src/services/notasService.js`
**Endpoints implementados:**
- `GET /ords/academico/notas/{grupo_id}` - Notas de un grupo
- `POST /ords/academico/notas/registrar` - Registrar/actualizar notas
- `GET /ords/academico/notas/estudiante/{codigo}/grupo/{grupo_id}` - Notas de estudiante
- `GET /ords/academico/notas/estudiante/{codigo}/periodo-actual` - Notas del periodo
- `POST /ords/academico/notas/cerrar-periodo` - Cerrar periodo académico
- `GET /ords/academico/notas/regla-evaluacion/{grupo_id}` - Regla de evaluación

**Características:**
- Validación de notas 0.0 - 5.0
- Cálculo automático de nota definitiva al completar 100%
- Estadísticas por grupo (promedio, max, min, aprobados, reprobados)

---

#### ✅ `src/services/asignaturasService.js`
**Endpoints implementados:**
- `GET /ords/academico/asignaturas/` - Listar asignaturas
- `GET /ords/academico/asignaturas/{codigo}` - Obtener asignatura
- `POST /ords/academico/asignaturas/` - Crear asignatura
- `PUT /ords/academico/asignaturas/{codigo}` - Actualizar asignatura
- `GET /ords/academico/asignaturas/{codigo}/prerrequisitos` - Obtener prerrequisitos
- `POST /ords/academico/asignaturas/prerrequisitos` - Agregar prerrequisito
- `DELETE /ords/academico/asignaturas/{codigo}/prerrequisitos/{prereq}` - Eliminar prerrequisito

---

#### ✅ `src/services/riesgoService.js`
**Endpoints implementados:**
- `GET /ords/academico/riesgo/periodo` - Riesgo por periodo
- `GET /ords/academico/riesgo/estudiante/{codigo}` - Riesgo de estudiante
- `POST /ords/academico/riesgo/recalcular` - Recalcular todos los riesgos
- `GET /ords/academico/riesgo/historial/{codigo}` - Historial de riesgo

**Niveles de riesgo documentados:**
- **Nivel 0**: Sin riesgo (21 créditos máx)
- **Nivel 1**: Promedio < 2.0 (8 créditos máx)
- **Nivel 2**: 2+ asignaturas perdidas (12 créditos máx)
- **Nivel 3**: Misma asignatura perdida 3 veces (8 créditos máx)
- **Nivel 4**: Promedio < 3.0 (16 créditos máx)

---

#### ✅ `src/services/programasService.js`
**Endpoints implementados:**
- `GET /ords/academico/programas/` - Listar programas
- `GET /ords/academico/programas/{codigo}` - Obtener programa
- `POST /ords/academico/programas/` - Crear programa
- `PUT /ords/academico/programas/{codigo}` - Actualizar programa
- `DELETE /ords/academico/programas/{codigo}` - Eliminar programa
- `GET /ords/academico/programas/{codigo}/asignaturas` - Asignaturas del programa
- `GET /ords/academico/programas/{codigo}/plan-estudios` - Plan de estudios completo

---

#### ✅ `src/services/docentesService.js`
**Endpoints implementados:**
- `GET /ords/academico/docentes/` - Listar docentes
- `GET /ords/academico/docentes/{codigo}` - Obtener docente
- `POST /ords/academico/docentes/` - Crear docente
- `PUT /ords/academico/docentes/{codigo}` - Actualizar docente
- `GET /ords/academico/docentes/{codigo}/grupos` - Grupos asignados
- `POST /ords/academico/docentes/asignar-grupo` - Asignar grupo
- `DELETE /ords/academico/docentes/remover-asignacion` - Remover asignación
- `GET /ords/academico/docentes/{codigo}/horario` - Horario del docente

**Validaciones:**
- ✅ Carga docente entre 8-16 horas semanales
- ✅ Sin choques de horario

---

#### ✅ `src/services/reportesService.js`
**18 Reportes implementados:**

1. `fetchMatriculaPeriodo()` - Matrícula y carga por periodo
2. `fetchOcupacionGrupos()` - Ocupación y top grupos
3. `fetchIntentosFallidos()` - Intentos fallidos de matrícula
4. `fetchRendimientoAsignatura()` - Rendimiento por asignatura
5. `fetchDistribucionNotas()` - Distribución de notas
6. `fetchEvolucionPromedio()` - Evolución de promedio
7. `fetchRiesgoAcademico()` - Riesgo académico por periodo
8. `fetchIntentosPorAsignatura()` - Intentos por asignatura
9. `fetchTrayectoriaCohorte()` - Trayectoria por cohorte
10. `fetchMapaPrerrequisitos()` - Mapa de prerrequisitos
11. `fetchImpactoPrerrequisitos()` - Impacto de prerrequisitos
12. `fetchReglasIncompletas()` - Reglas de evaluación incompletas
13. `fetchReprobacionPorItem()` - Reprobación por ítem
14. `fetchAvanceCreditos()` - Avance en créditos vs plan
15. `fetchOpinionEstudiantil()` - Opinión estudiantil (NoSQL)
16. `fetchCruceOpinionDesempeno()` - Cruce opiniones y desempeño
17. `fetchAsignaturasCuelloBotella()` - Asignaturas "cuello de botella"
18. `fetchCalidadDatos()` - Calidad de datos

**Funciones de exportación:**
- `exportarReportePDF()` - Exportar a PDF
- `exportarReporteExcel()` - Exportar a Excel

---

### 3. Contexto y Autenticación

#### ✅ `src/context/AuthContext.jsx`
**Mejoras implementadas:**
- Normalización de roles a minúsculas (`estudiante`, `docente`, `administrador`)
- Función `hasRole(role)` - Verificar rol específico
- Función `hasAnyRole([roles])` - Verificar múltiples roles
- Logout automático en error 401
- Refresh automático del perfil

**Estructura del usuario:**
```javascript
{
  id: 1,
  nombre: "Juan Pérez",
  email: "juan.perez@universidad.edu",
  cod_estudiante: "202500001",
  role: "estudiante",  // normalizado a minúsculas
  rol: "estudiante"    // compatibilidad
}
```

---

### 4. Rutas y Guards

#### ✅ `src/routes/RoleGuard.jsx`
**Mejoras implementadas:**
- Validación estricta de roles
- Normalización a minúsculas
- Redirección automática al dashboard del rol
- Soporte para múltiples roles permitidos

#### ✅ `src/routes/AppRoutes.jsx`
**Roles corregidos:**
- `/administrador/*` (antes `/admin/*`)
- `/docente/*`
- `/estudiante/*`

**Guards aplicados correctamente:**
```jsx
<RoleGuard roles={["administrador"]}>...</RoleGuard>
<RoleGuard roles={["docente"]}>...</RoleGuard>
<RoleGuard roles={["estudiante"]}>...</RoleGuard>
```

---

### 5. Utilidades

#### ✅ `src/utils/formatters.js` (NUEVO)
**30+ funciones de formateo:**

**Fechas:**
- `formatDate()` - Fecha legible en español
- `formatDateShort()` - Formato dd/mm/yyyy
- `formatPeriodo()` - "2025 - Primer Semestre"
- `formatHora()` - "8:00 AM"

**Notas:**
- `formatNota()` - Formato con decimales
- `getNotaColor()` - Color según nota
- `getEstadoNota()` - APROBADO/REPROBADO/PENDIENTE
- `isNotaValida()` - Validar rango 0.0-5.0
- `calcularPromedio()` - Promedio de array

**Riesgo Académico:**
- `formatRiesgo()` - Descripción del nivel
- `getRiesgoColor()` - Color según nivel
- `getCreditosMaximos()` - Límite por nivel

**Datos Personales:**
- `formatNombreCompleto()` - Nombre completo formateado
- `formatDocumento()` - Con separadores de miles
- `formatTelefono()` - Formato colombiano
- `formatCodigoEstudiante()` - Con guión separador

**Académico:**
- `formatCreditos()` - Con pluralización
- `calcularAvance()` - Porcentaje de avance
- `formatEstadoEstudiante()` - {label, color}

**Generales:**
- `formatNumber()` - Separadores de miles
- `formatPorcentaje()` - Con símbolo %
- `truncateText()` - Truncar con "..."
- `getBadgeColor()` - Colores de badges

---

### 6. Páginas Actualizadas

#### ✅ `src/pages/auth/LoginPage.jsx`
**Mejoras implementadas:**
- Diseño mejorado con gradiente
- Información de credenciales iniciales
- Botón mostrar/ocultar contraseña
- Validaciones de formulario
- Mensajes de error específicos por código HTTP
- UX mejorada con estados de carga

**Credenciales por defecto documentadas:**
```
Usuario: correo@universidad.edu
Contraseña: número_documento
```

---

## 🎯 Roles del Sistema

### Roles Normalizados (minúsculas)

| Rol | Descripción | Ruta |
|-----|-------------|------|
| `estudiante` | Estudiantes del sistema | `/estudiante/*` |
| `docente` | Profesores y catedráticos | `/docente/*` |
| `administrador` | Personal administrativo | `/administrador/*` |

---

## 🔐 Sistema de Autenticación

### Flujo de Login

1. Usuario ingresa correo institucional y contraseña
2. Frontend envía `POST /ords/academico/auth/login`
3. Backend valida credenciales (hash SHA-256)
4. Devuelve token JWT y datos del usuario
5. Frontend guarda token en `localStorage`
6. Redirige al dashboard según rol

### Token Management

- Token guardado en `localStorage.token`
- Se envía automáticamente en header `Authorization: Bearer {token}`
- Renovación automática al refrescar perfil
- Logout automático en error 401

### Credenciales Iniciales

**Estudiantes nuevos:**
- **Username**: Correo institucional
- **Password**: Número de documento (sin tipo, solo números)

**Ejemplo:**
```
Estudiante: María González
Documento: CC 9876543210
Correo: maria.gonzalez@universidad.edu

Credenciales:
- Username: maria.gonzalez@universidad.edu
- Password: 9876543210
```

---

## 📡 Estructura de Respuestas

### Respuesta Exitosa (200/201)
```json
{
  "mensaje": "Operación exitosa",
  "data": {...}
}
```

### Respuesta con Datos Paginados
```json
{
  "items": [...],
  "hasMore": false,
  "limit": 25,
  "offset": 0,
  "count": 150
}
```

### Respuesta de Error (400/401/403/404/500)
```json
{
  "error": "Descripción del error",
  "detalle": "Información adicional (opcional)"
}
```

---

## 🛠️ Manejo de Errores

### Códigos HTTP Manejados

| Código | Significado | Acción |
|--------|-------------|--------|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Error de validación - mostrar mensaje |
| 401 | Unauthorized | Token inválido - logout automático |
| 403 | Forbidden | Sin permisos - mostrar mensaje |
| 404 | Not Found | Recurso no encontrado |
| 500 | Server Error | Error del servidor - reintentar |

### Interceptor de Errores

El `axiosClient` maneja automáticamente:
- ✅ Logout en 401
- ✅ Mensajes específicos por código
- ✅ Redirección a login cuando necesario
- ✅ Log de errores en consola

---

## 🎨 Colores del Sistema

### Riesgo Académico
```css
Nivel 0 (Sin riesgo): bg-green-100 text-green-800
Nivel 1 (Alto): bg-red-900 text-white
Nivel 2 (Medio): bg-orange-100 text-orange-800
Nivel 3 (Crítico): bg-red-600 text-white
Nivel 4 (Moderado): bg-yellow-100 text-yellow-800
```

### Notas
```css
>= 4.5: text-green-600 (Excelente)
>= 3.5: text-blue-600 (Bueno)
>= 3.0: text-yellow-600 (Aprobado)
< 3.0: text-red-600 (Reprobado)
```

### Estados
```css
ACTIVO: bg-green-100 text-green-800
INACTIVO: bg-gray-100 text-gray-800
RETIRADO: bg-red-100 text-red-800
GRADUADO: bg-blue-100 text-blue-800
```

---

## 🚀 Próximos Pasos

### Páginas Pendientes de Actualizar

1. **Estudiante:**
   - ✅ LoginPage
   - ⏳ DashboardEstudiante
   - ⏳ MatriculaPage
   - ⏳ NotasPage
   - ⏳ RiesgoPage
   - ⏳ PerfilPage

2. **Docente:**
   - ⏳ DashboardDocente
   - ⏳ GruposPage
   - ⏳ CalificacionesPage
   - ⏳ ReportesDocente

3. **Administrador:**
   - ⏳ DashboardAdmin
   - ⏳ EstudiantesPage
   - ⏳ DocentesPage
   - ⏳ ProgramasPage
   - ⏳ AsignaturasPage
   - ⏳ ReportesPage
   - ⏳ ConfiguracionPage

### Componentes Reutilizables Sugeridos

- `<NotasBadge />` - Badge de notas con colores
- `<RiesgoBadge />` - Badge de riesgo con colores
- `<HorarioGrid />` - Grid visual de horarios
- `<EstadisticasCard />` - Tarjeta de estadísticas
- `<ProgressBar />` - Barra de progreso (créditos, avance)
- `<DataTable />` - Tabla con paginación y filtros

---

## 📝 Validaciones Implementadas

### Frontend (antes de enviar)
- ✅ Correo electrónico válido
- ✅ Campos requeridos
- ✅ Notas en rango 0.0-5.0
- ✅ Formato de fechas

### Backend (automáticas)
- ✅ Prerrequisitos cumplidos
- ✅ Límite de créditos por riesgo
- ✅ Choques de horario
- ✅ Cupos disponibles
- ✅ Ventanas de calendario
- ✅ Carga docente 8-16 horas
- ✅ Reglas de evaluación suman 100%
- ✅ Restricciones de cancelación

---

## 🔧 Configuración para Desarrollo

### Variables de Entorno
```bash
VITE_API_BASE_URL=http://localhost:8080
```

### Iniciar el Proyecto
```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

### Verificar Conexión con Backend
```bash
# Probar endpoint de login
curl -X POST http://localhost:8080/ords/academico/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@universidad.edu","password":"1234567890"}'
```

---

## ✅ Checklist de Integración

- [x] Configuración de `.env`
- [x] axiosClient con interceptores
- [x] Servicios de autenticación
- [x] Servicios de estudiantes
- [x] Servicios de matrículas
- [x] Servicios de notas
- [x] Servicios de asignaturas
- [x] Servicios de riesgo
- [x] Servicios de programas
- [x] Servicios de docentes
- [x] Servicios de reportes (18 tipos)
- [x] Utilidades de formateo
- [x] AuthContext actualizado
- [x] RoleGuard actualizado
- [x] AppRoutes actualizado
- [x] LoginPage mejorado
- [ ] Actualizar dashboards
- [ ] Actualizar páginas de matrícula
- [ ] Actualizar páginas de calificaciones
- [ ] Crear componentes reutilizables
- [ ] Testing de integración
- [ ] Documentación de componentes

---

## 📞 Soporte

Para más información:
- **Backend ORDS**: `http://localhost:8080/ords/academico/`
- **Documentación API**: Ver contexto del proyecto compartido
- **Repositorio**: ProyectoFinalBases/Frontend

---

**Fecha de actualización**: Noviembre 1, 2025
**Versión**: 1.0.0
