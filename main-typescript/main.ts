import {app, BrowserWindow} from 'electron'
import * as path from 'path'
import * as url from 'url'

let win = null

function createWindow() {
    // Initialize the window to our specified dimensions
    win = new BrowserWindow({
        width: 600, 
        height: 600,
        backgroundColor: '#ffffff',
        icon: `file://${__dirname}/dist/assets/logo.png`
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'CommanderNg\\index.html'),
        protocol: 'file:',
        slashes: true
      }))
      
    win.on('closed', () => win = null)
}

app.on('ready', () => createWindow())

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') 
        app.quit()
})