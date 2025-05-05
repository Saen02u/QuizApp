#!/bin/bash

echo "wait mysql_db server"
dockerize -wait tcp://quiz_db:3306 -timeout 20s

echo "start node server"
npm start