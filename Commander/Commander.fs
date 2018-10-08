module Commander
open System.Threading
open WebServer

let private evt = new ManualResetEvent false

let mutable private serverSentEvent: SseContext option = None

let sseInit context = 
    printfn "Initializing server sent events"
    serverSentEvent <- Some context
        
let run () = evt.WaitOne () |> ignore

let shutdown () =
    printfn "Shutting down Commander Server"
    evt.Set () |> ignore
    
