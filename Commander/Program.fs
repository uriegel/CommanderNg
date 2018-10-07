open System
open System.Threading

[<EntryPoint>]
let main argv =
    Console.OutputEncoding <- System.Text.Encoding.UTF8
    printfn "Starting Commander Server"

    try
        let requestOK (headers: WebServer.RequestHeaders) = 
            headers.path.StartsWith "/Request"

        let configuration = {
            WebServer.Configuration.defaultConfiguration with
                port = 20000
                checkRequest = requestOK
                request = Request.run


                webroot = System.IO.Directory.GetCurrentDirectory ()
        }
        WebServer.Server.start configuration
        printfn "Commander Server started"

        printfn "Curr: %s" (System.IO.Directory.GetCurrentDirectory ())

        Commander.run () |> ignore

        WebServer.Server.stop ()
        printfn "Commander Server stopped"

        0 
    with e -> 
        printfn "Error: %A" e
        1

