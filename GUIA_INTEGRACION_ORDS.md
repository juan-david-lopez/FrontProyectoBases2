# 🔌 Guía de Integración con API ORDS

## 📋 Cambios Realizados

### ✅ Servicios Actualizados

#### 1. `matriculasService.js` - **ACTUALIZADO**
Se actualizaron todos los endpoints para coincidir con la documentación de ORDS:

**Endpoints Corregidos:**
- ✅ `/registro-materias/disponibles/:cod_estudiante` (antes: `/asignaturas/disponibles`)
- ✅ `/registro-materias/grupos/:cod_asignatura` (NUEVO)
- ✅ `/registro-materias/mi-horario/:cod_estudiante` (NUEVO)
- ✅ `/registro-materias/resumen/:cod_estudiante` (NUEVO)
- ✅ `/matriculas/registrar` (sin cambios)
- ✅ `/estudiantes/:codigo/matriculas` (para historial)

#### 2. `alertasService.js` - **NUEVO**
Servicio completo para gestión de ventanas de calendario:

- `fetchVentanasCalendario()` - Todas las ventanas
- `fetchVentanaActiva(tipo)` - Ventana específica
- `isVentanaActiva(tipo)` - Helper booleano
- `getDetalleVentana(tipo)` - Detalle completo
- `fetchReporteGeneralAlertas()` - Dashboard de alertas
- `fetchAlertasAsistenciaBaja(codigo)` - Alertas de asistencia

**Tipos de Ventana:**
- `MATRICULA` - Inscripción de asignaturas
- `CANCELACION` - Cancelación de materias
- `MODIFICACION` - Cambio de grupos
- `CIERRE_NOTAS` - Cierre de calificaciones

---

## 🎯 Cambios Requeridos en Componentes

### 📄 **MatriculaPage.jsx**

#### Estado Actual vs Estado Requerido

**ANTES (estructura incorrecta):**
```javascript
{
  items: [
    {
      cod_grupo: 7,
      cod_asignatura: "IS201",
      nombre_asignatura: "Programación Orientada a Objetos",
      creditos: 4,
      docente: "Dr. Carlos Martínez",
      horario: "Lunes 8:00-10:00",
      salon: "B-201",
      cupo_disponible: 28,
      cupo_maximo: 30,
      sede: "Armenia",
      tiene_prerrequisitos: true,
      prerrequisitos_cumplidos: true,
      prerrequisitos: ["IS101"]
    }
  ]
}
```

**DESPUÉS (según ORDS):**
```javascript
// 1. Asignaturas disponibles
{
  items: [
    {
      cod_asignatura: "IS102",
      nombre: "Estructura de Datos",
      creditos: 4,
      semestre: 2,
      tipo: "OBLIGATORIA",
      prereq_cumplidos: "SÍ",  // Cambió de boolean a string
      grupos_disponibles: 3,
      puede_inscribir: "SÍ",  // NUEVO campo clave
      razon: null  // Razón si no puede inscribir
    }
  ]
}

// 2. Grupos de una asignatura (endpoint separado)
{
  items: [
    {
      cod_grupo: "G01",
      cod_asignatura: "IS102",
      nombre_asignatura: "Estructura de Datos",
      cod_docente: "D001",
      nombre_docente: "Dr. Roberto Méndez",
      horario: "LUN-MIE 08:00-10:00",
      salon: "LAB-201",
      cupo_maximo: 35,
      cupo_disponible: 12,
      porcentaje_ocupacion: 66,
      nombre_sede: "Campus Principal Armenia",
      estado: "ABIERTO"
    }
  ]
}

// 3. Resumen académico (endpoint separado)
{
  items: [
    {
      cod_estudiante: "202500001",
      nombre_completo: "JUAN CARLOS PÉREZ GÓMEZ",
      creditos_programa: 160,
      creditos_aprobados: 48,
      porcentaje_avance: 30,
      nivel_riesgo: 0,
      descripcion_riesgo: "SIN RIESGO",
      creditos_disponibles: 21,  // ESTE es el límite
      creditos_matriculados: 18,
      creditos_restantes: 3,
      puede_matricular_mas: "SÍ",
      periodo_actual: "2025-I"
    }
  ]
}
```

#### Cambios Necesarios en el Código

