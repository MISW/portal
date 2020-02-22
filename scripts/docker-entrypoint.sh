#!/bin/sh

if [[ -z "${DATABASE_URL}" ]]; then
  export DATABASE_URL="${CLEARDB_DATABASE_URL}"
fi

if [[ -z "${OIDC_REDIRECT_URL}" ]]; then
  export DATABASE_URL="https://${HEROKU_APP_NAME}.herokuapp.com/api/public/callback"
fi

eval "$(dbenv -)"

usage() {
    echo "Usage: $0 [-m] [-q] [-w]" 1>&2
    echo "Options: " 1>&2
    echo "-m: Run migration" 1>&2
    echo "-q: Quit without running server" 1>&2
    echo "-w: Wait for database to start" 1>&2
    exit 1
}

while getopts :mqwh OPT
do
    case $OPT in
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
    cat /schema/*.sql | mysqldef --user=$DATABSE_USER --password=$DATABASE_PASSWORD --host=$DATABASE_HOST -P $DATABASE_PORT $DATABASE_DB
fi

if [ "$QUIT" = "1" ]; then
    exit 0
fi

/bin/portal