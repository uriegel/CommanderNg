open System
open Request
open Commander
open Model

[<EntryPoint>]
let main argv =
    Console.OutputEncoding <- System.Text.Encoding.UTF8
    printfn "Starting Commander Server"

    let test = DirectoryProcessor.getItems @"c:\windows\system32"
    let str = Json.serialize test

    let erg = Json.deserialize<Event> str
    
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