**1. Agregar Validación de Ventana al Inicio:**
```javascript
import { fetchVentanaActiva } from '../../services/alertasService.js';

// En useEffect inicial
useEffect(() => {
  async function validarVentana() {
    const ventana = await fetchVentanaActiva('MATRICULA');
    
    if (ventana.items[0].activa !== 'SÍ') {
      setError(ventana.items[0].mensaje);
      setVentanaActiva(false);
      return;
    }
    
    setVentanaActiva(true);
    cargarDatosMatricula();
  }
  
  validarVentana();
}, []);
```

**2. Usar Resumen Académico para Créditos:**
```javascript
import { fetchResumenMatricula } from '../../services/matriculasService.js';

const [resumen, setResumen] = useState(null);

useEffect(() => {
  async function cargarResumen() {
    const data = await fetchResumenMatricula(user.codigo);
    setResumen(data.items[0]);
    setCreditosDisponibles(data.items[0].creditos_disponibles);
    setNivelRiesgo(data.items[0].nivel_riesgo);
  }
  cargarResumen();
}, [user]);

// Usar en UI
<div>
  <p>Créditos Disponibles: {resumen?.creditos_disponibles}</p>
  <p>Créditos Matriculados: {resumen?.creditos_matriculados}</p>
  <p>Puede Matricular Más: {resumen?.puede_matricular_mas}</p>
  <ProgressBar value={resumen?.porcentaje_avance} />
</div>
```

**3. Flujo de Selección de Asignaturas (2 pasos):**
```javascript
// PASO 1: Mostrar asignaturas disponibles
const asignaturasDisponibles = await fetchAsignaturasDisponibles(user.codigo);

asignaturasDisponibles.items.map(asig => (
  <Card key={asig.cod_asignatura}>
    <h3>{asig.cod_asignatura} - {asig.nombre}</h3>
    <p>{asig.creditos} créditos</p>
    
    {/* VALIDACIÓN CLAVE */}
    {asig.puede_inscribir === 'SÍ' ? (
      <Button onClick={() => mostrarGrupos(asig.cod_asignatura)}>
        Ver {asig.grupos_disponibles} grupos
      </Button>
    ) : (
      <Alert severity="warning">{asig.razon}</Alert>
    )}
    
    {/* Indicador de prerrequisitos */}
    {asig.prereq_cumplidos === 'SÍ' ? (
      <CheckIcon color="green" />
    ) : (
      <XIcon color="red" />
    )}
  </Card>
));

// PASO 2: Mostrar grupos cuando selecciona una asignatura
async function mostrarGrupos(codAsignatura) {
  const grupos = await fetchGruposPorAsignatura(codAsignatura);
  
  setGruposModal({
    asignatura: codAsignatura,
    grupos: grupos.items
  });
  setShowModal(true);
}

// PASO 3: Seleccionar grupo específico
function seleccionarGrupo(grupo) {
  setGruposSeleccionados(prev => [...prev, {
    cod_grupo: grupo.cod_grupo,
    asignatura: grupo.nombre_asignatura,
    creditos: grupo.creditos,
    horario: grupo.horario,
    docente: grupo.nombre_docente
  }]);
}
```

**4. Confirmación de Matrícula (Payload Correcto):**
```javascript
async function confirmarMatricula() {
  // Validar que no exceda créditos
  const totalCreditos = gruposSeleccionados.reduce((sum, g) => sum + g.creditos, 0);
  
  if (totalCreditos > resumen.creditos_disponibles) {
    setError(`Excede el límite: ${totalCreditos}/${resumen.creditos_disponibles}`);
    return;
  }
  
  // Payload según documentación ORDS
  const payload = {
    codigoEstudiante: user.codigo,
    cod_periodo: resumen.periodo_actual, // "2025-I"
    grupos: gruposSeleccionados.map(g => ({ cod_grupo: g.cod_grupo }))
  };
  
  try {
    const response = await registrarMatricula(payload);
    setSuccess(response.mensaje);
    setGruposSeleccionados([]);
    
    // Recargar datos
    await cargarDatosMatricula();
  } catch (error) {
    // El backend retorna errores 403 con detalles
    if (error.response?.status === 403) {
      setError(error.response.data.detalle);
    } else {
      setError('Error al registrar matrícula');
    }
  }
}
```

