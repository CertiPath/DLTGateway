#ARG core=mcr.microsoft.com/dotnet/framework/aspnet:4.7.2-windowsservercore-ltsc2019
#ARG target=mcr.microsoft.com/dotnet/framework/aspnet:4.7.2-windowsservercore-ltsc2019
#FROM $core as download
#
#SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]
#
#ENV GPG_VERSION 2.3.4
#
#RUN Invoke-WebRequest $('https://files.gpg4win.org/gpg4win-vanilla-{0}.exe' -f $env:GPG_VERSION) -OutFile 'gpg4win.exe' -UseBasicParsing ; \
    #Start-Process .\gpg4win.exe -ArgumentList '/S' -NoNewWindow -Wait
#
#RUN @( \
    #'94AE36675C464D64BAFA68DD7434390BDBE9B9C5', \
    #'FD3A5288F042B6850C66B31F09FE44734EB7990E', \
    #'71DCFD284A79C3B38668286BC97EC7A07EDE3FC1', \
    #'DD8F2338BAE7501E3DD5AC78C273792F7D83545D', \
    #'C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8', \
    #'B9AE9905FFD7803F25714661B63B535A4C206CA9', \
    #'77984A986EBC2AA786BC0F66B01FBB92821C587A', \
    #'8FCCA13FEF1D0C2E91008E09770F7A9A5AE15600', \
    #'4ED778F539E3634C779C87C6D7062848A1AB005C', \
    #'A48C2BEE680E841632CD4E44F07496B3EB3C1762', \
    #'B9E2F5981AA6E0CD28160D9FF13993A75599653C' \
    #) | foreach { \
      #gpg --keyserver ha.pool.sks-keyservers.net --recv-keys $_ ; \
    #}
#
#ENV NODE_VERSION 10.16.0
#
#RUN Invoke-WebRequest $('https://nodejs.org/dist/v{0}/SHASUMS256.txt.asc' -f $env:NODE_VERSION) -OutFile 'SHASUMS256.txt.asc' -UseBasicParsing ; \
    #gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc
#
#RUN Invoke-WebRequest $('https://nodejs.org/dist/v{0}/node-v{0}-win-x64.zip' -f $env:NODE_VERSION) -OutFile 'node.zip' -UseBasicParsing ; \
    #$sum = $(cat SHASUMS256.txt.asc | sls $('  node-v{0}-win-x64.zip' -f $env:NODE_VERSION)) -Split ' ' ; \
    #if ((Get-FileHash node.zip -Algorithm sha256).Hash -ne $sum[0]) { Write-Error 'SHA256 mismatch' } ; \
    #Expand-Archive node.zip -DestinationPath C:\ ; \
    #Rename-Item -Path $('C:\node-v{0}-win-x64' -f $env:NODE_VERSION) -NewName 'C:\nodejs'
#
## ENV YARN_VERSION 1.13.0
#
## RUN [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 ; \
##     Invoke-WebRequest $('https://yarnpkg.com/downloads/{0}/yarn-{0}.msi' -f $env:YARN_VERSION) -OutFile yarn.msi -UseBasicParsing ; \
##     $sig = Get-AuthenticodeSignature yarn.msi ; \
##     if ($sig.Status -ne 'Valid') { Write-Error 'Authenticode signature is not valid' } ; \
##     Write-Output $sig.SignerCertificate.Thumbprint ; \
##     if (@( \
##       '7E253367F8A102A91D04829E37F3410F14B68A5F', \
##       'AF764E1EA56C762617BDC757C8B0F3780A0CF5F9' \
##       ) -notcontains $sig.SignerCertificate.Thumbprint) { Write-Error 'Unknown signer certificate' } ; \
##     Start-Process msiexec.exe -ArgumentList '/i', 'yarn.msi', '/quiet', '/norestart' -NoNewWindow -Wait
#
## ENV GIT_VERSION 2.20.1
## ENV GIT_DOWNLOAD_URL https://github.com/git-for-windows/git/releases/download/v${GIT_VERSION}.windows.1/MinGit-${GIT_VERSION}-busybox-64-bit.zip
## ENV GIT_SHA256 9817ab455d9cbd0b09d8664b4afbe4bbf78d18b556b3541d09238501a749486c
#
## RUN [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 ; \
##     Invoke-WebRequest -UseBasicParsing $env:GIT_DOWNLOAD_URL -OutFile git.zip; \
##     if ((Get-FileHash git.zip -Algorithm sha256).Hash -ne $env:GIT_SHA256) {exit 1} ; \
##     Expand-Archive git.zip -DestinationPath C:\git; \
##     Remove-Item git.zip
#
#FROM $target
#
#SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]
#
#RUN Invoke-WebRequest 'https://download.visualstudio.microsoft.com/download/pr/fd368d43-d681-46b1-9e77-2d812f2f14ae/5bd60381d60f36aa4529934c7a83c0cf/dotnet-sdk-2.2.401-win-gs-x64.exe' -OutFile 'dotnet-sdk-2.2.401-win-gs-x64.exe' -UseBasicParsing ; \
    #Start-Process .\dotnet-sdk-2.2.401-win-gs-x64.exe -ArgumentList '/quiet' -NoNewWindow -Wait
#
#RUN Invoke-WebRequest 'https://download.microsoft.com/download/E/4/1/E4173890-A24A-4936-9FC9-AF930FE3FA40/NDP461-KB3102436-x86-x64-AllOS-ENU.exe' -OutFile 'NDP461-KB3102436-x86-x64-AllOS-ENU.exe' -UseBasicParsing ; \
    #Start-Process .\NDP461-KB3102436-x86-x64-AllOS-ENU.exe -ArgumentList '/quiet' -NoNewWindow -Wait
#
#ENV NPM_CONFIG_LOGLEVEL info
#
#COPY --from=download /nodejs /nodejs
## COPY --from=download [ "/Program Files (x86)/yarn", "/yarn" ]
## COPY --from=download /git /git
#
## RUN $env:PATH = 'C:\nodejs;C:\yarn\bin;C:\git\cmd;C:\git\mingw64\bin;C:\git\usr\bin;{0}' -f $env:PATH ; \
##     [Environment]::SetEnvironmentVariable('PATH', $env:PATH, [EnvironmentVariableTarget]::Machine)
#
#RUN $env:PATH = 'C:\nodejs;C:\program files\dotnet;{0}' -f $env:PATH ; \
    #[Environment]::SetEnvironmentVariable('PATH', $env:PATH, [EnvironmentVariableTarget]::Machine)
#
#CMD [ "node.exe" ]
#
#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat 

FROM windowsservercore-dotnet-node:latest AS base
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

WORKDIR "/src/Web/ClientApp"
RUN npm install

FROM build AS publish
RUN dotnet publish "CertiPath.BlockchainGateway.Web.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CertiPath.BlockchainGateway.Web.dll"]
