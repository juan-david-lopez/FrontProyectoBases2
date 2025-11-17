# 📘 API REST - Sistema de Gestión Académica
## Documentación para Frontend

**Base URL:** `http://localhost:8080/ords/academico/`  
**Formato de Respuesta:** JSON  
**Codificación:** UTF-8  

---

## 📋 Tabla de Contenidos

1. [Autenticación](#1-autenticación)
2. [Estudiantes](#2-estudiantes)
3. [Matrículas](#3-matrículas)
4. [Registro de Materias (Estudiantes)](#4-registro-de-materias-estudiantes)
5. [Calificaciones](#5-calificaciones)
6. [Docentes](#6-docentes)
7. [Alertas y Reportes](#7-alertas-y-reportes)
8. [Códigos de Estado](#8-códigos-de-estado)

---

## 1. Autenticación

### 🔐 Login

**Endpoint:** `POST /auth/login`

**Descripción:** Autenticación de usuarios (estudiantes, docentes, administradores)

**Request Body:**
```json
{
  "email": "estudiante@uniquindio.edu.co",
  "password": "contraseña123"
}
```

**Response 200 (Éxito):**
```json
{
  "status": 200,
  "message": "Autenticación exitosa",
  "token": "Bearer_12345_20251117143025",
  "role": "ESTUDIANTE",
  "usuario_id": 12345,
  "usuario_nombre": "Juan Pérez",
  "usuario_codigo": "20191234567"
}
```

**Response 401 (Credenciales inválidas):**
```json
{
  "status": 401,
  "message": "Credenciales inválidas. Intentos restantes: 2"
}
```

**Response 423 (Cuenta bloqueada):**
```json
{
  "status": 423,
  "message": "Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador."
}
```

**Roles disponibles:**
- `ESTUDIANTE`
- `DOCENTE`
- `ADMINISTRADOR`

---

## 2. Estudiantes

### 📚 Listar Todos los Estudiantes

**Endpoint:** `GET /estudiantes/`

**Response 200:**
```json
{
  "items": [
    {
      "cod_estudiante": "20191234567",
      "cod_programa": "ING001",
      "tipo_documento": "CC",
      "num_documento": "1094123456",
      "primer_nombre": "Juan",
      "segundo_nombre": "Carlos",
      "primer_apellido": "Pérez",
      "segundo_apellido": "Gómez",
      "correo_institucional": "jperez@uniquindio.edu.co",
      "correo_personal": "juan.perez@gmail.com",
      "telefono": "3101234567",
      "direccion": "Calle 15 #20-30",
      "estado_estudiante": "ACTIVO",
      "fecha_ingreso": "2019-08-15T00:00:00Z"
    }
  ],
  "hasMore": true,
  "limit": 25,
  "offset": 0,
  "count": 25
}
```

### 👤 Obtener Estudiante por Código

**Endpoint:** `GET /estudiantes/:codigo`

**Ejemplo:** `GET /estudiantes/20191234567`

**Response 200:**
```json
{
  "cod_estudiante": "20191234567",
  "cod_programa": "ING001",
  "nombre_programa": "Ingeniería de Sistemas",
  "tipo_documento": "CC",
  "num_documento": "1094123456",
  "primer_nombre": "Juan",
  "segundo_nombre": "Carlos",
  "primer_apellido": "Pérez",
  "segundo_apellido": "Gómez",
  "correo_institucional": "jperez@uniquindio.edu.co",
  "correo_personal": "juan.perez@gmail.com",
  "telefono": "3101234567",
  "direccion": "Calle 15 #20-30",
  "fecha_nacimiento": "2001-05-20T00:00:00Z",
  "genero": "M",
  "estado_estudiante": "ACTIVO",
  "fecha_ingreso": "2019-08-15T00:00:00Z"
}
```

### ➕ Crear Nuevo Estudiante

**Endpoint:** `POST /estudiantes/`

**Request Body:**
```json
{
  "cod_programa": "ING001",
  "tipo_documento": "CC",
  "num_documento": "1094999888",
  "primer_nombre": "María",
  "segundo_nombre": "Fernanda",
  "primer_apellido": "López",
  "segundo_apellido": "Torres",
  "correo_institucional": "mlopez@uniquindio.edu.co",
  "correo_personal": "maria.lopez@gmail.com",
  "telefono": "3209876543",
  "direccion": "Carrera 10 #5-25",
  "fecha_nacimiento": "2002-03-15",
  "genero": "F"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Estudiante creado exitosamente",
  "cod_estudiante": "20251234568"
}
```

### ✏️ Actualizar Estudiante

**Endpoint:** `PUT /estudiantes/:codigo`

**Request Body:**
```json
{
  "correo_personal": "nuevo.correo@gmail.com",
  "telefono": "3159876543",
  "direccion": "Nueva dirección"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Estudiante actualizado exitosamente"
}
```

---

## 3. Matrículas

### 📝 Crear Nueva Matrícula

**Endpoint:** `POST /matriculas/`

**Descripción:** Crea una matrícula para un estudiante en un periodo académico

**Request Body:**
```json
{
  "cod_estudiante": "20191234567",
  "cod_periodo": "2025-1"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Matrícula creada exitosamente",
  "cod_matricula": 45678
}
```

### ➕ Agregar Asignatura a Matrícula

**Endpoint:** `POST /matriculas/:cod_matricula/asignaturas`

**Ejemplo:** `POST /matriculas/45678/asignaturas`

**Request Body:**
```json
{
  "cod_grupo": 12345
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Asignatura agregada exitosamente a la matrícula"
}
```

**Response 400 (Error):**
```json
{
  "success": false,
  "error": "El estudiante no cumple con los prerrequisitos"
}
```

### 📋 Obtener Detalle de Matrícula

**Endpoint:** `GET /matriculas/:cod_matricula`

**Response 200:**
```json
{
  "cod_matricula": 45678,
  "cod_estudiante": "20191234567",
  "nombre_estudiante": "Juan Pérez",
  "cod_periodo": "2025-1",
  "nombre_periodo": "Primer Semestre 2025",
  "fecha_matricula": "2025-01-15T10:30:00Z",
  "estado_matricula": "ACTIVA",
  "total_creditos": 18,
  "asignaturas": [
    {
      "cod_detalle_matricula": 78901,
      "cod_grupo": 12345,
      "codigo_grupo": "G01",
      "cod_asignatura": "SIS301",
      "nombre_asignatura": "Bases de Datos II",
      "creditos": 3,
      "nombre_docente": "Dr. Carlos Ruiz",
      "estado_detalle": "ACTIVO"
    }
  ]
}
```

### 📊 Obtener Matrículas del Estudiante

**Endpoint:** `GET /matriculas/estudiante/:cod_estudiante`

**Response 200:**
```json
{
  "items": [
    {
      "cod_matricula": 45678,
      "cod_periodo": "2025-1",
      "nombre_periodo": "Primer Semestre 2025",
      "fecha_matricula": "2025-01-15T10:30:00Z",
      "estado_matricula": "ACTIVA",
      "total_creditos": 18,
      "total_asignaturas": 6
    }
  ]
}
```

---

## 4. Registro de Materias (Estudiantes)

### 📚 Obtener Asignaturas Disponibles

**Endpoint:** `GET /registro-materias/disponibles/:cod_estudiante`

**Descripción:** Retorna las asignaturas que el estudiante puede matricular (valida prerrequisitos, riesgo académico, cupos)

**Ejemplo:** `GET /registro-materias/disponibles/20191234567`

**Response 200:**
```json
[
  {
    "cod_asignatura": "SIS401",
    "nombre_asignatura": "Inteligencia Artificial",
    "creditos": 3,
    "nivel": 8,
    "tipo": "OBLIGATORIA",
    "tiene_prerrequisitos": 1,
    "prerrequisitos": "Estructuras de Datos, Algoritmos",
    "grupos_disponibles": 2
  },
  {
    "cod_asignatura": "SIS402",
    "nombre_asignatura": "Desarrollo Web",
    "creditos": 4,
    "nivel": 8,
    "tipo": "OBLIGATORIA",
    "tiene_prerrequisitos": 0,
    "prerrequisitos": null,
    "grupos_disponibles": 3
  }
]
```

### 👥 Obtener Grupos de una Asignatura

**Endpoint:** `GET /registro-materias/grupos/:cod_asignatura`

**Ejemplo:** `GET /registro-materias/grupos/SIS401`

**Response 200:**
```json
[
  {
    "cod_grupo": 12345,
    "codigo_grupo": "G01",
    "cod_docente": "DOC001",
    "nombre_docente": "Dr. Carlos Ruiz",
    "cupo_maximo": 30,
    "cupo_actual": 25,
    "cupos_disponibles": 5,
    "estado": "ACTIVO",
    "horarios": [
      {
        "dia_semana": "LUNES",
        "hora_inicio": "14:00",
        "hora_fin": "16:00",
        "tipo_clase": "TEORICA",
        "aula": "B-301"
      },
      {
        "dia_semana": "MIERCOLES",
        "hora_inicio": "14:00",
        "hora_fin": "16:00",
        "tipo_clase": "PRACTICA",
        "aula": "LAB-102"
      }
    ]
  }
]
```

### ✅ Matricular Asignatura

**Endpoint:** `POST /registro-materias/matricular`

**Request Body:**
```json
{
  "cod_estudiante": "20191234567",
  "cod_grupo": 12345
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Asignatura matriculada exitosamente",
  "cod_detalle_matricula": 78901
}
```

**Response 400 (Error de validación):**
```json
{
  "success": false,
  "error": "No hay cupos disponibles en este grupo"
}
```

### 🗑️ Cancelar Asignatura

**Endpoint:** `DELETE /registro-materias/cancelar/:cod_detalle_matricula`

**Response 200:**
```json
{
  "success": true,
  "message": "Asignatura cancelada exitosamente"
}
```

---

## 5. Calificaciones

### ➕ Registrar Calificación

**Endpoint:** `POST /calificaciones/`

**Request Body:**
```json
{
  "cod_detalle": 78901,
  "cod_actividad": 5,
  "nota": 4.5,
  "observaciones": "Excelente trabajo"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Calificación registrada exitosamente"
}
```

### 📊 Obtener Notas del Estudiante

**Endpoint:** `GET /calificaciones/estudiante/:cod_estudiante`

**Ejemplo:** `GET /calificaciones/estudiante/20191234567`

**Response 200:**
```json
{
  "items": [
    {
      "cod_nota_definitiva": 1001,
      "nombre_periodo": "Primer Semestre 2024",
      "cod_asignatura": "SIS301",
      "nombre_asignatura": "Bases de Datos II",
      "nota_final": 4.2,
      "resultado": "APROBADO",
      "fecha_registro": "2024-06-15T15:30:00Z"
    },
    {
      "cod_nota_definitiva": 1002,
      "nombre_periodo": "Segundo Semestre 2024",
      "cod_asignatura": "SIS302",
      "nombre_asignatura": "Arquitectura de Software",
      "nota_final": 3.8,
      "resultado": "APROBADO",
      "fecha_registro": "2024-12-10T10:00:00Z"
    }
  ]
}
```

### 👥 Obtener Notas de un Grupo

**Endpoint:** `GET /calificaciones/grupo/:cod_grupo`

**Ejemplo:** `GET /calificaciones/grupo/12345`

**Descripción:** Lista todos los estudiantes de un grupo con sus calificaciones detalladas

**Response 200:**
```json
{
  "items": [
    {
      "cod_estudiante": "20191234567",
      "estudiante": "Juan Pérez",
      "nota_final": 4.2,
      "resultado": "APROBADO",
      "detalle_calificaciones": [
        {
          "actividad": "Parcial 1",
          "nota": 4.0,
          "porcentaje": 30,
          "fecha": "2024-03-15T00:00:00Z"
        },
        {
          "actividad": "Parcial 2",
          "nota": 4.5,
          "porcentaje": 30,
          "fecha": "2024-05-10T00:00:00Z"
        },
        {
          "actividad": "Proyecto Final",
          "nota": 4.3,
          "porcentaje": 40,
          "fecha": "2024-06-01T00:00:00Z"
        }
      ]
    }
  ]
}
```

### ✏️ Actualizar Calificación

**Endpoint:** `PUT /calificaciones/:cod_calificacion`

**Request Body:**
```json
{
  "nota": 4.8,
  "observaciones": "Corrección por error de digitación"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Calificación actualizada exitosamente"
}
```

---

## 6. Docentes

### 📚 Obtener Grupos del Docente

**Endpoint:** `GET /docente/mis-grupos/:cod_docente`

**Ejemplo:** `GET /docente/mis-grupos/DOC001`

**Response 200:**
```json
[
  {
    "cod_grupo": 12345,
    "codigo_grupo": "G01",
    "cod_asignatura": "SIS301",
    "asignatura": "Bases de Datos II",
    "creditos": 3,
    "periodo": "Primer Semestre 2025",
    "cod_periodo": "2025-1",
    "cupo_maximo": 30,
    "cupo_actual": 28,
    "estudiantes_activos": 28,
    "estado": "ACTIVO",
    "horarios": [
      {
        "dia_semana": "LUNES",
        "hora_inicio": "14:00",
        "hora_fin": "16:00",
        "tipo_clase": "TEORICA",
        "aula": "B-301"
      }
    ]
  }
]
```

### 👥 Listar Estudiantes de un Grupo

**Endpoint:** `GET /docente/estudiantes/:cod_grupo`

**Ejemplo:** `GET /docente/estudiantes/12345`

**Response 200:**
```json
[
  {
    "cod_estudiante": "20191234567",
    "nombre_completo": "Juan Pérez",
    "correo_institucional": "jperez@uniquindio.edu.co",
    "riesgo_academico": "BAJO",
    "cod_detalle_matricula": 78901,
    "estado_detalle": "ACTIVO",
    "calificaciones": [
      {
        "cod_calificacion": 5001,
        "actividad": "Parcial 1",
        "porcentaje": 30,
        "nota": 4.0,
        "fecha_registro": "2025-03-15",
        "observaciones": null
      }
    ],
    "nota_definitiva": 4.2,
    "resultado": "APROBADO"
  }
]
```

### 📝 Registrar Calificación (Docente)

**Endpoint:** `POST /docente/registrar-calificacion`

**Request Body:**
```json
{
  "cod_detalle_matricula": 78901,
  "cod_tipo_actividad": 1,
  "nota": 4.5,
  "observaciones": "Buen desempeño"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Calificación registrada exitosamente",
  "cod_calificacion": 5002
}
```

### 📊 Estadísticas del Grupo

**Endpoint:** `GET /docente/estadisticas/:cod_grupo`

**Response 200:**
```json
{
  "cod_grupo": 12345,
  "total_estudiantes": 28,
  "promedio_grupo": 3.8,
  "aprobados": 22,
  "reprobados": 4,
  "en_curso": 2,
  "tasa_aprobacion": 78.57,
  "distribucion_notas": {
    "excelente": 8,
    "sobresaliente": 10,
    "aceptable": 6,
    "insuficiente": 4
  }
}
```

---

## 7. Alertas y Reportes

### 🚨 Estudiantes en Riesgo Académico

**Endpoint:** `GET /alertas/riesgo-academico`

**Descripción:** Lista todos los estudiantes con riesgo académico MEDIO o ALTO

**Response 200:**
```json
[
  {
    "cod_estudiante": "20201234567",
    "nombre": "Carlos Martínez",
    "correo": "cmartinez@uniquindio.edu.co",
    "riesgo": "ALTO",
    "programa": "Ingeniería de Sistemas",
    "promedio_acumulado": 2.8,
    "asignaturas_reprobadas": 5,
    "creditos_matriculados": 12
  },
  {
    "cod_estudiante": "20191234568",
    "nombre": "Ana López",
    "correo": "alopez@uniquindio.edu.co",
    "riesgo": "MEDIO",
    "programa": "Ingeniería Civil",
    "promedio_acumulado": 3.2,
    "asignaturas_reprobadas": 2,
    "creditos_matriculados": 16
  }
]
```

### 📊 Estadísticas del Programa

**Endpoint:** `GET /alertas/estadisticas-programa/:cod_programa`

**Ejemplo:** `GET /alertas/estadisticas-programa/ING001`

**Response 200:**
```json
{
  "cod_programa": "ING001",
  "nombre_programa": "Ingeniería de Sistemas",
  "total_estudiantes_activos": 450,
  "promedio_programa": 3.7,
  "tasa_retencion": 87.5,
  "estudiantes_riesgo_alto": 15,
  "estudiantes_riesgo_medio": 42,
  "estudiantes_riesgo_bajo": 393,
  "distribucion_por_semestre": {
    "1": 85,
    "2": 78,
    "3": 72,
    "4": 65,
    "5": 58,
    "6": 48,
    "7": 24,
    "8": 12,
    "9": 5,
    "10": 3
  }
}
```

### 📈 Reporte de Asistencia

**Endpoint:** `GET /alertas/asistencia/:cod_grupo`

**Response 200:**
```json
{
  "cod_grupo": 12345,
  "asignatura": "Bases de Datos II",
  "total_estudiantes": 28,
  "porcentaje_asistencia_promedio": 85.5,
  "alertas": [
    {
      "cod_estudiante": "20191234567",
      "nombre": "Juan Pérez",
      "porcentaje_asistencia": 55.0,
      "estado": "ALERTA",
      "mensaje": "Asistencia por debajo del 60% requerido"
    }
  ]
}
```

### 🗓️ Ventanas de Calendario Académico

**Endpoint:** `GET /alertas/ventanas-calendario`

**Descripción:** Retorna las ventanas académicas activas o próximas (matrícula, adiciones, retiros, etc.)

**Response 200:**
```json
[
  {
    "cod_ventana": 101,
    "tipo": "MATRICULA",
    "nombre": "Matrícula Ordinaria",
    "descripcion": "Período de matrícula regular para estudiantes",
    "fecha_inicio": "2025-01-10 08:00:00",
    "fecha_fin": "2025-01-20 17:00:00",
    "estado": "ACTIVA",
    "periodo": "Primer Semestre 2025",
    "cod_periodo": "2025-1",
    "activa_ahora": "SI",
    "dias_restantes": 3
  },
  {
    "cod_ventana": 102,
    "tipo": "ADICIONES",
    "nombre": "Adición de Asignaturas",
    "descripcion": "Período para agregar asignaturas a la matrícula",
    "fecha_inicio": "2025-01-21 08:00:00",
    "fecha_fin": "2025-01-25 17:00:00",
    "estado": "ACTIVA",
    "periodo": "Primer Semestre 2025",
    "cod_periodo": "2025-1",
    "activa_ahora": "NO",
    "dias_restantes": 11
  }
]
```

**Tipos de ventanas:**
- `MATRICULA` - Período de matrícula ordinaria
- `ADICIONES` - Agregar asignaturas
- `RETIROS` - Cancelar asignaturas
- `CALIFICACIONES` - Ingreso de notas
- `RECLAMOS` - Reclamos de calificaciones

### 📄 Reporte de Historial Académico

**Endpoint:** `GET /alertas/historial-academico/:cod_estudiante`

**Response 200:**
```json
{
  "cod_estudiante": "20191234567",
  "nombre_estudiante": "Juan Carlos Pérez Gómez",
  "programa": "Ingeniería de Sistemas",
  "fecha_ingreso": "2019-08-15",
  "estado": "ACTIVO",
  "promedio_acumulado": 3.85,
  "creditos_aprobados": 108,
  "creditos_totales_programa": 150,
  "porcentaje_avance": 72.0,
  "historial": [
    {
      "cod_historial": 1001,
      "periodo": "2024-1",
      "cod_asignatura": "SIS301",
      "nombre_asignatura": "Bases de Datos II",
      "creditos": 3,
      "nota_final": 4.2,
      "resultado": "APROBADO",
      "intento": 1,
      "docente": "Dr. Carlos Ruiz"
    }
  ]
}
```

### 📊 Reporte de Rendimiento Académico

**Endpoint:** `GET /alertas/rendimiento/:cod_estudiante/:cod_periodo`

**Response 200:**
```json
{
  "estudiante": {
    "cod_estudiante": "20191234567",
    "nombre": "Juan Pérez",
    "programa": "Ingeniería de Sistemas"
  },
  "periodo": {
    "cod_periodo": "2024-1",
    "nombre": "Primer Semestre 2024"
  },
  "resumen": {
    "total_asignaturas": 6,
    "creditos_matriculados": 18,
    "promedio_periodo": 4.1,
    "aprobadas": 5,
    "reprobadas": 1,
    "en_curso": 0
  },
  "asignaturas": [
    {
      "cod_asignatura": "SIS301",
      "nombre": "Bases de Datos II",
      "creditos": 3,
      "nota_final": 4.2,
      "resultado": "APROBADO"
    }
  ],
  "comparacion": {
    "promedio_anterior": 3.8,
    "mejora": 0.3,
    "tendencia": "POSITIVA"
  }
}
```

---

## 8. Programas y Períodos Académicos

### 📚 Listar Programas Académicos

**Endpoint:** `GET /programas/`

**Response 200:**
```json
{
  "items": [
    {
      "cod_programa": "ING001",
      "nombre_programa": "Ingeniería de Sistemas y Computación",
      "facultad": "Ingeniería",
      "nivel_formacion": "PREGRADO",
      "titulo_otorgado": "Ingeniero de Sistemas y Computación",
      "modalidad": "PRESENCIAL",
      "creditos_totales": 150,
      "duracion_semestres": 10,
      "estado": "ACTIVO"
    }
  ]
}
```

### 🎓 Obtener Programa por Código

**Endpoint:** `GET /programas/:cod_programa`

**Response 200:**
```json
{
  "cod_programa": "ING001",
  "nombre_programa": "Ingeniería de Sistemas y Computación",
  "facultad": "Ingeniería",
  "nivel_formacion": "PREGRADO",
  "titulo_otorgado": "Ingeniero de Sistemas y Computación",
  "modalidad": "PRESENCIAL",
  "creditos_totales": 150,
  "duracion_semestres": 10,
  "descripcion": "Programa orientado al desarrollo de software y sistemas de información",
  "estado": "ACTIVO",
  "fecha_creacion": "2010-01-15T00:00:00Z",
  "total_estudiantes_activos": 450,
  "total_docentes": 35
}
```

### 📅 Listar Períodos Académicos

**Endpoint:** `GET /periodos/`

**Response 200:**
```json
{
  "items": [
    {
      "cod_periodo": "2025-1",
      "nombre_periodo": "Primer Semestre 2025",
      "anio": 2025,
      "periodo": 1,
      "fecha_inicio": "2025-01-15T00:00:00Z",
      "fecha_fin": "2025-06-30T00:00:00Z",
      "estado": "ACTIVO"
    },
    {
      "cod_periodo": "2024-2",
      "nombre_periodo": "Segundo Semestre 2024",
      "anio": 2024,
      "periodo": 2,
      "fecha_inicio": "2024-08-01T00:00:00Z",
      "fecha_fin": "2024-12-15T00:00:00Z",
      "estado": "CERRADO"
    }
  ]
}
```

### 📖 Obtener Período Activo

**Endpoint:** `GET /periodos/activo`

**Response 200:**
```json
{
  "cod_periodo": "2025-1",
  "nombre_periodo": "Primer Semestre 2025",
  "anio": 2025,
  "periodo": 1,
  "fecha_inicio": "2025-01-15T00:00:00Z",
  "fecha_fin": "2025-06-30T00:00:00Z",
  "estado": "ACTIVO",
  "ventanas_activas": [
    {
      "tipo": "MATRICULA",
      "nombre": "Matrícula Ordinaria",
      "fecha_fin": "2025-01-20T17:00:00Z",
      "dias_restantes": 3
    }
  ]
}
```

### 👨‍🏫 Listar Todos los Docentes

**Endpoint:** `GET /docentes/`

**Response 200:**
```json
{
  "items": [
    {
      "cod_docente": "DOC001",
      "tipo_documento": "CC",
      "num_documento": "1094888777",
      "primer_nombre": "Carlos",
      "primer_apellido": "Ruiz",
      "correo_institucional": "cruiz@uniquindio.edu.co",
      "telefono": "3151234567",
      "tipo_vinculacion": "PLANTA",
      "nivel_estudios": "DOCTORADO",
      "estado": "ACTIVO"
    }
  ]
}
```

### 📋 Asignaturas por Programa

**Endpoint:** `GET /asignaturas/programa/:cod_programa`

**Response 200:**
```json
{
  "items": [
    {
      "cod_asignatura": "SIS301",
      "nombre_asignatura": "Bases de Datos II",
      "creditos": 3,
      "nivel_asignatura": 6,
      "tipo_asignatura": "OBLIGATORIA",
      "horas_teoricas": 3,
      "horas_practicas": 2,
      "descripcion": "Diseño y administración de bases de datos relacionales",
      "estado": "ACTIVO"
    }
  ]
}
```

---

## 9. Códigos de Estado

### Códigos HTTP Utilizados

| Código | Significado | Uso |
|--------|-------------|-----|
| **200** | OK | Solicitud exitosa (GET, PUT) |
| **201** | Created | Recurso creado exitosamente (POST) |
| **400** | Bad Request | Error en los datos enviados |
| **401** | Unauthorized | Credenciales inválidas |
| **403** | Forbidden | No tiene permisos |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: duplicados) |
| **423** | Locked | Cuenta bloqueada |
| **500** | Internal Server Error | Error del servidor |

### Estructura de Errores

**Formato estándar de error:**
```json
{
  "success": false,
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "details": {
    "campo": "mensaje específico"
  }
}
```

---

## 🔧 Implementación en React + Vite

### 📦 Instalación de Dependencias

```bash
npm install axios react-router-dom
# o
yarn add axios react-router-dom
```

### ⚙️ Configuración de Axios

**Archivo: `src/config/api.js`**

```javascript
import axios from 'axios';

// Configuración base de la API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/ords/academico',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 423) {
      // Cuenta bloqueada
      console.error('Cuenta bloqueada');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 🔐 Context de Autenticación

**Archivo: `src/context/AuthContext.jsx`**

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      const userData = {
        id: data.usuario_id,
        nombre: data.usuario_nombre,
        codigo: data.usuario_codigo,
        role: data.role,
        token: data.token,
      };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### 🎣 Custom Hooks para API

**Archivo: `src/hooks/useEstudiantes.js`**

```javascript
import { useState, useEffect } from 'react';
import api from '../config/api';

export const useEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEstudiantes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/estudiantes/');
      setEstudiantes(data.items || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const getEstudiante = async (codigo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/estudiantes/${codigo}`);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al obtener estudiante';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const createEstudiante = async (estudianteData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/estudiantes/', estudianteData);
      await fetchEstudiantes(); // Recargar lista
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al crear estudiante';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateEstudiante = async (codigo, estudianteData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/estudiantes/${codigo}`, estudianteData);
      await fetchEstudiantes(); // Recargar lista
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al actualizar estudiante';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudiantes();
  }, []);

  return {
    estudiantes,
    loading,
    error,
    fetchEstudiantes,
    getEstudiante,
    createEstudiante,
    updateEstudiante,
  };
};
```

**Archivo: `src/hooks/useMatriculas.js`**

```javascript
import { useState } from 'react';
import api from '../config/api';

export const useMatriculas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const crearMatricula = async (codEstudiante, codPeriodo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/matriculas/', {
        cod_estudiante: codEstudiante,
        cod_periodo: codPeriodo,
      });
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al crear matrícula';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const agregarAsignatura = async (codMatricula, codGrupo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(
        `/matriculas/${codMatricula}/asignaturas`,
        { cod_grupo: codGrupo }
      );
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al agregar asignatura';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getDetalleMatricula = async (codMatricula) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/matriculas/${codMatricula}`);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al obtener matrícula';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    crearMatricula,
    agregarAsignatura,
    getDetalleMatricula,
  };
};
```

**Archivo: `src/hooks/useRegistroMaterias.js`**

```javascript
import { useState, useEffect } from 'react';
import api from '../config/api';

export const useRegistroMaterias = (codEstudiante) => {
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAsignaturasDisponibles = async () => {
    if (!codEstudiante) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/registro-materias/disponibles/${codEstudiante}`);
      setAsignaturasDisponibles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar asignaturas');
    } finally {
      setLoading(false);
    }
  };

  const getGruposAsignatura = async (codAsignatura) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/registro-materias/grupos/${codAsignatura}`);
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar grupos';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const matricularAsignatura = async (codGrupo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/registro-materias/matricular', {
        cod_estudiante: codEstudiante,
        cod_grupo: codGrupo,
      });
      await fetchAsignaturasDisponibles(); // Actualizar lista
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al matricular';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const cancelarAsignatura = async (codDetalleMatricula) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.delete(
        `/registro-materias/cancelar/${codDetalleMatricula}`
      );
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cancelar';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsignaturasDisponibles();
  }, [codEstudiante]);

  return {
    asignaturasDisponibles,
    loading,
    error,
    fetchAsignaturasDisponibles,
    getGruposAsignatura,
    matricularAsignatura,
    cancelarAsignatura,
  };
};
```

**Archivo: `src/hooks/useCalificaciones.js`**

```javascript
import { useState, useEffect } from 'react';
import api from '../config/api';