**5. Mostrar Horario Actual:**
```javascript
import { fetchMiHorario } from '../../services/matriculasService.js';

const [horario, setHorario] = useState([]);

useEffect(() => {
  async function cargarHorario() {
    const data = await fetchMiHorario(user.codigo);
    setHorario(data.items);
  }
  cargarHorario();
}, [user]);

// Renderizar calendario
function renderCalendario() {
  const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
  
  return (
    <div className="calendar-grid">
      {dias.map(dia => (
        <div key={dia} className="day-column">
          <h4>{dia}</h4>
          {horario
            .filter(h => h.dia === dia)
            .map(h => (
              <div 
                key={h.cod_asignatura} 
                className="class-block"
                style={{
                  gridRow: `${getHoraRow(h.hora_inicio)} / ${getHoraRow(h.hora_fin)}`
                }}
              >
                <strong>{h.cod_asignatura}</strong>
                <p>{h.nombre_asignatura}</p>
                <p>{h.salon}</p>
                <small>{h.docente}</small>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
```

---

### 📄 **HistorialMatriculaPage.jsx**

**Cambio Principal: Endpoint del Historial**

```javascript
// ANTES
const historial = await axiosClient.get(`/matriculas/historial/${codigoEstudiante}`);

// DESPUÉS
const historial = await axiosClient.get(`/estudiantes/${codigoEstudiante}/matriculas`);
```

**Estructura de Respuesta:**
```javascript
{
  items: [
    {
      cod_matricula: "M2025-1-001",
      cod_periodo: "2025-I",
      fecha_matricula: "2025-01-20T10:30:00Z",
      total_creditos: 18,
      estado: "ACTIVA",
      asignaturas: [
        {
          cod_asignatura: "IS101",
          nombre_asignatura: "Fundamentos de Programación",
          creditos: 4,
          cod_grupo: "G01",
          docente: "Dr. Roberto Méndez",
          horario: "LUN-MIE 08:00-10:00"
        }
      ]
    }
  ]
}
```

---

## 🚨 Manejo de Errores según ORDS

### Códigos de Error Esperados

```javascript
try {
  await registrarMatricula(payload);
} catch (error) {
  const status = error.response?.status;
  const data = error.response?.data;
  
  switch (status) {
    case 400:
      // Datos inválidos
      setError(`Datos inválidos: ${data.message}`);
      break;
      
    case 403:
      // Validación de reglas de negocio
      setError(data.detalle || data.error);
      // Ejemplos:
      // - "Ventana de matrícula cerrada"
      // - "Límite de créditos excedido"
      // - "Falta prerrequisito: IS201"
      // - "Choque de horario con IS102"
      break;
      
    case 404:
      setError('Recurso no encontrado');
      break;
      
    case 500:
      setError('Error del servidor. Intente más tarde');
      break;
      
    default:
      setError('Error desconocido');
  }
}
```

---

## 🎨 Componentes de UI Recomendados

### 1. Banner de Ventana Activa

```javascript
import { fetchVentanaActiva } from '../../services/alertasService.js';

function VentanaBanner({ tipo }) {
  const [ventana, setVentana] = useState(null);
  
  useEffect(() => {
    fetchVentanaActiva(tipo).then(data => setVentana(data.items[0]));
  }, [tipo]);
  
  if (!ventana || ventana.activa !== 'SÍ') {
    return (
      <Alert severity="warning">
        {ventana?.mensaje || `Ventana de ${tipo} cerrada`}
      </Alert>
    );
  }
  
  return (
    <Alert severity="info">
      <strong>{ventana.mensaje}</strong>
      <CountdownTimer dias={ventana.dias_restantes} horas={ventana.horas_restantes} />
    </Alert>
  );
}
```

### 2. Indicador de Disponibilidad de Cupos

```javascript
function CupoIndicator({ disponible, maximo, porcentaje }) {
  const getColor = () => {
    if (porcentaje < 70) return 'green';
    if (porcentaje < 90) return 'yellow';
    return 'red';
  };
  
  return (
    <div className={`cupo-badge ${getColor()}`}>
      <Users size={16} />
      <span>{disponible}/{maximo}</span>
      {disponible === 0 && <span className="cerrado">CERRADO</span>}
    </div>
  );
}
```

