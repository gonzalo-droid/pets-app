# HUELLAS — Revisión del MVP frente a la definición de producto

Fecha: 10/11/2026. Compara lo que existe con la definición de producto y la guía visual.

## 1. Errores encontrados

| # | Problema | Estado |
|---|---|---|
| E1 | La web en Vercel mostraba "No pudimos cargar esta información". Causa comprobada en los logs: el proyecto de Supabase estaba pausado y faltaba la migración HUELLAS. | Resuelto |
| E2 | Al tocar la foto de una mascota no se abría su ficha (la foto tapaba el enlace). | Resuelto |
| E3 | Las campañas vencidas seguían mostrando "Donar ahora" y contaban como activas. | Resuelto |
| E4 | La página de campañas prometía "Yape o transferencia, 100% al albergue" y pasos con comprobante, aunque no hay pagos. | Resuelto |
| E5 | La ficha del animal ofrecía "Apadrinar" aunque estuviera adoptado. | Resuelto |
| E6 | La ficha mostraba atenuados "Vacunado/Castrado/Microchip" cuando no había dato, como si fuera un "no". | Resuelto: solo se muestran los datos confirmados |
| E7 | Perdidos fallaba para visitantes sin sesión (permiso faltante). | Resuelto |
| E8 | El menú no tenía "Inicio". | Resuelto |
| E9 | La "recaudación" de las campañas (p. ej. S/ 3,060) viene de datos de ejemplo heredados, no de pagos confirmados. | **Decidido (10/11/2026): se mantiene como dato de ejemplo por ahora.** Revisar antes de producción o al integrar pagos. |
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

Votación comunitaria de campañas (ver sección 6), pagos y suscripciones reales, notificaciones, subida de imágenes, onboarding y equipos de albergue, actualizaciones para padrinos, informes de transparencia, voluntariado, fichas veterinarias privadas, gastos e inventario, participación empresarial, auditoría y moderación, varios países. El módulo heredado de perdidos sigue fuera del alcance.

## 4. Hecho en esta iteración (diseño)

- Tokens de la guía: verde bosque #185642, crema #F5F1E8, salvia #E4EBDD, ámbar solo para avisos, foco azul.
- Tipografías: Inter para la interfaz, Lora en cursiva solo para "huella" en el hero.
- Menú con Inicio, sección activa, acceso según rol y menú móvil accesible.
- Portada: hero, campañas antes que animales, animales, necesidades abiertas y presentación de HUELLAS Gestión. Solo cifras reales.
- Tarjetas nuevas de animales, albergues y campañas.
- Ficha del animal reordenada: foto, estado, nombre, albergue, datos, acciones según el estado, historia.

## 5. Decisiones tomadas

1. "Votar por campañas": en el MVP, apoyar una campaña significa **registrar un compromiso de apoyo**. La votación comunitaria queda mapeada como función futura (sección 6), pendiente de definir.
2. Recaudación de ejemplo (E9): se mantiene visible por ahora.

## 6. Función futura: votación comunitaria de campañas

**Estado: por definir.** Esta ficha es un mapa inicial con preguntas abiertas. No forma parte del MVP.

| Aspecto | Propuesta inicial |
|---|---|
| Objetivo | Que la comunidad muestre qué campañas considera prioritarias y ayude a darles visibilidad, sin confundirlo con dinero. |
| Usuario | Miembro de la comunidad con sesión iniciada. Los visitantes ven los resultados, pero no votan. |
| Punto de entrada | Tarjeta y detalle de campaña: acción "Apoyar con mi voto" junto a "Apoyar campaña". |
| Flujo principal | 1. La persona abre una campaña abierta. 2. Toca votar (si no tiene sesión, inicia sesión y vuelve a la campaña). 3. El voto queda registrado y el botón cambia a "Votaste". 4. Puede retirar su voto. |
| Información necesaria | Campaña, persona, fecha. Sin importe. |
| Reglas de negocio | Un voto por persona y campaña. Solo campañas abiertas de albergues verificados. Un voto no es una donación ni un compromiso, y no suma a la recaudación. El albergue no puede votar sus propias campañas. Al cerrarse la campaña, los votos quedan congelados. |
| Permisos | Votar o retirar el voto: persona con sesión. Ver el total: público. Ver quién votó: nadie; solo se muestra el total. |
| Estados | Sin voto, votada y voto retirado. Campaña: abierta (acepta votos) o cerrada (no acepta). |
| Estados vacíos | "Sé la primera persona en apoyar esta campaña con tu voto." |
| Errores posibles | Sin sesión: llevar al login y volver. Campaña cerrada mientras votaba: avisar y no registrar. Doble clic: no duplicar el voto. |
| Criterios de aceptación | Un voto por persona y campaña, garantizado también en la base de datos. El total coincide con los votos activos. Una campaña cerrada no acepta votos. El voto nunca aparece como dinero. Funciona con teclado y en móvil. |
| Fase | Posterior al MVP. |

**Preguntas por responder antes de construirla:**
- ¿Para qué se usan los votos? ¿Solo para ordenar las campañas, para destacar una "campaña del mes" o para repartir fondos de un patrocinador?
- ¿Se vota por campañas, por necesidades o por ambas?
- ¿Hay periodos de votación (mensuales) o es continua?
- ¿Se muestra el número de votos o solo un orden de prioridad?
- ¿Qué medidas se toman contra cuentas falsas? Por ejemplo, exigir el correo verificado.
