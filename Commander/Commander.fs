module Commander
open System.Threading

let private evt = new ManualResetEvent false
        
let run () =
    evt.WaitOne () |> ignore

let shutdown () =
    evt.Set () |> ignore
    