#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR=/srv/projects/portfolio
DEPLOY_DIR="$PROJECT_DIR/deploy"
COMPOSE_FILE="$DEPLOY_DIR/compose.yaml"
CONTAINER=rodrigo_portfolio
PROJECT=portfolio

fail() {
  printf '%s\n' "$1" >&2
  exit 1
}

valid_run_id() {
  [[ "$1" =~ ^[0-9]+(-[0-9]+)?$ ]]
}

compose() {
  local image_ref="$1"
  shift
  PORTFOLIO_IMAGE="$image_ref" docker compose \
    --project-name "$PROJECT" \
    --project-directory "$PROJECT_DIR" \
    --file "$COMPOSE_FILE" \
    "$@"
}

restore_previous() {
  local run_id="$1"
  local state_dir="$DEPLOY_DIR/state/$run_id"
  [[ -d "$state_dir" ]] || fail 'No existe el estado de rollback para esta ejecución.'
  local previous_image previous_kind
  previous_image="$(cat "$state_dir/previous-image")"
  previous_kind="$(cat "$state_dir/previous-kind")"
  if [[ "$previous_kind" == legacy ]]; then
    rm -f "$COMPOSE_FILE"
    docker compose \
      --project-name "$PROJECT" \
      --project-directory "$PROJECT_DIR" \
      --file "$PROJECT_DIR/compose.yaml" \
      up --detach --no-build --pull never app
  elif [[ "$previous_kind" == managed ]]; then
    install -m 0600 "$state_dir/previous-compose.yaml" "$COMPOSE_FILE"
    PORTFOLIO_IMAGE="$previous_image" docker compose \
      --project-name "$PROJECT" \
      --project-directory "$PROJECT_DIR" \
      --file "$COMPOSE_FILE" \
      up --detach --no-build --pull never app
  else
    fail 'El estado de rollback no contiene una configuración conocida.'
  fi
  local attempt status
  for ((attempt = 1; attempt <= 20; attempt += 1)); do
    status="$(docker inspect --format '{{.State.Status}}' "$CONTAINER" 2>/dev/null || true)"
    if [[ "$status" == running ]]; then
      printf 'Rollback restauró el servicio anterior para la ejecución %s.\n' "$run_id"
      return 0
    fi
    sleep 2
  done
  fail 'El contenedor anterior no volvió a estado running; requiere intervención operativa.'
}

