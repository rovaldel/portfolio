# Contenedor local de la spec 000

`Dockerfile` construye la aplicación Astro y ejecuta un único proceso Node en el puerto `3000`. La imagen base está fijada por digest y el proceso runtime usa UID/GID `10001`, sin root. El contenedor es ejecutable localmente; la spec sigue pendiente de aceptación mientras falle una escena visual o una revisión humana de `T070`.

```bash
docker compose up --build --wait
curl --fail --silent http://localhost:3000/api/salud
docker compose ps
docker compose down
```

`compose.yaml` no declara volúmenes de datos, aplica un filesystem de solo lectura, monta únicamente `/tmp` como `tmpfs`, elimina todas las capacidades Linux y activa `no-new-privileges`. El healthcheck usa `GET /api/salud` sin requerir SMTP, secretos ni servicios adicionales.

Contacto sigue siendo no operativo en esta entrega: el contenedor sirve los enlaces de correo/teléfono/LinkedIn, sin crear ni simular ningún envío.

La evidencia de `pnpm run test:visual` registra ahora las 19 escenas y falla ante cualquier diferencia superior al 0,5 %. Solo Habilidades y Artículo LangGraph admiten excepciones contractuales localizadas; ambas están pendientes de revisión humana y el resto de cada captura permanece bajo comparación. Consulte `artifacts/spec-000/visual-report.json` y `specs/000-esqueleto-visual-funcional/accessibility-review.md` antes de considerar aceptada la spec.

Si el puerto `3000` ya está ocupado, el puerto publicado se puede cambiar sin tocar el puerto interno del contenedor: `PORT=4317 docker compose up --build --wait`; compruebe el healthcheck en `http://localhost:4317/api/salud` y pare el servicio con `docker compose down`.
