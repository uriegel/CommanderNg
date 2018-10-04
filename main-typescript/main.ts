import {app, BrowserWindow, protocol, Menu} from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as settings from 'electron-settings'

app.on('ready', () => {

    //const auguryPath = 'C:\\Users\\urieg\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\elgalmkoelokbchhkhacckoklkejnhcd\\1.19.1_0'

    //BrowserWindow.addDevToolsExtension(auguryPath)

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

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'Commander\\index.html'),
        protocol: 'file:',
        slashes: true
    }))
      
    mainWindow.on('resize', () => saveBounds())

    mainWindow.on('move', () => saveBounds())

    mainWindow.on('maximize', () => {
        settings.set("isMaximized", true)
    })

    mainWindow.on('unmaximize', () => {
        settings.set("isMaximized", false)
    })

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
                click: evt =>  mainWindow.webContents.send("delete")
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