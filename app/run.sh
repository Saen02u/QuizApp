sudo docker rm -f quiz_app
sudo docker rmi -f quiz_app
sudo docker build -t quiz_app .
sudo docker run -d --name=quiz_app --rm -p 8703:3000 -it quiz_app
echo "Done!"