import {app, BrowserWindow, Menu} from 'electron'
import  { spawn, ChildProcess } from 'child_process'
import { Observable, zip, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { run } from './mainWindow';

const onReady = new Observable(obs => { 
    console.log("Electron app is ready")
    app.on('ready', () => obs.next())
})

const commanderEvents = new Subject<CommanderEvent>()
commanderEvents.subscribe(evt => console.log("Commander: ", evt.cmd))

const startedEvent = zip(onReady, commanderEvents.pipe(filter(n => n.cmd == "-cmdevt: ready")))
const subscription = startedEvent.subscribe(evt => {
    subscription.unsubscribe()
    run(evt[1].process)
})

console.log("Starting Commander")
const prc = spawn("dotnet", [ "../Commander/bin/Debug/netcoreapp2.1/Commander.dll" ])
prc.stdout.on('data', data => {
    const str = data.toString() as string
    const lines = str.split(/(\r?\n)/g).map(n => n.trim()).filter(n => !!n)
    lines.forEach(n => commanderEvents.next({cmd: n, process: prc}))
            //     setTheme(mainWindow, theme)
            //     post("showHidden", formatParams({"show": settings.get("showHidden", false)}))
            //     break
})
prc.on('close', code => console.log('process exit code', code))

// const auguryPath = 'C:\\Users\\urieg\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\elgalmkoelokbchhkhacckoklkejnhcd\\1.19.1_0'
// BrowserWindow.addDevToolsExtension(auguryPath)

// const addon = require('addon')
// console.log(addon.hello())

    

// app.on('window-all-closed', () => {
//     if (process.platform != 'darwin') 
//         app.quit()
// })

// function formatParams(params:any) {
//     return "?" + Object
//         .keys(params)
//         .map(key => key+"="+encodeURIComponent(params[key]))
//         .join("&")
// }


interface CommanderEvent {
    cmd: string,
    process: ChildProcess   
}