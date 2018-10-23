module Commander
open System.Threading
open Model
open Processor
open WebServer

[<Literal>]
let COMMANDER = "commander"

[<Literal>]
let LEFT = 0

[<Literal>]
let RIGHT = 1

let private evt = new ManualResetEvent false

let mutable private serverSentEvent: SseContext option = None

let leftProcessor = create LEFT
let rightProcessor = create RIGHT

let sseInit context =
    printfn "-cmdevt: sse"
    printfn "Initializing server sent events"
    serverSentEvent <- Some context
    let commanderEvent = {
        theme = None
        isInitialized = true
    }
    context.send COMMANDER <| Json.serialize commanderEvent

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
        context.send COMMANDER <| Json.serialize commanderEvent
    | None -> ()
