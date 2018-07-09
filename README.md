# Commander with Electron and Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Prerequisites
### Install ng/cli:
```
npm i -g @angular/cli 
ng new CommanderNg
cd CommanderNg
```
### Install electron
```
npm i electron --save-dev
```
in package.json:
* build-electron: 
```"ng build --base-href . && copy main-typescript\\package.json dist\\package.json"``` 
* electron: 
```"npm run build-electron && .\\node_modules\\.bin\\electron --inspect=5858 dist\\"```

### header includes for intellisense:
in c_cpp_properties.json:
```
"includePath": [
    "${workspaceFolder}/**",
    "${workspaceFolder}/node_modules/nan",
    "${env:USERPROFILE}/.electron-gyp/.node-gyp/iojs-2.0.2/src",
    "${env:USERPROFILE}/.electron-gyp/.node-gyp/iojs-2.0.2/deps/uv/include",
    "${env:USERPROFILE}/.electron-gyp/.node-gyp/iojs-2.0.2/deps/v8/include"
],
```

## To build C++ Addon
```
npm install node-gyp -g 
```
Install python 2.7
```
npm install --global --production windows-build-tools  
```
in power shell:
```
npm install (to build node addon) 
```

## Build and Run
### Starting point
```
npm i
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
### Provider (service)
``` ng g s <ProviderName>``` 
### Component in sub folder 
``` ng g c <subfolder/<ComponentName>``` 

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
