import { http, HttpResponse } from 'msw';

export const handlers = [
    // Auth
    http.post('/ords/academico/auth/login', async ({ request }) => {
        const body = await request.json();
        if (body.email && body.password) {
            // Simular respuesta según documentación
            return HttpResponse.json({
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock',
                role: 'admin',
                usuario: {
                    id: 1,
                    nombre: 'Admin User',
                    email: body.email,
                    cod_estudiante: null,
                },
            });
        }
        return HttpResponse.json({ error: 'Usuario o contraseña incorrectos' }, { status: 401 });
    }),
    http.get('/ords/academico/usuarios/perfil', () =>
        HttpResponse.json({ id: 1, nombre: 'Admin User', rol: 'admin', email: 'admin@universidad.edu' })
    ),
    http.put('/ords/academico/usuarios/:username/actualizar-password', async ({ request, params }) => {
        const body = await request.json();
        if (body.new_password) {
            return HttpResponse.json({ status: 200, message: 'Contraseña actualizada correctamente' });
        }
        return HttpResponse.json({ status: 400, message: 'Contraseña no proporcionada' }, { status: 400 });
    }),

    // Estudiantes
    http.get('/ords/academico/estudiantes/', ({ request }) => {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '25');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        const mockEstudiantes = [
            {
                cod_estudiante: '202500001',
                tipo_documento: 'CC',
                num_documento: '1234567890',
                primer_nombre: 'Juan',
                segundo_nombre: 'Carlos',
                primer_apellido: 'Pérez',
                segundo_apellido: 'Gómez',
                correo_institucional: 'juan.perez@universidad.edu',
                correo_personal: 'juan.perez@gmail.com',
                telefono: '3101234567',
                cod_programa: 1,
                nombre_programa: 'Ingeniería de Sistemas',
                estado_estudiante: 'ACTIVO',
                fecha_ingreso: '2025-01-10T00:00:00Z',
                promedio_acumulado: 4.2,
                creditos_aprobados: 48,
                nivel_riesgo: 0,
            },
        ];

        return HttpResponse.json({
            items: mockEstudiantes.slice(offset, offset + limit),
            hasMore: false,
            limit,
            offset,
            count: mockEstudiantes.length,
        });
    }),
    http.post('/ords/academico/estudiantes/', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(
            {
                mensaje: 'Estudiante creado correctamente',
                cod_estudiante: body.codigo,
            },
            { status: 201 }
        );
    }),
    http.put('/ords/academico/estudiantes/:codigo', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json({ mensaje: 'Estudiante actualizado correctamente' });
    }),
    http.get('/ords/academico/estudiantes/:codigo/historial', () =>
        HttpResponse.json([
            { asignatura: 'MAT101', nota: 4.5, periodo: '2025-1' },
            { asignatura: 'PROG101', nota: 4.0, periodo: '2025-1' },
        ])
    ),

    // Matrículas
    http.get('/ords/academico/asignaturas/disponibles', ({ request }) => {
        const url = new URL(request.url);
        const codigoEstudiante = url.searchParams.get('codigoEstudiante');
        // Mock de asignaturas disponibles con grupos
        return HttpResponse.json([
            {
                codigo: 'IS201',
                nombre: 'Programación Orientada a Objetos',
                creditos: 4,
                cod_grupo: 7,
                horario: 'Lunes 8:00-10:00',
                cupo: 30,
                cupo_disponible: 15,
                docente: 'Dr. García',
            },
            {
                codigo: 'IS202',
                nombre: 'Estructuras de Datos',
                creditos: 3,
                cod_grupo: 8,
                horario: 'Miércoles 10:00-12:00',
                cupo: 25,
                cupo_disponible: 10,
                docente: 'Dra. Martínez',
            },
            {
                codigo: 'IS203',
                nombre: 'Bases de Datos',
                creditos: 4,
                cod_grupo: 9,
                horario: 'Viernes 14:00-16:00',
                cupo: 35,
                cupo_disponible: 20,
                docente: 'Dr. López',
            },
        ]);
    }),
    http.post('/ords/academico/matriculas/registrar', async ({ request }) => {
        const body = await request.json();
        // Validaciones básicas de ejemplo
        if (!body.codigoEstudiante || !body.cod_periodo || !body.asignaturas || !Array.isArray(body.asignaturas)) {
            return HttpResponse.json(
                { error: 'Datos incompletos o inválidos para la matrícula' },
                { status: 400 }
            );
        }
        if (body.asignaturas.length === 0) {
            return HttpResponse.json({ error: 'Debe seleccionar al menos una asignatura' }, { status: 400 });
        }
        // Respuesta exitosa según documentación
        return HttpResponse.json({
            mensaje: 'Matrícula registrada exitosamente',
            cod_matricula: 1,
            creditos_registrados: 11,
            asignaturas_inscritas: [
                {
                    cod_asignatura: 'IS201',
                    nombre: 'Programación Orientada a Objetos',
                    creditos: 4,
                    horario: 'Lunes 8:00-10:00',
                },
                {
                    cod_asignatura: 'IS202',
                    nombre: 'Estructuras de Datos',
                    creditos: 3,
                    horario: 'Miércoles 10:00-12:00',
                },
                {
                    cod_asignatura: 'IS203',
                    nombre: 'Bases de Datos',
                    creditos: 4,
                    horario: 'Viernes 14:00-16:00',
                },
            ],
            alertas: [],
        });
    }),

    http.post('/ords/academico/matriculas/agregar-asignatura', async ({ request }) => {
        const body = await request.json();
        if (!body.cod_matricula || !body.cod_grupo) {
            return HttpResponse.json({ error: 'Datos incompletos' }, { status: 400 });
        }
        return HttpResponse.json({
            mensaje: 'Asignatura agregada correctamente',
            creditos_registrados: 15,
        });
    }),
    http.delete('/ords/academico/matriculas/retirar-asignatura', async ({ request }) => {
        const body = await request.json();
        if (!body.cod_matricula || !body.cod_grupo) {
            return HttpResponse.json({ error: 'Datos incompletos' }, { status: 400 });
        }
        return HttpResponse.json({
            mensaje: 'Asignatura retirada correctamente',
            creditos_registrados: 8,
        });
    }),

    // Calificaciones
    http.get('/ords/academico/notas/:grupo_id', ({ params }) => {
        return HttpResponse.json([
            {
                estudiante_id: 1,
                cod_estudiante: '202500001',
                nombre: 'Juan Pérez',
                nota1: 4.5,
                nota2: 4.0,
                nota3: null,
                definitiva: null,
            },
            {
                estudiante_id: 2,
                cod_estudiante: '202500002',
                nombre: 'María González',
                nota1: 3.5,
                nota2: 3.8,
                nota3: null,
                definitiva: null,
            },
        ]);
    }),
    http.post('/ords/academico/notas/registrar', async ({ request }) => {
        const body = await request.json();
        if (!body.grupo_id || !body.notas || !Array.isArray(body.notas)) {
            return HttpResponse.json({ error: 'Datos incompletos' }, { status: 400 });
        }
        return HttpResponse.json({ mensaje: 'Notas registradas correctamente' });
    }),
    http.post('/ords/academico/notas/cerrar-periodo', async ({ request }) => {
        const body = await request.json();
        if (!body.cod_periodo) {
            return HttpResponse.json({ error: 'Periodo no especificado' }, { status: 400 });
        }
        return HttpResponse.json({
            mensaje: 'Periodo cerrado exitosamente',
            estudiantes_actualizados: 150,
        });
    }),

    // Riesgo Académico
    http.get('/ords/academico/riesgo/periodo', ({ request }) => {
        const url = new URL(request.url);
        const periodo = url.searchParams.get('periodo');
        return HttpResponse.json([
            {
                programa: 'Ingeniería de Sistemas',
                riesgo_1: 5,
                riesgo_2: 8,
                riesgo_3: 2,
                riesgo_4: 12,
                total_estudiantes: 150,
            },
        ]);
    }),
    http.post('/ords/academico/riesgo/recalcular', async () => {
        return HttpResponse.json({
            mensaje: 'Riesgos recalculados exitosamente',
            estudiantes_evaluados: 150,
        });
    }),

    // Reportes
    http.get('/ords/academico/reportes/matricula-periodo', ({ request }) => {
        const url = new URL(request.url);
        const periodo = url.searchParams.get('periodo');
        return HttpResponse.json([
            {
                programa: 'Ingeniería de Sistemas',
                creditos: 450,
                ocupacion: 85.5,
                estudiantes_matriculados: 120,
            },
        ]);
    }),
    http.get('/ords/academico/reportes/rendimiento-asignatura', ({ request }) => {
        const url = new URL(request.url);
        const periodo = url.searchParams.get('periodo');
        return HttpResponse.json([
            {
                asignatura: 'IS201',
                nombre: 'Programación Orientada a Objetos',
                promedio: 4.2,
                aprobados: 35,
                reprobados: 5,
            },
        ]);
    }),

    // Docentes
    http.get('/ords/academico/docentes/', () => {
        return HttpResponse.json([
            {
                id: 1,
                nombre: 'Dr. García',
                horas_asignadas: 12,
                grupos_asignados: 3,
            },
            {
                id: 2,
                nombre: 'Dra. Martínez',
                horas_asignadas: 10,
                grupos_asignados: 2,
            },
        ]);
    }),
    http.post('/ords/academico/docentes/asignar-grupo', async ({ request }) => {
        const body = await request.json();
        if (!body.docente_id || !body.asignatura_id || !body.horas) {
            return HttpResponse.json({ error: 'Datos incompletos' }, { status: 400 });
        }
        if (body.horas < 8 || body.horas > 16) {
            return HttpResponse.json({ error: 'Horas fuera del rango permitido (8-16)' }, { status: 400 });
        }
        return HttpResponse.json({ mensaje: 'Grupo asignado correctamente' });
    }),

    // Programas
    http.get('/ords/academico/programas/', () =>
        HttpResponse.json([{ codigo: 'ING', nombre: 'Ingeniería', creditos: 160, facultad: 'Ingenierías' }])
    ),
];


