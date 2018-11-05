open System
open System.IO
open Request
open Commander
open WebServer

[<EntryPoint>]
let main argv =
    Console.OutputEncoding <- System.Text.Encoding.UTF8
    printfn "Starting Commander Server"

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