export const useCalificaciones = (codEstudiante) => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCalificaciones = async () => {
    if (!codEstudiante) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/calificaciones/estudiante/${codEstudiante}`);
      setCalificaciones(data.items || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar calificaciones');
    } finally {
      setLoading(false);
    }
  };

  const getCalificacionesGrupo = async (codGrupo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/calificaciones/grupo/${codGrupo}`);
      return { success: true, data: data.items || [] };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar calificaciones del grupo';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const registrarCalificacion = async (calificacionData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/calificaciones/', calificacionData);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al registrar calificación';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const actualizarCalificacion = async (codCalificacion, calificacionData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put(`/calificaciones/${codCalificacion}`, calificacionData);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al actualizar calificación';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalificaciones();
  }, [codEstudiante]);

  return {
    calificaciones,
    loading,
    error,
    fetchCalificaciones,
    getCalificacionesGrupo,
    registrarCalificacion,
    actualizarCalificacion,
  };
};
```

**Archivo: `src/hooks/useDocente.js`**

```javascript
import { useState, useEffect } from 'react';
import api from '../config/api';

export const useDocente = (codDocente) => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMisGrupos = async () => {
    if (!codDocente) return;
    
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/docente/mis-grupos/${codDocente}`);
      setGrupos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar grupos');
    } finally {
      setLoading(false);
    }
  };

  const getEstudiantesGrupo = async (codGrupo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/docente/estudiantes/${codGrupo}`);
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar estudiantes';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const registrarCalificacion = async (calificacionData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/docente/registrar-calificacion', calificacionData);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al registrar calificación';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getEstadisticasGrupo = async (codGrupo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/docente/estadisticas/${codGrupo}`);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar estadísticas';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMisGrupos();
  }, [codDocente]);

  return {
    grupos,
    loading,
    error,
    fetchMisGrupos,
    getEstudiantesGrupo,
    registrarCalificacion,
    getEstadisticasGrupo,
  };
};
```

**Archivo: `src/hooks/useAlertas.js`**

```javascript
import { useState, useEffect } from 'react';
import api from '../config/api';

