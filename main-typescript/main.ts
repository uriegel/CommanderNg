import {app, BrowserWindow, Menu} from 'electron'
import  { spawn, ChildProcess } from 'child_process'
import { Observable, zip, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { run } from './mainWindow';
var XMLHttpRequest = require('xhr2')

const onReady = new Observable(obs => { 
    console.log("Electron app is ready")
    app.on('ready', () => obs.next())
})

const commanderEvents = new Subject<CommanderEvent>()

console.log("Starting Commander")
const prc = spawn("dotnet", [ "../Commander/bin/Debug/netcoreapp2.1/Commander.dll" ])
prc.stdout.on('data', data => {
    const str = data.toString() as string
    const lines = str.split(/(\r?\n)/g).map(n => n.trim()).filter(n => !!n)
    lines.forEach(n => commanderEvents.next({cmd: n, process: prc}))
            // case "-cmdevt: sse":
            //     setTheme(mainWindow, theme)
            //     post("showHidden", formatParams({"show": settings.get("showHidden", false)}))
            //     break
            // default:
            //     console.log(n)
            //     break
})

const startedEvent = zip(onReady, commanderEvents.pipe(filter(n => n.cmd == "-cmdevt: ready")))

const subscription = startedEvent.subscribe(evt => {
    subscription.unsubscribe()
    run(evt[1].process)
})

commanderEvents.subscribe(evt => console.log("Commander: ", evt.cmd))






    // const addon = require('addon')
    // console.log(addon.hello())

    //prc.on('close', code => console.log('process exit code', code))

    // const auguryPath = 'C:\\Users\\urieg\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\elgalmkoelokbchhkhacckoklkejnhcd\\1.19.1_0'
    // BrowserWindow.addDevToolsExtension(auguryPath)
//})

// app.on('window-all-closed', () => {
//     if (process.platform != 'darwin') 
//         app.quit()
// })

// function close() {
//     return post("close")
// }

// function initializeMenu(mainWindow: BrowserWindow, theme: string, showHidden: boolean) {
//     const menu = Menu.buildFromTemplate([
//         {
//             label: '&Datei',
//             submenu: [{
//                 label: '&Umbenennen',
//                 accelerator: "F2"
//             },{
//                 type: 'separator'
//             },{
//                 label: '&Kopieren',
//                 accelerator: "F5"
//             },
//             {
//                 label: '&Verschieben',
//                 accelerator: "F6"
//             },
//             {
//                 label: '&Löschen',
//                 accelerator: "Delete",
//                 // click: evt =>  mainWindow.webContents.send("delete")
//             },
//             {
//                 type: 'separator'
//             },            
//             {
//                 label: 'Ordner &anlegen',
//                 accelerator: "F7",
//             },            
//             {
//                 label: '&Eigenschaften',
//                 accelerator: "Alt+Enter"
//             },
//             {
//                 label: '&Beenden',
//                 accelerator: 'Alt+F4',
//                 role: "quit"
//             }
//         ]},
//         {
//             label: '&Navigation',
//             submenu: [{
//                 label: '&Erstes Element',
//                 accelerator: 'Home'
//             },
//             {
//                 label: '&Favoriten',
//                 accelerator: 'F1'
//             }
//         ]},
//         {
//             label: '&Selection',
//             submenu: [{
//                 label: '&Alles'
//             },
//             {
//                 label: '&Nichts'
//             }
//         ]},
//         {
//             label: '&Ansicht',
//             submenu: [{
//                 label: '&Versteckte Dateien',
//                 accelerator: "Ctrl+H",
//                 checked: showHidden,
//                 type: "checkbox",
//                 click: evt => {
//                     post("showHidden", formatParams({"show": evt.checked}))
//                     settings.set("showHidden", evt.checked)
//                 }
//             },
//             {
//                 label: '&Aktualisieren',
//                 accelerator: "Ctrl+R",
//                 click: evt => post("refresh")
//             },            
//             {
//                 type: 'separator'
//             },            
//             {
//                 label: '&Vorschau',
//                 accelerator: "F3",
//                 type: "checkbox",
// //                click: evt =>  mainWindow.webContents.send("viewer", evt.checked)
//             },
//             {
//                 type: 'separator'
//             },            
//             {
//                 label: '&Ubuntu',
//                 type: "radio",
//                 visible: process.platform == "linux",
//                 checked: theme == "ubuntu",
//                 click: () => setTheme(mainWindow, "ubuntu")
//             },
//             {
//                 label: '&Blaues Thema',
//                 type: "radio",
//                 checked: theme == "blue",
//                 click: () => setTheme(mainWindow,"blue")
//             },
//             {
//                 label: '&Hellblaues Thema',
//                 type: "radio",
//                 checked: theme == "lightblue",
//                 click: () => setTheme(mainWindow,"lightblue")
//             },
//             {
//                 label: '&Dunkles Thema',
//                 type: "radio",
//                 checked: theme == "dark",
//                 click: () => setTheme(mainWindow,"dark")
//             },
//             {
//                 type: 'separator'
//             },            
//             {
//                 label: '&Vollbild',
//                 click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()),
//                 accelerator: "F11"
//             },
//             {
//                 type: 'separator'
//             },            
//             {
//                 label: '&Entwicklerwerkzeuge',
//                 click: () => mainWindow.webContents.openDevTools(),
//                 accelerator: "F12"
//             }
//         ]}
//     ])

//     Menu.setApplicationMenu(menu)   
// }

// function formatParams(params:any) {
//     return "?" + Object
//         .keys(params)
//         .map(key => key+"="+encodeURIComponent(params[key]))
//         .join("&")
// }

// function setTheme(mainWindow: BrowserWindow, theme: string) {
//     console.log("Theme", theme)
//     mainWindow.webContents.send("setTheme", theme)
//     post("setTheme", formatParams({"theme": theme}))
//     settings.set("theme", theme)  
// }

// function post<T>(method: string, param = "") {
//     return new Promise<T>((res, rej) => {
//         const request = new XMLHttpRequest()
//         request.open('POST', `${baseUrl}/request/${method}${param}`, true)
//         request.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
//         request.onload = (evt:any) => {
//             var result = <T>JSON.parse(request.responseText)
//             res(result)
//         }
//         request.send()
//     })
// }
// const baseUrl = "http://localhost:20000"

interface CommanderEvent {
    cmd: string,
    process: ChildProcess   
}