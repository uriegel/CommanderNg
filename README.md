# Commander with Electron and Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Prerequisites
### Install ng/cli:
```
npm i -g @angular/cli 
ng new CommanderNg
cd CommanderNg
```
### Update index.html
```
<base href="./">
```
### Install electron
```
npm i electron --save-dev
```
in package.json:
* build-electron: 
```ng build --base-href .```

* electron: 
```npm run build-electron && .\\node_modules\\.bin\\electron dist\\```

### Change polyfills.ts
```
import 'zone.js/dist/zone-mix';  // Included with Angular CLI. 
```
## Build and Run
### Starting point
```
npm i
```
## To build C++ Addon
```
npm install node-gyp -g 
```
Install python 2.7
```
npm install --global --production windows-build-tools  
```
in power shell mit Admin-Rechten:
```
npm install (to build node addon) 
```
to rebuild electron addon:
```
.\node_modules\\.bin\electron-rebuild.cmd 
```
### Manual build of addon
```
cd addon
node-gyp configure 
node-gyp build
```
### Build main thread
```
Ctrl+Shift+B: compile main typescript
```
### Build renderer and run
```
npm run electron
```
## Create Angular
### Component
``` ng g c <ComponentName>``` 

## Test scenarios
### Include scrollbar.html in main.ts
You can only test the following:
* Resizing window: scrollbar appears and disappears
* Press upper and lower button: the scrollbar thumb will move
* Press the space between button and scrollbar thumb: thumb will move pagewise
* Move scrollbar thumb

Content will not be scrolled!
### Include columns.html in main.ts
Now the columns control can be tested

### Include iconview.html in main.ts
Retrieve several icons from Windows via C++ addon

### Include tableview.html in main.ts
Test tableview functionality, column sorting, scrolling, ...
