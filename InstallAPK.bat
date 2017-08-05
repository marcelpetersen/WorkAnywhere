@echo off
cd /d %~dp0
echo Uninstalling old APK...
call adb uninstall io.syracuseit.workanywhere
echo Deleting old APK...
if Exist "%~dp0\platforms\android\build\outputs\apk\android-debug.apk" call del "%~dp0\platforms\android\build\outputs\apk\android-debug.apk"
echo Building new APK...
call ionic cordova build android
echo Installing APK...
call adb install "%~dp0\platforms\android\build\outputs\apk\android-debug.apk"
echo Starting APK...
adb shell monkey -p io.syracuseit.workanywhere -c android.intent.category.LAUNCHER 1


