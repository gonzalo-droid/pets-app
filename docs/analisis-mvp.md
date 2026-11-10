# HUELLAS — Revisión del MVP frente a la definición de producto

Fecha: 10/11/2026. Compara lo que existe con la definición de producto y la guía visual.

## 1. Errores encontrados

| # | Problema | Estado |
|---|---|---|
| E1 | La web en Vercel mostraba "No pudimos cargar esta información". Causa comprobada en los logs: el proyecto de Supabase estaba pausado y faltaba la migración HUELLAS. | Resuelto |
| E2 | Al tocar la foto de una mascota no se abría su ficha (la foto tapaba el enlace). | Resuelto |
| E3 | Las campañas vencidas seguían mostrando "Donar ahora" y contaban como activas. | Resuelto (pendiente de publicar) |
| E4 | La página de campañas prometía "Yape o transferencia, 100% al albergue" y pasos con comprobante, aunque no hay pagos. | Resuelto |
| E5 | La ficha del animal ofrecía "Apadrinar" aunque estuviera adoptado. | Resuelto |
| E6 | La ficha mostraba atenuados "Vacunado/Castrado/Microchip" cuando no había dato, como si fuera un "no". | Resuelto: solo se muestran los datos confirmados |
| E7 | Perdidos fallaba para visitantes sin sesión (permiso faltante). | Resuelto |
| E8 | El menú no tenía "Inicio". | Resuelto |
| E9 | La "recaudación" de las campañas (p. ej. S/ 3,060) viene de datos de ejemplo heredados, no de pagos confirmados. La definición pide no mostrar cifras inventadas. | **Decisión pendiente** |
| E10 | Las solicitudes de adopción permiten cualquier cambio de estado (p. ej. de "Completada" a "Pendiente"). La definición pide transiciones definidas. | Pendiente |

## 2. Funciones incompletas del MVP

| Área | Qué falta | Prioridad |
|---|---|---|
| Inicio de sesión | Al pedir login desde "Solicitar adopción" o "Apadrinar", la persona no vuelve a esa acción; termina en su perfil. | Alta |
| Mi espacio (donante) | Los apoyos muestran tipo e importe, pero no el destino (campaña o animal) ni la fecha; usan el identificador como referencia. No hay pestañas Apoyos / Solicitudes / Perfil. | Alta |
| Solicitudes (albergue) | Falta el nombre del animal en cada solicitud, la regla de transiciones y una confirmación explícita para "Completar". | Alta |
| Panel del albergue | Aún no usa la barra lateral verde de la guía; las campañas solo se crean (no se cierran ni editan); el perfil solo edita nombre y descripción. | Media |
| Apadrinamiento | Falta explicar si el aporte va al animal o al fondo del albergue. | Media |
| Administración | No explica qué pasa al retirar una verificación (deja de verse en el portal). | Media |
| Perfil del albergue (público) | Revisar contra la guía visual y mostrar sus necesidades abiertas. | Media |

## 3. Ampliaciones (fase posterior)

Pagos y suscripciones reales, notificaciones, subida de imágenes, onboarding y equipos de albergue, actualizaciones para padrinos, informes de transparencia, voluntariado, fichas veterinarias privadas, gastos e inventario, participación empresarial, auditoría y moderación, varios países. El módulo heredado de perdidos sigue fuera del alcance.

## 4. Hecho en esta iteración (diseño)

- Tokens de la guía: verde bosque #185642, crema #F5F1E8, salvia #E4EBDD, ámbar solo para avisos, foco azul.
- Tipografías: Inter para la interfaz, Lora en cursiva solo para "huella" en el hero.
- Menú con Inicio, sección activa, acceso según rol y menú móvil accesible.
- Portada: hero, campañas antes que animales, animales, necesidades abiertas y presentación de HUELLAS Gestión. Solo cifras reales.
- Tarjetas nuevas de animales, albergues y campañas.
- Ficha del animal reordenada: foto, estado, nombre, albergue, datos, acciones según el estado, historia.

## 5. Preguntas abiertas

1. "Votar por campañas": se interpretó como **apoyar** (registrar un compromiso). Si se quiere una votación comunitaria, es una función nueva que hay que definir.
2. Recaudación de ejemplo (E9): ¿ocultarla hasta que existan pagos confirmados, o etiquetarla como "dato de ejemplo"?
