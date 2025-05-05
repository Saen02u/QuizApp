docker rm -f quiz_app
docker rmi -f quiz_app
docker build -t quiz_app .
docker run -d --name=quiz_app --rm -p 8703:3000 -it quiz_app
echo "Done!"