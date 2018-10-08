open System
open Request
open Commander

open System
open Microsoft.FSharp.Reflection
open Newtonsoft.Json
open Newtonsoft.Json.Converters
open System.IO
open System.Diagnostics

type Affe = {
    name: string
    email: string
    zahlen: int list option
    nothing: string option
    anzahl: int
}

type DirectoryItem = {
    name: string
    dateTime: DateTime
}

type FileItem = {
    name: string
    extension: string
    dateTime: DateTime
}

type Event = {
    directoryItems: DirectoryItem list
    fileItems: FileItem list
}

[<EntryPoint>]
let main argv =
    Console.OutputEncoding <- System.Text.Encoding.UTF8
    printfn "Starting Commander Server"

    let test () = 
        let GetSafeItems getItems =
            try 
                getItems ()
                |> Array.toList
            with | :? UnauthorizedAccessException as uae -> []   

        let stoppwatch = Stopwatch ()
        stoppwatch.Start ()
        let directoryInfo = new DirectoryInfo @"c:\windows\system32"

        let directoryItems = 
            GetSafeItems directoryInfo.GetDirectories

        let elapsed = stoppwatch.Elapsed
        printfn "Gebraucht 1: %A" elapsed

        let directoryItems = 
            directoryItems
            |> List.map (fun item -> {
                name = item.Name
                dateTime = item.LastWriteTime
            })

        let fileItems = 
            GetSafeItems directoryInfo.GetFiles
            |> List.map (fun item -> {
                name = item.Name
                extension = "Ext"
                dateTime = item.LastWriteTime
            })
        let result = {
            directoryItems = directoryItems
            fileItems = fileItems
        }
        Json.serialize result


    test () |> ignore
    let stoppwatch = Stopwatch ()
    stoppwatch.Start ()
    let test = test ()
    let elapsed = stoppwatch.Elapsed

    printfn "______________________"
    printfn "Gebraucht: %A" elapsed
    printfn "______________________"
    let erg = Json.deserialize<Event> test
    
        
        

    //let directoryItem = (GetSafeItems (fun () -> directoryInfo.GetDirectories()) (fun () ->  Array.empty<DirectoryInfo>) 

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

