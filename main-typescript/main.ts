import {app, BrowserWindow, protocol, Menu} from 'electron'
import * as path from 'path'
import * as settings from 'electron-settings'
import  { spawn } from 'child_process'
var XMLHttpRequest = require('xhr2')

function getDefaultTheme() {
    return process.platform == "linux" ? "ubuntu": "blue"
}

function start() {
    const bounds = <any>settings.get("window-bounds", { 
        width: 800,
        height: 600
    })
    bounds.icon = path.join(__dirname, 'Commander/assets/images/kirk.png')

    const mainWindow = new BrowserWindow(bounds)
    mainWindow.loadURL("http://localhost:20000/Commander")
    
    if (settings.get("isMaximized"))
        mainWindow.maximize()

    let canClose = false
    mainWindow.on('close', async e => {
        if (canClose)
            return
        canClose = true
        e.preventDefault()
        await close()
        mainWindow.close()
    })

    mainWindow.on('resize', () => saveBounds())

    mainWindow.on('move', () => saveBounds())

    mainWindow.on('maximize', () => settings.set("isMaximized", true))

    mainWindow.on('unmaximize', () => settings.set("isMaximized", false))

    const theme = <any>settings.get("theme", getDefaultTheme())

    initializeMenu(mainWindow, theme)

    function saveBounds() {
        if (!mainWindow.isMaximized()) {
            const bounds = mainWindow.getBounds()
            settings.set("window-bounds", <any>bounds)
        }
    }    
    return theme
}

app.on('ready', () => {
    console.log("Starting Commander")
    
    const prc = spawn("dotnet", [ "../Commander/bin/Debug/netcoreapp2.1/Commander.dll" ])
    let theme = ""
    prc.stdout.on('data', data => {
        const str = data.toString() as string
        const lines = str.split(/(\r?\n)/g).map(n => n.trim()).filter(n => !!n)
        lines.forEach(n => {
            switch (n) {
                case "-cmdevt: ready":
                    theme = start()
                    break
                case "-cmdevt: sse":
                    setTheme(theme)
                    break
                default:
                    console.log(n)
                    break
            }
        })
    })

    const addon = require('addon')
    console.log(addon.hello())

    prc.on('close', code => console.log('process exit code', code))

    //const auguryPath = 'C:\\Users\\urieg\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\elgalmkoelokbchhkhacckoklkejnhcd\\1.19.1_0'
    //BrowserWindow.addDevToolsExtension(auguryPath)
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') 
        app.quit()
})

function close() {
    return post("close")
}

function initializeMenu(mainWindow: BrowserWindow, theme: string) {
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
                type: "checkbox",
                click: evt => post("showHidden", formatParams({"show": evt.checked}))
            },
            {
                label: '&Aktualisieren',
                accelerator: "Ctrl+R",
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
                click: () => setTheme("ubuntu")
            },
            {
                label: '&Blaues Thema',
                type: "radio",
                checked: theme == "blue",
                click: () => setTheme("blue")
            },
            {
                label: '&Hellblaues Thema',
                type: "radio",
                checked: theme == "lightblue",
                click: () => setTheme("lightblue")
            },
            {
                label: '&Dunkles Thema',
                type: "radio",
                checked: theme == "dark",
                click: () => setTheme("dark")
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

function formatParams(params:any) {
    return "?" + Object
        .keys(params)
        .map(key => key+"="+encodeURIComponent(params[key]))
        .join("&")
}

function setTheme(theme: string) {
    console.log("Theme", theme)
    post("setTheme", formatParams({"theme": theme}))
    settings.set("theme", theme)  
}

function post<T>(method: string, param = "") {
    return new Promise<T>((res, rej) => {
        const request = new XMLHttpRequest()
        request.open('POST', `${baseUrl}/request/${method}${param}`, true)
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
        request.onload = (evt:any) => {
            var result = <T>JSON.parse(request.responseText)
            res(result)
        }
        request.send()
    })
}
const baseUrl = "http://localhost:20000"