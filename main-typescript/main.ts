import {app, BrowserWindow, protocol, Menu} from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as settings from 'electron-settings'
import  { spawn } from 'child_process'
var XMLHttpRequest = require('xhr2')

app.on('ready', () => {

    console.log("Starting Commander")
    const auguryPath = 'C:\\Users\\urieg\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\elgalmkoelokbchhkhacckoklkejnhcd\\1.19.1_0'
    const prc = spawn("dotnet", [ "C:\\Users\\urieg\\source\\repos\\Commander\\Commander\\bin\\Debug\\netcoreapp2.1\\Commander.dll" ])
    prc.stdout.on('data', data => {
        var str = data.toString()
        var lines = str.split(/(\r?\n)/g);
        console.log(lines.join(""));
    })
    
    prc.on('close', code => console.log('process exit code', code))

    BrowserWindow.addDevToolsExtension(auguryPath)

    const bounds = JSON.parse(settings.get("window-bounds", 
        JSON.stringify({ 
            width: 800,
            height: 600
        }
    )) as string)

    bounds.icon = path.join(__dirname, 'Commander/assets/images/kirk.png')
    const mainWindow = new BrowserWindow(bounds)

    if (settings.get("isMaximized"))
        mainWindow.maximize()

    mainWindow.loadURL("http://localhost:20000/Commander")

    let canClose = false
    mainWindow.on('close', async e => {
        if (canClose)
            return
        canClose = true
        e.preventDefault()
        await post("close")
        mainWindow.close()
    })

    mainWindow.on('resize', () => saveBounds())

    mainWindow.on('move', () => saveBounds())

    mainWindow.on('maximize', () => {
        settings.set("isMaximized", true)
    })

    mainWindow.on('unmaximize', () => {
        settings.set("isMaximized", false)
    })

    mainWindow.on

    function saveBounds() {
        if (!mainWindow.isMaximized()) {
            const bounds = mainWindow.getBounds()
            settings.set("window-bounds", JSON.stringify(bounds))
        }
    }    

    const menu = Menu.buildFromTemplate([
        {
            label: '&Datei',
            submenu: [{
                label: '&Umbenennen',
                accelerator: "F2"
            },
            {
                type: 'separator'
            },            
            {
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
                click: evt =>  post("close")


            },
            {
                type: 'separator'
            },            
            {
                label: 'Ordner &anlegen',
                accelerator: "F7",
                click: evt =>  mainWindow.webContents.send("createFolder")
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
                click: evt =>  mainWindow.webContents.send("setShowHidden", evt.checked)
            },
            {
                label: '&Aktualisieren',
                accelerator: "Ctrl+R",
                click: evt =>  mainWindow.webContents.send("refresh")
            },            
            {
                type: 'separator'
            },            
            {
                label: '&Vorschau',
                accelerator: "F3",
                type: "checkbox",
                click: evt =>  mainWindow.webContents.send("viewer", evt.checked)
            },
            {
                type: 'separator'
            },            
            // {
            //     label: '&Blaues Thema',
            //     type: "radio",
            //     checked: theme == "blue",
            //     click: () => {
            //         mainWindow.webContents.send("setTheme", "blue")
            //         settings.set("theme", "blue")  
            //     } 
            // },
            // {
            //     label: '&Hellblaues Thema',
            //     type: "radio",
            //     checked: theme == "lightblue",
            //     click: () => {
            //         mainWindow.webContents.send("setTheme", "lightblue")
            //         settings.set("theme", "lightblue")  
            //     } 
            // },
            // {
            //     label: '&Dunkles Thema',
            //     type: "radio",
            //     checked: theme == "dark",
            //     click: () => {
            //         mainWindow.webContents.send("setTheme", "dark")
            //         settings.set("theme", "dark")  
            //     } 
            // },
            // {
            //     type: 'separator'
            // },            
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
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') 
        app.quit()
})

function post(method: string) {
    return new Promise((res, rej) => {
        const request = new XMLHttpRequest()
        const encodedPath = encodeURI(method)
        request.open('GET', `${baseUrl}/Request/${encodedPath}`, true)
        request.onload = (e:any) => res()
        request.send()
    })
}

const baseUrl = "http://localhost:20000"