#!/bin/bash
set -e

rm -f /app/tmp/pids/server.pid

bundle exec whenever --update-crontab --set environment=${RAILS_ENV:-production}

cron -f &

exec bundle exec puma -C config/puma.rb