export const useAlertas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEstudiantesRiesgo = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/alertas/riesgo-academico');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar alertas';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getVentanasCalendario = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/alertas/ventanas-calendario');
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar ventanas';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getHistorialAcademico = async (codEstudiante) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/alertas/historial-academico/${codEstudiante}`);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar historial';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getRendimientoAcademico = async (codEstudiante, codPeriodo) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/alertas/rendimiento/${codEstudiante}/${codPeriodo}`);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar rendimiento';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getEstudiantesRiesgo,
    getVentanasCalendario,
    getHistorialAcademico,
    getRendimientoAcademico,
  };
};
```

**Archivo: `src/hooks/useProgramas.js`**

```javascript
import { useState, useEffect } from 'react';
import api from '../config/api';

export const useProgramas = () => {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProgramas = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/programas/');
      setProgramas(data.items || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar programas');
    } finally {
      setLoading(false);
    }
  };

  const getPrograma = async (codPrograma) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/programas/${codPrograma}`);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar programa';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramas();
  }, []);

  return {
    programas,
    loading,
    error,
    fetchProgramas,
    getPrograma,
  };
};
```

**Archivo: `src/hooks/usePeriodos.js`**

```javascript
import { useState, useEffect } from 'react';
import api from '../config/api';

