#!/usr/bin/env sh

set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  if [ -n "${JAWSDB_URL:-}" ]; then
    export DATABASE_URL="${JAWSDB_URL}"
  else
    export DATABASE_URL="${CLEARDB_DATABASE_URL}"
  fi
fi

eval "$(dbenv -)"

usage() {
    echo "Usage: $0 [-d] [-m] [-q] [-s] [-w]" 1>&2
    echo "Options: " 1>&2
    echo "-d: Run as development mode(require go)" 1>&2
    echo "-m: Run migration" 1>&2
    echo "-q: Quit without running server" 1>&2
    echo "-s: Seed into database" 1>&2
    echo "-w: Wait for database to start" 1>&2
    exit 1
}

WAIT=0
QUIT=0
MIGRATION=0
SEED=0
ENVIRONMENT=prod

while getopts :dwmsqh OPT
do
    case $OPT in
    d)  ENVIRONMENT=dev
        ;;
    w)  WAIT=1
        ;;
    m)  MIGRATION=1
        ;;
    s)  SEED=1
        ;;
    q)  QUIT=1
        ;;
    h)  usage
        ;;
    \?) usage
        ;;
    esac
done

if [ "${ENVIRONMENT:-}" = "dev" ]; then
    go mod download
    go build -buildmode pie -buildvcs=false -o /bin/portal
fi

if [ "$WAIT" = "1" ]; then
    echo "Waiting for db"
    dockerize -wait tcp://$DATABASE_HOST:$DATABASE_PORT -timeout 480s
fi

if [ "$MIGRATION" = "1" ]; then
    echo "Running migration"
    cat /schema/*.sql | mysqldef --host=$DATABASE_HOST --port=$DATABASE_PORT --user=$DATABASE_USER --password=$DATABASE_PASSWORD $DATABASE_DB
fi

if [ "$SEED" = "1" ]; then
    echo "Seeding database"
    cat /seeds/*.sql | mariadb --host=$DATABASE_HOST --port=$DATABASE_PORT --user=$DATABASE_USER --password=$DATABASE_PASSWORD $DATABASE_DB
fi

if [ "$QUIT" = "1" ]; then
    exit 0
fi

export DATABASE_URL="$DATABASE_USER:$DATABASE_PASSWORD@tcp($DATABASE_HOST:$DATABASE_PORT)/$DATABASE_DB?parseTime=true&loc=Asia%2FTokyo"

/bin/portal
