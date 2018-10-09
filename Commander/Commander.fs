module Commander
open System.Threading
open WebServer

let private evt = new ManualResetEvent false

let mutable private serverSentEvent: SseContext option = None

let private commander = "commander"

let sseInit context = 
    printfn "Initializing server sent events"
    serverSentEvent <- Some context
    context.send commander "initialized"
        
let run () = evt.WaitOne () |> ignore

let close () = 
    printfn "Closing Commander Server"
    
let shutdown () =
    printfn "Shutting down Commander Server"
    evt.Set () |> ignore
    
