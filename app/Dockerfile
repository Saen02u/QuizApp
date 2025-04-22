FROM node:22.14
WORKDIR /app
COPY . .

RUN apt-get update && apt -y install mariadb-server && apt-get install -y libpng-dev libfontconfig locales
#Locale
RUN localedef -f UTF-8 -i ko_KR ko_KR.UTf-8
ENV LC_ALL=ko.KR.UTF-8

RUN npm install
RUN chmod +x ./init.sh
ENTRYPOINT ["/bin/bash", "./init.sh"]
