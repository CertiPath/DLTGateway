@echo off
pushd ..
echo "Enter SQL Login PWD Here"  > SQL_LOGIN_PWD.secret 
@echo on

docker build --no-cache -t dlt-fabric-listener-img .
docker-compose up --force-recreate

@echo off
popd
@echo on
