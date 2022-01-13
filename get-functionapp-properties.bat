echo off
if "%1"=="" echo "missing function app name" && GOTO completed
if "%2"=="" echo "missing resource group name" && GOTO completed

mkdir output 2> NUL
az functionapp config appsettings list --name %1 --resource-group %2 > output\functionapp_settings.json && echo running dev && npm run dev

:completed
echo done
