#!/bin/sh

echo "✅ docker-entrypoint.sh started"

# 예: DB가 준비될 때까지 대기
dockerize -wait tcp://quiz_db:3306 -timeout 20s

# Node.js 앱 실행
exec npm start