export const usePeriodos = () => {
  const [periodos, setPeriodos] = useState([]);
  const [periodoActivo, setPeriodoActivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPeriodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/periodos/');
      setPeriodos(data.items || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar períodos');
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodoActivo = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/periodos/activo');
      setPeriodoActivo(data);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al cargar período activo';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodos();
    fetchPeriodoActivo();
  }, []);

  return {
    periodos,
    periodoActivo,
    loading,
    error,
    fetchPeriodos,
    fetchPeriodoActivo,
  };
};
```

### 📄 Ejemplo de Componentes

**Archivo: `src/pages/Login.jsx`**

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Redirigir según el rol
      switch (result.data.role) {
        case 'ESTUDIANTE':
          navigate('/estudiante/dashboard');
          break;
        case 'DOCENTE':
          navigate('/docente/dashboard');
          break;
        case 'ADMINISTRADOR':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Sistema de Gestión Académica</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="email"
          placeholder="Correo institucional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

**Archivo: `src/pages/RegistroMaterias.jsx`**

```jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRegistroMaterias } from '../hooks/useRegistroMaterias';

const RegistroMaterias = () => {
  const { user } = useAuth();
  const {
    asignaturasDisponibles,
    loading,
    error,
    getGruposAsignatura,
    matricularAsignatura,
  } = useRegistroMaterias(user?.codigo);

  const [selectedAsignatura, setSelectedAsignatura] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const handleVerGrupos = async (asignatura) => {
    setSelectedAsignatura(asignatura);
    const result = await getGruposAsignatura(asignatura.cod_asignatura);
    
    if (result.success) {
      setGrupos(result.data);
    } else {
      setMensaje(result.error);
    }
  };

  const handleMatricular = async (codGrupo) => {
    const result = await matricularAsignatura(codGrupo);
    
    if (result.success) {
      setMensaje('✅ Asignatura matriculada exitosamente');
      setSelectedAsignatura(null);
      setGrupos([]);
    } else {
      setMensaje(`❌ ${result.error}`);
    }
  };

  if (loading) return <div>Cargando asignaturas disponibles...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="registro-materias">
      <h1>Registro de Materias</h1>
      
      {mensaje && <div className="mensaje">{mensaje}</div>}

      <div className="asignaturas-grid">
        {asignaturasDisponibles.map((asignatura) => (
          <div key={asignatura.cod_asignatura} className="asignatura-card">
            <h3>{asignatura.nombre_asignatura}</h3>
            <p>Créditos: {asignatura.creditos}</p>
            <p>Nivel: {asignatura.nivel}</p>
            
            {asignatura.tiene_prerrequisitos > 0 && (
              <p className="prerrequisitos">
                Prerrequisitos: {asignatura.prerrequisitos}
              </p>
            )}
            
            <p>Grupos disponibles: {asignatura.grupos_disponibles}</p>
            
            <button onClick={() => handleVerGrupos(asignatura)}>
              Ver Grupos
            </button>
          </div>
        ))}
      </div>

      {selectedAsignatura && grupos.length > 0 && (
        <div className="grupos-modal">
          <h2>Grupos - {selectedAsignatura.nombre_asignatura}</h2>
          
          {grupos.map((grupo) => (
            <div key={grupo.cod_grupo} className="grupo-card">
              <h4>Grupo {grupo.codigo_grupo}</h4>
              <p>Docente: {grupo.nombre_docente}</p>
              <p>Cupos: {grupo.cupos_disponibles}/{grupo.cupo_maximo}</p>
              
              <div className="horarios">
                <h5>Horarios:</h5>
                {grupo.horarios?.map((horario, idx) => (
                  <p key={idx}>
                    {horario.dia_semana}: {horario.hora_inicio} - {horario.hora_fin}
                    {' '}({horario.tipo_clase}) - {horario.aula}
                  </p>
                ))}
              </div>
              
              <button
                onClick={() => handleMatricular(grupo.cod_grupo)}
                disabled={grupo.cupos_disponibles === 0}
              >
                {grupo.cupos_disponibles > 0 ? 'Matricular' : 'Sin Cupos'}
              </button>
            </div>
          ))}
          
          <button onClick={() => setSelectedAsignatura(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default RegistroMaterias;
```

**Archivo: `src/pages/CalificacionesEstudiante.jsx`**

```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const CalificacionesEstudiante = () => {
  const { user } = useAuth();
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const { data } = await api.get(`/calificaciones/estudiante/${user.codigo}`);
        setCalificaciones(data.items || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar calificaciones');
      } finally {
        setLoading(false);
      }
    };

    if (user?.codigo) {
      fetchCalificaciones();
    }
  }, [user]);

  if (loading) return <div>Cargando calificaciones...</div>;
  if (error) return <div className="error">{error}</div>;

  // Calcular promedio acumulado
  const promedioAcumulado = calificaciones.length > 0
    ? (calificaciones.reduce((sum, c) => sum + c.nota_final, 0) / calificaciones.length).toFixed(2)
    : 0;

  return (
    <div className="calificaciones-estudiante">
      <h1>Mis Calificaciones</h1>
      
      <div className="resumen">
        <h2>Promedio Acumulado: {promedioAcumulado}</h2>
        <p>Total de asignaturas cursadas: {calificaciones.length}</p>
        <p>
          Aprobadas: {calificaciones.filter(c => c.resultado === 'APROBADO').length}
        </p>
      </div>

      <table className="tabla-calificaciones">
        <thead>
          <tr>
            <th>Período</th>
            <th>Código</th>
            <th>Asignatura</th>
            <th>Nota Final</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {calificaciones.map((cal) => (
            <tr key={cal.cod_nota_definitiva}>
              <td>{cal.nombre_periodo}</td>
              <td>{cal.cod_asignatura}</td>
              <td>{cal.nombre_asignatura}</td>
              <td className={cal.nota_final >= 3.0 ? 'aprobado' : 'reprobado'}>
                {cal.nota_final.toFixed(1)}
              </td>
              <td>
                <span className={`badge ${cal.resultado.toLowerCase()}`}>
                  {cal.resultado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalificacionesEstudiante;
```

### 🛣️ Configuración de Rutas

**Archivo: `src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Páginas
import Login from './pages/Login';
import EstudianteDashboard from './pages/EstudianteDashboard';
import RegistroMaterias from './pages/RegistroMaterias';
import CalificacionesEstudiante from './pages/CalificacionesEstudiante';
import DocenteDashboard from './pages/DocenteDashboard';

// Componente de ruta protegida
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Rutas de Estudiante */}
          <Route
            path="/estudiante/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
                <EstudianteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estudiante/registro-materias"
            element={
              <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
                <RegistroMaterias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estudiante/calificaciones"
            element={
              <ProtectedRoute allowedRoles={['ESTUDIANTE']}>
                <CalificacionesEstudiante />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de Docente */}
          <Route
            path="/docente/dashboard"
            element={
              <ProtectedRoute allowedRoles={['DOCENTE']}>
                <DocenteDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

### 🌍 Variables de Entorno

**Archivo: `.env`**

```env
VITE_API_URL=http://localhost:8080/ords/academico
```

**Archivo: `.env.production`**

```env
VITE_API_URL=https://api.uniquindio.edu.co/ords/academico
```

### 📁 Estructura de Proyecto Recomendada

```
src/
├── config/
│   └── api.js              # Configuración de Axios
├── context/
│   └── AuthContext.jsx     # Context de autenticación
├── hooks/
│   ├── useEstudiantes.js
│   ├── useMatriculas.js
│   ├── useRegistroMaterias.js
│   ├── useCalificaciones.js
│   ├── useDocente.js
│   ├── useAlertas.js
│   ├── useProgramas.js
│   └── usePeriodos.js
├── pages/
│   ├── Login.jsx
│   ├── EstudianteDashboard.jsx
│   ├── RegistroMaterias.jsx
│   ├── CalificacionesEstudiante.jsx
│   ├── DocenteDashboard.jsx
│   └── AdminDashboard.jsx
├── components/
│   ├── Navbar.jsx
│   ├── AsignaturaCard.jsx
│   ├── GrupoCard.jsx
│   ├── TablaCalificaciones.jsx
│   ├── AlertaCard.jsx
│   └── ProtectedRoute.jsx
├── utils/
│   ├── formatters.js       # Funciones auxiliares
│   ├── validators.js       # Validaciones
│   └── constants.js        # Constantes
├── styles/
│   └── main.css
├── App.jsx
└── main.jsx
```

### 🛠️ Utilidades y Helpers

**Archivo: `src/utils/formatters.js`**

```javascript
/**
 * Formatea un nombre completo desde el objeto estudiante/docente
 */
export const formatNombreCompleto = (persona) => {
  const partes = [
    persona.primer_nombre,
    persona.segundo_nombre,
    persona.primer_apellido,
    persona.segundo_apellido,
  ].filter(Boolean);
  
  return partes.join(' ');
};

/**
 * Formatea una fecha ISO a formato legible
 */
export const formatFecha = (fechaISO, incluirHora = false) => {
  if (!fechaISO) return '-';
  
  const fecha = new Date(fechaISO);
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  if (incluirHora) {
    opciones.hour = '2-digit';
    opciones.minute = '2-digit';
  }
  
  return fecha.toLocaleDateString('es-CO', opciones);
};

/**
 * Formatea una nota con un decimal
 */
export const formatNota = (nota) => {
  if (nota === null || nota === undefined) return '-';
  return Number(nota).toFixed(1);
};

/**
 * Determina el estado de una nota (aprobado/reprobado)
 */
export const getEstadoNota = (nota, notaMinima = 3.0) => {
  if (nota === null || nota === undefined) return 'pendiente';
  return nota >= notaMinima ? 'aprobado' : 'reprobado';
};

/**
 * Calcula el promedio de un array de notas
 */
export const calcularPromedio = (notas) => {
  if (!notas || notas.length === 0) return 0;
  const suma = notas.reduce((acc, nota) => acc + Number(nota), 0);
  return suma / notas.length;
};

/**
 * Formatea un horario para mostrar
 */
export const formatHorario = (horario) => {
  return `${horario.dia_semana} ${horario.hora_inicio} - ${horario.hora_fin}`;
};

/**
 * Obtiene el color según el nivel de riesgo
 */
export const getColorRiesgo = (riesgo) => {
  const colores = {
    BAJO: 'green',
    MEDIO: 'yellow',
    ALTO: 'red',
  };
  return colores[riesgo] || 'gray';
};

/**
 * Formatea número de créditos
 */
export const formatCreditos = (creditos) => {
  return `${creditos} ${creditos === 1 ? 'crédito' : 'créditos'}`;
};
```

**Archivo: `src/utils/validators.js`**

```javascript
/**
 * Valida formato de correo electrónico
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida correo institucional de Uniquindío
 */
export const validarEmailInstitucional = (email) => {
  return email.endsWith('@uniquindio.edu.co');
};

/**
 * Valida formato de documento
 */
export const validarDocumento = (documento) => {
  return /^\d{7,10}$/.test(documento);
};

/**
 * Valida formato de teléfono colombiano
 */
export const validarTelefono = (telefono) => {
  return /^3\d{9}$/.test(telefono);
};

/**
 * Valida rango de nota (0.0 - 5.0)
 */
export const validarNota = (nota) => {
  const num = Number(nota);
  return !isNaN(num) && num >= 0 && num <= 5.0;
};

/**
 * Valida que una fecha sea válida
 */
export const validarFecha = (fecha) => {
  const date = new Date(fecha);
  return date instanceof Date && !isNaN(date);
};
```

**Archivo: `src/utils/constants.js`**

```javascript
export const ROLES = {
  ESTUDIANTE: 'ESTUDIANTE',
  DOCENTE: 'DOCENTE',
  ADMINISTRADOR: 'ADMINISTRADOR',
};

export const ESTADOS_ESTUDIANTE = {
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO',
  GRADUADO: 'GRADUADO',
  RETIRADO: 'RETIRADO',
};

export const NIVELES_RIESGO = {
  BAJO: 'BAJO',
  MEDIO: 'MEDIO',
  ALTO: 'ALTO',
};

export const RESULTADOS_ACADEMICOS = {
  APROBADO: 'APROBADO',
  REPROBADO: 'REPROBADO',
  CURSO: 'CURSO',
  VALIDADO: 'VALIDADO',
  HOMOLOGADO: 'HOMOLOGADO',
};

export const TIPOS_ASIGNATURA = {
  OBLIGATORIA: 'OBLIGATORIA',
  ELECTIVA: 'ELECTIVA',
  OPTATIVA: 'OPTATIVA',
};

export const NOTA_MINIMA_APROBACION = 3.0;
export const NOTA_MAXIMA = 5.0;

export const CREDITOS_MAXIMOS = {
  BAJO: 20,
  MEDIO: 16,
  ALTO: 12,
};

export const TIPOS_VENTANA = {
  MATRICULA: 'MATRICULA',
  ADICIONES: 'ADICIONES',
  RETIROS: 'RETIROS',
  CALIFICACIONES: 'CALIFICACIONES',
  RECLAMOS: 'RECLAMOS',
};
```

### 🎨 Componentes Adicionales

**Archivo: `src/components/AlertaCard.jsx`**

```jsx
import { getColorRiesgo } from '../utils/formatters';

const AlertaCard = ({ alerta }) => {
  return (
    <div className={`alerta-card alerta-${getColorRiesgo(alerta.riesgo)}`}>
      <div className="alerta-header">
        <h3>{alerta.nombre}</h3>
        <span className={`badge badge-${alerta.riesgo.toLowerCase()}`}>
          {alerta.riesgo}
        </span>
      </div>
      
      <div className="alerta-body">
        <p><strong>Programa:</strong> {alerta.programa}</p>
        <p><strong>Promedio:</strong> {alerta.promedio_acumulado.toFixed(2)}</p>
        <p><strong>Asignaturas reprobadas:</strong> {alerta.asignaturas_reprobadas}</p>
        <p><strong>Créditos matriculados:</strong> {alerta.creditos_matriculados}</p>
      </div>
      
      <div className="alerta-actions">
        <a href={`mailto:${alerta.correo}`}>Contactar</a>
        <button onClick={() => window.open(`/estudiante/${alerta.cod_estudiante}`)}>
          Ver Perfil
        </button>
      </div>
    </div>
  );
};

export default AlertaCard;
```

**Archivo: `src/components/VentanaCalendarioCard.jsx`**

```jsx
import { formatFecha } from '../utils/formatters';

const VentanaCalendarioCard = ({ ventana }) => {
  const estaActiva = ventana.activa_ahora === 'SI';
  
  return (
    <div className={`ventana-card ${estaActiva ? 'activa' : 'inactiva'}`}>
      <div className="ventana-header">
        <span className="ventana-tipo">{ventana.tipo}</span>
        {estaActiva && <span className="badge-activo">ACTIVA</span>}
      </div>
      
      <h3>{ventana.nombre}</h3>
      <p className="ventana-descripcion">{ventana.descripcion}</p>
      
      <div className="ventana-fechas">
        <p><strong>Inicio:</strong> {formatFecha(ventana.fecha_inicio, true)}</p>
        <p><strong>Fin:</strong> {formatFecha(ventana.fecha_fin, true)}</p>
      </div>
      
      <div className="ventana-periodo">
        <p><strong>Período:</strong> {ventana.periodo}</p>
      </div>
      
      {estaActiva && (
        <div className="ventana-countdown">
          <p className="dias-restantes">
            {ventana.dias_restantes} {ventana.dias_restantes === 1 ? 'día' : 'días'} restantes
          </p>
        </div>
      )}
    </div>
  );
};

export default VentanaCalendarioCard;
```

**Archivo: `src/components/GrupoCard.jsx`**

```jsx
import { formatHorario } from '../utils/formatters';

const GrupoCard = ({ grupo, onMatricular, disabled }) => {
  const tieneoCupos = grupo.cupos_disponibles > 0;
  
  return (
    <div className="grupo-card">
      <div className="grupo-header">
        <h4>Grupo {grupo.codigo_grupo}</h4>
        <span className={`cupos ${!tieneCupos ? 'sin-cupos' : ''}`}>
          {grupo.cupos_disponibles}/{grupo.cupo_maximo} cupos
        </span>
      </div>
      
      <div className="grupo-docente">
        <p><strong>Docente:</strong> {grupo.nombre_docente}</p>
      </div>
      
      <div className="grupo-horarios">
        <h5>Horarios:</h5>
        {grupo.horarios && grupo.horarios.length > 0 ? (
          <ul>
            {grupo.horarios.map((horario, idx) => (
              <li key={idx}>
                {formatHorario(horario)}
                <span className="tipo-clase">{horario.tipo_clase}</span>
                <span className="aula">{horario.aula}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay horarios definidos</p>
        )}
      </div>
      
      <button
        className="btn-matricular"
        onClick={() => onMatricular(grupo.cod_grupo)}
        disabled={disabled || !tieneCupos}
      >
        {tieneCupos ? 'Matricular' : 'Sin Cupos'}
      </button>
    </div>
  );
};

export default GrupoCard;
```

### 📱 Ejemplo de Dashboard Completo

**Archivo: `src/pages/EstudianteDashboard.jsx`**

```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlertas } from '../hooks/useAlertas';
import { usePeriodos } from '../hooks/usePeriodos';
import { useCalificaciones } from '../hooks/useCalificaciones';
import VentanaCalendarioCard from '../components/VentanaCalendarioCard';
import { calcularPromedio, formatCreditos } from '../utils/formatters';

const EstudianteDashboard = () => {
  const { user } = useAuth();
  const { getVentanasCalendario } = useAlertas();
  const { periodoActivo } = usePeriodos();
  const { calificaciones } = useCalificaciones(user?.codigo);
  
  const [ventanas, setVentanas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await getVentanasCalendario();
      if (result.success) {
        setVentanas(result.data);
      }
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) return <div>Cargando...</div>;

  const promedioAcumulado = calificaciones.length > 0
    ? calcularPromedio(calificaciones.map(c => c.nota_final))
    : 0;

  return (
    <div className="estudiante-dashboard">
      <header>
        <h1>Bienvenido, {user?.nombre}</h1>
        <p>Código: {user?.codigo}</p>
      </header>

      <div className="dashboard-grid">
        {/* Tarjeta de Resumen */}
        <div className="card resumen-academico">
          <h2>Resumen Académico</h2>
          <div className="stats">
            <div className="stat">
              <span className="stat-label">Promedio Acumulado</span>
              <span className="stat-value">{promedioAcumulado.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Período Actual</span>
              <span className="stat-value">{periodoActivo?.nombre_periodo || 'N/A'}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Asignaturas Cursadas</span>
              <span className="stat-value">{calificaciones.length}</span>
            </div>
          </div>
        </div>

        {/* Ventanas Activas */}
        <div className="card ventanas-activas">
          <h2>Ventanas Académicas</h2>
          <div className="ventanas-grid">
            {ventanas.filter(v => v.activa_ahora === 'SI').map(ventana => (
              <VentanaCalendarioCard key={ventana.cod_ventana} ventana={ventana} />
            ))}
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="card accesos-rapidos">
          <h2>Accesos Rápidos</h2>
          <div className="accesos-grid">
            <a href="/estudiante/registro-materias" className="acceso-btn">
              📚 Registro de Materias
            </a>
            <a href="/estudiante/calificaciones" className="acceso-btn">
              📊 Mis Calificaciones
            </a>
            <a href="/estudiante/horario" className="acceso-btn">
              🗓️ Mi Horario
            </a>
            <a href="/estudiante/historial" className="acceso-btn">
              📋 Historial Académico
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstudianteDashboard;
```

---

## 📞 Soporte

Para reportar problemas o consultas sobre la API:
- **Repositorio:** [GitHub - backBases2ORDS](https://github.com/juan-david-lopez/backBases2ORDS)
- **Equipo:** Proyecto Base de Datos II - Universidad del Quindío

---

## 📝 Changelog

**v1.0.0** - Noviembre 2025
- ✅ Módulo de autenticación
- ✅ CRUD de estudiantes
- ✅ Gestión de matrículas
- ✅ Sistema de calificaciones
- ✅ Panel docente
- ✅ Registro de materias
- ✅ Reportes y alertas

---

**Última actualización:** 17 de noviembre de 2025
