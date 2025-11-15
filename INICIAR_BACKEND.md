# 🚀 Guía Rápida: Iniciar el Backend ORDS

## ❌ Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

Este error significa que el **servidor backend ORDS no está corriendo** en `http://localhost:8080`.

---

## ✅ Solución: Iniciar el Servidor Backend

### Opción 1: Oracle REST Data Services (ORDS) Standalone

Si tienes ORDS configurado como servidor standalone:

```bash
# Navega al directorio de ORDS
cd /ruta/a/ords

# Inicia ORDS
java -jar ords.war standalone
```

### Opción 2: SQL Developer con ORDS Embedded

Si usas SQL Developer:

1. Abre **Oracle SQL Developer**
2. Ve a **Ver → REST Data Services**
3. Haz clic derecho en **REST Data Services**
4. Selecciona **Iniciar**
5. Verifica que esté corriendo en `http://localhost:8080`

### Opción 3: Tomcat/WebLogic con ORDS

Si tienes ORDS desplegado en un servidor de aplicaciones:

```bash
# Inicia Tomcat
cd /ruta/a/tomcat/bin
./startup.sh  # Linux/Mac
startup.bat   # Windows

# O inicia WebLogic
cd /ruta/a/weblogic/bin
./startWebLogic.sh  # Linux/Mac
startWebLogic.cmd   # Windows
```

---

## 🔍 Verificar que ORDS está Corriendo

### 1. Desde el Navegador

Abre tu navegador y accede a:
```
http://localhost:8080/ords/
```

Deberías ver una página de respuesta de ORDS (puede ser un JSON vacío o una página de bienvenida).

### 2. Desde la Terminal

```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri http://localhost:8080/ords/ -UseBasicParsing

# Linux/Mac
curl http://localhost:8080/ords/
```

### 3. Verificar que el Puerto 8080 está en Uso

```bash
# Windows
netstat -an | findstr "8080"

# Linux/Mac
lsof -i :8080
# o
netstat -an | grep 8080
```

Si ves algo como `LISTENING` o `ESTABLISHED`, el puerto está en uso.

---

## 📝 Configuración del Backend

### Verifica tu archivo `.env`

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Si ORDS está en otro puerto

Si tu ORDS está corriendo en un puerto diferente (por ejemplo, `8081`), actualiza el `.env`:

```env
VITE_API_BASE_URL=http://localhost:8081
```

Y reinicia el servidor de desarrollo:

```bash
# Detener el servidor (Ctrl+C)
# Reiniciar
npm run dev
```

---

## 🛠️ Solución de Problemas Comunes

### Problema 1: Puerto 8080 ya está en uso

```bash
# Windows - Encontrar qué proceso usa el puerto
netstat -ano | findstr "8080"
# Luego matar el proceso con el PID mostrado
taskkill /PID <PID> /F

# Linux/Mac - Encontrar y matar el proceso
lsof -ti:8080 | xargs kill -9
```

### Problema 2: Oracle Database no está corriendo

ORDS necesita que la base de datos Oracle esté activa:

```bash
# Verificar el estado de Oracle
# Windows
services.msc  # Buscar OracleServiceXE o similar

# Linux
systemctl status oracle-xe
# o
sudo service oracle-xe status
```

### Problema 3: ORDS no está configurado

Si es la primera vez usando ORDS:

```bash
# Configurar ORDS
java -jar ords.war install

# Sigue el asistente proporcionando:
# - Host de la base de datos (localhost)
# - Puerto (1521)
# - SID/Service Name (XE o tu servicio)
# - Usuario APEX (APEX_PUBLIC_USER)
# - Contraseña
```

### Problema 4: Endpoints no están habilitados

Verifica que los módulos REST estén habilitados en tu base de datos:

```sql
-- Conectarse como usuario administrador
SELECT * FROM USER_ORDS_MODULES;
SELECT * FROM USER_ORDS_SERVICES;

-- Si no hay resultados, necesitas ejecutar los scripts de configuración
-- que están en tu proyecto backend
```

---

## 🔗 Recursos Adicionales

### Documentación Oracle ORDS
- [Oracle REST Data Services](https://www.oracle.com/database/technologies/appdev/rest.html)
- [ORDS Developer Guide](https://docs.oracle.com/en/database/oracle/oracle-rest-data-services/)

### Archivos de Configuración del Proyecto

En tu proyecto backend, deberías tener:

```
ProyectoFinalBases/
├── Backend/
│   ├── endpoints/
│   │   └── 00_ords_setup.sql
│   ├── Tablas/
│   ├── triggers/
│   └── procedures/
```

Asegúrate de haber ejecutado todos los scripts SQL en orden.

---

## ✅ Checklist de Inicio

Antes de iniciar el frontend, verifica:

- [ ] Oracle Database está corriendo
- [ ] ORDS está instalado y configurado
- [ ] ORDS está corriendo en el puerto 8080 (o el configurado)
- [ ] Los endpoints REST están habilitados (`00_ords_setup.sql`)
- [ ] Puedes acceder a `http://localhost:8080/ords/` desde el navegador
- [ ] El archivo `.env` tiene la URL correcta
- [ ] Has ejecutado `npm run dev` para iniciar el frontend

---

## 📞 ¿Necesitas Ayuda?

Si después de estos pasos aún no funciona:

1. **Revisa los logs de ORDS**
   - Ubicación típica: `<ords_directory>/logs/`
   - Busca errores recientes

2. **Verifica la conexión a la base de datos**
   ```sql
   -- Desde SQL*Plus o SQL Developer
   SELECT 'Database OK' FROM DUAL;
   ```

3. **Prueba un endpoint simple**
   ```bash
   curl http://localhost:8080/ords/academico/test
   ```

4. **Contacta al equipo de backend**
   - Proporciona los logs de error
   - Indica qué endpoints no funcionan

---

## 🎯 Resumen Rápido

```bash
# 1. Inicia Oracle Database
# (depende de tu instalación)

# 2. Inicia ORDS
java -jar ords.war standalone

# 3. Verifica en el navegador
# http://localhost:8080/ords/

# 4. Inicia el frontend
cd ProyectoFinalBases/Frontend
npm run dev

# 5. Accede a la aplicación
# http://localhost:5173
```

---

**Última actualización**: Noviembre 2, 2025
