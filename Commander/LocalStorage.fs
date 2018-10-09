module LocalStorage
open System.Collections.Concurrent
open System.IO
open Newtonsoft.Json

let mutable private keyValues = ConcurrentDictionary<string, string>()

let private getFileName () = 
    Path.Combine (System.AppContext.BaseDirectory, ".localstorage")

let load () =
    let file = getFileName ()
    match File.Exists file with
    | true -> 
        let text = File.ReadAllText file
        keyValues <- JsonConvert.DeserializeObject<ConcurrentDictionary<string, string>> (text) 
    | false -> ()

let persist () =
    let serialized = JsonConvert.SerializeObject keyValues
    use fileStream = File.OpenWrite (getFileName ())
    use writer = new StreamWriter (fileStream)
    writer.Write serialized

let get key = 
    let found, value = keyValues.TryGetValue key
    match found with 
    | true -> value
    | false -> ""

let set key value =
    keyValues.[key] <- value 

    async {
        do! Async.Sleep 100
        persist ()
    } |> Async.StartAsTask

