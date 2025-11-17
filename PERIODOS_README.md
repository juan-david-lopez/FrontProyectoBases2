# 📅 Servicio de Períodos Académicos

## Descripción

El servicio de períodos académicos (`periodosService.js`) proporciona todas las funcionalidades necesarias para gestionar los períodos académicos del sistema, incluyendo la creación, edición, activación y cierre de períodos.

## Archivos Implementados

1. **`src/services/periodosService.js`** - Servicio principal de períodos
2. **`src/hooks/usePeriodos.js`** - Hook personalizado para usar períodos en componentes
3. **`src/components/PeriodoActivoInfo.jsx`** - Componente para mostrar información del período activo
4. **`src/pages/admin/PeriodosPage.jsx`** - Página de administración de períodos

## 🚀 Uso Básico

### En un Componente Funcional

```jsx
import { usePeriodos } from '../hooks/usePeriodos';

function MiComponente() {
  const { periodos, periodoActivo, loading, error } = usePeriodos();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Período Activo: {periodoActivo?.nombre_periodo}</h2>
      <ul>
        {periodos.map(periodo => (
          <li key={periodo.cod_periodo}>{periodo.nombre_periodo}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Uso Directo del Servicio

```jsx
import { fetchPeriodoActivo, crearPeriodo } from '../services/periodosService';

// Obtener período activo
const periodoActivo = await fetchPeriodoActivo();

// Crear nuevo período
const nuevoPeriodo = await crearPeriodo({
  cod_periodo: '2025-2',
  nombre_periodo: 'Segundo Semestre 2025',
  anio: 2025,
  periodo: 2,
  fecha_inicio: '2025-08-01',
  fecha_fin: '2025-12-15',
  descripcion: 'Segundo período académico 2025'
});
```

## 📚 API del Hook `usePeriodos`

### Estados

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `periodos` | Array | Lista de todos los períodos |
| `periodoActivo` | Object | Período actualmente activo |
| `periodoSeleccionado` | Object | Período seleccionado para edición |
| `loading` | Boolean | Indica si hay una operación en curso |
| `error` | String | Mensaje de error si hay alguno |

### Funciones de Carga

| Función | Parámetros | Descripción |
|---------|------------|-------------|
| `cargarPeriodos()` | `params?: Object` | Carga todos los períodos |
| `cargarPeriodoActivo()` | - | Carga el período activo |
| `cargarPeriodo()` | `codPeriodo: string` | Carga un período específico |
| `cargarPorAnio()` | `anio: number` | Carga períodos de un año |

### Funciones CRUD

| Función | Parámetros | Descripción |
|---------|------------|-------------|
| `crear()` | `periodoData: Object` | Crea un nuevo período |
| `actualizar()` | `codPeriodo: string, data: Object` | Actualiza un período |
| `eliminar()` | `codPeriodo: string` | Elimina un período |

### Funciones de Gestión

| Función | Parámetros | Descripción |
|---------|------------|-------------|
| `activar()` | `codPeriodo: string` | Activa un período |
| `cerrar()` | `codPeriodo: string` | Cierra un período |
| `obtenerEstadisticas()` | `codPeriodo: string` | Obtiene estadísticas |

### Funciones Auxiliares

| Función | Parámetros | Retorno | Descripción |
|---------|------------|---------|-------------|
| `verificarActivo()` | `codPeriodo: string` | `Boolean` | Verifica si un período está activo |
| `obtenerCodigoActivo()` | - | `String` | Obtiene código del período activo |
| `obtenerProximo()` | - | `Object` | Obtiene el período próximo |
| `refrescar()` | - | `Promise` | Recarga todos los datos |

## 🔧 Ejemplos de Uso

### 1. Mostrar Información del Período Activo

```jsx
import PeriodoActivoInfo from '../components/PeriodoActivoInfo';

