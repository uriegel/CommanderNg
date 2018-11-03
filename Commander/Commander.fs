module Commander
open System.Threading
open Model
open Processor
open WebServer
open System

[<Literal>]
let COMMANDER = "commander"

[<Literal>]
let LEFTVIEW = "leftView"

[<Literal>]
let RIGHTVIEW = "rightView"

[<Literal>]
let LEFT = 0

[<Literal>]
let RIGHT = 1

let mutable private serverSentEvent: SseContext option = None

let leftProcessor = create LEFT
let rightProcessor = create RIGHT

let sseInit context =
    printfn "Initializing server sent events"
    serverSentEvent <- Some context
    leftProcessor.initEvents <| serverSentEvent.Value.send LEFTVIEW
    rightProcessor.initEvents <| serverSentEvent.Value.send RIGHTVIEW

let run () = 
    let line = Console.ReadLine()
    printfn "Cmd: %s" line
    ()

let close () = 
    printfn "Closing Commander Server"
    
