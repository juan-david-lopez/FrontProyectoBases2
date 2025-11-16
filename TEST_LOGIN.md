# 🔍 Diagnóstico de Problema de Login

## Problema Detectado

El frontend está intentando llamar al endpoint `/auth/login` pero el backend responde con **401 Unauthorized**.

## Posibles Causas

### 1. ❌ El endpoint `/auth/login` NO EXISTE en tu backend ORDS

**Síntomas:**
- Error 401 en `/auth/login` inmediatamente al intentar login
- Ningún endpoint de autenticación en la lista de 23 endpoints documentados
- El backend tiene usuarios con contraseñas pero sin endpoint de validación

**Solución:** Necesitas implementar el endpoint de autenticación en ORDS.

### 2. ⚠️ El formato del payload es incorrecto

**Solución:** Verifica qué formato espera tu backend.

### 3. ⚠️ Problemas de CORS

**Solución:** Configurar CORS en ORDS para permitir peticiones desde `localhost:5173`.

---

## 🔧 Soluciones Propuestas

### Opción A: Implementar Autenticación en ORDS (RECOMENDADO)

Necesitas crear en tu backend ORDS un handler para autenticación:

```sql
-- Ejemplo de procedimiento PL/SQL para login
CREATE OR REPLACE PROCEDURE login_usuario(
    p_email IN VARCHAR2,
    p_password IN VARCHAR2,
    p_token OUT VARCHAR2,
    p_role OUT VARCHAR2,
    p_usuario OUT SYS_REFCURSOR
) AS
BEGIN
    -- Buscar usuario por email
    SELECT tipo_usuario INTO p_role
    FROM usuarios
    WHERE email = p_email
    AND password_hash = DBMS_CRYPTO.HASH(
        UTL_I18N.STRING_TO_RAW(p_password, 'AL32UTF8'),
        DBMS_CRYPTO.HASH_SH256
    );
    
    -- Generar token JWT (simplificado)
    p_token := 'token_' || SYS_GUID();
    
    -- Retornar datos del usuario
    OPEN p_usuario FOR
        SELECT id, nombre, email
        FROM usuarios
        WHERE email = p_email;
END;
```

Luego exponer como endpoint REST en ORDS:

```sql
BEGIN
    ORDS.define_module(
        p_module_name => 'auth',
        p_base_path => '/auth/'
    );
    
    ORDS.define_template(
        p_module_name => 'auth',
        p_pattern => 'login'
    );
    
    ORDS.define_handler(
        p_module_name => 'auth',
        p_pattern => 'login',
        p_method => 'POST',
        p_source_type => ORDS.source_type_plsql,
        p_source => 'BEGIN login_usuario(:email, :password, :token, :role, :usuario); END;'
    );
END;
```

### Opción B: Usar Autenticación Mock Temporal

Si solo estás probando el frontend, puedes usar autenticación simulada:

1. **Comentar la validación real** en `authService.js`
2. **Retornar datos ficticios** basados en el email ingresado

```javascript
export async function login({ email, password }) {
    // TEMPORAL: Autenticación mock para desarrollo
    console.warn('⚠️ Usando autenticación MOCK - Solo para desarrollo');
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Determinar rol basado en el email
    let role = 'estudiante';
    if (email.includes('docente')) role = 'docente';
    if (email.includes('admin')) role = 'administrador';
    
    return {
        token: 'mock-token-' + Date.now(),
        role: role,
        usuario: {
            id: 1,
            nombre: email.split('@')[0],
            email: email,
            cod_estudiante: '202500001'
        }
    };
}
```

### Opción C: Verificar si existe otro endpoint

Quizás el endpoint tiene otro nombre. Prueba:
- `/usuarios/login`
- `/login`
- `/authenticate`
- `/signin`

---

## 📋 Pasos Inmediatos

1. **Verifica si existe el endpoint de autenticación en tu backend**
   ```powershell
   # Probar con PowerShell
   Invoke-WebRequest -Uri "http://localhost:8080/ords/academico/auth/login" `
       -Method POST `
       -ContentType "application/json" `
       -Body '{"email":"carlos.rodriguez@universidad.edu","password":"Docente123#"}'
   ```

2. **Si NO existe el endpoint:**
   - Implementar autenticación en ORDS (Opción A)
   - O usar autenticación mock temporal (Opción B)

3. **Si existe pero da error:**
   - Verificar el formato del payload
   - Verificar CORS en el backend
   - Revisar logs del servidor ORDS

---

## 🔍 Información Adicional Necesaria

Para ayudarte mejor, necesito que me proporciones:

1. **¿Tienes implementado el endpoint `/auth/login` en ORDS?**
2. **¿Qué endpoints de autenticación tienes disponibles?**
3. **¿Los usuarios de la tabla tienen tokens o sesiones?**
4. **¿Estás usando algún esquema de autenticación (Basic, JWT, OAuth)?**

---

## ⚡ Solución Rápida para Probar el Frontend

Si solo quieres probar el frontend SIN backend de autenticación, usa esta versión mock:

**Archivo:** `src/services/authService.MOCK.js`

```javascript
// SOLO PARA DESARROLLO - Autenticación simulada
const MOCK_USERS = {
    'carlos.rodriguez@universidad.edu': {
        password: 'Docente123#',
        role: 'docente',
        cod_docente: 'D001'
    },
    'juan.perez@universidad.edu': {
        password: '1234567890',
        role: 'estudiante',
        cod_estudiante: '202500001'
    },
    'admin@universidad.edu': {
        password: 'admin123',
        role: 'administrador'
    }
};

export async function login({ email, password }) {
    await new Promise(r => setTimeout(r, 500)); // Simular latencia
    
    const user = MOCK_USERS[email];
    if (!user || user.password !== password) {
        throw new Error('Usuario o contraseña incorrectos');
    }
    
    return {
        token: 'mock-jwt-token',
        role: user.role,
        usuario: {
            email,
            nombre: email.split('@')[0],
            ...user
        }
    };
}
```

Luego importa este archivo en lugar del real mientras desarrollas.

---

¿Cuál opción prefieres seguir?
