// Learn more about F# at http://fsharp.org

open System
open System.Threading

[<EntryPoint>]
let main argv =

    Console.OutputEncoding <- System.Text.Encoding.UTF8
    printfn "%A" argv

    printfn "Hello Wörld from F#!"
    let evt = new ManualResetEvent false
    evt.WaitOne 5000 |> ignore

    0 // return an integer exit code
