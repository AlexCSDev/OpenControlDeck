## Prerequisites
* All platforms: [.NET Core SDK 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1), [Node.js, npm, Angular CLI](https://angular.io/guide/setup-local)
* Windows (optional): [Microsoft Visual Studio 2019](https://visualstudio.microsoft.com/en/vs/)

## Building release build on Windows (standalone windows-x64 build)
Run **build_release.bat**, all files will be placed in **dist** subdirectory.

## Building release build on other platforms
There are no automatic build scripts for other platforms at this time. You can manually execute build steps from **build_release.bat** in order to build release build.

## Debugging backend on Windows (via Visual Studio)
1. Open **OCDBackend\OCDBackend.sln**
2. Select desired build configuration in build toolbar and build solution by pressing **Build -> Build Solution**. This will copy all required plugin files into correct directories
3. Run **Debug -> Start Debugging**

## Debugging frontend on Windows
1. Open command line in **OCDFrontend** directory
2. Execute **ng serve**
3. Development webserver will be started on port 4200