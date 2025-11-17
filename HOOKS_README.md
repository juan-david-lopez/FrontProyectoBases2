# 🎯 Hooks Personalizados - Sistema Académico

Documentación completa de todos los hooks personalizados implementados para el sistema académico.

---

## 📋 Índice de Hooks

1. [usePeriodos](#-useperiodos) - Gestión de períodos académicos
2. [useEstudiantes](#-useestudiantes) - Gestión de estudiantes
3. [useMatriculas](#-usematriculas) - Proceso de matrícula
4. [useCalificaciones](#-usecalificaciones) - Gestión de notas
5. [useDocente](#-usedocente) - Vista docente de grupos
6. [useAlertas](#-usealertas) - Sistema de alertas
7. [useReportes](#-usereportes) - Generación de reportes
8. [useProgramas](#-useprogramas) - Programas académicos

---

## 🎓 usePeriodos

**Ubicación:** `src/hooks/usePeriodos.js`

### Propósito
Gestiona períodos académicos, incluyendo CRUD completo, activación/cierre de períodos y estadísticas.

### Uso Básico
```javascript
import { usePeriodos } from '../hooks/usePeriodos';

function PeriodosPage() {
  const {
    periodos,
    periodoActivo,
    loading,
    error,
    cargarPeriodos,
    crear,
    activar,
    cerrar
  } = usePeriodos();

  // Los períodos se cargan automáticamente
}
```

### Props
```javascript
usePeriodos(options)
```
- `options.autoLoad` (boolean, default: true) - Cargar datos automáticamente

### Estado Retornado
```javascript
{
  periodos: [],              // Lista de períodos
  periodoActivo: null,       // Período actualmente activo
  estadisticas: null,        // Estadísticas del período seleccionado
  loading: false,            // Estado de carga
  error: null,               // Mensaje de error
  periodoSeleccionado: null  // Período seleccionado en detalle
}
```

### Funciones Disponibles

#### Carga de Datos
- `cargarPeriodos()` - Carga todos los períodos
- `cargarPeriodoActivo()` - Obtiene el período activo
- `cargarPeriodo(codigo)` - Carga un período específico
- `cargarEstadisticas(codigo)` - Obtiene estadísticas de un período

#### CRUD
- `crear(periodoData)` - Crea nuevo período
- `actualizar(codigo, periodoData)` - Actualiza período
- `eliminar(codigo)` - Elimina período
- `activar(codigo)` - Activa un período
- `cerrar(codigo)` - Cierra un período

#### Auxiliares
- `refrescar()` - Recarga todos los datos
- `setError(mensaje)` - Establece mensaje de error

---

## 👨‍🎓 useEstudiantes

**Ubicación:** `src/hooks/useEstudiantes.js`

### Propósito
Gestiona estudiantes con paginación, búsqueda, filtros y acceso a historial académico.

### Uso Básico
```javascript
import { useEstudiantes } from '../hooks/useEstudiantes';

function EstudiantesPage() {
  const {
    estudiantes,
    loading,
    pagination,
    cargarEstudiantes,
    buscar,
    paginaSiguiente
  } = useEstudiantes({ autoLoad: true, limit: 25 });
}
```

### Props
```javascript
useEstudiantes(options)
```
- `options.autoLoad` (boolean, default: true) - Cargar automáticamente
- `options.limit` (number, default: 25) - Resultados por página

### Estado Retornado
```javascript
{
  estudiantes: [],
  estudianteSeleccionado: null,
  historial: null,
  loading: false,
  error: null,
  pagination: {
    offset: 0,
    limit: 25,
    hasMore: false,
    count: 0
  }
}
```

### Funciones Principales

#### Carga
- `cargarEstudiantes(params)` - Carga lista con parámetros
- `cargarEstudiante(codigo)` - Carga estudiante específico
- `cargarHistorial(codigo)` - Obtiene historial académico

#### CRUD
- `crear(estudianteData)` - Crea estudiante
- `actualizar(codigo, estudianteData)` - Actualiza estudiante
- `eliminar(codigo)` - Elimina estudiante

#### Búsqueda/Filtros
- `buscar(criterio)` - Búsqueda por texto
- `filtrarPorPrograma(codPrograma)` - Filtra por programa
- `filtrarPorEstado(estado)` - Filtra por estado

#### Paginación
- `paginaSiguiente()` - Siguiente página
- `paginaAnterior()` - Página anterior
- `reiniciarPaginacion()` - Vuelve a página 1

---

## 📝 useMatriculas

**Ubicación:** `src/hooks/useMatriculas.js`

### Propósito
Maneja el proceso completo de matrícula: registro, agregar/retirar asignaturas, consulta de horarios.

### Uso Básico
```javascript
import { useMatriculas } from '../hooks/useMatriculas';

function MatriculaPage() {
  const {
    matriculaActual,
    asignaturasDisponibles,
    agregar,
    retirar,
    cargarHorario
  } = useMatriculas('123456'); // código estudiante
}
```

### Props
```javascript
useMatriculas(codigoEstudiante)
```
- `codigoEstudiante` (string) - Código del estudiante

### Estado Retornado
```javascript
{
  matriculaActual: null,
  historial: [],
  asignaturasDisponibles: [],
  gruposDisponibles: [],
  horario: null,
  resumen: null,
  loading: false,
  error: null
}
```

### Funciones Principales

#### Matrícula
- `registrar(codPeriodo)` - Registra matrícula nueva
- `agregar(codGrupo)` - Agrega asignatura a matrícula
- `retirar(codDetalleMatricula)` - Retira asignatura

#### Consulta
- `cargarMatriculaActual()` - Carga matrícula del período activo
- `cargarHistorial()` - Historial de matrículas
- `cargarAsignaturasDisponibles()` - Asignaturas que puede tomar
- `cargarGrupos(codAsignatura)` - Grupos disponibles de asignatura
- `cargarHorario()` - Horario del estudiante
- `cargarResumen()` - Resumen de créditos y estado

#### Validación
- `puedeAgregarAsignatura()` - Verifica límite de créditos

---

## 📊 useCalificaciones

**Ubicación:** `src/hooks/useCalificaciones.js`

### Propósito
Gestiona calificaciones desde perspectiva de estudiante o docente, con estadísticas.

### Uso Básico
```javascript
// Vista Estudiante
const {
  calificaciones,
  estadisticas,
  cargarNotasEstudiante
} = useCalificaciones({ codigoEstudiante: '123456' });

// Vista Docente
const {
  calificaciones,
  registrar,
  actualizar
} = useCalificaciones({ codigoGrupo: 101 });
```

### Props
```javascript
useCalificaciones(options)
```
- `options.codigoEstudiante` (string) - Para vista estudiante
- `options.codigoGrupo` (number) - Para vista docente
- `options.autoLoad` (boolean, default: true) - Carga automática

### Estado Retornado
```javascript
{
  calificaciones: [],
  calificacionSeleccionada: null,
  estadisticas: {
    totalNotas: 0,
    promedio: 0,
    aprobadas: 0,
    reprobadas: 0,
    tasa_aprobacion: 0,
    nota_mas_alta: 0,
    nota_mas_baja: 0
  },
  loading: false,
  error: null
}
```

### Funciones Principales

#### Consulta
- `cargarNotasEstudiante(codigo)` - Notas de estudiante
- `cargarNotasGrupo(codigo)` - Notas de grupo (docente)

#### CRUD (Docente)
- `registrar(notaData)` - Registra calificación
- `actualizar(codCalificacion, notaData)` - Actualiza nota
- `eliminar(codCalificacion)` - Elimina calificación

#### Análisis
- `filtrarPorPeriodo(periodo)` - Filtra por período
- `filtrarPorAsignatura(codAsignatura)` - Filtra por asignatura
- `promedioDelPeriodo(periodo)` - Promedio de período específico

---

## 👨‍🏫 useDocente

**Ubicación:** `src/hooks/useDocente.js`

### Propósito
Gestiona grupos asignados a docente, estudiantes matriculados y horarios.

### Uso Básico
```javascript
import { useDocente } from '../hooks/useDocente';

function DashboardDocente() {
  const {
    grupos,
    estudiantes,
    seleccionarGrupo,
    obtenerEstadisticas
  } = useDocente('DOC123', { autoLoad: true });

  const stats = obtenerEstadisticas();
}
```

### Props
```javascript
useDocente(codigoDocente, options)
```
- `codigoDocente` (string) - Código del docente
- `options.autoLoad` (boolean, default: true) - Carga automática

### Estado Retornado
```javascript
{
  grupos: [],
  grupoSeleccionado: null,
  estudiantes: [],
  horario: null,
  loading: false,
  error: null
}
```

### Funciones Principales

#### Consulta
- `cargarGrupos(codigo)` - Grupos del docente
- `cargarDetalleGrupo(codGrupo)` - Detalle de grupo
- `cargarEstudiantes(codGrupo)` - Estudiantes del grupo
- `cargarHorario(codGrupo)` - Horario del grupo

#### Selección
- `seleccionarGrupo(codGrupo)` - Carga info completa del grupo

#### Filtros
- `filtrarPorPeriodo(codPeriodo)` - Filtra grupos por período
- `filtrarPorAsignatura(codAsignatura)` - Filtra por asignatura

#### Análisis
- `obtenerEstadisticas()` - Estadísticas de grupos del docente

---

## 🔔 useAlertas

**Ubicación:** `src/hooks/useAlertas.js`

### Propósito
Sistema de alertas y notificaciones con filtros y gestión de lectura.

### Uso Básico
```javascript
import { useAlertas } from '../hooks/useAlertas';

function NotificacionesPage() {
  const {
    alertas,
    conteoNoLeidas,
    marcarComoLeida,
    obtenerCriticas
  } = useAlertas('123456'); // código estudiante

  const criticas = obtenerCriticas();
}
```

### Props
```javascript
useAlertas(codigoEstudiante)
```
- `codigoEstudiante` (string, opcional) - Para alertas de estudiante

### Estado Retornado
```javascript
{
  alertas: [],
  alertaSeleccionada: null,
  loading: false,
  error: null,
  conteoNoLeidas: 0
}
```

### Funciones Principales

#### Consulta
- `cargarAlertasEstudiante(codigo)` - Alertas de estudiante
- `cargarTodasAlertas(filtros)` - Todas las alertas (admin)

#### Gestión
- `marcarComoLeida(codAlerta)` - Marca como leída
- `marcarTodasComoLeidas()` - Marca todas como leídas

#### Filtros
- `filtrarPorTipo(tipo)` - Filtra por tipo
- `filtrarPorPrioridad(prioridad)` - Filtra por prioridad
- `obtenerNoLeidas()` - Solo no leídas
- `obtenerLeidas()` - Solo leídas
- `obtenerCriticas()` - Solo críticas/alta prioridad

#### Análisis
- `agruparPorTipo()` - Agrupa alertas por tipo
- `obtenerEstadisticas()` - Estadísticas completas

---

## 📈 useReportes

**Ubicación:** `src/hooks/useReportes.js`

### Propósito
Genera y gestiona reportes del sistema (riesgo, rendimiento, asistencia).

### Uso Básico
```javascript
import { useReportes } from '../hooks/useReportes';

function ReportesPage() {
  const {
    reporteActual,
    generarRiesgo,
    generarRendimiento,
    exportar
  } = useReportes();

  const handleGenerar = async () => {
    const result = await generarRiesgo({ cod_periodo: 2025 });
    if (result.success) {
      await exportar(result.data, 'pdf');
    }
  };
}
```

### Estado Retornado
```javascript
{
  reportes: [],
  reporteActual: null,
  loading: false,
  error: null,
  progreso: 0
}
```

### Funciones Principales

#### Generación
- `generarRiesgo(parametros)` - Reporte de riesgo académico
- `generarRendimiento(parametros)` - Reporte de rendimiento
- `generarAsistencia(parametros)` - Reporte de asistencia

#### Consulta
- `cargarHistorial(filtros)` - Historial de reportes

#### Exportación
- `exportar(reporte, formato)` - Exporta a PDF/Excel

#### Filtros
- `filtrarPorTipo(tipo)` - Filtra por tipo de reporte
- `filtrarPorFecha(inicio, fin)` - Filtra por rango de fechas

#### Análisis
- `obtenerEstadisticas()` - Estadísticas de reportes

#### Auxiliares
- `limpiarReporte()` - Limpia reporte actual

---

## 🎓 useProgramas

**Ubicación:** `src/hooks/useProgramas.js`

### Propósito
Gestiona programas académicos, sus estudiantes y asignaturas.

### Uso Básico
```javascript
import { useProgramas } from '../hooks/useProgramas';

function ProgramasPage() {
  const {
    programas,
    programaSeleccionado,
    seleccionarPrograma,
    obtenerActivos
  } = useProgramas({ autoLoad: true });

  const activos = obtenerActivos();
}
```

### Props
```javascript
useProgramas(options)
```
- `options.autoLoad` (boolean, default: true) - Carga automática

### Estado Retornado
```javascript
{
  programas: [],
  programaSeleccionado: null,
  estudiantes: [],
  asignaturas: [],
  loading: false,
  error: null
}
```

### Funciones Principales

#### Consulta
- `cargarProgramas(filtros)` - Lista de programas
- `cargarPrograma(codigo)` - Programa específico
- `cargarEstudiantes(codPrograma)` - Estudiantes del programa
- `cargarAsignaturas(codPrograma)` - Asignaturas del programa

#### CRUD
- `crear(programaData)` - Crea programa
- `actualizar(codigo, programaData)` - Actualiza programa
- `eliminar(codigo)` - Elimina programa

#### Selección
- `seleccionarPrograma(codigo)` - Carga info completa

#### Búsqueda/Filtros
- `buscar(termino)` - Búsqueda por nombre
- `filtrarPorFacultad(facultad)` - Filtra por facultad
- `obtenerActivos()` - Solo programas activos
- `obtenerInactivos()` - Solo programas inactivos

#### Análisis
- `obtenerEstadisticas()` - Estadísticas de programas
- `agruparPorFacultad()` - Agrupa por facultad

---

## 🔄 Patrones Comunes

### Manejo de Errores
Todos los hooks manejan errores de forma consistente:

```javascript
const { error, setError } = useHook();

// Mostrar error
if (error) {
  console.error(error);
}

// Limpiar error
setError(null);
```

### Estados de Carga
```javascript
const { loading } = useHook();

if (loading) {
  return <Loader />;
}
```

### Resultado de Funciones
Todas las funciones CRUD retornan el mismo formato:

```javascript
const result = await crear(data);

if (result.success) {
  console.log('Datos:', result.data);
} else {
  console.error('Error:', result.error);
}
```

---

## 🛠️ Tips de Uso

### 1. Carga Condicional
```javascript
// No cargar automáticamente
const { cargarProgramas } = useProgramas({ autoLoad: false });

// Cargar cuando sea necesario
useEffect(() => {
  if (someCondition) {
    cargarProgramas();
  }
}, [someCondition]);
```

### 2. Combinación de Hooks
```javascript
function MatriculaInteligente() {
  const { periodoActivo } = usePeriodos();
  const { matriculaActual, agregar } = useMatriculas(codigoEstudiante);
  const { alertas } = useAlertas(codigoEstudiante);
  
  // Usar datos de múltiples hooks
}
```

### 3. Refrescar Datos
```javascript
const { refrescar } = useHook();

// Refrescar después de una operación
const handleCreate = async (data) => {
  const result = await crear(data);
  if (result.success) {
    await refrescar();
  }
};
```

---

## 📦 Dependencias

Todos los hooks dependen de:
- React (useState, useEffect)
- Servicios correspondientes en `src/services/`

---

## 🚀 Próximos Pasos

1. ✅ Todos los hooks principales están implementados
2. 🔄 Crear componentes reutilizables que usen estos hooks
3. 🎨 Implementar páginas completas con estos hooks
4. 📱 Agregar validaciones y mejoras de UX
5. 🧪 Escribir tests unitarios para cada hook

---

**Última actualización:** Noviembre 2025
**Autor:** Sistema Académico - Universidad del Quindío
