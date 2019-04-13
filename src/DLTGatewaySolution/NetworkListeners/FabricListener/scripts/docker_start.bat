@echo off
pushd ..
REM Using set and the /p parameter to echo without a newline 
echo|set /p="%DB_LOGIN_PWD%" > SQL_LOGIN_PWD.secret
@echo on

docker-compose rm && ^
docker-compose pull && ^
docker-compose build --no-cache && ^
docker-compose up --force-recreate && ^
docker-compose down

@echo off
rm -rf *.secret
popd
@echo on
