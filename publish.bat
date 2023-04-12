@echo off
npm version patch && ^
cd "%cd%\projects\ng-lazy-load-component" && ^
npm version patch && ^
cd "%cd%" && ^
npm run build ng-lazy-load-component --prod && ^
copy /y "%cd%\README.md" "%cd%\dist\ng-lazy-load-component\README.md" && ^
copy /y "%cd%\LICENSE" "%cd%\dist\ng-lazy-load-component\LICENSE" && ^
cd "%cd%\dist\ng-lazy-load-component" && ^
npm publish --ignore-scripts && ^
cd "%cd%"
pause