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
         

    //let test = DirectoryProcessor.getItems @"c:\windows\system32"
    let test = DirectoryProcessor.getItems (Directory.GetCurrentDirectory ())
    let str = Json.serialize test
    let str1 = Json.serialize rekwest
    

    let erg = Json.deserialize<Response> str
    let erg1 = Json.deserialize<Request> str1

    





    
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
        Commander.run () |> ignore
        WebServer.Server.stop ()
        printfn "Commander Server stopped"
        0 
    with e -> 
        printfn "Error: %A" e
        1

