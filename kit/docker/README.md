# Contrato Docker pendiente de instanciar

El kit no incluye un Dockerfile ejecutable porque todavía desconoce el runtime, el artefacto de build y el modelo de procesos del proyecto. La primera spec que requiera ejecución local o producción debe crear el mínimo conjunto aplicable:

- `Dockerfile` multi-etapa con versiones fijadas y contexto mínimo;
- `compose.yaml` sin servicios que el producto no use;
- `.dockerignore` adaptado al ecosistema;
- `.env.example` sin valores secretos;
- healthcheck real del proceso, si existe servidor.

## Criterios comunes

- Build desde checkout limpio y lockfile congelado o equivalente.
- Imagen final sin toolchain ni ficheros innecesarios.
- Usuario dedicado no root, `no-new-privileges` y capacidades eliminadas cuando el runtime lo permita.
- Sistema de ficheros de solo lectura y `tmpfs` solo donde se necesite.
- Secretos montados o inyectados en runtime; nunca incorporados a capas de imagen.
- Señales y cierre limpio; límites de CPU/memoria documentados.
- Escaneo de vulnerabilidades y SBOM en CI.
- La misma imagen promovida entre entornos; configuración externa.

## Decisiones que debe cerrar el plan

1. Runtime y comando exacto de build/arranque.
2. Puerto y healthcheck, o justificación de que no hay proceso servidor.
3. Directorios escribibles y persistencia real.
4. Servicios auxiliares imprescindibles.
5. Plataformas objetivo y estrategia de fijación por digest.
6. Contrato local, producción y rollback.

No renombrar una plantilla de otro stack para “hacerla encajar”: se instancia este contrato con la arquitectura aprobada.
