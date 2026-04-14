# PawRescue — Funciones del proyecto

## Funciones implementadas

### Animales en adopción
- `getAnimals(filters?)` — lista animales con filtros de especie, tamaño, estado y ubicación (ubigeo/departamento)
- `getAnimalBySlug(slug)` — detalle de un animal individual
- `getAnimalsByShelter(shelterId)` — animales pertenecientes a un albergue
- Formulario de solicitud de adopción con datos del hogar, mascotas existentes e hijos
- Galería de fotos con imagen de portada

### Albergues
- `getShelters()` — lista albergues verificados
- `getShelterById(id)` — perfil básico del albergue
- `getShelterWithPhotos(id)` — perfil completo con galería de imágenes
- Página pública de perfil: descripción larga, redes sociales, datos de contacto, animales propios y campañas activas

### Reportes de mascotas perdidas/encontradas
- `getLostReports(filters?)` — lista reportes con filtros de tipo, especie, departamento y estado
- `getLostReportBySlug(slug)` — detalle del reporte con historial de avistamientos
- Formulario para crear reporte (perdido o encontrado) con ubicación, descripción, recompensa y teléfono
- Formulario de avistamiento: cualquier usuario puede agregar una pista

### Donaciones y campañas
- `getCampaigns(filters?)` — lista campañas con filtros de albergue, animal y estado activo
- `getCampaignBySlug(slug)` — detalle de campaña con barra de progreso
- `getDonationsByCampaigns(campaignIds)` — donaciones agrupadas por campaña
- `getDonationById(id)` — detalle de una donación
- Flujo de donación manual (Yape / transferencia bancaria) con subida de comprobante

### Panel del albergue (dashboard privado)
- Vista resumen del albergue (dashboard)
- `getAnimalsByShelter` — listado y gestión de animales propios
- Formulario para publicar un nuevo animal
- `getRequestsByShelter(shelterId)` — gestión de solicitudes de adopción (aprobar / rechazar / revisar)
- `getDonationsByCampaigns` — gestión de donaciones (verificar comprobante, aprobar / rechazar)
- Página de campañas del albergue
- Página de configuración del albergue

### Autenticación y roles
- Login y registro de usuarios
- Middleware que protege rutas `/shelter/*` y redirige según rol
- Roles definidos: `user`, `shelter`, `admin`
- Mock de usuarios para desarrollo sin Supabase conectado

### Layout y UI
- Navbar pública con estado de sesión (autenticado / no autenticado)
- Sidebar del panel de albergue con navegación entre secciones
- Footer global
- Soporte de modo oscuro / claro (`theme-toggle`)
- Componentes: `AnimalCard`, `ShelterCard`, `CampaignCard`, `LostReportCard`, `DonationProgress`, `PhotoGallery`

---

## Funciones propuestas

### Alta prioridad (MVP completo)

| Función | Descripción |
|---|---|
| **Conexión real a Supabase** | Reemplazar todos los mocks por llamadas reales a la base de datos con `supabase gen types` |
| **Subida de imágenes a Storage** | Fotos de animales y comprobantes de donación almacenadas en Supabase Storage |
| **Notificaciones en app** | Mostrar alertas para `adoption_approved`, `adoption_rejected`, `donation_confirmed`, `new_sighting` (el tipo ya existe en DB) |
| **Perfil del usuario** | Página con historial de solicitudes enviadas, donaciones realizadas y reportes creados |
| **Página de admin** | Panel para verificar albergues, moderar reportes y ver estadísticas globales |

### Media prioridad (diferenciadores de producto)

| Función | Descripción |
|---|---|
| **Mapa interactivo** | Mapa de Lambayeque con pins de animales perdidos, encontrados y en adopción por zona |
| **Seguimiento post-adopción** | El albergue puede publicar fotos y actualizaciones de un animal ya adoptado |
| **Voluntariado** | Formulario para que usuarios se inscriban como voluntarios de un albergue |
| **Integración de pagos** | Verificación automática vía Yape API o PagoEfectivo en lugar de comprobante manual |
| **Compartir en RRSS** | Open Graph dinámico por animal y campaña para compartir en WhatsApp, Facebook e Instagram |
| **Búsqueda global** | Barra de búsqueda full-text que cubra animales, albergues y reportes |

### Baja prioridad (crecimiento futuro)

| Función | Descripción |
|---|---|
| **Multi-región** | Expandir ubigeo más allá de Lambayeque a todo el Perú |
| **Donaciones recurrentes** | Opción de suscripción mensual a una campaña |
| **Match inteligente** | Sugerir animales compatibles según el perfil del usuario (¿tiene patio?, ¿tiene niños?, etc.) |
| **Reseñas de adoptantes** | Familias que adoptaron pueden dejar una reseña pública al albergue |
| **Alertas por email / WhatsApp** | Notificación automática cuando una solicitud cambia de estado |
| **App móvil (PWA)** | Manifest + service worker para instalar la app desde el navegador |
