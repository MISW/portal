#!/bin/sh

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
    echo "Usage: $0 [-d] [-m] [-q] [-w]" 1>&2
    echo "Options: " 1>&2
    echo "-d: Run as development mode(require go)" 1>&2
    echo "-m: Run migration" 1>&2
    echo "-q: Quit without running server" 1>&2
    echo "-w: Wait for database to start" 1>&2
    exit 1
}

WAIT=0
QUIT=0
MIGRATION=0
ENVIRONMENT=prod

while getopts :dmqwh OPT
do
    case $OPT in
    d)  ENVIRONMENT=dev
        ;;
    m)  MIGRATION=1
        ;;
    q)  QUIT=1
        ;;
    w)  WAIT=1
        ;;
    h)  usage
        ;;
    \?) usage
        ;;
    esac
done

if [ "$WAIT" = "1" ]; then
    echo "Waiting for db"
    dockerize -wait tcp://$DATABASE_HOST:$DATABASE_PORT -timeout 60s
fi

if [ "$MIGRATION" = "1" ]; then
    echo "Running migration"
    cat /schema/*.sql | mysqldef --user=$DATABASE_USER --password=$DATABASE_PASSWORD --host=$DATABASE_HOST -P $DATABASE_PORT $DATABASE_DB
fi

if [ "$QUIT" = "1" ]; then
    exit 0
fi

if [ "${ENVIRONMENT:-}" = "dev" ]; then
    cd /backend && GO111MODULE=on go build -o /bin/portal
fi

export DATABASE_URL="$DATABASE_USER:$DATABASE_PASSWORD@tcp($DATABASE_HOST:$DATABASE_PORT)/$DATABASE_DB?parseTime=true&loc=Asia%2FTokyo"

/bin/portal
