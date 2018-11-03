import {BrowserWindow, protocol, Menu} from 'electron'
import * as settings from 'electron-settings'
import * as path from 'path'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'
import { ChildProcess } from 'child_process';

export function run(process: ChildProcess) {
    console.log("Displaying main window")

    const bounds = <any>settings.get("window-bounds", { 
        width: 800,
        height: 600
    })
    bounds.icon = path.join(__dirname, 'Commander/assets/images/kirk.png')

    const mainWindow = new BrowserWindow(bounds)
    mainWindow.loadURL("http://localhost:20000/Commander")
    
    if (settings.get("isMaximized"))
        mainWindow.maximize()

    setCloseBehaviour(mainWindow, process)

    mainWindow.on('resize', () => saveBounds())
    mainWindow.on('move', () => saveBounds())
    mainWindow.on('maximize', () => settings.set("isMaximized", true))
    mainWindow.on('unmaximize', () => settings.set("isMaximized", false))

    const theme = <any>settings.get("theme", getDefaultTheme())
    const showHidden = <boolean>settings.get("showHidden", false)

   // initializeMenu(mainWindow, theme, showHidden)

    function saveBounds() {
        if (!mainWindow.isMaximized()) {
            const bounds = mainWindow.getBounds()
            settings.set("window-bounds", <any>bounds)
        }
    }    
}

function getDefaultTheme() {
    return process.platform == "linux" ? "ubuntu": "blue"
}

function setCloseBehaviour(mainWindow: BrowserWindow, process: ChildProcess) {
    const onClose = new Observable<Electron.Event>(obs => {
        mainWindow.on('close', e => obs.next(e))
    })

    const firstClose = onClose.pipe(take(1))
    firstClose.subscribe(evt => {
        evt.preventDefault()
        process.stdin.write("Trying to stop Commander\r\n")
        mainWindow.close()
    })
}
 