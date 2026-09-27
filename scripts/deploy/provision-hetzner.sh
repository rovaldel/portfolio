#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "$EUID" -ne 0 ]]; then
  printf '%s\n' 'Ejecuta este provisionamiento como root en Hetzner.' >&2
  exit 1
fi
public_key="${1:-}"
if [[ ! "$public_key" =~ ^ssh-ed25519[[:space:]]+[A-Za-z0-9+/=]+([[:space:]].*)?$ ]]; then
  printf '%s\n' 'Pasa como argumento la clave pública ssh-ed25519 exclusiva del workflow.' >&2
  exit 1
fi
if ! getent group docker >/dev/null; then
  printf '%s\n' 'No existe el grupo docker en el servidor.' >&2
  exit 1
fi
if ! id deploy >/dev/null 2>&1; then
  useradd --create-home --user-group --shell /bin/bash deploy
fi
usermod --append --groups docker deploy
passwd --lock deploy >/dev/null 2>&1 || true
install -d -o deploy -g deploy -m 0700 /home/deploy/.ssh
install -o deploy -g deploy -m 0600 /dev/null /home/deploy/.ssh/authorized_keys.tmp
if [[ -f /home/deploy/.ssh/authorized_keys ]]; then
  cat /home/deploy/.ssh/authorized_keys >> /home/deploy/.ssh/authorized_keys.tmp
fi
if ! grep --fixed-strings --line-regexp --quiet "$public_key" /home/deploy/.ssh/authorized_keys.tmp; then
  printf '%s\n' "$public_key" >> /home/deploy/.ssh/authorized_keys.tmp
fi
install -o deploy -g deploy -m 0600 /home/deploy/.ssh/authorized_keys.tmp /home/deploy/.ssh/authorized_keys
rm -f /home/deploy/.ssh/authorized_keys.tmp
install -d -o deploy -g deploy -m 0750 /srv/projects/portfolio/deploy
printf '%s\n' 'Usuario deploy preparado con acceso SSH por clave y acceso a Docker.'
printf '%s\n' 'El archivo /srv/projects/portfolio/deploy/runtime.env debe crearse aparte con permisos 0600.'
printf '%s\n' 'Configura también el token GHCR de solo lectura con login-ghcr-once.sh.'
