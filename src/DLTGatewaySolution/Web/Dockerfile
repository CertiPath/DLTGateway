#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat 

FROM mcr.microsoft.com/dotnet/core/aspnet:2.1-nanoserver-1809 AS base
WORKDIR /Misc
COPY Misc .
#RUN node-v10.16.1-x64.msi /quiet

WORKDIR /app
EXPOSE 80

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
