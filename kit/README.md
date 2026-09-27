# Kit agnóstico: del mockup a un producto especificado

Esta carpeta contiene un armazón reutilizable para iniciar proyectos con GitHub Spec Kit y la skill Servilleta. Conserva lo que es universal —trazabilidad, fuentes, revisión humana y controles de seguridad— y deja fuera toda decisión que dependa del producto.

## Arranque

```bash
./kit/bin/nuevo-proyecto.sh /ruta/destino "Nombre del proyecto" /ruta/mockup
```

Requisitos del kit: Bash, Git, Node.js y `uvx`. Node.js ejecuta las herramientas de diseño; **no obliga a construir la aplicación con Node.js**.

El comando:

1. inicializa Spec Kit;
2. copia el mockup como golden master de solo lectura;
3. instala plantillas, skill, scripts y controles universales;
4. detecta una fuente inicial y genera el inventario;
5. deja marcadas las decisiones que todavía corresponden al proyecto.

No crea `apps/`, `packages/`, base de datos, API, Dockerfile ni pipeline de despliegue. Esos artefactos solo aparecen cuando la especificación y el plan han fijado el stack y demostrado que hacen falta.

## Contrato de neutralidad

Un proyecto recién generado no contiene:

- nombres, dominios, copy ni reglas de negocio de otro producto;
- un framework, gestor de paquetes o arquitectura de aplicación preseleccionados;
- autenticación, persistencia o servicios externos no exigidos;
- una infraestructura que finja estar lista sin conocer el runtime.

Las únicas convenciones iniciales son las rutas documentales de Spec Kit, `design/golden.config.json` y los comandos Node sin dependencias externas del kit.

## Contenido

| Ruta | Función |
|---|---|
| `bin/nuevo-proyecto.sh` | Bootstrap seguro e idempotencia defensiva |
| `config/golden.config.example.json` | Única descripción específica del mockup |
| `scripts/` | Tokens, contenido, capturas, inventario, fuentes y referencias |
| `templates/` | Constitución, primera rebanada y cierre |
| `security/` | Baseline OWASP y plantilla de análisis de seguridad |
| `docker/` | Contrato para instanciar Docker después de elegir runtime |
| `ci/` | Controles universales; las puertas del stack se añaden en el plan |
| `METODO.md` | Flujo operativo completo |

## Configuración del golden

`golden.config.json` empieza en modo conservador:

- inventario y una captura inicial activos;
- extracción de tokens desactivada hasta declarar selectores reales;
- extracción de contenido desactivada hasta declarar estructuras reales;
- mapa de specs vacío hasta aprobar la especificación maestra.

Un control desactivado se declara como tal; nunca simula una verificación positiva.
