// Learn more about F# at http://fsharp.org

open System
open System.Threading

[<EntryPoint>]
let main argv =
    printfn "Hello World from F#!"
    let evt = new ManualResetEvent false
    evt.WaitOne () |> ignore

    0 // return an integer exit code
