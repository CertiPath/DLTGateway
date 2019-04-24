set secretsDIR=..\secrets
IF not exist %secretsDIR% (mkdir %secretsDIR%)
IF not exist "%secretsDIR%\SQL_*" Powershell.exe -executionpolicy remotesigned -File  docker_create_secrets.ps1

pushd ..

docker-compose rm && ^
docker-compose pull && ^
docker-compose build --no-cache && ^
docker-compose up --force-recreate && ^
del .\secrets\* && ^
docker-compose down && ^
docker image prune

popd


