#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "$EUID" -ne 0 ]]; then
  printf '%s\n' 'Ejecuta este provisionamiento como root en Hetzner.' >&2
  exit 1
fi
id deploy >/dev/null 2>&1 || { printf '%s\n' 'Primero crea el usuario deploy.' >&2; exit 1; }
read -r -p 'Usuario GitHub propietario del paquete: ' ghcr_user
[[ "$ghcr_user" =~ ^[A-Za-z0-9-]+$ ]] || { printf '%s\n' 'Nombre de usuario inválido.' >&2; exit 1; }
read -r -s -p 'Token GHCR de solo lectura (read:packages): ' ghcr_token
printf '\n'
[[ -n "$ghcr_token" ]] || { printf '%s\n' 'Token vacío.' >&2; exit 1; }
install -d -o deploy -g deploy -m 0700 /home/deploy/.docker
if ! printf '%s' "$ghcr_token" | runuser -u deploy -- env HOME=/home/deploy docker login ghcr.io --username "$ghcr_user" --password-stdin >/dev/null; then
  unset ghcr_token
  printf '%s\n' 'No se pudo guardar el acceso de lectura a GHCR.' >&2
  exit 1
fi
unset ghcr_token
chown deploy:deploy /home/deploy/.docker/config.json
chmod 0600 /home/deploy/.docker/config.json
printf '%s\n' 'Credencial GHCR guardada para deploy con permisos 0600; no se copia al workflow.'
