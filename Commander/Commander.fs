module Commander
open System.Threading
open Model
open WebServer

let private evt = new ManualResetEvent false

let mutable private serverSentEvent: SseContext option = None

let private commander = "commander"
let sseInit context =
    printfn "Initializing server sent events"
    serverSentEvent <- Some context
    let commanderEvent = {
        theme = None
        isInitialized = true
    }
    context.send commander <| Json.serialize commanderEvent
        
let run () = evt.WaitOne () |> ignore

let close () = 
    printfn "Closing Commander Server"
    
let shutdown () =
    printfn "Shutting down Commander Server"
    evt.Set () |> ignore
    
let setTheme (theme: string) =
    match serverSentEvent with
    | Some context -> 
        let commanderEvent = {
            theme = Some theme
            isInitialized = false
        }
        context.send commander <| Json.serialize commanderEvent
    | None -> ()
