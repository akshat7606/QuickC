#!/bin/sh
set -e

# Print helpful info and check backend reachability
/docker/print-frontend-info.sh || true

# Start nginx in the foreground
exec nginx -g 'daemon off;'

