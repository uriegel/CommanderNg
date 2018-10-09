open System
open Request
open Commander
open Model
open System.Configuration
open Microsoft.Extensions.Configuration

[<EntryPoint>]
let main argv =
    Console.OutputEncoding <- System.Text.Encoding.UTF8
    printfn "Starting Commander Server"


    let test = "/request/close"
        
    let appSettings = ConfigurationManager.AppSettings
    let value = appSettings.Item "test"         
    appSettings.["test"] <- "Affe"
    let value2 = appSettings.Item "test"         
    

    
    let rekwest = {
        commanderView = Some CommanderView.Left
        newPath = None
    }
         

    let test = DirectoryProcessor.getItems @"c:\windows\system32"
    let str = Json.serialize test
    let str1 = Json.serialize rekwest
    

    let erg = Json.deserialize<Event> str
    let erg1 = Json.deserialize<Request> str1

    





    
    try
        let configuration = {
            WebServer.Configuration.defaultConfiguration with
                port = 20000
                checkRequest = requestOK
                request = Request.run
                webroot = System.IO.Directory.GetCurrentDirectory ()
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

