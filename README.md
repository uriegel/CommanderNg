# Commander with Angular and C#

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Prerequisites
### Install ng/cli:
```
npm i -g @angular/cli 
ng new CommanderNg
cd CommanderNg
```
## Build and Run
### Starting point
```
npm i
```
### Build main thread
```
Ctrl+Shift+B: compile main typescript
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
