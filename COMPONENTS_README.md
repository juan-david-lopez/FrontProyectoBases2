# 🎨 Componentes Reutilizables - Sistema Académico

Documentación completa de todos los componentes reutilizables implementados para el sistema académico.

---

## 📋 Índice de Componentes

1. [GrupoCard](#-grupocard) - Tarjeta de información de grupo
2. [AlertaCard](#-alertacard) - Tarjeta de alerta/notificación
3. [AsignaturaCard](#-asignaturacard) - Tarjeta de asignatura
4. [EstadisticasCard](#-estadisticascard) - Tarjeta de estadística
5. [HorarioGrid](#-horariogrid) - Grilla semanal de horarios
6. [TablaCalificaciones](#-tablacalificaciones) - Tabla de calificaciones con detalles

---

## 📦 GrupoCard

**Ubicación:** `src/components/GrupoCard.jsx`

### Propósito
Muestra información detallada de un grupo académico con cupo, horario y docente.

### Props

```javascript
<GrupoCard
  grupo={grupoData}
  onClick={handleGrupoClick}
  showEstudiantes={true}
  showDocente={true}
  showHorario={true}
  className="mb-4"
/>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `grupo` | Object | **requerido** | Datos del grupo |
| `onClick` | Function | - | Callback al hacer click |
| `showEstudiantes` | boolean | true | Mostrar contador de estudiantes |
| `showDocente` | boolean | true | Mostrar nombre del docente |
| `showHorario` | boolean | true | Mostrar información de horario |
| `className` | string | '' | Clases CSS adicionales |

### Estructura de Datos

```javascript
const grupo = {
  nombre_grupo: "Grupo A",
  cod_grupo: 101,
  nombre_asignatura: "Bases de Datos II",
  codigo_asignatura: "BD201",
  creditos: 3,
  cupo_maximo: 30,
  cupo_disponible: 5,
  total_estudiantes: 25,
  nombre_docente: "Dr. Juan Pérez",
  dias: "Lunes - Miércoles",
  hora_inicio: "14:00",
  hora_fin: "16:00",
  aula: "Lab 302",
  estado: "ACTIVO"
}
```

### Ejemplos de Uso

```javascript
// Básico
<GrupoCard grupo={grupo} />

// Con click handler
<GrupoCard 
  grupo={grupo}
  onClick={(g) => console.log('Grupo seleccionado:', g)}
/>

// Versión simplificada
<GrupoCard 
  grupo={grupo}
  showDocente={false}
  showHorario={false}
/>
```

### Características
- ✅ Indicador visual de ocupación (verde/amarillo/rojo)
- ✅ Badges de estado y créditos
- ✅ Hover effect con borde azul
- ✅ Iconos de lucide-react
- ✅ Responsive y adaptable

---

## 🔔 AlertaCard

**Ubicación:** `src/components/AlertaCard.jsx`

### Propósito
Muestra alertas/notificaciones del sistema con tipos, prioridades y estado de lectura.

### Props

```javascript
<AlertaCard
  alerta={alertaData}
  onMarcarLeida={handleMarcarLeida}
  onClick={handleAlertaClick}
  showActions={true}
  className="mb-3"
/>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `alerta` | Object | **requerido** | Datos de la alerta |
| `onMarcarLeida` | Function | - | Callback al marcar como leída |
| `onClick` | Function | - | Callback al hacer click |
| `showActions` | boolean | true | Mostrar botón de marcar leída |
| `className` | string | '' | Clases CSS adicionales |

### Estructura de Datos

```javascript
const alerta = {
  cod_alerta: 1,
  tipo_alerta: "RIESGO_ACADEMICO", // RIESGO, MATRICULA, NOTA, ERROR, INFO
  prioridad: "ALTA", // ALTA, MEDIA, BAJA
  mensaje: "Riesgo de perder el semestre",
  descripcion: "Tu promedio es inferior a 3.0",
  fecha_creacion: "2025-11-15T10:00:00",
  fecha_lectura: null,
  leida: false
}
```

### Tipos de Alerta

- **RIESGO / RIESGO_ACADEMICO**: ⚠️ Rojo - Alertas de riesgo académico
- **MATRICULA / VENTANA_MATRICULA**: 📚 Azul - Notificaciones de matrícula
- **NOTA / CALIFICACION**: ✅ Verde - Actualizaciones de calificaciones
- **ERROR / ADVERTENCIA**: ⚡ Amarillo - Advertencias del sistema
- **INFO** (default): ℹ️ Gris - Información general

### Ejemplos de Uso

```javascript
// Alerta no leída
<AlertaCard 
  alerta={alerta}
  onMarcarLeida={(id) => marcarComoLeida(id)}
/>

// Lista de alertas
{alertas.map(alerta => (
  <AlertaCard 
    key={alerta.cod_alerta}
    alerta={alerta}
    onMarcarLeida={handleMarcar}
    onClick={handleVerDetalle}
  />
))}
```

### Características
- ✅ Colores automáticos según tipo
- ✅ Indicador visual de no leída (punto azul pulsante)
- ✅ Fechas relativas ("hace 2 horas")
- ✅ Badges de prioridad
- ✅ Animación hover

---

## 📚 AsignaturaCard

**Ubicación:** `src/components/AsignaturaCard.jsx`

### Propósito
Muestra información de una asignatura con nota, estado y prerequisitos.

### Props

```javascript
<AsignaturaCard
  asignatura={asignaturaData}
  onClick={handleAsignaturaClick}
  showNota={true}
  showEstado={true}
  showPrerequisitos={false}
  className="mb-4"
/>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `asignatura` | Object | **requerido** | Datos de la asignatura |
| `onClick` | Function | - | Callback al hacer click |
| `showNota` | boolean | false | Mostrar calificación |
| `showEstado` | boolean | true | Mostrar estado |
| `showPrerequisitos` | boolean | false | Mostrar prerequisitos |
| `className` | string | '' | Clases CSS adicionales |

### Estructura de Datos

```javascript
const asignatura = {
  cod_asignatura: "BD201",
  nombre_asignatura: "Bases de Datos II",
  creditos: 3,
  semestre: 5,
  tipo_asignatura: "OBLIGATORIA", // OBLIGATORIA, ELECTIVA, LIBRE, TRABAJO_GRADO
  nota_final: 4.2,
  estado: "APROBADA", // APROBADA, REPROBADA, EN_CURSO, PENDIENTE
  horas_teoricas: 3,
  horas_practicas: 2,
  prerequisitos: [
    { codigo: "BD101", nombre: "Bases de Datos I" }
  ]
}
```

### Ejemplos de Uso

```javascript
// Con nota (para historial académico)
<AsignaturaCard 
  asignatura={asignatura}
  showNota={true}
/>

// Para matrícula (sin nota, con prerequisitos)
<AsignaturaCard 
  asignatura={asignatura}
  showNota={false}
  showPrerequisitos={true}
  onClick={handleSeleccionar}
/>
```

### Características
- ✅ Iconos según nota (✓ aprobada, ✗ reprobada)
- ✅ Colores según tipo y estado
- ✅ Muestra horas teóricas/prácticas
- ✅ Lista de prerequisitos
- ✅ Responsive

---

## 📊 EstadisticasCard

**Ubicación:** `src/components/EstadisticasCard.jsx`

### Propósito
Muestra una estadística individual con ícono, valor, descripción y tendencia.

### Props

```javascript
<EstadisticasCard
  titulo="Total Estudiantes"
  valor={1234}
  descripcion="Activos este semestre"
  icono={Users}
  color="blue"
  cambio={12.5}
  tendencia="up"
  loading={false}
/>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `titulo` | string | **requerido** | Título de la estadística |
| `valor` | string\|number | **requerido** | Valor principal |
| `descripcion` | string | - | Descripción adicional |
| `icono` | Component | - | Componente de ícono (lucide-react) |
| `color` | string | 'blue' | Color del tema |
| `cambio` | number | - | Porcentaje de cambio |
| `tendencia` | string | - | 'up', 'down', 'neutral' |
| `loading` | boolean | false | Mostrar skeleton |
| `className` | string | '' | Clases CSS adicionales |

### Colores Disponibles
- `blue` - Azul (default)
- `green` - Verde
- `red` - Rojo
- `yellow` - Amarillo
- `purple` - Morado
- `gray` - Gris

### Ejemplos de Uso

```javascript
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

// Dashboard de estadísticas
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <EstadisticasCard
    titulo="Total Estudiantes"
    valor={1234}
    descripcion="Activos"
    icono={Users}
    color="blue"
    cambio={12.5}
    tendencia="up"
  />
  
  <EstadisticasCard
    titulo="Promedio General"
    valor="3.85"
    descripcion="Este semestre"
    icono={Award}
    color="green"
  />
  
  <EstadisticasCard
    titulo="Tasa de Aprobación"
    valor="87%"
    icono={TrendingUp}
    color="purple"
    cambio={5.2}
  />
  
  <EstadisticasCard
    titulo="Asignaturas"
    valor={45}
    descripcion="Ofertadas"
    icono={BookOpen}
    color="yellow"
  />
</div>

// Con estado de carga
<EstadisticasCard
  titulo="Cargando..."
  valor={0}
  loading={true}
/>
```

### Características
- ✅ Skeleton loader automático
- ✅ Indicadores de tendencia (flechas)
- ✅ Porcentajes de cambio coloreados
- ✅ Hover effect
- ✅ Totalmente personalizable

---

## 🗓️ HorarioGrid

**Ubicación:** `src/components/HorarioGrid.jsx`

### Propósito
Muestra horarios semanales en formato de grilla con colores por asignatura.

### Props

```javascript
<HorarioGrid
  horarios={horariosData}
  compacto={false}
  onBloqueClick={handleBloqueClick}
  className="mt-6"
/>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `horarios` | Array | [] | Array de bloques de horario |
| `compacto` | boolean | false | Modo compacto (menos info) |
| `onBloqueClick` | Function | - | Callback al hacer click en bloque |
| `className` | string | '' | Clases CSS adicionales |

### Estructura de Datos

```javascript
const horarios = [
  {
    dia: "Lunes", // o dia_semana
    hora_inicio: "14:00",
    hora_fin: "16:00",
    nombre_asignatura: "Bases de Datos II",
    codigo_asignatura: "BD201",
    nombre_docente: "Dr. Juan Pérez",
    aula: "Lab 302"
  },
  // ... más bloques
];
```

### Días Soportados
- Lunes, Martes, Miércoles, Jueves, Viernes, Sábado
- Abreviaturas: L, M, X, J, V, S
- Formato corto: Lu, Ma, Mi, Ju, Vi, Sa

### Ejemplos de Uso

```javascript
// Horario completo del estudiante
<HorarioGrid 
  horarios={miHorario}
  onBloqueClick={(bloque) => verDetalles(bloque)}
/>

// Modo compacto (para vista previa)
<HorarioGrid 
  horarios={horarios}
  compacto={true}
/>

// Horario de un grupo específico
const { horario } = useDocente('DOC123');
<HorarioGrid horarios={horario} />
```

### Características
- ✅ Grilla semanal (Lunes-Sábado)
- ✅ Horas de 7am a 9pm
- ✅ Colores automáticos por asignatura
- ✅ Bloques multi-hora (rowspan automático)
- ✅ Leyenda de asignaturas
- ✅ Click en bloques para detalles
- ✅ Modo compacto para previews
- ✅ Responsive con scroll horizontal

---

## 📋 TablaCalificaciones

**Ubicación:** `src/components/TablaCalificaciones.jsx`

### Propósito
Tabla completa de calificaciones con parciales, nota final, estadísticas y modo editable.

### Props

```javascript
<TablaCalificaciones
  calificaciones={calificacionesData}
  expandible={true}
  mostrarEstadisticas={true}
  onEditarNota={handleEditar}
  editable={false}
  className="mt-6"
/>
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `calificaciones` | Array | [] | Array de calificaciones |
| `expandible` | boolean | true | Permitir expandir filas |
| `mostrarEstadisticas` | boolean | true | Mostrar resumen al final |
| `onEditarNota` | Function | - | Callback para editar (docente) |
| `editable` | boolean | false | Mostrar botones de edición |
| `className` | string | '' | Clases CSS adicionales |

### Estructura de Datos

```javascript
const calificaciones = [
  {
    nombre_asignatura: "Bases de Datos II",
    codigo_asignatura: "BD201",
    parcial1: 4.2,
    parcial2: 3.8,
    parcial3: 4.5,
    nota_final: 4.2,
    creditos: 3,
    // Para vista docente:
    nombre_estudiante: "Juan López",
    codigo_estudiante: "123456",
    observaciones: "Excelente trabajo"
  },
  // ... más calificaciones
];
```

### Modos de Uso

#### Vista Estudiante
```javascript
const { calificaciones } = useCalificaciones({ 
  codigoEstudiante: '123456' 
});

<TablaCalificaciones 
  calificaciones={calificaciones}
  expandible={true}
  mostrarEstadisticas={true}
/>
```

#### Vista Docente
```javascript
const { calificaciones, actualizar } = useCalificaciones({ 
  codigoGrupo: 101 
});

<TablaCalificaciones 
  calificaciones={calificaciones}
  editable={true}
  onEditarNota={(cal) => abrirModalEdicion(cal)}
/>
```

### Características
- ✅ Muestra parciales 1, 2, 3 y nota final
- ✅ Iconos según estado (✓ aprobada, ✗ reprobada)
- ✅ Colores según nota (verde ≥4.0, azul ≥3.0, amarillo ≥2.0, rojo <2.0)
- ✅ Filas expandibles con detalles
- ✅ Estadísticas automáticas (promedio, aprobadas, tasa de aprobación)
- ✅ Modo editable para docentes
- ✅ Fondo coloreado según nota
- ✅ Responsive con scroll horizontal

---

## 🎯 Patrones de Uso Común

### 1. Dashboard con Estadísticas

```javascript
import { EstadisticasCard } from '../components/EstadisticasCard';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

function Dashboard() {
  const stats = obtenerEstadisticas();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <EstadisticasCard
        titulo="Total Estudiantes"
        valor={stats.estudiantes}
        icono={Users}
        color="blue"
      />
      {/* ... más cards */}
    </div>
  );
}
```

### 2. Lista de Grupos Disponibles

```javascript
import { GrupoCard } from '../components/GrupoCard';

function GruposDisponibles() {
  const { grupos } = useGrupos();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {grupos.map(grupo => (
        <GrupoCard
          key={grupo.cod_grupo}
          grupo={grupo}
          onClick={seleccionarGrupo}
        />
      ))}
    </div>
  );
}
```

### 3. Panel de Alertas

```javascript
import { AlertaCard } from '../components/AlertaCard';
import { useAlertas } from '../hooks/useAlertas';

function Notificaciones() {
  const { alertas, marcarComoLeida } = useAlertas(codigoEstudiante);
  const noLeidas = alertas.filter(a => !a.leida);
  
  return (
    <div className="space-y-3">
      {noLeidas.map(alerta => (
        <AlertaCard
          key={alerta.cod_alerta}
          alerta={alerta}
          onMarcarLeida={marcarComoLeida}
        />
      ))}
    </div>
  );
}
```

### 4. Horario del Estudiante

```javascript
import { HorarioGrid } from '../components/HorarioGrid';
import { useMatriculas } from '../hooks/useMatriculas';

function MiHorario() {
  const { horario, loading } = useMatriculas(codigoEstudiante);
  
  useEffect(() => {
    cargarHorario();
  }, []);
  
  if (loading) return <Loader />;
  
  return (
    <HorarioGrid 
      horarios={horario}
      onBloqueClick={(bloque) => verDetallesClase(bloque)}
    />
  );
}
```

### 5. Historial Académico

```javascript
import { AsignaturaCard } from '../components/AsignaturaCard';
import { TablaCalificaciones } from '../components/TablaCalificaciones';

function HistorialAcademico() {
  const { calificaciones } = useCalificaciones({ codigoEstudiante });
  
  return (
    <>
      {/* Vista de tabla */}
      <TablaCalificaciones 
        calificaciones={calificaciones}
        mostrarEstadisticas={true}
      />
      
      {/* O vista de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calificaciones.map(cal => (
          <AsignaturaCard
            key={cal.cod_asignatura}
            asignatura={cal}
            showNota={true}
            showEstado={true}
          />
        ))}
      </div>
    </>
  );
}
```

---

## 🎨 Temas y Personalización

### Colores Consistentes

Todos los componentes usan la misma paleta de Tailwind:

- **Azul**: Información general, estados activos
- **Verde**: Éxito, aprobado, positivo
- **Rojo**: Error, reprobado, negativo
- **Amarillo**: Advertencia, pendiente
- **Morado**: Especial, destacado
- **Gris**: Neutral, deshabilitado

### Clases CSS Comunes

```javascript
// Añadir clases personalizadas
<GrupoCard 
  className="shadow-lg hover:shadow-xl transition-shadow"
  grupo={grupo}
/>

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards aquí */}
</div>
```

---

## 📦 Dependencias

Todos los componentes usan:
- **React**: Hooks (useState)
- **lucide-react**: Iconos
- **TailwindCSS**: Estilos
- **date-fns**: Formateo de fechas (solo AlertaCard)

---

## 🚀 Próximos Pasos

1. ✅ Todos los componentes principales están implementados
2. 🔄 Integrar en páginas existentes
3. 🎨 Crear variantes temáticas si es necesario
4. 🧪 Escribir tests unitarios
5. 📱 Optimizar para móvil

---

**Última actualización:** Noviembre 2025
**Total de componentes:** 6
