FROM mcr.microsoft.com/dotnet/framework/aspnet:4.7.2-windowsservercore-ltsc2019 AS base

WORKDIR /app
EXPOSE 80:5000

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

RUN Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
RUN choco install dotnetcore-runtime --version 2.1.1 -y --no-progress --no-color
RUN choco install aspnetcore-runtimepackagestore --version 2.1.1 -y --no-progress --no-color
RUN choco install nodejs -y --no-progress --no-color


FROM mcr.microsoft.com/dotnet/core/sdk:2.1-nanoserver-1809 AS build
WORKDIR /src
COPY ["Web/CertiPath.BlockchainGateway.Web.csproj", "Web/"]
COPY ["Common/CertiPath.BlockchainGateway.Model/CertiPath.BlockchainGateway.Model.csproj", "Common/CertiPath.BlockchainGateway.Model/"]
COPY ["Database/CertiPath.BlockchainGateway.DataLayer/CertiPath.BlockchainGateway.DataLayer.csproj", "Database/CertiPath.BlockchainGateway.DataLayer/"]
RUN dotnet restore "Web/CertiPath.BlockchainGateway.Web.csproj"
COPY . .
WORKDIR "/src/Web"
RUN dotnet build "CertiPath.BlockchainGateway.Web.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "CertiPath.BlockchainGateway.Web.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CertiPath.BlockchainGateway.Web.dll"]
