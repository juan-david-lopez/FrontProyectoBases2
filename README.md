# 🎓 Sistema Académico Universidad del Quindío - Frontend

Sistema de gestión académica desarrollado con React + Vite, integrado con Oracle REST Data Services (ORDS).

---

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

El archivo `.env` ya está configurado con:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Si tu backend ORDS está en otro puerto, actualiza esta URL.

### 3. ⚠️ IMPORTANTE: Iniciar el Backend ORDS Primero

**Antes de iniciar el frontend, asegúrate de que el backend ORDS esté corriendo:**

```bash
# Verifica que ORDS esté corriendo en:
http://localhost:8080/ords/
```

📚 **¿Backend no está corriendo?** Lee: [`INICIAR_BACKEND.md`](./INICIAR_BACKEND.md)

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 📦 Scripts Disponibles

```bash
npm run dev       # Inicia el servidor de desarrollo
npm run build     # Compila para producción
npm run preview   # Previsualiza la compilación de producción
npm run lint      # Ejecuta ESLint
npm test          # Ejecuta tests (Jest)
npm run test:ui   # Ejecuta tests E2E (Cypress)
```

---

## 🔐 Credenciales de Acceso

### Estudiantes Nuevos
Las credenciales iniciales se generan automáticamente al crear un estudiante:

- **Usuario**: Correo institucional (`correo@universidad.edu`)
- **Contraseña**: Número de documento de identidad (sin tipo, solo números)

**Ejemplo:**
```
Usuario: juan.perez@universidad.edu
Contraseña: 1234567890
```

### Cambiar Contraseña
Los usuarios pueden cambiar su contraseña desde su perfil después del primer acceso.

---

## 📁 Estructura del Proyecto

```
Frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── context/         # Context API (Auth, UI)
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Páginas por rol
│   │   ├── auth/        # Login, recuperación
│   │   ├── estudiante/  # Dashboard, matrícula, notas
│   │   ├── docente/     # Calificaciones, grupos
│   │   └── admin/       # Gestión completa
│   ├── routes/          # Configuración de rutas
│   ├── services/        # Servicios API (10 servicios)
│   ├── utils/           # Utilidades (formatters)
│   └── styles/          # Estilos globales
├── .env                 # Variables de entorno
├── INTEGRACION_BACKEND.md    # Documentación técnica completa
├── INICIAR_BACKEND.md        # Guía para iniciar ORDS
└── RESUMEN_INTEGRACION.md    # Resumen de la integración
```

---

## 🎯 Roles del Sistema

| Rol | Ruta | Descripción |
|-----|------|-------------|
| `estudiante` | `/estudiante/*` | Matrícula, notas, historial académico |
| `docente` | `/docente/*` | Calificaciones, gestión de grupos |
| `administrador` | `/administrador/*` | Acceso completo al sistema |

---

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **React Router 6** - Enrutamiento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos
- **Vite** - Build tool
- **Recharts** - Gráficos
- **React Hook Form** - Formularios
- **Yup** - Validación de esquemas
- **Lucide React** - Iconos

---

## 🔌 Servicios API Implementados

El frontend está completamente integrado con 10 servicios:

1. **authService** - Autenticación y sesiones
2. **estudiantesService** - Gestión de estudiantes
3. **matriculasService** - Proceso de matrícula
4. **notasService** - Calificaciones y evaluaciones
5. **asignaturasService** - Gestión de asignaturas
6. **riesgoService** - Sistema de riesgo académico
7. **programasService** - Programas académicos
8. **docentesService** - Gestión de docentes
9. **reportesService** - 18 tipos de reportes
10. **axiosClient** - Cliente HTTP con interceptores

📚 **Documentación completa**: [`INTEGRACION_BACKEND.md`](./INTEGRACION_BACKEND.md)

---

## 🎨 Utilidades de Formateo

Se incluyen 30+ funciones de formateo en `src/utils/formatters.js`:

```javascript
import { 
  formatNota,      // Formato de notas (0.0-5.0)
  formatRiesgo,    // Descripción de riesgo académico
  formatDate,      // Fechas en español
  formatCreditos,  // Créditos con pluralización
  getNotaColor,    // Color según nota
  getRiesgoColor   // Color según riesgo
} from '@/utils/formatters';
```

---

## ⚠️ Solución de Problemas

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Causa:** El servidor backend ORDS no está corriendo.

**Solución:**
1. Inicia el servidor ORDS en `http://localhost:8080`
2. Lee la guía completa: [`INICIAR_BACKEND.md`](./INICIAR_BACKEND.md)

### Error: "The requested module does not provide an export named 'HttpResponse'"

**Causa:** MSW (Mock Service Worker) tiene una versión incompatible.

**Solución:** MSW ya está desactivado en `src/main.jsx`. Si persiste, reinicia el servidor:
```bash
# Ctrl+C para detener
npm run dev
```

### Error: CORS Policy

**Causa:** El backend no permite peticiones desde `http://localhost:5173`

**Solución:** Actualiza la configuración CORS en el backend ORDS para permitir el origen del frontend.

---

## 📚 Documentación Adicional

- [`INTEGRACION_BACKEND.md`](./INTEGRACION_BACKEND.md) - Documentación técnica completa de la integración
- [`INICIAR_BACKEND.md`](./INICIAR_BACKEND.md) - Guía para iniciar el servidor ORDS
- [`RESUMEN_INTEGRACION.md`](./RESUMEN_INTEGRACION.md) - Resumen ejecutivo de la integración

---

## 🧪 Testing

```bash
# Tests unitarios con Jest
npm test

# Tests E2E con Cypress
npm run test:ui
```

---

## 🏗️ Compilar para Producción

```bash
# Compilar
npm run build

# Previsualizar
npm run preview
```

Los archivos compilados estarán en `dist/`.

---

## 📝 Notas de Desarrollo

### MSW (Mock Service Worker)
Los mocks están **desactivados** por defecto. Para habilitarlos, edita `src/main.jsx` y descomenta el bloque de MSW.

### Variables de Entorno
- `VITE_API_BASE_URL` - URL base del backend ORDS (default: `http://localhost:8080`)

### Indicador de Estado del Backend
El frontend incluye un componente `BackendHealthCheck` que monitorea la conexión con el backend y muestra una alerta visual si está caído.

---

## 🤝 Contribuir

1. Crear una rama para tu feature
2. Hacer commit de los cambios
3. Hacer push a la rama
4. Crear un Pull Request

---

## 📞 Soporte

Para problemas o preguntas:
- Revisa la documentación en los archivos `.md`
- Verifica que el backend ORDS esté corriendo
- Consulta los logs de la consola del navegador

---

## 📄 Licencia

© 2025 Universidad del Quindío. Todos los derechos reservados.

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2, 2025