function Dashboard() {
  return (
    <div>
      <PeriodoActivoInfo showVentanas={true} />
      {/* Resto del dashboard */}
    </div>
  );
}
```

### 2. Crear un Nuevo Período

```jsx
function CrearPeriodo() {
  const { crear, loading } = usePeriodos({ autoLoad: false });

  const handleSubmit = async (formData) => {
    const resultado = await crear({
      cod_periodo: formData.codigo,
      nombre_periodo: formData.nombre,
      anio: parseInt(formData.anio),
      periodo: parseInt(formData.periodo),
      fecha_inicio: formData.fechaInicio,
      fecha_fin: formData.fechaFin,
      descripcion: formData.descripcion
    });

    if (resultado.success) {
      alert('Período creado exitosamente');
    } else {
      alert(`Error: ${resultado.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
```

### 3. Listar Períodos por Año

```jsx
function PeriodosPorAnio({ anio }) {
  const { cargarPorAnio, periodos, loading } = usePeriodos({ autoLoad: false });

  useEffect(() => {
    cargarPorAnio(anio);
  }, [anio]);

  if (loading) return <Loader />;

  return (
    <ul>
      {periodos.map(p => (
        <li key={p.cod_periodo}>
          {p.nombre_periodo} - {p.estado}
        </li>
      ))}
    </ul>
  );
}
```

### 4. Activar un Período

```jsx
function ActivarPeriodo({ codPeriodo }) {
  const { activar, loading } = usePeriodos();

  const handleActivar = async () => {
    if (confirm('¿Desea activar este período?')) {
      const resultado = await activar(codPeriodo);
      if (resultado.success) {
        alert('Período activado correctamente');
      }
    }
  };

  return (
    <button onClick={handleActivar} disabled={loading}>
      Activar Período
    </button>
  );
}
```

### 5. Verificar Ventanas Activas

```jsx
function VentanasActivas() {
  const { periodoActivo } = usePeriodos();

  return (
    <div>
      {periodoActivo?.ventanas_activas?.map((ventana, idx) => (
        <div key={idx} className="ventana-card">
          <h4>{ventana.nombre}</h4>
          <p>Tipo: {ventana.tipo}</p>
          <p>Días restantes: {ventana.dias_restantes}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📊 Estructura de Datos

### Objeto Período

```javascript
{
  cod_periodo: "2025-1",
  nombre_periodo: "Primer Semestre 2025",
  anio: 2025,
  periodo: 1,
  fecha_inicio: "2025-01-15T00:00:00Z",
  fecha_fin: "2025-06-30T00:00:00Z",
  estado: "ACTIVO",  // ACTIVO | CERRADO | PROXIMO
  descripcion: "Descripción del período",
  ventanas_activas: [
    {
      tipo: "MATRICULA",
      nombre: "Matrícula Ordinaria",
      fecha_fin: "2025-01-20T17:00:00Z",
      dias_restantes: 3
    }
  ]
}
```

## 🎯 Configuraciones del Hook

El hook `usePeriodos` acepta opciones de configuración:

```jsx
const { periodos, periodoActivo } = usePeriodos({
  autoLoad: true,      // Cargar períodos automáticamente (default: true)
  loadActivo: true     // Cargar período activo automáticamente (default: true)
});

// Sin carga automática
const { cargarPeriodos } = usePeriodos({ 
  autoLoad: false, 
  loadActivo: false 
});
```

## 🔒 Permisos

- **Lectura**: Todos los roles pueden consultar períodos
- **Creación/Edición/Eliminación**: Solo administradores
- **Activación/Cierre**: Solo administradores

## 🚨 Manejo de Errores

Todos los métodos retornan un objeto con la estructura:

```javascript
{
  success: true | false,
  data: { /* datos */ },
  error: "Mensaje de error"
}
```

Ejemplo:

```jsx
const resultado = await crear(periodoData);

if (resultado.success) {
  console.log('Éxito:', resultado.data);
} else {
  console.error('Error:', resultado.error);
}
```

## 📝 Notas Importantes

1. **Período Activo Único**: Solo puede haber un período activo a la vez
2. **Validaciones**: Las fechas deben ser coherentes (inicio < fin)
3. **Eliminación**: Solo se pueden eliminar períodos sin matrículas
4. **Estados**: Los estados válidos son: ACTIVO, CERRADO, PROXIMO

## 🔗 Integración con Otros Servicios

El servicio de períodos se integra con:

- **Matrículas**: Requiere período activo para matricular
- **Ventanas de Calendario**: Asociadas a períodos específicos
- **Reportes**: Generados por período
- **Grupos**: Creados para un período específico

## 📖 Recursos Adicionales

- Ver `integracion.md` para documentación completa de la API
- Ver `PeriodosPage.jsx` para ejemplo de implementación completa
- Ver `periodosService.js` para detalles de los endpoints
