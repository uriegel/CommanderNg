open System
open Request
open Commander

open System
open Microsoft.FSharp.Reflection
open Newtonsoft.Json
open Newtonsoft.Json.Converters

type Affe = {
    name: string
    email: string
    zahlen: int list option
    nothing: string option
    anzahl: int
}

[<EntryPoint>]
let main argv =
    Console.OutputEncoding <- System.Text.Encoding.UTF8
    printfn "Starting Commander Server"

    let affe = {
        name = "AberHallo"
        email = "a@a.a"
        //nothing = Some "Affe"
        nothing = None
        anzahl = 0
        zahlen = Some [1;2;4]
    }

    let test = Json.serialize affe
    let erg = Json.deserialize<Affe> test
    

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

