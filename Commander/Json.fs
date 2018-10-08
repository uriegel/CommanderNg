module Json
open Newtonsoft.Json
open System.Xml

let serialize obj =
    let defaultSettings =  JsonSerializerSettings()
    //defaultSettings.TypeNameHandling = TypeNameHandling.All
    defaultSettings.DefaultValueHandling <- DefaultValueHandling.Ignore

    JsonConvert.SerializeObject (obj, defaultSettings)

let deserialize<'a> str =
    try
        let jds = JsonSerializerSettings ()
        jds.DefaultValueHandling <- DefaultValueHandling.Ignore
        JsonConvert.DeserializeObject<'a> (str, jds)
        |> Result.Ok
    with
        // catch all exceptions and convert to Result
        | ex -> Result.Error ex  