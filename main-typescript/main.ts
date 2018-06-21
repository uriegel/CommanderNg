import {app, BrowserWindow, protocol} from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as addon from 'addon'

let win = null

app.on('ready', () => {

    protocol.registerBufferProtocol('icon', 
        (request, callback) => {
            const ext = decodeURI(request.url).substr(7)
            addon.getIcon(ext, (error, result) => callback(result))
        }, (error) => {}
    )

    // Initialize the window to our specified dimensions
    win = new BrowserWindow({
        width: 600, 
        height: 800,    
        backgroundColor: '#ffffff',
        icon: `file://${__dirname}/dist/assets/logo.png`
    })
    console.log("Creating Window")
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'Commander\\index.html'),
        protocol: 'file:',
        slashes: true
      }))
      
    win.on('closed', () => win = null)
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') 
        app.quit()
})