"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
let win = null;
function createWindow() {
    // Initialize the window to our specified dimensions
    win = new electron_1.BrowserWindow({
        width: 600,
        height: 600,
        backgroundColor: '#ffffff',
        icon: `file://${__dirname}/dist/assets/logo.png`
    });
    console.log("Creating Window");
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'CommanderNg\\index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.on('closed', () => win = null);
}
electron_1.app.on('ready', () => createWindow());
console.log("Es geht los");
electron_1.app.on('window-all-closed', () => {
    if (process.platform != 'darwin')
        electron_1.app.quit();
});
//# sourceMappingURL=main.js.map