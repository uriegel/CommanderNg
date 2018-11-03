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

    initializeMenu(mainWindow, theme, showHidden)

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
 
function initializeMenu(mainWindow: BrowserWindow, theme: string, showHidden: boolean) {
    const menu = Menu.buildFromTemplate([
        {
            label: '&Datei',
            submenu: [{
                label: '&Umbenennen',
                accelerator: "F2"
            },{
                type: 'separator'
            },{
                label: '&Kopieren',
                accelerator: "F5"
            },
            {
                label: '&Verschieben',
                accelerator: "F6"
            },
            {
                label: '&Löschen',
                accelerator: "Delete",
                // click: evt =>  mainWindow.webContents.send("delete")
            },
            {
                type: 'separator'
            },            
            {
                label: 'Ordner &anlegen',
                accelerator: "F7",
            },            
            {
                label: '&Eigenschaften',
                accelerator: "Alt+Enter"
            },
            {
                label: '&Beenden',
                accelerator: 'Alt+F4',
                role: "quit"
            }
        ]},
        {
            label: '&Navigation',
            submenu: [{
                label: '&Erstes Element',
                accelerator: 'Home'
            },
            {
                label: '&Favoriten',
                accelerator: 'F1'
            }
        ]},
        {
            label: '&Selection',
            submenu: [{
                label: '&Alles'
            },
            {
                label: '&Nichts'
            }
        ]},
        {
            label: '&Ansicht',
            submenu: [{
                label: '&Versteckte Dateien',
                accelerator: "Ctrl+H",
                checked: showHidden,
                type: "checkbox",
                click: evt => {
                    //post("showHidden", formatParams({"show": evt.checked}))
                    settings.set("showHidden", evt.checked)
                }
            },
            {
                label: '&Aktualisieren',
                accelerator: "Ctrl+R",
                //click: evt => post("refresh")
            },            
            {
                type: 'separator'
            },            
            {
                label: '&Vorschau',
                accelerator: "F3",
                type: "checkbox",
//                click: evt =>  mainWindow.webContents.send("viewer", evt.checked)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Ubuntu',
                type: "radio",
                visible: process.platform == "linux",
                checked: theme == "ubuntu",
                click: () => setTheme(mainWindow, "ubuntu")
            },
            {
                label: '&Blaues Thema',
                type: "radio",
                checked: theme == "blue",
                click: () => setTheme(mainWindow,"blue")
            },
            {
                label: '&Hellblaues Thema',
                type: "radio",
                checked: theme == "lightblue",
                click: () => setTheme(mainWindow,"lightblue")
            },
            {
                label: '&Dunkles Thema',
                type: "radio",
                checked: theme == "dark",
                click: () => setTheme(mainWindow,"dark")
            },
            {
                type: 'separator'
            },            
            {
                label: '&Vollbild',
                click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()),
                accelerator: "F11"
            },
            {
                type: 'separator'
            },            
            {
                label: '&Entwicklerwerkzeuge',
                click: () => mainWindow.webContents.openDevTools(),
                accelerator: "F12"
            }
        ]}
    ])

    Menu.setApplicationMenu(menu)   
}

function setTheme(mainWindow: BrowserWindow, theme: string) {
    console.log("Theme", theme)
    mainWindow.webContents.send("setTheme", theme)
    settings.set("theme", theme)  
}

