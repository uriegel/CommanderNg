open System
open System.Threading
open WebServer

[<EntryPoint>]
let main argv =
    Console.OutputEncoding <- System.Text.Encoding.UTF8
    printfn "Starting Commander Server"

    try

        let configuration = {
            Configuration.defaultConfiguration with
                port = 20000
        }
        Server.Start configuration

        printfn "Commander Server started"

        let evt = new ManualResetEvent false
        evt.WaitOne 15000 |> ignore

        0 // return an integer exit code
    with e -> 
        printfn "Error: %A" e
        1

