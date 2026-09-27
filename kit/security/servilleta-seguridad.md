# Servilleta: Seguridad proporcional · spec 001

> Usar como spec separada solo si el riesgo o el tamaño lo justifican. En productos pequeños, integrar estos criterios en la spec 000 evita una rebanada horizontal sin valor.

**Depende de:** especificación maestra y modelo de amenazas

**Se valida viendo:** informe de controles aplicables, pruebas negativas y puertas de CI en verde.

## 0. Referencias

- `compliance/BASELINE_OWASP.md`.
- Constitución, sección de seguridad.
- ⚠️ Modelo de amenazas y clasificación de datos del proyecto.
- **Nivel declarado:** ASVS ⚠️; MASVS ⚠️ si aplica; fecha de verificación de versiones ⚠️.

## 1. Objetivo

Convertir los riesgos reales del producto en controles comprobables antes de exponer cada superficie.

## 2. Actores

Personas usuarias, equipo, operadores, terceros y potenciales atacantes relevantes: ⚠️.

## 3. Escenarios

- Como responsable, quiero que un cambio que incumple un control aplicable no se integre.
- Como persona usuaria, quiero que mis datos y acciones respeten el nivel de protección declarado.
- Como operador, quiero detectar y recuperar fallos sin exponer información.

## 4. Requisitos

- **RF1.** Mantener una matriz de aplicabilidad con prueba y evidencia por control.
- **RF2.** Validar y limitar cada entrada no confiable; codificar cada salida por contexto.
- **RF3.** Mantener secretos fuera de código, logs y cliente.
- **RF4.** Activar las puertas que correspondan al stack y bloquear la integración ante hallazgos por encima del umbral aprobado.
- **RF5.** Aplicar mínimo privilegio en runtime, CI y producción.
- **RF6.** ⚠️ Controles de identidad/autorización solo si existen cuentas o recursos privados.
- **RF7.** ⚠️ Controles de datos según clasificación, retención, residencia y terceros.
- **RF8.** ⚠️ Healthcheck, observabilidad y rollback si existe despliegue.

## 5. Reglas

- Un “no aplica” sin motivo se considera pendiente.
- Un fallo de configuración crítica en producción falla cerrado.
- Un log nunca compensa una exposición de datos: se registra el mínimo identificador técnico necesario.
- Ninguna excepción de seguridad es permanente: incluye responsable, alcance y caducidad.

## 6. Criterios de aceptación

- Cada frontera pública tiene pruebas de entrada inválida, tamaño límite, abuso y fallo del tercero si existe.
- El historial no contiene secretos detectables.
- Los análisis del stack y de dependencias pasan con el umbral acordado.
- La imagen no corre como root y supera escaneo si hay contenedor.
- Las rutas privadas niegan acceso horizontal y vertical si existen.
- El rollback restaura una versión sana si existe despliegue.

## 7. Casos límite

Configuración ausente, secreto rotado, dependencia comprometida, timeout, doble envío, reintento, tercero caído, disco lleno y rollback fallido: seleccionar solo los aplicables y concretar respuesta.

## 8. Fuera de alcance

⚠️ Auditorías externas, certificaciones y mitigaciones de infraestructura gestionadas por terceros, con responsable y momento de incorporación.

## 9. Decisiones

⚠️ Nivel, clasificación de datos, controles aplicables, umbrales, responsables, retención y proceso de excepción.
