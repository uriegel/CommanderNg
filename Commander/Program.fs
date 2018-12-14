open System
open System.IO
open Request
open WebServer
open Sse

[<EntryPoint>]
let main argv =

    // TODO: root: hide all symlinks and show /home 

    let run () = 
        let line = Console.ReadLine()
        printfn "Cmd: %s" line
        ()

    let close () = 
        printfn "Closing Commander Server"

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
        run () |> ignore
        WebServer.Server.stop ()
        printfn "Commander Server stopped"
        0 
    with e -> 
        printfn "Error: %A" e
        1