### 3. Validador de Prerrequisitos

```javascript
function PrerrequisitosCard({ cumplidos, puede_inscribir, razon }) {
  if (puede_inscribir === 'SÍ' && cumplidos === 'SÍ') {
    return (
      <div className="prereq-ok">
        <CheckCircle color="green" />
        <span>Prerrequisitos cumplidos</span>
      </div>
    );
  }
  
  return (
    <div className="prereq-falta">
      <AlertCircle color="red" />
      <span>{razon}</span>
    </div>
  );
}
```

---

## 📋 Checklist de Integración

### ✅ Fase 1: Servicios
- [x] Actualizar `matriculasService.js` con endpoints correctos
- [x] Crear `alertasService.js` para ventanas de calendario
- [ ] Actualizar `estudiantesService.js` si es necesario
- [ ] Actualizar `notasService.js` (calificaciones)

### ✅ Fase 2: Validaciones
- [ ] Agregar validación de ventana en `MatriculaPage`
- [ ] Mostrar banner de ventana activa/cerrada
- [ ] Bloquear funciones si ventana está cerrada
- [ ] Validar límite de créditos en tiempo real

### ✅ Fase 3: Flujo de Matrícula
- [ ] Implementar selección en 2 pasos (asignatura → grupo)
- [ ] Usar `fetchGruposPorAsignatura` para mostrar grupos
- [ ] Validar `puede_inscribir === 'SÍ'` antes de permitir selección
- [ ] Mostrar `razon` cuando no pueda inscribir

### ✅ Fase 4: Vista de Horario
- [ ] Integrar `fetchMiHorario` en componente
- [ ] Renderizar calendario semanal visual
- [ ] Detectar y mostrar choques de horario

### ✅ Fase 5: Manejo de Errores
- [ ] Capturar errores 403 y mostrar `detalle`
- [ ] Mostrar mensajes específicos del backend
- [ ] Toast/Snackbar para feedback inmediato

---

## 🧪 Testing de Integración

### Comando de Prueba

```bash
# Ejecutar script de testing de endpoints
.\07_TESTS\test_all_endpoints.ps1
```

**Resultado Esperado:** `23/23 endpoints OK (100%)`

### Endpoints Críticos a Probar

```javascript
// 1. Resumen académico
GET /registro-materias/resumen/202500001

// 2. Asignaturas disponibles
GET /registro-materias/disponibles/202500001

// 3. Grupos por asignatura
GET /registro-materias/grupos/IS102

// 4. Mi horario
GET /registro-materias/mi-horario/202500001

// 5. Ventana activa
GET /alertas/ventana-activa/MATRICULA

// 6. Registrar matrícula (requiere datos válidos)
POST /matriculas/registrar
{
  "codigoEstudiante": "202500001",
  "cod_periodo": "2025-I",
  "grupos": [
    { "cod_grupo": "G01" }
  ]
}
```

---

## 📞 Próximos Pasos

1. **Actualizar `MatriculaPage.jsx`** con los cambios mencionados
2. **Probar flujo completo** con datos reales del backend
3. **Agregar banner de ventana** en todas las vistas de estudiante
4. **Implementar calendario visual** de horarios
5. **Mejorar manejo de errores** según códigos de ORDS

---

## 📝 Notas Importantes

### ⚠️ Cambios Críticos

1. **Prerrequisitos:** Cambió de `boolean` a `string` (`"SÍ"` / `"NO"`)
2. **Puede Inscribir:** Nuevo campo clave que determina si se puede seleccionar
3. **Razon:** Mensaje específico cuando no puede inscribir
4. **Grupos:** Ahora es un endpoint separado, no viene con las asignaturas
5. **Periodo:** Formato `"2025-I"` (con guión, no `-1`)

### ✅ Lo que el Backend Garantiza

- ✅ Validación automática de prerrequisitos
- ✅ Validación de límite de créditos por riesgo
- ✅ Detección de choques de horario
- ✅ Validación de cupos disponibles
- ✅ Validación de ventanas de calendario

**El frontend solo debe presentar la información y confiar en las validaciones del servidor.**

---

¿Necesitas ayuda con alguna implementación específica?