deploy() {
  local image_ref="$1"
  local commit_sha="$2"
  local run_id="$3"
  [[ "$image_ref" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]] || fail 'La imagen no es una referencia GHCR inmutable válida.'
  [[ "$commit_sha" =~ ^[a-f0-9]{40}$ ]] || fail 'El commit no es un SHA válido.'
  valid_run_id "$run_id" || fail 'El identificador de ejecución no es válido.'
  [[ -f "$DEPLOY_DIR/compose.next" ]] || fail 'Falta el Compose candidato.'
  [[ -f "$DEPLOY_DIR/runtime.env" ]] || fail 'Falta el archivo de entorno de producción.'
  [[ "$(stat -c '%a' "$DEPLOY_DIR/runtime.env")" == 600 ]] || fail 'runtime.env debe tener permisos 0600.'
  grep --quiet --fixed-strings 'GMAIL_SMTP_USER=rodrigo.valdelvira@gmail.com' "$DEPLOY_DIR/runtime.env" || fail 'GMAIL_SMTP_USER no coincide con la decisión D-03.'
  grep --quiet --fixed-strings 'GMAIL_SMTP_APP_PASSWORD=' "$DEPLOY_DIR/runtime.env" || fail 'Falta GMAIL_SMTP_APP_PASSWORD.'
  grep --quiet --fixed-strings 'CONTACT_FROM=rodrigo.valdelvira@gmail.com' "$DEPLOY_DIR/runtime.env" || fail 'CONTACT_FROM no coincide con la decisión D-03.'
  grep --quiet --fixed-strings 'CONTACT_TO=rodrigo.valdelvira@gmail.com' "$DEPLOY_DIR/runtime.env" || fail 'CONTACT_TO no coincide con la decisión D-03.'
  if ! grep --quiet --extended-regexp '^GMAIL_SMTP_APP_PASSWORD=..+' "$DEPLOY_DIR/runtime.env"; then
    fail 'La contraseña SMTP está vacía.'
  fi
  docker network inspect borde >/dev/null 2>&1 || fail 'No existe la red externa borde.'
  docker inspect "$CONTAINER" >/dev/null 2>&1 || fail 'No existe el contenedor previo que debe conservarse para rollback.'

  local state_dir previous_image previous_kind
  state_dir="$DEPLOY_DIR/state/$run_id"
  [[ ! -e "$state_dir" ]] || fail 'Esta ejecución ya tiene estado de despliegue; usa otro intento.'
  install -d -m 0700 "$state_dir"
  previous_image="$(docker inspect --format '{{.Config.Image}}' "$CONTAINER")"
  if [[ -f "$COMPOSE_FILE" ]]; then
    previous_kind=managed
    install -m 0600 "$COMPOSE_FILE" "$state_dir/previous-compose.yaml"
  elif [[ -f "$PROJECT_DIR/compose.yaml" ]]; then
    previous_kind=legacy
  else
    fail 'No se encontró Compose previo para rollback.'
  fi
  printf '%s\n' "$previous_image" > "$state_dir/previous-image"
  printf '%s\n' "$previous_kind" > "$state_dir/previous-kind"
  chmod 0600 "$state_dir/previous-image" "$state_dir/previous-kind"
  install -m 0600 "$DEPLOY_DIR/compose.next" "$COMPOSE_FILE"
  rm -f "$DEPLOY_DIR/compose.next"

  if ! compose "$image_ref" config --quiet; then
    restore_previous "$run_id"
    fail 'Compose candidato inválido; se restauró la versión anterior.'
  fi
  if ! compose "$image_ref" pull app; then
    restore_previous "$run_id"
    fail 'No se pudo descargar la imagen; se restauró la configuración anterior.'
  fi
  if ! compose "$image_ref" up --detach --no-build --pull never --force-recreate app; then
    restore_previous "$run_id"
    fail 'No se pudo iniciar la nueva imagen; se restauró la versión anterior.'
  fi

  local attempt status health
  for ((attempt = 1; attempt <= 30; attempt += 1)); do
    status="$(docker inspect --format '{{.State.Status}}' "$CONTAINER" 2>/dev/null || true)"
    health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$CONTAINER" 2>/dev/null || true)"
    if [[ "$status" == running && "$health" == healthy ]]; then
      {
        printf 'commit=%s\n' "$commit_sha"
        printf 'image=%s\n' "$image_ref"
        printf 'deployed_at=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
        printf 'url=https://rodrigovaldelvira.com\n'
        printf 'result=container-healthy\n'
      } > "$DEPLOY_DIR/last-deploy.txt"
      chmod 0600 "$DEPLOY_DIR/last-deploy.txt"
      printf 'Contenedor saludable; la comprobación HTTPS externa sigue pendiente.\n'
      return 0
    fi
    sleep 2
  done
  restore_previous "$run_id"
  fail 'Falló el healthcheck local; se restauró la versión anterior.'
}

mode="${1:-}"
case "$mode" in
  deploy)
    [[ "$#" -eq 4 ]] || fail 'Uso: deploy.sh deploy IMAGE_REF COMMIT_SHA RUN_ID'
    deploy "$2" "$3" "$4"
    ;;
  rollback)
    [[ "$#" -eq 2 ]] || fail 'Uso: deploy.sh rollback RUN_ID'
    valid_run_id "$2" || fail 'El identificador de ejecución no es válido.'
    restore_previous "$2"
    ;;
  *)
    fail 'Modo válido: deploy o rollback.'
    ;;
esac
