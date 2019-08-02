REM set secretsDIR=..\secrets
REM IF not exist %secretsDIR% (mkdir %secretsDIR%)
REM IF not exist "%secretsDIR%\SQL_*" Powershell.exe -executionpolicy remotesigned -File  docker_create_secrets.ps1

pushd ..

docker-compose rm && ^
docker-compose pull && ^
docker-compose build --no-cache && ^
docker-compose up --force-recreate && ^
REM del .\secrets\* && ^
REM docker-compose down && ^
REM docker image prune

popd


