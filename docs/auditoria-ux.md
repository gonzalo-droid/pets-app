# Auditoría UX — HUELLAS

Fecha: 14/11/2026. Revisión del modo demo en móvil (390 px) y escritorio (1440 px): inicio, campañas, ficha del animal, apadrinar, solicitud de adopción, Mi espacio y panel del albergue.

Contexto asumido: web responsive, uso principal en móvil. Personas de Lambayeque que quieren ayudar a un albergue; albergues pequeños que publican lo que necesitan. Tarea principal: elegir una campaña o un animal y registrar un apoyo.

**Puntaje general: 6,5/10**

## Resumen

- Lo que funciona: textos claros y honestos ("sin cobro"), vuelta a la acción después de iniciar sesión, confirmación antes de acciones destructivas y buenos estados vacíos en el panel.
- Las campañas no muestran al animal, aunque la base ya los relaciona (`animal_id`). En escritorio, la campaña destacada deja un gran bloque vacío.
- La barra de huellas al 0 % casi no se ve (contraste 1,2:1) y transmite abandono.
- El campo de teléfono de la solicitud mide 32 px y no tiene autocompletado.
- En móvil, el panel del albergue corta las pestañas ("Nec…") y no destaca lo que espera respuesta.

## Hallazgos

| # | Severidad | Área | Problema | Arreglo recomendado |
|---|---|---|---|---|
| 1 | 🟠 Alto | Campañas | Ninguna campaña muestra foto. En escritorio, la tarjeta destacada (`CampaignCard featured`) se estira y deja ~250 px en blanco. | Usar la foto del animal (`animal_id`) o la portada del albergue; el alto de la tarjeta lo marca la foto. |
| 2 | 🟠 Alto | Accesibilidad | `PawProgress` sin avance: 10 huellas #ffe3d3 sobre blanco (1,2:1; WCAG 1.4.11 pide 3:1). | Barra sólida con borde #C9D3C4. Al 0 %: "Aún no hay apoyos registrados. Tu compromiso sería el primero." |
| 3 | 🟠 Alto | Formularios | `components/ui/input` usa `h-8` (32 px). El teléfono de la solicitud no tiene `autocomplete="tel"` y el formulario no usa el estilo `huellas-field` del resto. | Pasar el formulario a `huellas-field` (48 px), agregar `autoComplete="tel"` y mostrar la foto del animal arriba. |
| 4 | 🟠 Alto | Panel albergue | En móvil, las pestañas se cortan sin indicar que hay más; los 5 indicadores tienen el mismo peso. | Barra inferior de 5 secciones; bloque "Para hoy" con solicitudes y compromisos nuevos primero. |
| 5 | 🟡 Medio | Apadrinar | 4 párrafos de avisos antes de elegir el monto. | Monto primero; avisos en 3 puntos plegables y un solo "hoy no se cobra nada" junto al botón. |
| 6 | 🟡 Medio | Ficha del animal | Acciones duplicadas (barra fija y tarjeta). La historia queda al final, después de 5 cajas de datos. | Una sola barra de acciones; datos como etiquetas en una línea; historia justo después del nombre. |
| 7 | 🟡 Medio | Inicio | ~5.700 px de alto en móvil; 3 botones "Apoyar esta campaña" iguales seguidos; cifras apiladas. | Un caso destacado con foto; las demás campañas en lista compacta. |
| 8 | 🟡 Medio | Elegir campaña | Una sola campaña con más del 50 % del espacio; el apoyo pasa por otra pantalla. | Elegir el monto en el detalle de la campaña, con botón fijo "Registrar compromiso de S/ X". |
| 9 | 🟢 Bajo | Visual | Rasgos de plantilla: fondo crema con acento arcilla, etiquetas inclinadas, "Apoya · Apadrina · Adopta", una sola palabra en color en el título, 5 colores en el panel. | Ver la propuesta de sistema visual. |
| 10 | 🟢 Bajo | Lenguaje | "Abierta" se repite en cada tarjeta de la lista de abiertas; el pie dice "MVP". | Quitar la etiqueta redundante; reemplazar "MVP" por "Por ahora los apoyos son compromisos sin cobro". |

## Arreglos rápidos (menos de 1 hora)

1. `autoComplete="tel"` y alto de 48 px en el formulario de adopción (#3).
2. Borde y mensaje del 0 % en `PawProgress` (#2).
3. Quitar la etiqueta "Abierta" en la lista filtrada y la palabra "MVP" (#10).
4. Quitar las acciones duplicadas de la ficha del animal (#6).

## Propuesta de rediseño

Lienzo con 8 pantallas: https://claude.ai/artifact/KeYtJkSzAaMPCdN6kcEPTh

- Se mantienen el verde de confianza, el acento cálido para apoyar y las letras Fredoka + Nunito.
- **Hocico #B8324B** reemplaza al coral arcilla #C4513A. Es más rosado (nariz, almohadillas) y tiene más contraste: 5,8:1 con texto blanco.
- **Papel #F6F7F2** reemplaza al crema #FFF8F1.
- El nombre de cada animal va en su **placa de collar** amarilla (#F2C14E). Es el único adorno del sistema.
- Un solo botón principal por pantalla, de 48 px de alto como mínimo.
