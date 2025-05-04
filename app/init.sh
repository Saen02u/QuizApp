#!/bin/sh

#location
ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

#service mariadb start
service mariadb start

#edit config file
cat ./my.cnf >> /etc/mysql/my.cnf

#setting logging file
touch /var/log/mysql.log
chown mysql:mysql /var/log/mysql.log
touch /var/log/mysql-bin.log
chown mysql:mysql /var/log/mysql-bin.log
touch /var/log/mysql-error.log
chown mysql:mysql /var/log/mysql-error.log
touch /var/log/mysql-slowquery.log
chown mysql:mysql /var/log/mysql-slowquery.log
chmod 644 /var/log/mysql*

#service mariadb restart
service mariadb restart

USER="toshwm"
PASSWORD="tltmxpaznlwm"

echo "Creating new user ${MYSQL_USER} ..."
mysql -uroot -e "CREATE USER '${USER}'@'localhost' IDENTIFIED BY '${PASSWORD}';"
echo "Granting privileges..."
mysql -uroot -e "GRANT ALL PRIVILEGES ON *.* TO '${USER}'@'localhost';"
mysql -uroot -e "GRANT FILE ON *.* TO '${USER}'@'localhost';"
mysql -uroot -e "FLUSH PRIVILEGES;"
echo "Done! Permissions granted"
mysql -u$USER -p$PASSWORD -e "CREATE database QuizApp;"
mysql -u$USER -p$PASSWORD QuizApp  < ./init.db
echo "All done."
sleep 5
npm start