module DirectoryProcessor
open System.IO
open ModelTools
open Model

let getItems (path: string) = 
    let di = DirectoryInfo path
    let directoryItems (di: DirectoryInfo) () = GetSafeItems di.GetDirectories 
    let fileItems (di: DirectoryInfo) () = GetSafeItems di.GetFiles
    
    let directoryItems = directoryItems di
    let fileItems = fileItems di

    let directoryItems = 
        directoryItems ()
        |> List.map (fun item -> {
            name = item.Name
            dateTime = item.LastWriteTime
        })

    let fileItems = 
        fileItems ()
        |> List.map (fun item -> {
            name = item.Name
            extension = "Ext"
            dateTime = item.LastWriteTime
        })
    let result = {
        directoryItems = directoryItems
        fileItems = fileItems
    }
    result
