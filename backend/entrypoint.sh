#!/bin/bash
set -e

rm -f /app/tmp/pids/server.pid

bundle exec whenever --update-crontab

cron

exec "$@"