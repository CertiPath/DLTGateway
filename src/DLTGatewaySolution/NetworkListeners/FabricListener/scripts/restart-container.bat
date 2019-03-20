docker stop dltgateway-fabric-listener
docker rm dltgateway-fabric-listener
docker build .. --tag dltgateway-fabric-listener-img
docker run -d -p --name dltgateway-fabric-listener dltgateway-fabric-listener-img
