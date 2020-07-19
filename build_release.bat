RD /S /Q dist
RD /S /Q OCDBackend\bin
RD /S /Q OCDFrontend\dist

mkdir dist
mkdir dist\wwwroot
mkdir dist\docs

xcopy README.md dist\ /r /h
xcopy LICENSE.md dist\ /r /h
cd docs
xcopy *.* ..\dist\docs /e /s /r /h
cd ..

cd OCDBackend\OCDBackend
dotnet publish -c release -r win-x64 --self-contained -f netcoreapp3.1
cd ..\Plugins\OCDPlugin.Hydrus
dotnet build -c release
xcopy settings.json ..\..\..\dist\plugins\hydrus\ /r /h
cd ..\OCDPlugin.KeyPress
dotnet build -c release
cd ..\OCDPlugin.OBS
dotnet build -c release
cd ..\..\bin\release\
move plugins win-x64\plugins
cd win-x64
RD /S /Q publish
xcopy *.* ..\..\..\..\dist\ /e /s /r /h

cd ..\..\..\..\OCDFrontend
call ng build --prod
cd dist\OCDFrontend
xcopy *.* ..\..\..\dist\wwwroot /e /s /r /h