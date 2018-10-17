open System
open Request
open Commander
open Model
open System.Configuration
open Microsoft.Extensions.Configuration
open System.IO

[<EntryPoint>]
let main argv =
    Console.OutputEncoding <- System.Text.Encoding.UTF8
    printfn "Starting Commander Server"

    LocalStorage.load ()
    let affe = LocalStorage.get "Affe"
    LocalStorage.set "Affe" "Huhn" |> ignore
    let huhn = LocalStorage.get "Affe"

    let test = "/request/close"
        
    let rekwest = {
        commanderView = Some CommanderView.Left
        newPath = None
    }


    // TODO:
    // CommanderView Module, with state object (Monad)
    // two Commander instances with id left, right
    // Subject for events
    // sseInit subscribes events-Subject
    // Commander and the two commander views send events to Subject

    try
        let configuration = {
            WebServer.Configuration.defaultConfiguration with
                port = 20000
                noCompression = true
                checkRequest = requestOK
                request = Request.run
                webroot = Directory.GetCurrentDirectory ()
                serverSentEvent = Some sseInit
        }
        WebServer.Server.start configuration
        printfn "Commander Server started"
        printfn "-cmdevt: ready"
        Commander.run () |> ignore
        WebServer.Server.stop ()
        printfn "Commander Server stopped"
        0 
    with e -> 
        printfn "Error: %A" e
        1

