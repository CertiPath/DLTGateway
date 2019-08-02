FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env
WORKDIR /solution

COPY . ./

WORKDIR /solution/Web
RUN dotnet restore

# # Copy everything else and build
# COPY . ./
# RUN dotnet publish -c Release -o out

# # Build runtime image
# FROM mcr.microsoft.com/dotnet/core/aspnet:2.2
# WORKDIR /web
# COPY --from=build-env /web/out .
# ENTRYPOINT ["dotnet", "CertiPath.BlockchainGateway.Web.dll"]
