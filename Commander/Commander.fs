module Commander
open System.Threading

let private evt = new ManualResetEvent false
        
let run () =
    evt.WaitOne () |> ignore

let shutdown () =
    printfn "Shutting down Commander Server"
    evt.Set () |> ignore
    