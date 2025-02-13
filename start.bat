@echo off
echo Installing and starting root project...
@REM npm install
start cmd /k "npm run dev"

cd backend
echo Installing and starting backend...
@REM npm install
start cmd /k "npx tsc -b && npm start"
cd ..

cd application
echo Installing and starting application...
@REM npm install
start cmd /k "npm start"
cd ..
