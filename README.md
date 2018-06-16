# Commander with Electron and Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Prerequisites
### Install ng/cli:

npm i -g @angular/cli

ng new CommanderNg

cd CommanderNg

### Update index.html
<base href="./">
### Install electron
npm i electron --save-dev

in package.json:

"build-electron": "ng build --base-href . && copy src\\electron\\* dist\\",

"electron": "npm run build-electron && .\\node_modules\\.bin\\electron dist\\"

### polyfills.ts
import 'zone.js/dist/zone-mix';  // Included with Angular CLI.
