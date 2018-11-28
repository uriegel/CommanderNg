module Sse
open WebServer

let mutable serverSentEvent = fun (item: string) -> ()

let sseInit (context: SseContext) =
    printfn "Initializing server sent events"
    serverSentEvent <- context.send "updates"
