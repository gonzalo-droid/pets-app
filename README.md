# HUELLAS 🐾

Plataforma multi-albergue de gestión y apoyo animal. Refactorización del proyecto existente `pets-app` (antes PawRescue), conservando Next.js App Router, TypeScript, Tailwind 4, componentes y directorios públicos.

## Ejecutar la demo local

Requisitos: Node.js 22.15+ (recomendado 22 LTS o superior) y npm.

```bash
cd /Volumes/Neko/webs/pets-app
npm ci
npm run dev
```

Abre http://localhost:3000. Si el puerto está ocupado: `npm run dev -- --port 3100`.
El arranque usa Webpack con sondeo de archivos para funcionar en volúmenes externos donde FSEvents/Turbopack puede fallar.

No necesitas `.env.local` ni Supabase: `npm run dev` fuerza `NEXT_PUBLIC_DEMO_MODE=true` y **no conecta a la base existente**, aunque tengas credenciales guardadas. El archivo `.env.local` existente no se ha modificado.

En `/auth/login` elige Donante, Patitas Chiclayo, Huellas Lambayeque o Administración. No hay contraseñas demo ni credenciales reales en el navegador. La sesión demo usa una cookie HttpOnly firmada, válida durante 8 horas; reiniciar el servidor puede cerrar la sesión.

Los cambios se guardan en `.huellas-demo/data.json`, ignorado por Git. Para volver a los datos iniciales, detén el servidor y elimina **solo esa carpeta demo**. La demo es para un servidor/proceso local; no soporta varios procesos ni despliegues serverless. En producción está bloqueada incluso si se intenta activar por variable de entorno.

## Qué funciona

- Portal de albergues verificados y perfiles con fotos.
- Animales filtrables, fichas públicas, solicitud de adopción y apadrinamiento.
- Panel por albergue: alta de animales y fotos mediante URL HTTPS, actualización de estado de adopción, campañas, necesidades, presentación pública y solicitudes privadas.
- Campañas con metas y necesidades con cantidad, descripción y resolución.
- Donantes: historial propio de compromisos y solicitudes; cancelación del apoyo.
- Administración: listado de albergues y verificación/retiro de verificación.
- Sesiones reales de Supabase en modo conectado; roles `admin`, `shelter` y `user` (donante, nombre heredado por compatibilidad).
- Lecturas/escrituras conectadas mediante el JWT del usuario y RLS. No se usa `service_role`.

### Donaciones y apadrinamientos

**No hay pasarela de pago implementada.** Los formularios guardan compromisos `pending`, sin solicitar tarjetas, comprobantes ni transferencias. Un apadrinamiento expresa una intención mensual: no crea una suscripción facturable ni un débito automático. No se presenta como dinero recaudado ni se puede marcar como pagado desde el panel. Las peticiones incluyen una clave de idempotencia para impedir registros duplicados al reintentar. El donante puede cancelar su compromiso.

El esquema `donations` heredado se conserva para no borrar registros; queda de solo lectura. Los nuevos flujos usan `support_intents`. Las recaudaciones existentes de una base real no se alteran con la migración. Solo el seed local reinicia los importes ficticios a cero.

## Conectar Supabase local

Requiere Supabase CLI y Docker en ejecución:

```bash
supabase start
supabase db reset   # SOLO instancia local desechable: borra y vuelve a sembrar esa DB
supabase status
```

Copia `.env.example` a `.env.local` **solo si aún no tienes configuración**, y completa la URL y clave pública anon indicadas por `supabase status`. Si ya existe `.env.local`, edítalo sin reemplazar tus otras variables.

```bash
npm run dev:connected
```

`supabase/config.toml` desactiva confirmación de email solo en la instancia local. En Supabase alojado configura SMTP y confirmación de email, y mantén `NEXT_PUBLIC_DEMO_MODE=false`. El registro público siempre crea donantes: ni metadata ni formularios pueden conceder privilegios.

### Base nueva o base existente

- **Nueva con CLI:** las migraciones `202611090001_legacy_baseline.sql` y `202611090002_huellas.sql` se aplican en orden. El seed es exclusivamente local.
- **Nueva con SQL Editor:** ejecuta `supabase/schema.sql` una sola vez. Contiene ambos pasos. No ejecutes además la primera migración sobre esas tablas.
- **Base existente con el esquema anterior:** respalda primero, verifica en una copia de staging y ejecuta **solo** `supabase/migrations/202611090002_huellas.sql`. No ejecutes `schema.sql`, `db reset` ni `seed.sql` sobre datos reales. El upgrade conserva tablas y registros; reemplaza políticas heredadas inseguras y restringe permisos de columnas. Si usas CLI, registra el baseline como ya aplicado antes de desplegar el segundo paso.

No se ha ejecutado ninguna migración contra tu Supabase real.

### Cuentas locales conectadas

El seed conserva los correos históricos por compatibilidad. Contraseña para todos: `PawRescue2024!`. Son exclusivamente datos de prueba.

| Perfil | Correo |
|---|---|
| Donante | usuario1@pawrescue.pe |
| Albergue 1 | patitaschiclayo@gmail.com |
| Albergue 2 | huellaslamb@gmail.com |
| Administración | admin@huellas.test |

