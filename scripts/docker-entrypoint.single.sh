#! /bin/sh

/bin/docker-entrypoint.frontend.sh &
/bin/docker-entrypoint.backend.sh -w -m