El usuario de administración se crea solamente con el seed local. Para un proyecto alojado, crea cuentas mediante Supabase Auth y asigna privilegios desde SQL administrativo confiable:

```sql
-- Sustituir UUID; nunca tomar el rol desde user_metadata.
update public.profiles set role = 'admin' where id = '<uuid-del-admin>';
update public.profiles set role = 'shelter' where id = '<uuid-del-responsable>';
insert into public.shelters(profile_id, name, description, ubigeo)
values ('<uuid-del-responsable>', 'Mi albergue', 'Historia de nuestro albergue', '140101');
```

Un responsable administra un albergue en la UI de este MVP. La base usa `shelter_id` como tenant. El administrador verifica albergues desde `/admin`; su panel de gestión resuelve el primer albergue disponible. La selección de múltiples albergues por cuenta está pendiente.

## Seguridad

La autorización se comprueba en layouts y en cada mutación; el proxy solo refresca la sesión. En modo conectado `getUser()` verifica la sesión en Supabase. Las políticas RLS y los permisos de columna impiden autoasignar roles, autoverificarse, modificar recaudación o mover entidades a otro tenant. Los perfiles, solicitudes y apoyos privados se limitan a su dueño, el albergue correspondiente o administración. Las funciones SQL fijan `search_path` y limitan `EXECUTE`. Las intenciones se crean mediante RPC con destino, importe y tenant resueltos en PostgreSQL.

El directorio, animales, campañas y necesidades publicados son públicos por diseño. Las fichas médicas privadas y documentos veterinarios no forman parte del MVP; no coloques datos sensibles en descripciones públicas.

## Verificación

```bash
npm test                 # Dominio + migraciones/seed/RLS en PostgreSQL WASM (PGlite)
npm run typecheck
npm run build
npm start                # Modo conectado; requiere Supabase configurado
```

Para comprobar los endpoints contra la demo en otro terminal:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3100
HUELLAS_TEST_URL=http://127.0.0.1:3100 npm test
```

La prueba HTTP crea datos ficticios en `.huellas-demo`; ejecútala en una demo local desechable. Comprueba autenticación, cruce de tenants rechazado, persistencia pública, compromisos idempotentes, cancelación y CSRF. Las pruebas SQL ejecutan ambas migraciones y el seed: roles desde metadata, permisos de columnas, aislamiento, privacidad y recaudación inalterada. PGlite simula el esquema Auth mínimo; no sustituye la prueba de integración con GoTrue/Supabase completo.

Evidencia visual del flujo demo: [compromiso sin cobro](docs/huellas-support-demo.png).

## Estructura

- `src/app/(public)`: portal, directorios, perfiles, campañas, apadrinamientos, necesidades y administración.
- `src/app/(shelter)`: panel protegido del albergue.
- `src/app/api`: sesión, gestión y apoyo con validación y autorización.
- `src/lib/data`: lecturas públicas con adaptadores demo/Supabase.
- `src/lib/huellas`: permisos, sesiones, almacén demo y lecturas privadas.
- `supabase/migrations`: baseline y upgrade HUELLAS.
- `tests`: pruebas de dominio, SQL y HTTP opcional.

Los módulos de animales perdidos del proyecto anterior se conservan para consulta. El alta de reportes y avistamientos queda explícitamente inhabilitada mientras no esté integrada; no muestra éxitos ficticios. Los mocks heredados de usuarios/donaciones/solicitudes y los antiguos managers se conservan como material previo y no alimentan los flujos activos del MVP.

## Pendiente para producción

1. Probar migración y autenticación contra una instancia Supabase de staging con datos representativos; revisar los accesos heredados antes de publicar.
2. Integrar una pasarela apropiada para Perú: checkout alojado, webhooks firmados, idempotencia del proveedor, conciliación, reembolsos y suscripciones. El estado cobrado debe venir de eventos verificados del proveedor.
3. Incorporar onboarding/aprobación de albergues, invitaciones de equipo, recuperación de contraseña, SMTP y notificaciones.
4. Añadir subida de imágenes a Storage con cuotas, validación y políticas por tenant. Actualmente se admiten URLs HTTPS; el optimizador solo permite los hosts configurados en `next.config.ts`. Agrega tu host de Storage al conectar archivos reales.
5. Definir política de privacidad, consentimiento, retención, responsabilidades y moderación antes de recoger datos de personas reales.
6. Rate limiting, auditoría de cambios, observabilidad, backups y restauración, pruebas de concurrencia y accesibilidad ampliadas.
7. Fichas veterinarias privadas, gastos/reportes de impacto, voluntariado y monetización SaaS siguen fuera del alcance de este MVP.

Referencias técnicas: [Next.js App Router](https://nextjs.org/docs/app), [Supabase SSR](https://supabase.com/docs/guides/auth/server-side), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

La verificación final de dependencias de ejecución (`npm audit --omit=dev`) no reportó vulnerabilidades. Hay avisos pendientes en herramientas de desarrollo (ESLint/shadcn); no se aplicaron cambios incompatibles con `--force`.
